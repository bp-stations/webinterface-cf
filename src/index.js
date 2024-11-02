import render_search from './template_raw_search.js';

var src_default = {
    corsHeaders: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
        "Access-Control-Max-Age": "86400",
        "Access-Control-Allow-Headers": "hx-current-url,hx-request,hx-target,hx-trigger,hx-trigger-name",
    },
    async default(request, env) {
        const response = new Response(`https://github.com/bp-stations/webinterface-cf`, {headers: {
            ...this.corsHeaders,
            "content-type": "text/html"
        }});
        return response;
    },
    async station_count(request, env) {
        const { DATABASE } = env;
        const stmp = DATABASE.prepare('SELECT COUNT(*) AS total FROM stations;');
        const data = await stmp.first("total");
        const response = new Response(`<span>${data}</span>`, {headers: {
            ...this.corsHeaders,
            "content-type": "text/html"
        }});
        return response;
    },
    async get_station(request, env) {
        const { DATABASE } = env;
        const url = new URL(request.url)
        let search_term = url.searchParams.get("search");
        if (search_term && search_term.length > 2) {
            search_term = search_term.toLocaleLowerCase();
            const stmp = DATABASE.prepare("SELECT id, city, name FROM stations WHERE LOWER(name) LIKE ?1 OR LOWER(city) LIKE ?1 OR LOWER(postcode) LIKE ?1 LIMIT 20;");
            const { results } = await stmp.bind(`%${search_term}%`).all();
            let result_html = "";
            results.forEach(element => { result_html = result_html + render_search(element.id, element.city, element.name); });
            const response = new Response(result_html, {headers: {
                ...this.corsHeaders,
                "content-type": "text/html"
            }});
            return response
        } else {
            const response = new Response("", {headers: {
                ...this.corsHeaders,
                "content-type": "text/html"
            }});
            return response
        }
    }, 
    async fetch(request, env) {
        const pathName = new URL(request.url).pathname;
        switch (pathName) {
            case "/":
                return await this.default(request, env);
            case "/count":
                return await this.station_count(request, env);
            case "/search":
                return await this.get_station(request, env);
            default:
                return await this.default(request, env);
        }
        
    }
};
export {
  src_default as default
};
