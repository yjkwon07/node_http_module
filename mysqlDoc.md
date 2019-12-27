## 1. MySQL 모듈의 기본 사용방법 
https://github.com/mysqljs/mysql

### trouble shooting!! 
https://www.digitalocean.com/community/tutorials/how-to-create-a-new-user-and-grant-permissions-in-mysql

- create user !!
```
    create user 'nodejs'@'%' identified by '111111';
    select user, host from mysql.user;
                            (database).(table)
    grant all privileges on B_board.* TO 'nodejs'@'%';
```

## 2. MySQL SELECT
```js
db.query(`SELECT * FROM topic`, (_error, topics) => {});
```

## 3. MySQL로 상세보기 구현 
? => 사용자의 입력 값 중 공격 가능한 쿼리문이었을 때 자동으로 필터처리를 하는 기능이다. 
so what? => sanitize-html을 사용 안 해두 된다.
```sql
    INSERT INTO topic (title, description, created, author_id) 
           VALUES(?, ?, NOW(), ?), [post.title, post.description, 1],
```

```js
    db.query('UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?', [post.title, post.description, post.id], (error,result) => {});
```
```js
    db.query(`DELETE FROM topic WHERE id = ?`, [post.id], (error,result) => {})
```
```js
    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], (error, topic) => {});
```

## 4. 보안 - SQL Injection
- 공격의 의도를 가진 SQL 코드를 주입함으로서 공격 목적을 달성하는 기법을 SQL Injection이라고 한다. 
- multipleStatements : true -> 위험!!! [참고](https://www.technicalkeeda.com/nodejs-tutorials/nodejs-mysql-multiple-statement-queries)
```sql
    select * from topic LEFT join author on topic.author_id =  author.id where topic.id='1;drop table topic;'
```

1. ? => query 보안성 높다.
1. db.escape(queryData.id) !! -> 문자열로 바꿔줌 [참고](https://bcho.tistory.com/892)
```js
    var query = db.query('select * from users where userid='+db.escape(req.params.userid),function(err,rows){
            console.log(rows);
    });
```

## 5. 보안 - Escaping 
- 공격의 의도를 가진 자바스크립트 코드를 입력해서 이 코드를 웹 브라우저로 실행할 때 공격목적을 달성하는 공격 기법을 Cross site scripting (XSS) 이라고 한다.
- sanitize!!!!
- [참고](https://dydals5678.tistory.com/99)





















