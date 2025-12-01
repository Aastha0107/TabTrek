function calculateLevel(xp) {
  // Simple leveling: 100 xp per level
  return Math.floor(xp / 100);
}

function choosePet(xp) {
  if (xp < 100) return "🐣";
  if (xp < 300) return "🐤";
  if (xp < 700) return "🦅";
  return "🐉";
}

function renderStats(stats) {
  const xp = stats.xp || 0;
  const level = calculateLevel(xp);
  document.getElementById("level").innerText = `Level ${level}`;
  document.getElementById("xp").innerText = `XP: ${xp}`;

  const progress = xp % 100;
  const percent = (progress / 100) * 100;
  document.getElementById("progressFill").style.width = percent + "%";

  document.getElementById("pet").innerText = choosePet(xp);

  // categories
  const catsEl = document.getElementById("categories");
  catsEl.innerHTML = "";
  const cats = stats.categories || {};
  for (let c of Object.keys(cats).sort((a,b)=>cats[b]-cats[a])) {
    const p = document.createElement("div");
    p.innerText = `${c}: ${cats[c]}`;
    catsEl.appendChild(p);
  }

  // top sites
  const sitesEl = document.getElementById("sites");
  sitesEl.innerHTML = "";
  const visited = stats.visited || {};
  const topSites = Object.keys(visited).sort((a,b)=> visited[b]-visited[a]).slice(0,8);
  for (let s of topSites) {
    const p = document.createElement("div");
    p.innerText = `${s}: ${visited[s]} visits`;
    sitesEl.appendChild(p);
  }
}

function refresh() {
  chrome.runtime.sendMessage({type: "getStats"}, (res) => {
    const stats = (res && res.stats) || { visited: {}, categories: {}, xp: 0 };
    renderStats(stats);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("refresh").addEventListener("click", refresh);
  document.getElementById("reset").addEventListener("click", () => {
    if (!confirm("Reset all extension data?")) return;
    chrome.storage.local.set({ stats: { visited: {}, categories: {}, xp: 0, history: [], badges: [] } }, refresh);
  });

  document.getElementById("summary").addEventListener("click", async () => {
    // Basic local summary (works offline, no API key)
    chrome.runtime.sendMessage({type: "getStats"}, (res) => {
      const stats = (res && res.stats) || { visited: {}, categories: {}, xp: 0 };
      const totalVisits = Object.values(stats.visited || {}).reduce((a,b)=>a+b, 0);
      const cat = stats.categories || {};
      const productive = (cat.education || 0) + (cat.productive || 0);
      const productivePct = totalVisits ? Math.round((productive / totalVisits) * 100) : 0;
      const text = `You visited ${totalVisits} pages. ${productivePct}% were productive (education/productive). XP: ${stats.xp || 0}`;
      document.getElementById("summaryBox").innerText = text;
    });
  });

  refresh();
});
