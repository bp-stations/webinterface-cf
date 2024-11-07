function get_expires_time() {
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const daysUntilNextMonday = (8 - dayOfWeek) % 7 || 7;
  const nextMonday = new Date(now);
  nextMonday.setUTCDate(now.getUTCDate() + daysUntilNextMonday);
  nextMonday.setUTCHours(2, 20, 0, 0);
  return nextMonday.toUTCString();
}

export async function onRequestGet(context) {
  const { DATABASE } = context.env;
  const stmp = DATABASE.prepare('SELECT COUNT(*) AS total FROM stations;');
  const data = await stmp.first("total");
  const response = new Response(`<span>${data}</span>`, {headers: {
      "content-type": "text/html",
      "expires": get_expires_time()
  }});
  return response;
}