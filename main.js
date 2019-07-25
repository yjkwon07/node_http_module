/*
    1. Node.js - NodeJs는 사용자에게 전송할 데이터를 생성한다.

    2. Node.js - URL로 입력된 값 사용하기 => node url parse query string

    3. App - 동적인 웹페이지 만들기 => Template Literal 

    4. App - 파일 읽기 => fs
        CRUD
        - Create
        - Read
        - Update
        - Delte

    5. App - 파일을 이용해 본문 구현  => fs 

    6. Node.js - 콘솔에서의 입력값 => process.argv;
    
    7. App - Not found 오류 구현 => pathname

    8. Node.js - data의 값이 없다면? => 만약 id의 값이 없다면 undefind로 출력이 나온다.
        해결점: if queryData.id === undefined

    9. App - 글목록 출력하기 => fs.readdir

    10. App -함수를 이용해서 정리 정돈하기 => function

    11. Node.js - 동기와 비동기 그리고 콜백 => readFileSync

    12. Node.js - 패키지 매니저와 PM2 => npm install pm2 -g
        pm2 start [.js]
        pm2 stop
        pm2 list 
        pm2 log
        pm2 monit

    13. App - 글생성 UI 만들기 => create 분기문/ form tag생성

    14. POST 방식으로 전송된 데이터 받기 => 
        웹브라우저가 post방식으로 데이터를 전송할 때 데이터가
        엄청나게 많으면 그 데이터를 한 번에 처리하여 받아간다면
        다운 문제가 발생할 수 있다.
        Node에서는 이 post방식으로 전송되는 데이터가 많을 경우를 대비해서 
        데이터를 조각조각 받게한다. 
        
        request.on('datat' , () =>{})
        end에 해당되는 콜백이 실행됐을 때 정보 수신이 끝났다.    
        request.on('end' , () =>{})


    15. App - 파일생성과 리다이렉션 =>
        전송된 POST 데이터를 받아서 파일에 저장하고, 
        그 결과 페이지로 리다이렉션하는 방법에 대해서 알아보겠습니다.

    16. App - 글수정 - 수정 링크 생성 => 
        글 수정 기능을 구현하기 위해서 수정 링크를 추가하는 법을 살펴봅니다. 

    17. 글수정 - 수정할 정보 전송 =>
        수정할 내용을 서버로 전송하는 법을 살펴봅니다.

    18. 글수정 - 수정된 내용 저장

*/
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

    else {
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000);