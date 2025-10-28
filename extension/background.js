// Listen for allowDomainOnce message from interstitial page
if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.onMessage) {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.allowDomainOnce) {
      allowDomainOnce(message.allowDomainOnce);
      sendResponse();
    }
  });
}
// Hardcoded blocklists
const ARCHIVE_LIST = [
  "theguardian.com",
  "malicious-example.net"
];
const SLOP_LIST = [
  "facebook.com",
  "youtube.com",
  "theconversation.com"
];

const REDIRECT_URL = "https://archive.today/"

function getSettings(callback) {
  browser.storage.local.get(["blockMalware", "blockDistraction"], callback);
}

function shouldBlock(url, list) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return list.some(domain => hostname === domain || hostname.endsWith(`.${domain}`));
  } catch (e) {
    return false;
  }
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (e) {
    return null;
  }
}

let proceedOnceDomains = [];

function onBeforeRequest(details) {
  const now = Date.now();
  // Remove expired entries
  proceedOnceDomains = proceedOnceDomains.filter(entry => entry.expires > now);
  const domain = getDomain(details.url);
  if (domain && proceedOnceDomains.some(entry => domain === entry.domain || domain.endsWith('.' + entry.domain))) {
    return {};
  }
  const blockMalware = true; // Change to false to disable
  const blockDistraction = true; // Change to false to disable
  if (blockMalware && shouldBlock(details.url, ARCHIVE_LIST)) {
    console.log(`Blocking malware site: ${details.url}`);
    return {redirectUrl: REDIRECT_URL + `${encodeURIComponent(details.url)}`};
  } else if (blockDistraction && shouldBlock(details.url, SLOP_LIST)) {
    console.log(`Blocking distraction site: ${details.url}`);
    return {redirectUrl: browser.extension.getURL("interstitial.html") + `?url=${encodeURIComponent(details.url)}`};
  } else {
    return {};
  }
}

// Allow domain for 24 hours
function allowDomainOnce(domain) {
  const now = Date.now();
  const expires = now + 24 * 60 * 60 * 1000; // 24 hours
  proceedOnceDomains = proceedOnceDomains.filter(entry => entry.expires > now);
  if (!proceedOnceDomains.some(entry => entry.domain === domain)) {
    proceedOnceDomains.push({ domain, expires });
  }
}

// Cleanup expired entries every hour



browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    return onBeforeRequest(details);
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);
