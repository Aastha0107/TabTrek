// background.js - TabTrek basic tracker (Manifest V3 Service Worker)
const DOMAIN_CATEGORIES = {
  "youtube.com": "entertainment",
  "netflix.com": "entertainment",
  "twitter.com": "social",
  "x.com": "social",
  "instagram.com": "social",
  "github.com": "productive",
  "stackoverflow.com": "productive",
  "leetcode.com": "education",
  "geeksforgeeks.org": "education",
  "w3schools.com": "education",
  "medium.com": "education"
};

// fallback keywords -> category (simple)
const KEYWORD_CATEGORIES = {
  "edu": "education",
  "learn": "education",
  "course": "education",
  "github": "productive",
  "docs": "productive",
  "news": "news",
  "shop": "shopping",
  "amazon": "shopping"
};

function categorizeDomain(domain) {
  domain = domain.replace(/^www\./, "");
  if (DOMAIN_CATEGORIES[domain]) return DOMAIN_CATEGORIES[domain];
  for (let k in KEYWORD_CATEGORIES) {
    if (domain.includes(k)) return KEYWORD_CATEGORIES[k];
  }
  return "other";
}

function xpForCategory(cat) {
  const map = {
    education: 20,
    productive: 15,
    entertainment: 5,
    social: 5,
    news: 7,
    shopping: 1,
    other: 3
  };
  return map[cat] || 3;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    stats: {
      visited: {},
      categories: {},
      xp: 0,
      history: [],
      badges: []
    }
  });
});

// When a tab finishes loading, record visit and give XP
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  try {
    if (changeInfo.status === "complete" && tab.url && (tab.url.startsWith("http://") || tab.url.startsWith("https://"))) {
      const url = new URL(tab.url);
      const domain = url.hostname.replace(/^www\./, "");
      const category = categorizeDomain(domain);
      chrome.storage.local.get(["stats"], (res) => {
        const stats = res.stats || { visited: {}, categories: {}, xp: 0, history: [], badges: [] };
        stats.visited[domain] = (stats.visited[domain] || 0) + 1;
        stats.categories[category] = (stats.categories[category] || 0) + 1;
        const gained = xpForCategory(category);
        stats.xp = (stats.xp || 0) + gained;
        stats.history = stats.history || [];
        stats.history.push({domain, category, time: Date.now(), xp: gained});
        // optional: prune history size
        if (stats.history.length > 1000) stats.history.shift();
        chrome.storage.local.set({ stats });
      });
    }
  } catch (e) {
    // ignore non-parsable urls (chrome:, extension pages, etc.)
  }
});

// Popup will call this to get current stats
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === "getStats") {
    chrome.storage.local.get(["stats"], (res) => {
      sendResponse({ stats: res.stats || { visited: {}, categories: {}, xp: 0, badges: [], history: [] } });
    });
    return true; // keep channel open for async response
  }
});
