document.addEventListener('DOMContentLoaded', () => {
  const blockMalware = document.getElementById('blockMalware');
  const blockDistraction = document.getElementById('blockDistraction');
  browser.storage.local.get(["blockMalware", "blockDistraction"], (settings) => {
    blockMalware.checked = !!settings.blockMalware;
    blockDistraction.checked = !!settings.blockDistraction;
  });
  document.getElementById('settingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    browser.storage.local.set({
      blockMalware: blockMalware.checked,
      blockDistraction: blockDistraction.checked
    });
    alert('Settings saved!');
  });
});
