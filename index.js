require('dotenv').config();
const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const serv = require('http').Server(app);

// const socket = require('socket.io');
// const io = socket(serv);

//Connect To DataBase
const con = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database:process.env.DB_USER
}); 

//middleware
app.use('/public',express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));


app.get('/',(req, res) => {
	res.sendFile(__dirname + '/public/index.html');
}).post('/push',(req,res)=>{
    const user = req.body.user;
    const project_name = req.body.name;
    const data = req.body.data;
    const queryString = "Insert INTO WorldsHardestGame (Id,User,ProjectName,Data) VALUES (?,?,?,?)";
    let id = 0;
    con.query(`SELECT * FROM WorldsHardestGame`,(err,result)=>{
        id = result.length;
        con.query(queryString,[id,user,project_name,data],(err,results,feilds)=>{
            if(err){
                throw err
                return;
            }
            res.redirect('https://worldshardestgame.bigboyz.repl.co/');
            res.end();
        });
    });
});




serv.listen(process.env.PORT);
console.log("Server Started");