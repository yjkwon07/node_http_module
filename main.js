const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require('./lib/template.js');

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
                const list = template.List(filelist);
                const html = template.HTML(title, list,
                    `<h2>${title}</h2>${description}`,
                    '<a href="/create">create</a>'
                );
                response.writeHead(200);
                response.end(html);
            });
        }
        else {
            fs.readdir('./data', function (error, filelist) {
                fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
                    const title = queryData.id;
                    const list = template.List(filelist);
                    const html = template.HTML(title, list,
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a> 
                        <a href="update?id=${title}">update</a>
                        <form action='/delete_process' method="POST">
                            <input type = "hidden" name = "id" value="${title}"/>
                            <input type = "submit" value="delete">
                        </form>
                        `);
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }

    }

    else if (pathname === '/create') {
        fs.readdir('./data', function (error, filelist) {
            const title = 'WEB - create';
            const list = template.List(filelist);
            const html = template.HTML(title, list, `
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
            response.end(html);
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
                const list = template.List(filelist);
                const html = template.HTML(title, list,
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
                response.end(html);
            });
        });
    }

    else if (pathname === '/update_process') {
        let body = "";
        request.on('data', (data) => {
            body += data;
        });
        request.on('end', () => {
            const post = qs.parse(body);
            const id = post.id;
            const title = post.title;
            const description = post.description;
            fs.rename(`./data/${id}`, `data/${title}`, function (error) {
                fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
                    response.writeHead(302, { Location: `/?id=${title}` });
                    response.end();
                })
            });
        });
    }

    else if (pathname === '/delete_process') {
        let body = '';
        request.on('data', (data) => {
            body += data;
        });
        request.on('end', () => {
            const post = qs.parse(body);
            const id = post.id;
            fs.unlink(`./data/${id}`, (error) => {
                response.writeHead(302, { Location: `/` });
                response.end();
            });
        });

    }

    else {
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000);