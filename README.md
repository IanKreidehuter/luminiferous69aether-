# Fahlan Aditya – childcore portfolio

Files: `index.html`, `style.css`, `config.js` (all paths/text), `api.js`, `script.js`, `Code.gs` (backend).

## 1. Assets
Put your existing PNGs in `assets/` (or change `ASSET_BASE` in `config.js`). Set `PROFILE` to your profile image path.
Names used: home, about, portofolio, posts, contacts, whatsapp, Instagram, tiktok, email, more, cat, rainbow, sun, cloud, leaf, flower, love, yellow_love, baby1 (sample post).
A missing file simply hides itself.

## 2. Backend (Google Apps Script)
1. Create a Google Sheet with a tab named `posts` and headers in row 1: `id, title, type, content, imageUrl, linkUrl, category, date, status`.
2. Extensions → Apps Script → paste `Code.gs`.
3. Project Settings → Script properties: `ADMIN_TOKEN` (long random string, for the future admin) and `UPLOAD_FOLDER_ID` (a Drive folder).
4. Deploy → New deployment → Web app → Execute as **Me**, access **Anyone**. Copy the `/exec` URL into `API_URL` in `config.js`.
5. Images: share the Drive file as "Anyone with the link" and paste its link in `imageUrl`; the API converts it to a thumbnail URL.

`type` is one of `image`, `image_text`, `text`, `link`; only `status = published` rows are returned, newest first. With `API_URL` empty, sample posts show instead.

## 3. Future admin.html
`doPost` already supports `save`, `delete` and `upload` (base64) behind `ADMIN_TOKEN`. Never put the token in public pages; the admin page should ask for it at login.
Redeploy (new version) after every Code.gs change.

## 4. admin.html
Open `admin.html`, enter your `ADMIN_TOKEN`, then create, edit, delete, save drafts, publish and upload images (resized to JPEG in the browser, saved to your `UPLOAD_FOLDER_ID` Drive folder). Needs `Code.gs` redeployed as a **New version** after the latest update.
