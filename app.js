const mongoclient = require('mongodb').MongoClient;
//const url = "mongodb://bigworld3863_db_user:1111@ac-d9mmrty-shard-00-00.vzh6ita.mongodb.net:27017,ac-d9mmrty-shard-00-01.vzh6ita.mongodb.net:27017,ac-d9mmrty-shard-00-02.vzh6ita.mongodb.net:27017/?ssl=true&replicaSet=atlas-196oho-shard-0&authSource=admin&appName=t30ester";
let mydb;

require('dotenv').config();
const { MONGO_URL } = process.env;

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

mongoclient.connect(MONGO_URL).then(client => {
    console.log('DB 연결 성공');
    mydb = client.db('t30ester');

    app.listen(3000, function(){
        console.log("포트 3000으로 서버 대기중...");
    });
}).catch(err => {
    console.log(err);
});

app.get('/teacher', function(req, res){
    res.sendFile(__dirname + '/public/teacher.html');
});

app.get('/student', function(req, res){
    res.sendFile(__dirname + '/public/student.html');
});


app.get('/', function(req, res){
    //res.send('메인페이지다. 반갑다');
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/save', function(req, res){
    console.log(req.body.title);
    console.log(req.body.content);

    mydb.collection('post').insertOne(
        {title : req.body.title, content : req.body.content}
    ).then(result =>{
        console.log(result);
        console.log('데이터 추가 성공');
        res.redirect(req.get('Referer') || '/student');
    }).catch(err => {
        console.log(err);
        res.status(500).send('데이터 추가 실패');
    });
});


app.post("/delete", function(req, res){
    console.log(req.body._id);
    req.body._id = new ObjId(req.body._id);
    mydb.collection('post').deleteOne(req.body)
    .then(result =>{
        console.log('삭제완료');
        res.status(200).send();
    }).catch(err =>{
        console.log(err);
        res.status(500).send();
    })
});
