import proxy from "express-http-proxy";

export const proxyWithHeader = (serviceUrl, options = {}) => {
  return proxy(serviceUrl, {
    limit: "50mb",
    parseReqBody: false,
    ...options,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = String(
          srcReq.user.userId || srcReq.user._id || "",
        );
      }
      const sessionId =
        srcReq.cookies?.session ||
        srcReq.headers.cookie?.match(/(?:^|;\s*)session=([^;]+)/)?.[1];
      if (sessionId) {
        proxyReqOpts.headers["x-session-id"] = sessionId;
      }
      return proxyReqOpts;
    },
  });
};
