#!/usr/bin/env bash
# ==============================================================================
# Koggent Backend - Multi-Service Docker Build & ECR Deployment Script
# 
# Solves Apple Silicon (M1/M2/M3) ARM64 vs AWS ECS/Fargate AMD64 incompatibility.
# Ensures images are explicitly built for linux/amd64 using Docker Buildx.
# ==============================================================================

set -euo pipefail

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Determine script and backend root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${SCRIPT_DIR}"

# Default configuration via environment variables
AWS_REGION="${AWS_REGION:-$(aws configure get region 2>/dev/null || echo "us-east-1")}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "")}"
ECR_REGISTRY="${ECR_REGISTRY:-}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
PLATFORM="${PLATFORM:-linux/amd64}"
ECS_CLUSTER="${ECS_CLUSTER:-koggent-backend}"

PUSH=true
LOAD_LOCAL=false
DEPLOY_ECS=false
SELECTED_SERVICES=()

# Known service definitions: <name>:<dockerfile_rel_path>:<ecr_repo_name>:<ecs_service_name>
ALL_SERVICE_DEFS=(
  "agent:services/agent/Dockerfile:agent-service:agent-service"
  "auth:services/auth/Dockerfile:auth-service:auth-service"
  "chat:services/chat/Dockerfile:chat-service:chat-service"
  "billing:services/billing/Dockerfile:billing-service:billing-service"
  "gateway:gateway/Dockerfile:gateway:gateway-service"
)

# Print banner
echo -e "${PURPLE}====================================================================${NC}"
echo -e "${PURPLE}       KoggenT ECS Image Builder & Deployment Workflow              ${NC}"
echo -e "${PURPLE}====================================================================${NC}"

usage() {
  cat << EOF
Usage: $(basename "$0") [options] [services...]

Services:
  agent, auth, chat, billing, gateway, or 'all' (default: all)

Options:
  --platform <arch>     Target architecture (default: linux/amd64)
                        Supported: linux/amd64, or linux/amd64,linux/arm64
  --tag <tag>           Image tag (default: latest, or \$IMAGE_TAG)
  --region <region>     AWS Region (default: \$AWS_REGION or us-east-1)
  --account <id>        AWS Account ID (default: current AWS caller account)
  --registry <url>      ECR Registry URL (default: <account>.dkr.ecr.<region>.amazonaws.com)
  --build-only          Build images without pushing to ECR
  --load                Load built single-platform image into local Docker daemon
  --deploy              Trigger ECS service deployment after push
  --cluster <cluster>   ECS Cluster name for deployment (default: koggent-backend)
  -h, --help            Show this help message

Examples:
  # Build and push all services for ECS linux/amd64:
  ./build-and-push.sh

  # Build and push only auth and chat services:
  ./build-and-push.sh auth chat

  # Build locally for linux/amd64 without pushing (for verification):
  ./build-and-push.sh --build-only --load auth

  # Build multi-architecture (linux/amd64 and linux/arm64) and push:
  ./build-and-push.sh --platform linux/amd64,linux/arm64

  # Build, push, and trigger ECS rolling update:
  ./build-and-push.sh --deploy
EOF
  exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --platform)
      PLATFORM="$2"
      shift 2
      ;;
    --tag)
      IMAGE_TAG="$2"
      shift 2
      ;;
    --region)
      AWS_REGION="$2"
      shift 2
      ;;
    --account)
      AWS_ACCOUNT_ID="$2"
      shift 2
      ;;
    --registry)
      ECR_REGISTRY="$2"
      shift 2
      ;;
    --build-only)
      PUSH=false
      shift
      ;;
    --load)
      LOAD_LOCAL=true
      shift
      ;;
    --deploy)
      DEPLOY_ECS=true
      shift
      ;;
    --cluster)
      ECS_CLUSTER="$2"
      shift 2
      ;;
    -h|--help)
      usage
      ;;
    *)
      SELECTED_SERVICES+=("$1")
      shift
      ;;
  esac
done

# Check required local tools
command -v docker >/dev/null 2>&1 || { echo -e "${RED}Error: docker is not installed or not in PATH.${NC}" >&2; exit 1; }
docker info >/dev/null 2>&1 || { echo -e "${RED}Error: Docker daemon is not running.${NC}" >&2; exit 1; }

# Verify Docker Buildx
if ! docker buildx version >/dev/null 2>&1; then
  echo -e "${RED}Error: Docker buildx plugin is not installed.${NC}" >&2
  exit 1
fi

# Resolve AWS Account ID and ECR Registry
if [[ -z "${AWS_ACCOUNT_ID}" ]]; then
  if command -v aws >/dev/null 2>&1; then
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "")
  fi
fi

if [[ -z "${ECR_REGISTRY}" ]]; then
  if [[ -n "${AWS_ACCOUNT_ID}" ]]; then
    ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
  else
    if [[ "${PUSH}" == "true" ]]; then
      echo -e "${RED}Error: Could not determine AWS Account ID. Set AWS_ACCOUNT_ID or configure AWS CLI.${NC}" >&2
      exit 1
    else
      ECR_REGISTRY="local"
    fi
  fi
fi

# Print configuration summary
echo -e "${CYAN}Configuration:${NC}"
echo -e "  • Target Platform : ${GREEN}${PLATFORM}${NC}"
echo -e "  • AWS Region      : ${YELLOW}${AWS_REGION}${NC}"
echo -e "  • AWS Account ID  : ${YELLOW}${AWS_ACCOUNT_ID:-<unknown>}${NC}"
echo -e "  • ECR Registry    : ${YELLOW}${ECR_REGISTRY}${NC}"
echo -e "  • Image Tag       : ${YELLOW}${IMAGE_TAG}${NC}"
echo -e "  • Push to ECR     : $([ "${PUSH}" == "true" ] && echo -e "${GREEN}YES${NC}" || echo -e "${YELLOW}NO (Build Only)${NC}")"
echo -e "  • Trigger ECS     : $([ "${DEPLOY_ECS}" == "true" ] && echo -e "${GREEN}YES (${ECS_CLUSTER})${NC}" || echo -e "NO")"
echo ""

# Authenticate with Amazon ECR if pushing
if [[ "${PUSH}" == "true" ]]; then
  echo -e "${CYAN}Authenticating with Amazon ECR...${NC}"
  if command -v aws >/dev/null 2>&1; then
    if aws ecr get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin "${ECR_REGISTRY}" >/dev/null 2>&1; then
      echo -e "${GREEN}✓ Successfully authenticated with ECR registry: ${ECR_REGISTRY}${NC}\n"
    else
      echo -e "${RED}Failed to authenticate with ECR. Please ensure AWS CLI has valid credentials.${NC}" >&2
      exit 1
    fi
  else
    echo -e "${RED}Error: aws CLI is required for pushing to ECR.${NC}" >&2
    exit 1
  fi
fi

# Determine target services
SERVICES_TO_BUILD=()
if [[ ${#SELECTED_SERVICES[@]} -eq 0 ]] || [[ "${SELECTED_SERVICES[0]}" == "all" ]]; then
  for def in "${ALL_SERVICE_DEFS[@]}"; do
    sname=$(echo "$def" | cut -d: -f1)
    SERVICES_TO_BUILD+=("$sname")
  done
else
  for input_svc in "${SELECTED_SERVICES[@]}"; do
    # Normalize input like agent-service -> agent
    norm_svc="${input_svc%-service}"
    found=false
    for def in "${ALL_SERVICE_DEFS[@]}"; do
      sname=$(echo "$def" | cut -d: -f1)
      if [[ "$norm_svc" == "$sname" ]]; then
        SERVICES_TO_BUILD+=("$sname")
        found=true
        break
      fi
    done
    if [[ "$found" == "false" ]]; then
      echo -e "${RED}Error: Unknown service '${input_svc}'. Allowed: agent, auth, chat, billing, gateway, all${NC}" >&2
      exit 1
    fi
  done
fi

echo -e "${CYAN}Services scheduled to build (${#SERVICES_TO_BUILD[@]}): ${SERVICES_TO_BUILD[*]}${NC}\n"

# Execute builds
SUCCESSFUL_SERVICES=()

for svc in "${SERVICES_TO_BUILD[@]}"; do
  # Find service definition
  dockerfile=""
  repo_name=""
  ecs_svc=""
  for def in "${ALL_SERVICE_DEFS[@]}"; do
    sname=$(echo "$def" | cut -d: -f1)
    if [[ "$sname" == "$svc" ]]; then
      dockerfile=$(echo "$def" | cut -d: -f2)
      repo_name=$(echo "$def" | cut -d: -f3)
      ecs_svc=$(echo "$def" | cut -d: -f4)
      break
    fi
  done

  target_image="${ECR_REGISTRY}/${repo_name}:${IMAGE_TAG}"
  local_alias="${repo_name}:${IMAGE_TAG}"

  echo -e "${BLUE}--------------------------------------------------------------------${NC}"
  echo -e "${BLUE}Building Service: ${CYAN}${svc}${NC} -> ${GREEN}${target_image}${NC}"
  echo -e "  Dockerfile : ${BACKEND_DIR}/${dockerfile}"
  echo -e "  Context    : ${BACKEND_DIR}"
  echo -e "  Platform   : ${PLATFORM}"
  echo -e "${BLUE}--------------------------------------------------------------------${NC}"

  if [[ ! -f "${BACKEND_DIR}/${dockerfile}" ]]; then
    echo -e "${RED}Error: Dockerfile not found at ${BACKEND_DIR}/${dockerfile}${NC}" >&2
    exit 1
  fi

  # Build arguments
  BUILD_CMD=(
    docker buildx build
    --platform "${PLATFORM}"
    --file "${BACKEND_DIR}/${dockerfile}"
    --tag "${target_image}"
  )

  # Also tag local alias for convenience if not pushing
  if [[ "${PUSH}" == "false" ]]; then
    BUILD_CMD+=(--tag "${local_alias}")
  fi

  # Pushing or loading
  if [[ "${PUSH}" == "true" ]]; then
    BUILD_CMD+=(--push)
  elif [[ "${LOAD_LOCAL}" == "true" ]]; then
    if [[ "${PLATFORM}" == *","* ]]; then
      echo -e "${YELLOW}Notice: Multi-platform builds cannot be loaded into local Docker daemon. Using build cache.${NC}"
    else
      BUILD_CMD+=(--load)
    fi
  fi

  # Add context
  BUILD_CMD+=("${BACKEND_DIR}")

  echo -e "${PURPLE}Running:${NC} ${BUILD_CMD[*]}"
  "${BUILD_CMD[@]}"

  echo -e "${GREEN}✓ Successfully built ${svc}${NC}\n"
  SUCCESSFUL_SERVICES+=("${svc}:${repo_name}:${ecs_svc}")
done

# Summary & Architecture Verification
echo -e "${PURPLE}====================================================================${NC}"
echo -e "${GREEN}                      Build Complete!                               ${NC}"
echo -e "${PURPLE}====================================================================${NC}"

for item in "${SUCCESSFUL_SERVICES[@]}"; do
  sname=$(echo "$item" | cut -d: -f1)
  repo_name=$(echo "$item" | cut -d: -f2)
  ecs_svc=$(echo "$item" | cut -d: -f3)
  full_ref="${ECR_REGISTRY}/${repo_name}:${IMAGE_TAG}"

  echo -e "Service: ${CYAN}${sname}${NC}"
  echo -e "  Image URI: ${GREEN}${full_ref}${NC}"

  if [[ "${PUSH}" == "true" ]]; then
    echo -e "  Verification:"
    echo -e "    ${YELLOW}docker buildx imagetools inspect ${full_ref}${NC}"
  fi
done

# Optional ECS Deployment Trigger
if [[ "${DEPLOY_ECS}" == "true" && "${PUSH}" == "true" ]]; then
  echo -e "\n${CYAN}Triggering ECS Service Deployments on cluster '${ECS_CLUSTER}'...${NC}"
  for item in "${SUCCESSFUL_SERVICES[@]}"; do
    ecs_svc=$(echo "$item" | cut -d: -f3)
    echo -e "Checking ECS service: ${CYAN}${ecs_svc}${NC}..."
    if aws ecs describe-services --cluster "${ECS_CLUSTER}" --services "${ecs_svc}" --region "${AWS_REGION}" --query 'services[?status==`ACTIVE`].serviceName' --output text 2>/dev/null | grep -qw "${ecs_svc}"; then
      echo -e "Updating ECS service: ${CYAN}${ecs_svc}${NC}..."
      aws ecs update-service \
        --cluster "${ECS_CLUSTER}" \
        --service "${ecs_svc}" \
        --force-new-deployment \
        --region "${AWS_REGION}" >/dev/null
      echo -e "${GREEN}✓ New deployment triggered for ${ecs_svc}${NC}"
    else
      echo -e "${YELLOW}Service '${ecs_svc}' not found or inactive in cluster '${ECS_CLUSTER}'. Skipping ECS update.${NC}"
    fi
  done
  echo -e "\n${GREEN}All applicable ECS service updates initiated.${NC}"
fi

echo -e "\n${GREEN}Done!${NC}"
