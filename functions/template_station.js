const IMG = ["000000000180000000", "F00104", "F00113", "F00114", "F00125", "F00400", "F00401", "F00426", "F00606", "F00930"];

async function get_data(id) {
    try {
        const data = await fetch(`https://api.tankstelle.aral.de/api/v2/stations/${id}/prices`);
        if (data.ok) {
            const real_data = await data.json();
            return real_data["data"];
        } else {
            return [];
        }
    } catch (e) {
        console.error(e);
        return [];
    }
}

function priceView(data) {
    let imageTag = IMG.includes(data.aral_id)
        ? `<img class="object-cover" alt="Logo für ${data.name}" src="/images/icons/${data.aral_id}.avif">`
        : '';

    return `
        <tr class="border-b border-slate-200">
            <th scope="row" class="w-200">${imageTag}</th>
            <td>${data.name}</td>
            ${
                !data.price.error
                    ? `<td>${data.price.price}</td><td>${data.price.valid_from} Uhr</td>`
                    : `<td>kein Preis Verfügbar</td><td></td>`
            }
        </tr>
    `;
}

export default async function render_station(id, city, name, postcode, lat, lng) {
    const data = await get_data(id);
    let prices = "";
    data.forEach(element => {
        prices = prices + priceView(element);
    });
    return `<div class="container mx-auto text-center">
    <div class="border border-1 m-2 mb-5 text-4xl p-2 dark:text-white">
        <h1>${postcode} ${city}</h1>
        <h2>${name}</h2>
    </div>

    <div class="flex w-full dark:text-white">
            <div class="info w-full lg:w-full">
                <table class="table">
                    <thead class="border-b border-black dark:border-white">
                        <tr>
                            <td style="width:7.5%"></td><td>Kraftstoff</td><td>Preis</td><td>letzte Preisänderung</td>
                        </tr>
                    </thead>
                    <tbody>
                        ${prices}
                    </tbody>
                </table>
            </div>
    </div>
    <a href="/"><button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mt-4">zurück</button></a>
</div>
<script>
document.addEventListener("DOMContentLoaded", function() {
    const frame = document.getElementById("mapframe");

    if ("IntersectionObserver" in window) {
        let lazy_frame_observer = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyFrame = entry.target;
                    lazyFrame.src = lazyFrame.dataset.src;
                    lazy_frame_observer.unobserve(lazyFrame);
                }
            })
        });
        lazy_frame_observer.observe(frame);
    }
});
</script>
`;
}