# Node
## 1. Module
- URL로 입력된 값 사용하기 
- require("url") => (url.parse("URL"))
- require("queryString") => (quryString.parse(url.parse("URL").query))

## 2. process.argv
```js
    // 콘솔에서의 입력값 => process.argv;
    const args = process.argv;
    console.log(args[2]);
    if(args[2] == '1') {
        console.log('C1');
    }
    else {
        console.log('C2');
    }
```

## 3. 동기와 비동기 그리고 콜백 => readFileSync
```js
    // Node.js - 동기와 비동기 그리고 콜백
    const fs = require('fs');

    // readFileSync
    var result = fs.readFileSync('./sample.txt', 'utf8');
    console.log(result);
```

## 4. Node.js - 모듈의 형식 => 
    많아진 코드를 정리
```js
    var M = {
        v:'v',
        f:function(){
        console.log(this.v);
        }
    }
    
    module.exports = M;
```

# App
## 1. 동적인 웹페이지 만들기 => Template Literal 
**./lib/templaate.js**

## 2. 파일을 이용해 본문 구현  => fs 
```js
    const fs = require('fs');
    fs.readFile('../txt/sample.txt', 'utf8', (err , data) => {
        if(err)throw err;
        console.log(data);
    }); 
```

## 3. Not found 오류 구현 => pathname
```js
    var path = require('path');
    console.log(path.parse('../password.js'))
    console.log(path.parse('../password.js').base);
```
```js
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
```

## 4. POST 방식으로 전송된 데이터 받기 => 
    웹브라우저가 post방식으로 데이터를 전송할 때 데이터가
    엄청나게 많으면 그 데이터를 한 번에 처리하여 받아간다면
    다운 문제가 발생할 수 있다.
    Node에서는 이 post방식으로 전송되는 데이터가 많을 경우를 대비해서 
    데이터를 조각조각 받게한다. 
    
    request.on('datat' , () =>{})
    end에 해당되는 콜백이 실행됐을 때 정보 수신이 끝났다.    
    request.on('end' , () =>{})

## 5. 글수정 - 수정된 내용 저장, 파일생성과 리다이렉션
    전송된 POST 데이터를 받아서 파일에 저장하고, 
    그 결과 페이지로 리다이렉션
```js
fs.rename(`./data/${id}`, `data/${title}`, function(error){

    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
    });

});
```

## 6. 입력 정보에 대한 보안 => 
    데이터를 읽어 올 때, 파일의 아이디를 가져온다. 
    하지만 사용자가 ../같이 상위 디렉토리 탐색 문구를 넣게 되면 
    사용자에게 서버의 파일을 읽어들일 수 있는 심각한 문제가 있다.
    작은 해결 => path.parse()

## 7. 출력정보에 대한 보안 => XSS
- require("sanitize-html") using

# PM2
## 패키지 매니저와 PM2 
- npm install pm2 -g
- pm2 start [.js]
- pm2 stop
- pm2 list 
- pm2 log
- pm2 monit
- pm2 kill : pm2로 실행한 모든 프로세스를 중지 & 삭제 합니다. 
- pm2 start main.js --watch --ignore-watch="data/* sessions/*"  --no-daemon 
  - pm2를 실행하면서 로그가 출력되도록 합니다. 
- (--no-daemon) 또 특정 디랙토리에 대한 watch를 하지 않도록 하는 방법입니다

```
    --ignore-watch 해결방법
    pm2 init 혹은 pm2 ecosystem을 입력해주면 ecosystem.config.js 파일이 생성됩니다.
    pm2 설정파일 생성 사이트링크 : http://pm2.keymetrics.io......on/
    apps 설정부분에 ignore_watch: ["data/*", "sessions/*"]를 추가해주시면 해결됩니다.
```