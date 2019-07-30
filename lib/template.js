const template = {
    HTML: (title, list, body, control) => {
        return `
        <!DOCTYPE html>
        <html lang="kr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>WEB1 - ${title}</title>
        </head>
        <body>
        <a href="/author">author-create</a>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${control}
            ${body}
        </body>
        </html>
        `;
    },
    db_List: (topics) => {
        let list = '<ul>';
        for (let i = 0; i < topics.length; i++) {
            list += `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
        }
        list += '</ul>';
        return list;
    },
    data_List: (fileList) => {
        let list = '<ul>';

        for (let i = 0; i < fileList.length; i++) {
            list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</li>`
        }
        list += '</ul>';
        return list;
    },
    authorSelect: (authors, author_id) => {
        let tag = '';
        for(let i =0; i < authors.length; i++) {
            let selected = '';
            if(authors[i].id === author_id){
                selected = `selected`;
            }
            tag += `<option value = "${authors[i].id}" ${selected}>${authors[i].name}</option>`;
        }
        return `
            <select name = "author">
            ${tag}
            </select>
        `;
    },
    authorTable: (authors) => {
        let tag = '<table>';
        for(let i =0; i < authors.length; i++){
            tag += `
                <tr>
                    <td>${authors[i].name}</td>
                    <td>${authors[i].profile}</td>
                    <td>update</td>
                    <td>delte</td>                   
                </tr> 
            `;
        }
        tag += '</table>';
        return tag;
    }
};

module.exports = template;