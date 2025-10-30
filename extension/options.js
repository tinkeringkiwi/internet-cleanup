document.addEventListener('DOMContentLoaded', () => {
  const blockCookies = document.getElementById('blockCookies');
  const blockDistraction = document.getElementById('blockDistraction');
  const blockNewsletters = document.getElementById('blockNewsletters');
  const archiveSites = document.getElementById('archiveSites');

  browser.storage.local.get(["blockCookies", "blockDistraction", "blockNewsletters", "archiveSite"], (settings) => {
    blockCookies.checked = !!settings.blockCookies;
    blockDistraction.checked = !!settings.blockDistraction;
    blockNewsletters.checked = !!settings.blockNewsletters;
    if (settings.archiveSite) archiveSites.value = settings.archiveSite;
  });

  function updateSettings() {
    browser.storage.local.set({
      blockCookies: blockCookies.checked,
      blockDistraction: blockDistraction.checked,
      blockNewsletters: blockNewsletters.checked,
      archiveSite: archiveSites.value
    });
    const status = document.getElementById('saveStatus');
    if (status) {
      status.style.display = 'block';
      setTimeout(() => { status.style.display = 'none'; }, 1200);
    }
  }

  blockCookies.addEventListener('change', updateSettings);
  blockDistraction.addEventListener('change', updateSettings);
  blockNewsletters.addEventListener('change', updateSettings);
  archiveSites.addEventListener('change', updateSettings);

  function openReportTab() {
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const url = tabs[0]?.url || '';
      browser.tabs.create({url: `https://example.com/?url=${encodeURIComponent(url)}`});
    });
  }
  document.getElementById('reportBroken').addEventListener('click', openReportTab);
  document.getElementById('suggestSite').addEventListener('click', openReportTab);
});
