document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const originalUrl = params.get('url');
  document.getElementById('goBack').onclick = () => {
    window.history.back();
  };
  document.getElementById('proceed').onclick = () => {
    if (originalUrl) {
      // Extract domain and call background function to allow it
      const domain = (() => {
        try {
          return new URL(originalUrl).hostname.replace(/^www\./, "");
        } catch (e) {
          return null;
        }
      })();
      if (domain) {
        // Use runtime.sendMessage to call background
        browser.runtime.sendMessage({ allowDomainOnce: domain }, () => {
          window.location.href = originalUrl;
        });
      } else {
        window.location.href = originalUrl;
      }
    }
  };
});


