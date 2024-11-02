export default function render_search(id, city, name) {
    return `<tr class="s_station" role="button" hx-on:click="location.href = '/station/${id}';">
    <td>${id}</td>
    <td>${city}</td>
    <td>${name}</td>
</tr>
`;
}