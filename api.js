/* Posts API. Uses JSONP so it works with Apps Script Web Apps from any host. */
const API = (() => {
  const SAMPLE = [  // dev data, used only while CONFIG.API_URL is empty
    { id:"s1", type:"image",      title:"A quiet day",     imageUrl:"rainbow.png", date:"2026-10-28", status:"published" },
    { id:"s2", type:"image_text", title:"Mood today",      content:"Soft day, slow tea.", imageUrl:"baby1.png", date:"2026-10-26", status:"published" },
    { id:"s3", type:"text",       title:"Just a thought",  content:"Little progress is still progress.", date:"2026-10-24", status:"published" },
    { id:"s4", type:"link",       title:"Sample link",     content:"An external page or media link.", imageUrl:"sun.png", linkUrl:"https://example.com", date:"2026-10-21", status:"published" }
  ];
  function jsonp(base, ms = 10000) {
    return new Promise((resolve, reject) => {
      const cb = "cb" + Date.now(), s = document.createElement("script");
      const end = () => { clearTimeout(t); delete window[cb]; s.remove(); };
      const t = setTimeout(() => { end(); reject(new Error("timeout")); }, ms);
      window[cb] = d => { end(); resolve(d); };
      s.onerror = () => { end(); reject(new Error("network")); };
      s.src = base + (base.includes("?") ? "&" : "?") + "action=posts&_=" + Date.now() + "&callback=" + cb;
      document.head.appendChild(s);
    });
  }
  async function getPosts() {
    const raw = CONFIG.API_URL ? await jsonp(CONFIG.API_URL).catch(() => jsonp(CONFIG.API_URL)) : { ok: true, posts: SAMPLE };
    if (!raw || !raw.ok) throw new Error((raw && raw.error) || "bad response");
    return raw.posts.filter(p => p.status === "published")
                    .sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  return { getPosts };
})();
