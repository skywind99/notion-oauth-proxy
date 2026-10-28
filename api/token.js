// Vercel 서버리스 함수: code → access_token 교환 (client_secret은 여기서만 사용)
// 환경변수: NOTION_CLIENT_ID, NOTION_CLIENT_SECRET
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { code, redirect_uri } = req.body || {};
  if (!code || !redirect_uri) return res.status(400).json({ error: "code, redirect_uri required" });

  const basic = Buffer.from(
    `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
  ).toString("base64");

  const r = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/json" },
    body: JSON.stringify({ grant_type: "authorization_code", code, redirect_uri }),
  });

  const data = await r.json();
  res.status(r.status).json(data);
};
