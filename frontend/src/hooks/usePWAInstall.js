import { useState, useEffect, useCallback } from "react";


function detectPlatform() {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isAndroid = /Android/.test(ua);
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  return {
    platform: isIOS ? "ios" : isAndroid ? "android" : "desktop",
    isIOS,
    isIOSSafari: isIOS && isSafari,
    isStandalone,
  };
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installedViaEvent, setInstalledViaEvent] = useState(false);

  // Derive everything synchronously — no setState calls at render time
  const { platform, isIOSSafari, isStandalone } = detectPlatform();

  // For iOS Safari: installable is purely derived from platform detection (no state needed)
  const iosInstallable = isIOSSafari && !isStandalone;

  // For Chromium/Android: installable depends on the event having fired
  const [chromiumInstallable, setChromiumInstallable] = useState(false);

  const installable = iosInstallable || chromiumInstallable;
  const installed = isStandalone || installedViaEvent;

  useEffect(() => {
    if (isStandalone || isIOSSafari) return;

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setChromiumInstallable(true);
    };

    const handleAppInstalled = () => {
      setInstalledViaEvent(true);
      setChromiumInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalledViaEvent(true);
      setChromiumInstallable(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  return { installable, installed, install, platform, isStandalone };
}
