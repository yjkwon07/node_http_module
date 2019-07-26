const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

function templateHTML(title, list, body, control) {
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
}

function templateList(filelist) {
    let list = '<ul>';
    for (let i = 0; i < filelist.length; i++) {
        list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    }
    list += '</ul>';
    return list;
}

const app = http.createServer((request, response) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
    console.log(pathname);
    if (pathname === '/') {

        if (queryData.id === undefined) {
            fs.readdir('./data', (error, filelist) => {
                const title = 'Welcome';
                const description = 'Hello, Node.js';
                const list = templateList(filelist);
                const template = templateHTML(title, list,
                    `<h2>${title}</h2>${description}`,
                    '<a href="/create">create</a>'
                );
                response.writeHead(200);
                response.end(template);
            });
        }
        else {
            fs.readdir('./data', function (error, filelist) {
                fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
                    const title = queryData.id;
                    const list = templateList(filelist);
                    const template = templateHTML(title, list,
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a> <a href="update?id=${title}">update</a>`);
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }

    }

    else if (pathname === '/create') {
        fs.readdir('./data', function (error, filelist) {
            const title = 'WEB - create';
            const list = templateList(filelist);
            const template = templateHTML(title, list, `
                <form action="create_process" method="POST">
                    <p>
                        <input type = "text" name="title" placeholder="title">
                    </p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type = "submit">
                    </p>
                </form>
            `, '');
            response.writeHead(200);
            response.end(template);
        });
    }

    else if (pathname === '/create_process') {
        let body = "";
        request.on('data', (data) => {
            body += data;
        });
        request.on('end', () => {
            const post = qs.parse(body);
            const title = post.title;
            const description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', (error) => {
                response.writeHead(302, { Location: `/?id=${title}` });
                response.end();
            });
        });
    }
    else if (pathname === '/update') {
        fs.readdir('./data', (error, filelist) => {
            fs.readFile(`./data/${queryData.id}`, 'utf8', (error, description) => {
                const title = queryData.id;
                const list = templateList(filelist);
                const template = templateHTML(title, list,
                    ` 
                        <form action = "/update_process" method="post">
                            <input type="hidden" name = "id" value="${title}">
                            <p>
                                <input type="text" name = "title" value = "${title}"/>
                           </p>
                            <p>
                                <textarea type="text" name ="description" value="${description}">${description}</textarea>
                            </p>
                            <input type="submit">
                        </form>
                    `,
                    `<a href = "/create">create</a> <a href="/update?id${title}">update</a>`);
                response.writeHead(200);
                response.end(template);
            });
        });
    }
    
    else if(pathname === '/update_process') {
        let body = "";
        request.on('data', (data) => {
            body += data;
        });
        request.on('end' , () => {
            const post = qs.parse(body);
            const id = post.id;
            const title = post.title;
            const description = post.description;
            fs.rename(`./data/${id}`, `data/${title}`, function(error){
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                  response.writeHead(302, {Location: `/?id=${title}`});
                  response.end();
                })
              });
        });
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000);