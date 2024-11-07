function render_search(id, city, name) {
    return `<tr class="s_station" role="button" hx-on:click="location.href = '/station/${id}';">
    <td>${id}</td>
    <td>${city}</td>
    <td>${name}</td>
</tr>
`;
}

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
    const url = new URL(context.request.url)
    let search_term = url.searchParams.get("search");
    if (search_term && search_term.length > 2) {
        search_term = search_term.toLocaleLowerCase();
        const stmp = DATABASE.prepare("SELECT id, city, name FROM stations WHERE LOWER(name) LIKE ?1 OR LOWER(city) LIKE ?1 OR LOWER(postcode) LIKE ?1 LIMIT 20;");
        const { results } = await stmp.bind(`%${search_term}%`).all();
        const result_html = results.map(element => render_search(element.id, element.city, element.name)).join('');
        const response = new Response(result_html, {headers: {
            "content-type": "text/html",
            "Expires": get_expires_time()
        }});
        return response
    } else {
        const response = new Response("", {headers: {
            "content-type": "text/html"
        }});
        return response
    }
}