const YOUTUBE_URL = "https://www.youtube.com/@mistlewood";

const YOUTUBE_ANDROID_PACKAGE = "com.google.android.youtube";

(function openYouTube() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const isAndroid = /android/i.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

  // Always reveal a manual fallback link after a short delay,
  // in case the automatic redirect doesn't fire for any reason.
  const manualLink = document.getElementById("manualLink");
  if (manualLink) {
    manualLink.href = YOUTUBE_URL;
    setTimeout(() => {
      manualLink.classList.add("visible");
    }, 2500);
  }

  if (isAndroid) {
    // Android: use an intent:// URL. This only works in Chrome on Android,
    // but Chrome is the default browser on the vast majority of Android phones.
    const pathPart = YOUTUBE_URL.replace(/^https?:\/\//, "");
    const intentUrl =
      "intent://" + pathPart +
      "#Intent;scheme=https;package=" + YOUTUBE_ANDROID_PACKAGE +
      ";S.browser_fallback_url=" + encodeURIComponent(YOUTUBE_URL) +
      ";end";
    window.location.href = intentUrl;
    return;
  }

  if (isIOS) {
    // iOS: try the YouTube app's custom URL scheme first.
    // Note: iOS Safari can be inconsistent about auto-triggering app
    // switches without a direct user tap — test this on a real device.
    const iosAppUrl = YOUTUBE_URL.replace(
      /^https?:\/\/(www\.)?youtube\.com/,
      "youtube://www.youtube.com"
    );

    let stillOnPage = true;
    window.addEventListener("pagehide", () => { stillOnPage = false; });
    window.addEventListener("blur", () => { stillOnPage = false; });

    window.location.href = iosAppUrl;

    // If the app didn't open within ~1.2s (we're still on this page),
    // fall back to the regular website.
    setTimeout(() => {
      if (stillOnPage) {
        window.location.href = YOUTUBE_URL;
      }
    }, 1200);
    return;
  }

  // Desktop or anything else: just go straight to the website.
  window.location.href = YOUTUBE_URL;
})();
