(() => {
  const C = CONFIG, $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const src = n => /^(https?:|data:|\/|\.)/.test(n) ? n : C.ASSET_BASE + n;
  const safe = u => /^(https?:|mailto:)/i.test(u) ? u : "#";
  const fmt = d => { const t = new Date(d); return isNaN(t) ? "" : t.toLocaleDateString("en-US", {month:"short", day:"numeric", year:"numeric"}); };
  const stickers = l => l.map(([n, st, cl]) => `<img class="sticker ${cl || ""}" src="${esc(src(n))}" alt="" style="${esc(st)}">`).join("");

  // Missing assets hide themselves instead of showing broken icons.
  document.addEventListener("error", e => { if (e.target.tagName === "IMG") e.target.classList.add("broken"); }, true);

  $("#profile").src = $("#profile2").src = C.PROFILE;
  $("#decoHero").innerHTML = stickers(C.DECO_HERO);
  $("#decoHeroM").innerHTML = stickers(C.DECO_HERO_M);
  const side = $("#decoSide"), pool = C.DECO_SIDE_POOL || [];
  const fillSide = () => {          // scatter stickers down the whole sidebar height
    const h = side.offsetHeight; side.innerHTML = "";
    if (!h || !pool.length) return;
    let html = "", i = 0;
    for (let y = 6; y < h - 70; y += 118, i++) {
      const f = pool[i % pool.length], tw = /love|yellow/.test(f) ? " twinkle" : "";
      html += `<img class="sticker${tw}" src="${esc(src(f))}" alt="" style="left:${(i % 2 ? 48 : 4) + (i * 11) % 14}%;top:${y}px;width:${58 + (i * 29) % 44}px;--r:${(i * 19) % 24 - 12}deg;--d:-${(i * 7) % 5}s">`;
    }
    side.innerHTML = html;
  };
  if ("ResizeObserver" in window) new ResizeObserver(fillSide).observe(side); else fillSide();
  $("#nav").innerHTML = C.NAV.map(([id, label, f, r]) =>
    `<a href="#${id}" data-id="${id}" class="nb"><img class="wide" src="${esc(src(f))}" alt=""><img class="round" src="${esc(src(r || f))}" alt=""><span>${esc(label)}</span></a>`).join("");
  $("#info").innerHTML = C.INFO.map(([i, l, v]) => `<li><span aria-hidden="true">${i}</span><span><b>${esc(l)}:</b> ${esc(v)}</span></li>`).join("");
  $("#skills").innerHTML = C.SKILLS.map(([i, t]) => `<li title="${esc(t)}"><span aria-hidden="true">${i}</span><em>${esc(t)}</em></li>`).join("");
  $("#social").innerHTML = C.SOCIAL.map(s =>
    `<li><a href="${esc(safe(s.url))}" target="_blank" rel="noopener noreferrer" title="${esc(s.text)}"><img src="${esc(src(s.icon))}" alt=""><span>${esc(s.name)}</span></a></li>`).join("") +
    `<li><button type="button" class="moreBtn" aria-haspopup="dialog" title="More"><img src="${esc(src(C.MORE_ICON))}" alt=""><span>More</span></button></li>`;
  $("#msocial").innerHTML = $("#social").innerHTML;
  $("#contactLinks").innerHTML = C.CONTACT.map((n, i) => {
    const s = C.SOCIAL.find(x => x.name === n); if (!s) return "";
    return `<a class="lbl c${i}" href="${esc(safe(s.url))}" target="_blank" rel="noopener noreferrer"><img src="${esc(src(s.icon))}" alt="">${esc(s.name)}</a>`;
  }).join("");

  const dlg = $("#more");
  const openMore = () => {
    $("#moreList").innerHTML = C.MORE_LINKS.length
      ? C.MORE_LINKS.map(l => `<li><a href="${esc(safe(l.url))}" target="_blank" rel="noopener noreferrer">${esc(l.label)}</a></li>`).join("")
      : "<li>Nothing here yet.</li>";
    dlg.showModal();
  };
  document.querySelectorAll(".moreBtn").forEach(b => b.onclick = openMore);
  $("#moreClose").onclick = () => dlg.close();
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

  // Smooth scroll + active nav
  document.querySelectorAll(".nb").forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    if (root.classList.contains("stage")) return setView(a.dataset.id);   // desktop: swap views, no scrolling
    document.getElementById(a.dataset.id)?.scrollIntoView({behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "auto" : "smooth"});
  }));
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting && !root.classList.contains("stage")) document.querySelectorAll(".nb").forEach(a => a.classList.toggle("on", a.dataset.id === en.target.id));
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
  let pn = 0;
  const pk = () => C.POST_STICKERS?.length ? `<img class="pk" src="${esc(src(C.POST_STICKERS[pn++ % C.POST_STICKERS.length]))}" alt="">` : "";
  const card = p => {
    const t = p.type, thumb = p.imageUrl && t !== "text" ? `<div class="thumb"><img loading="lazy" src="${esc(src(p.imageUrl))}" alt="${esc(p.title)}"></div>` : "";
    const body = `${thumb}<div class="cap">${p.title ? `<h3>${esc(p.title)}</h3>` : ""}${t !== "image" && p.content ? `<p>${esc(p.content)}</p>` : ""}<time datetime="${esc(p.date)}">${fmt(p.date)}</time>${pk()}</div>`;
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
  // Stage mode (desktop): the whole site is drawn on a 1280x820 stage scaled to fit the screen; the nav swaps views
  const root = document.documentElement, mainEl = $("main"), VIEWS = ["home", "about", "portfolio", "posts", "contact"];
  function setView(id, keepHash) {
    if (!VIEWS.includes(id)) id = "home";
    mainEl.dataset.view = id;
    document.querySelectorAll(".nb").forEach(a => a.classList.toggle("on", a.dataset.id === id));
    if (!keepHash) history.replaceState(null, "", "#" + id);
    const g = $("#grid"); if (g) g.scrollTop = 0;
  }
  function fit() {
    const on = innerWidth >= 1000 && innerHeight >= 520, was = root.classList.contains("stage");
    root.classList.toggle("stage", on);
    if (on) root.style.setProperty("--z", Math.min(innerWidth / 1280, innerHeight / 820, 1.8).toFixed(3));
    if (on && !was) setView(location.hash.slice(1), true);
  }
  addEventListener("resize", fit); fit();
  // Protection layer: no right-click / long-press menu, no image dragging (turn off with PROTECT_IMAGES: false)
  if (C.PROTECT_IMAGES !== false) {
    document.documentElement.classList.add("protect");
    document.addEventListener("contextmenu", e => { if (!e.target.closest("input,textarea")) e.preventDefault(); });
    document.addEventListener("dragstart", e => { if (e.target.tagName === "IMG") e.preventDefault(); });
  }
  // Cards fade in as they scroll into view
  document.documentElement.classList.add("js");
  if ("IntersectionObserver" in window) {
    const ro = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); } }), {threshold: .06});
    document.querySelectorAll(".hero,.card").forEach(e => { e.classList.add("rv"); ro.observe(e); });
  }
  // Loading screen: hide it once fonts, stickers and the first posts request are done (12 s max)
  const loader = $("#loader"), bar = $("#loaderBar");
  const settle = i => i.complete ? Promise.resolve() : new Promise(r => { i.addEventListener("load", r, {once: true}); i.addEventListener("error", r, {once: true}); });
  const seen = new Set(), prog = {n: 0, done: 0};
  const watch = () => {              // lazy post thumbnails are skipped so they never block the screen
    const l = [...document.images].filter(i => i.loading !== "lazy" && !seen.has(i));
    l.forEach(i => seen.add(i)); prog.n += l.length;
    return Promise.all(l.map(i => settle(i).then(() => { prog.done++; if (bar) bar.style.width = Math.max(8, Math.round(100 * prog.done / prog.n)) + "%"; })));
  };
  (async () => {
    const first = watch();
    await Promise.race([
      Promise.all([first, load(), document.fonts ? document.fonts.ready : 0]).then(watch),
      new Promise(r => setTimeout(r, 12000))
    ]);
    root.classList.remove("loading");
    if (loader) { loader.classList.add("done"); setTimeout(() => loader.remove(), 800); }
  })();
})();
