import * as params from '@params';

let fuse;
let searchBox = document.getElementById('search');
let resList = document.getElementById('tableListBox');

window.onload = () => {
    fetch(params.BaseURL + 'index.json')
        .then(res => res.json())
        .then(data => {
            const options = {
                distance: 100,
                threshold: 0.0,
                ignoreLocation: true,
                keys: [
                    'title',
                    'description',
                    'tags.title',
                ]
            };
            const myIndex = Fuse.createIndex(options.keys, data)
            fuse = new Fuse(data, options, myIndex);
        });
}

searchBox.addEventListener('input', () => {
    let resultSet = '';
    let results = fuse.search(searchBox.value);
    if (searchBox.value !== '') {
        for (let item in results) {
            let tagList = '';
            if (results[item].item.tags) {
                results[item].item.tags.forEach(tag => {
                    tagList += `<li><a href="${tag.permalink}">${tag.title}</a></li>`
                });
            }
            resultSet += `
            <div class="package-box">
                <table style="margin: 0.2rem; height: 100%;">
                <thead>
                    <tr><th><a href="${results[item].item.permalink}">${results[item].item.title}</a></th></tr>
                </thead>
                <tbody>
                    <td style="text-align: left; vertical-align: top;">
                        <div style="display: inline-flex; flex-shrink: 0;">
            `;
            // If the item is a visualization package, show the thumbnail.
            if (results[item].item.permalink.includes('visualization_')) {
                resultSet += `
                            <figure style="margin: 1rem 1rem 0 0; width: 40%;">
                                <a href="${results[item].item.permalink}"><img src="${results[item].item.permalink}images/thumbnail.png" width="100%"" /></a>
                            </figure>`;
            }
            resultSet += `
                            <p>
                                ${results[item].item.description}
                            </p>
                        </div>
                    </td>
                    <tr>
                    <td valign="bottom">
                        <ul class="tagsList">${tagList}</ul>
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>`
        }
    } else {
        for (let item of fuse.getIndex().docs) {
            let tagList = '';
            if (item.tags) {
                item.tags.forEach(tag => {
                    tagList += `<li><a href="${tag.permalink}">${tag.title}</a></li>`
                });
            }
            resultSet += `
            <div class="package-box">
                <table style="margin: 0.2rem; height: 100%;">
                <thead>
                    <tr><th><a href="${item.permalink}">${item.title}</a></th></tr>
                </thead>
                <tbody>
                    <td style="text-align: left; vertical-align: top;">
                    <div style="display: inline-flex; flex-shrink: 0;">
            `;
            // If the item is a visualization package, show the thumbnail.
            if (item.permalink.includes('visualization_')) {
                resultSet += `
                        <figure style="margin: 1rem 1rem 0 0; width: 40%;">
                            <a href="${item.permalink}"><img src="${item.permalink}images/thumbnail.png" width="100%"" /></a>
                        </figure>`;
            }
            resultSet += `
                        <p>
                            ${item.description}
                        </p>
                    </div>
                </td>
                    <tr>
                    <td valign="bottom">
                        <ul class="tagsList">${tagList}</ul>
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>`
        }
    }
    resList.innerHTML = resultSet;
})
