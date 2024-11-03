function render_search(id, city, name) {
    return `<tr class="s_station" role="button" hx-on:click="location.href = '/station/${id}';">
    <td>${id}</td>
    <td>${city}</td>
    <td>${name}</td>
</tr>
`;
}

export async function onRequestGet(context) {
    const { DATABASE } = context.env;
    const url = new URL(context.request.url)
    let search_term = url.searchParams.get("search");
    if (search_term && search_term.length > 2) {
        search_term = search_term.toLocaleLowerCase();
        const stmp = DATABASE.prepare("SELECT id, city, name FROM stations WHERE LOWER(name) LIKE ?1 OR LOWER(city) LIKE ?1 OR LOWER(postcode) LIKE ?1 LIMIT 20;");
        const { results } = await stmp.bind(`%${search_term}%`).all();
        let result_html = "";
        results.forEach(element => { result_html = result_html + render_search(element.id, element.city, element.name); });
        const response = new Response(result_html, {headers: {
            "content-type": "text/html"
        }});
        return response
    } else {
        const response = new Response("", {headers: {
            "content-type": "text/html"
        }});
        return response
    }
}