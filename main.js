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

    12. Node.js - 패키지 매니저와 PM2

    13. 



*/
const http = require('http');
const fs = require('fs');
const url = require('url');

function templateHTML(title, list, body) {
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
            ${body}
        </body>
        </html>
     `;
}

function templateList(filelist) {
    let list = '<ul>';
    let i = 0;
    while (i < filelist.length) {
        list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i++;
    }
    list += '</ul>';
    console.log(list);
    return list;
}

const app = http.createServer((request, response) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
    if (pathname === '/') {
        if (queryData.id === undefined) {
            fs.readdir('./data', (error, filelist) => {
                const title = 'Welcome';
                const description = 'Hello, Node.js';
                const list = templateList(filelist);
                const template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
                response.writeHead(200);
                response.end(template);
            });
        }
        else {
            fs.readdir('./data', function (error, filelist) {
                fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
                    const title = queryData.id;
                    const list = templateList(filelist);
                    const template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000);