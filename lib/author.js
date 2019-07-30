const template = require('./template');
const db = require('./db');
const qs = require('querystring');
const url = require(`url`);
const fs = require('fs');

exports.home = (_request, response) => {
    db.query(`SELECT * FROM topic`, (topic_error, topics) => {
        if (topic_error) throw topic_error;
        db.query(`SELECT * FROM author`, (author_error, authors) => {
            if (author_error) throw author_error;
            fs.readFile('./view/author/home.html', 'utf8' ,(fs_error , data)=>{
                if(fs_error) throw fs_error;
                const body = template.authorTable(authors) + data;
                const title = "author - Create";
                const list = template.db_List(topics);
                const html = template.HTML(title, list, body, ``);
                response.writeHead(200);
                response.end(html);
            });
        });
    });
};

exports.create_process = (request, response) => {
    let body = '';
    request.on('data', (data) => {
        body += data;
    });
    request.on('end', () => {
        let post = qs.parse(body);
        db.query(`INSERT INTO author (name , profile) VALUES(? , ?)`, [post.name, post.profile], (author_error, _result) => {
            if (author_error) throw author_error;
            response.writeHead(302, { Location: "/author" });
            response.end();
        });
    });
};

exports.update = (request, response) => {
    let _url = request.url;
    let queryData = url.parse(_url, true).query;
    // call back hell.....
    db.query(`SELECT * FROM topic`, (topic_error, topics) => {
        if (topic_error) throw topic_error;
        db.query(`SELECT * FROM author`, (author_error, authors) => {
            if (author_error) throw author_error;
            db.query(`SELECT * FROM author WHERE id = ?`, [queryData.id], (author_id_error, author) => {
                if (author_id_error) throw author_id_error;
                const title = "author";
                const list = template.db_List(topics);
                const html = template.HTML(title, list, `
                    ${template.authorTable(authors)}
                    
                    <form action="/author/update_process" method="post">
                        <p>
                            <input type="hidden" name="id" value="${queryData.id}">
                        </p>
                        <p>
                            <input type="text" name="name" value="${author[0].name}" placeholder="name">
                        </p>
                        <p>
                            <textarea name="profile" placeholder="description">${author[0].profile}</textarea>
                        </p>
                        <p>
                            <input type="submit" value="update">
                        </p>
                    </form>

                    <style>
                    table {
                        border-collapse : collapse;
                    }
                    tr{
                        border: 0.1rem solid;
                    }
                    </style>
                `, ``);
                response.writeHead(200);
                response.end(html);
            });
        });
    });
};

exports.update_process = (request, response) => {
    let body = "";
    request.on('data', (data) => {
        body += data;
    });
    request.on('end', () => {
        const post = qs.parse(body);
        db.query(`UPDATE author SET name = ?, profile = ? WHERE id=?`, [post.name, post.profile, post.id], (error, _result) => {
            if(error) throw error;
            response.writeHead(302, { Location: "/author" });
            response.end();
        });
    });
};

exports.delete_process = (request, response) =>{
    let body = "";
    request.on('data', (data) => {
        body += data;
    });
    request.on('end', () => {
        const post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE author_id=?`,[post.id],(error, result) =>{
            if(error) throw error;
            db.query(`DELETE FROM author WHERE id =?`, [post.id], (error2 , result2) => {
                if(error2) throw error2;
                response.writeHead(302, {Location: '/author'});
                response.end();
            });
        });
    });
};