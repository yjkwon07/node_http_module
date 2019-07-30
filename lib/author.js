const template = require('./template');
const db = require('./db');
const qs= require('querystring');

exports.main = (request , response) => {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        if(error) throw error;
        db.query(`SELECT * FROM author`, (error2 , authors) => {
            if(error2) throw error2; 
            const title = "author - Create";
            const list = template.db_List(topics);
            const html = template.HTML(title, list, `
                ${template.authorTable(authors)}
     
                <form action="/author/create_process" method="post">
                <p>
                    <input type="text" name="name" placeholder="name">
                </p>
                <p>
                    <textarea name="profile" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>

                <style>
                    table {
                        border-collapse : collapse
                    }
                    td {
                        border:1px solid black;
                    }
                </style>
            `,``);
            response.writeHead(200);
            response.end(html);
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
        db.query(`INSERT INTO author (name , profile) VALUES(? , ?)`, [post.name , post.profile], (error , result) => {
            if(error) throw error;
            response.writeHead(302, {Location : "/author"});
            response.end();
       });
    });
};