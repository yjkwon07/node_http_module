const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const path = require('path');
const template = require('./lib/template.js');
const sanitizedHtml = require('sanitize-html');
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'B_board'
});
db.connect();

const app = http.createServer((request, response) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
    console.log(pathname);
    if (queryData.id !== undefined) {
        console.log(path.parse(queryData.id));
    }
    else {
        console.log(`queryDataid === undefined`);
    }

    if (pathname === '/') {
        if (queryData.id === undefined) {
            const title = "welcome to nodeJS";
            const description = "<h1>what is web??</h1>";
            db.query(`SELECT * FROM topic`, (_error, topics) => {
                console.log(topics);
                const list = template.db_List(topics);
                const html = template.HTML(title, list, description,
                    `<a href='/create'>create</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        }
        else {
            db.query(`SELECT * FROM topic`, (error, topics) => {
                if (error) throw error;
                db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function (error2, topic) {
                    if (error2) throw error2;
                    const title = topic[0].title;
                    const description = topic[0].description;
                    const list = template.db_List(topics);
                    const html = template.HTML(title, list, `
                            <h2>${title}</h2>
                            ${description}
                            <p>${topic[0].name}</p>
                        `, `
                            <a href="/create">create</a>
                            <a href="/update?id=${queryData.id}">update</a>
                            <form action="delete_process" method="POST">
                                <input type = "hidden" name = 'id' value = ${queryData.id}/>
                                <input type = "submit" value ="delete"/>
                            </form>
                            `
                    );
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    }

    else if (pathname === '/create') {
        db.query(`SELECT * FROM topic`, (error, topics) => {
            if (error) throw error;
            db.query(`SELECT * FROM author`, (error2, authors) => {
                if (error2) throw error2;
                const title = "Create topic";
                const list = template.db_List(topics);
                const html = template.HTML(title, list, `
            <form action="/create_process" method="POST">
                <p>
                    <input type="text" name="title" placeholder="title">
                </p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    ${template.authorSelect(authors)}
                </p>
                <p>
                    <input type="submit" value="submit">
                </p>
            </form>
           `, '');
                response.writeHead(200);
                response.end(html);
            });
        });
    }

    else if (pathname === '/create_process') {
        let body = "";
        request.on('data', (data) => {
            body += data;
        });
        request.on('end', () => {
            const post = qs.parse(body);
            db.query(`INSERT INTO topic (title, description, created, author_id) 
            VALUES(?, ?, NOW(), ?)`, [post.title, post.description, post.author],
                (error, result) => {
                    if (error) throw error;
                    response.writeHead(302, { Location: `/?id=${result.insertId}` });
                    response.end();
                });
        });
    }

    else if (pathname === '/update') {
        db.query(`SELECT * FROM topic`, (error, topics) => {
            if (error) throw error;
            db.query(`SELECT * FROM topic WHERE id = ?`, [queryData.id],
                (error2, topic) => {
                    if (error2) throw error2;
                    db.query(`SELECT * FROM author`, (error3 , authors)=>{
                        if(error3) throw error3;
                        const title = topic[0].title;
                        const list = template.db_List(topics);
                        const html = template.HTML(title, list,
                            ` 
                            <form action = "/update_process" method="post">
                                <input type="hidden" name = "id" value="${topic[0].id}">
                                <p>
                                    <input type="text" name = "title" value = "${topic[0].title}"/>
                               </p>
                                <p>
                                    <textarea type="text" name ="description" value="${topic[0].description}">${topic[0].description}</textarea>
                                </p>
                                <p>
                                    ${template.authorSelect(authors, topic[0].author_id)}
                                </p>
                                <input type="submit">
                            </form>
                        `,
                            `<a href = "/create">create</a> <a href="/update?id${topic[0].id}">update</a>`);
                        response.writeHead(200);
                        response.end(html);
                    });
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
            console.log(post);
            db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', [post.title, post.description, post.author, post.id],
                (error, _result) => {
                    if (error) throw error;
                    response.writeHead(302, { Location: `/?id=${post.id}` });
                    response.end();
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
            db.query(`DELETE FROM topic WHERE id = ?`, [post.id], (error, result) => {
                if (error) throw error;
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

app.listen(30000);