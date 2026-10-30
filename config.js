/* One place for every path, link and editable text. */
window.CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbzMgJNS2h9IBrOJ3JoRJKlvkoFzCOUWIvfbYZCuOdK7SeyCM1k2d3Uoa8G9HtTdSmaRRg/exec",                      // paste your Apps Script Web App /exec URL (empty = sample posts)
  ASSET_BASE: "assets/",            // folder with your existing PNGs
  PROFILE: "assets/profile.png",    // your existing profile image path (separate asset)
  NAV: [                            // [section id, label, existing button file]
    ["home", "Home", "home.png"], ["about", "About", "about.png"],
    ["portfolio", "Portfolio", "portofolio.png"], ["posts", "Posts", "posts.png"],
    ["contact", "Contacts", "contacts.png"]
  ],
  INFO: [                           // [icon, label, value]  <- edit freely
    ["🎂", "Age", "19 (soon 20)"], ["📍", "Location", "Subang, Indonesia"],
    ["🎓", "Occupation", "Student"], ["💗", "Personality", "ISFP / Libra"],
    ["🌱", "Languages", "Indonesian, English, Japanese (N5-N4), German, Italian"],
    ["🎮", "Interests", "Languages, Tech, Games, Art, Music, Websites, Random things"]
  ],
  SKILLS: [["💻","Web Development"],["🎨","Art & Design"],["📚","Language Learning"],["🎮","Gaming"],
           ["🎵","Music"],["📷","Photography"],["💡","Ideas & Projects"],["🎲","Random Activities"]],
  SOCIAL: [
    { name: "WhatsApp",  icon: "whatsapp.png",  text: "+6285161840928",              url: "https://wa.me/6285161840928" },
    { name: "Email",     icon: "email.png",     text: "froylanfahlanaditya@gmail.com", url: "mailto:froylanfahlanaditya@gmail.com" },
    { name: "TikTok",    icon: "tiktok.png",    text: "@adrianmostlyloser",          url: "https://www.tiktok.com/@adrianmostlyloser" },
    { name: "Instagram", icon: "Instagram.png", text: "@mostlytsar",                 url: "https://www.instagram.com/mostlytsar" }
  ],
  MORE_ICON: "more.png",
  POST_STICKERS: ["yellow_love.png", "love.png"],   // small stickers on post cards
  MORE_LINKS: [],                   // [{label:"Name", url:"https://..."}] shown in the "More" popup
  CONTACT: ["Email", "WhatsApp", "Instagram"],
  // Stickers: [file, "inline css"]. Positions are relative to the hero / sidebar block.
  DECO_HERO: [
    ["sun.png","left:3%;top:4%;width:74px"], ["cloud.png","left:24%;top:2%;width:96px"],
    ["rainbow.png","right:2%;top:0;width:190px"], ["cat.png","left:64%;bottom:22px;width:72px"],
    ["leaf.png","left:6%;bottom:6px;width:46px"], ["flower.png","left:44%;bottom:4px;width:50px"],
    ["leaf.png","right:6%;bottom:6px;width:42px"]
  ],
  DECO_SIDE: [
    ["cat.png","left:4%;top:6%;width:110px;--r:-6deg"], ["rainbow.png","left:30%;top:32%;width:130px"],
    ["yellow_love.png","right:6%;top:8%;width:52px"], ["love.png","left:8%;top:64%;width:56px"],
    ["flower.png","right:10%;top:72%;width:70px"], ["leaf.png","left:38%;top:88%;width:50px"]
  ]
};
