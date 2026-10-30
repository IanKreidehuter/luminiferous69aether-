(() => {
  const C = CONFIG, $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const src = n => /^(https?:|data:|\/|\.)/.test(n) ? n : C.ASSET_BASE + n;
  const safe = u => /^(https?:|mailto:)/i.test(u) ? u : "#";
  const fmt = d => { const t = new Date(d); return isNaN(t) ? "" : t.toLocaleDateString("en-US", {month:"short", day:"numeric", year:"numeric"}); };
  const stickers = l => l.map(([n, st]) => `<img class="sticker" src="${esc(src(n))}" alt="" style="${esc(st)}">`).join("");

  // Missing assets hide themselves instead of showing broken icons.
  document.addEventListener("error", e => { if (e.target.tagName === "IMG") e.target.classList.add("broken"); }, true);

  $("#profile").src = C.PROFILE;
  $("#decoHero").innerHTML = stickers(C.DECO_HERO);
  $("#decoSide").innerHTML = stickers(C.DECO_SIDE);
  $("#nav").innerHTML = C.NAV.map(([id, label, f]) =>
    `<a href="#${id}" data-id="${id}" class="nb"><img src="${esc(src(f))}" alt=""><span>${esc(label)}</span></a>`).join("");
  $("#info").innerHTML = C.INFO.map(([i, l, v]) => `<li><span aria-hidden="true">${i}</span><span><b>${esc(l)}:</b> ${esc(v)}</span></li>`).join("");
  $("#skills").innerHTML = C.SKILLS.map(([i, t]) => `<li><span aria-hidden="true">${i}</span>${esc(t)}</li>`).join("");
  $("#social").innerHTML = C.SOCIAL.map(s =>
    `<li><a href="${esc(safe(s.url))}" target="_blank" rel="noopener noreferrer" title="${esc(s.text)}"><img src="${esc(src(s.icon))}" alt=""><span>${esc(s.name)}</span></a></li>`).join("") +
    `<li><button type="button" id="moreBtn" aria-haspopup="dialog" title="More"><img src="${esc(src(C.MORE_ICON))}" alt=""><span>More</span></button></li>`;
  $("#contactLinks").innerHTML = C.CONTACT.map((n, i) => {
    const s = C.SOCIAL.find(x => x.name === n); if (!s) return "";
    return `<a class="lbl c${i}" href="${esc(safe(s.url))}" target="_blank" rel="noopener noreferrer"><img src="${esc(src(s.icon))}" alt="">${esc(s.name)}</a>`;
  }).join("");

  const dlg = $("#more");
  $("#moreBtn").onclick = () => {
    $("#moreList").innerHTML = C.MORE_LINKS.length
      ? C.MORE_LINKS.map(l => `<li><a href="${esc(safe(l.url))}" target="_blank" rel="noopener noreferrer">${esc(l.label)}</a></li>`).join("")
      : "<li>Nothing here yet.</li>";
    dlg.showModal();
  };
  $("#moreClose").onclick = () => dlg.close();
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

  // Smooth scroll + active nav
  document.querySelectorAll(".nb").forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    document.getElementById(a.dataset.id)?.scrollIntoView({behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "auto" : "smooth"});
  }));
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) document.querySelectorAll(".nb").forEach(a => a.classList.toggle("on", a.dataset.id === en.target.id));
  }), {rootMargin: "-40% 0px -55% 0px"});
  C.NAV.forEach(([id]) => { const s = document.getElementById(id); if (s) io.observe(s); });

  // Posts
  const TYPES = [["all","All"],["image","Image"],["image_text","Image + Text"],["text","Text"],["link","Link"]];
  const grid = $("#grid"), state = $("#state");
  let posts = [], filter = "all";
  $("#filters").innerHTML = TYPES.map(([k, l]) => `<button type="button" data-k="${k}" aria-pressed="${k === "all"}">${l}</button>`).join("");
  $("#filters").onclick = e => {
    const b = e.target.closest("button"); if (!b) return;
    filter = b.dataset.k;
    $("#filters").querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
    render();
  };
  const card = p => {
    const t = p.type, thumb = p.imageUrl && t !== "text" ? `<div class="thumb"><img loading="lazy" src="${esc(src(p.imageUrl))}" alt="${esc(p.title)}"></div>` : "";
    const body = `${thumb}<div class="cap">${p.title ? `<h3>${esc(p.title)}</h3>` : ""}${t !== "image" && p.content ? `<p>${esc(p.content)}</p>` : ""}<time datetime="${esc(p.date)}">${fmt(p.date)}</time></div>`;
    return t === "link" && p.linkUrl
      ? `<a class="post link" href="${esc(safe(p.linkUrl))}" target="_blank" rel="noopener noreferrer">${body}</a>`
      : `<article class="post ${esc(t)}">${body}</article>`;
  };
  const say = (msg, retry) => { grid.innerHTML = ""; state.hidden = false; state.innerHTML = esc(msg) + (retry ? ` <button type="button" id="retry">Try again</button>` : ""); if (retry) $("#retry").onclick = load; };
  function render() {
    const l = posts.filter(p => filter === "all" || p.type === filter);
    if (!l.length) return say("No posts here yet. Check back soon!");
    state.hidden = true; grid.innerHTML = l.map(card).join("");
  }
  async function load() {
    say("Loading posts…");
    try { posts = await API.getPosts(); render(); }
    catch (e) { say("Couldn't load posts. Check your API_URL in config.js, then try again.", true); }
  }
  load();
})();
