const template = {
    HTML: (title, list, body, control) => {
        return `
            <!doctype html>
            <html>
            <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
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
        
        for(let i = 0; i < fileList.length; i++){
            list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</li>`
        }
        list+='</ul>';
        return list;
    }
};

module.exports = template;