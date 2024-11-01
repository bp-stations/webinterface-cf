var src_default = {
    async default(request, env) {
        const response = new Response("https://github.com/bp-stations/webinterface-cf")
        response.headers["content-type"] = "text/html"
        return response
    },
    async station_count(request, env) {
        const { DATABASE } = env;
        const ps = DATABASE.prepare('SELECT COUNT(*) AS total FROM stations;');
        const data = await ps.first("total");
        const response = new Response(data)
        response.headers["content-type"] = "text/html"
        return response
    },
    async get_station(request, env) {
        const { DATABASE } = env;
        const ps = DATABASE.prepare('SELECT COUNT(*) AS total FROM stations;');
        const data = await ps.first("total");
        const response = new Response(data)
        response.headers["content-type"] = "text/html"
        return response
    }, 
    async fetch(request, env) {
        const pathName = new URL(request.url).pathname;
        switch (pathName) {
            case "/":
                return await this.default(request, env);
            case "/count":
                return await this.station_count(request, env);
            default:
                return await this.default(request, env);
        }
        
    }
};
export {
  src_default as default
};
