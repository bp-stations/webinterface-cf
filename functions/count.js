export async function onRequestGet(context) {
  const { DATABASE } = context.env;
  const stmp = DATABASE.prepare('SELECT COUNT(*) AS total FROM stations;');
  const data = await stmp.first("total");
  const response = new Response(`<span>${data}</span>`, {headers: {
      "content-type": "text/html"
  }});
  return response;
}