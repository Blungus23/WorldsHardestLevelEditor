/* Add coins as well as coin count parameter in data function */

//grid pattern colors
let empty1 = "#e9d9fa",empty2 = "#c8c0d1";
let MAP_POSSIBLE = false;


function make2DArray(cols,rows,set){
     arr = new Array(cols).fill(set);
    for(let i =0;i<arr.length;i++){   
       arr[i] = new Array(rows).fill(set);  
    }
  return arr;
}

const res = 25;
const ballSpeed = 1;
let grid,cols,rows,myElt,id=0,sim=false,curSpeed=1,playing=false,touching=false,mode=1,balls=[],coins=[];

function setup() {
  createCanvas(600, 400);
  cols = (width/res);
  rows = (height/res);
  grid = make2DArray(cols,rows,0);
  myElt = document.getElementById("mode");
}

function deleteObj(){
  balls = [];
  coins = [];
}

function gridSet(num){
  grid = make2DArray(cols,rows,num);
}

function draw() {
  if(!playing){
    empty1 = document.getElementById("c1").value;
  empty2 = document.getElementById("c2").value;
  background(220);
  drawGrid();
  handleMouse();
  for(var ball of balls){
    ball.show();
    if(sim){
      if(ball.pos.length>1){
        ball.update();
      }
    }
  }
  for(var coin of coins){
    coin.show();
  }
  curSpeed = document.getElementById("fname").value;
  }else{
    handlePlaying();
  } 
}

function keyPressed(){
    if(keyCode>47 && keyCode<58){
     mode = String.fromCharCode(keyCode);
   }
    if(keyCode == 32){
     sim = !sim;
    }
    if(keyCode == 84){
     console.log(balls);
    }
  if(keyCode == 82){
    for(var ball of balls){
       ball.ind = 1;
       ball.x = ball.pos[0].x;
       ball.y = ball.pos[0].y;
    }
  }
   touching = false;
   mode = parseInt(mode);
   myElt.innerHTML= `Mode: ${mode} - ${getText(mode)}`; 
}

function getText(num){
  switch(num){
    case 0 : return "Empty";
    case 1 : return "Wall";
    case 2 : return "Start";
    case 3 : return "End";
    case 4 : return "Ball Editor";
    case 5 : return "Coin Editor";
    case 6 : return "Marker 1";
    case 7 : return "Marker 2";
    case 8 : return "Marker 3";
    case 9 : return "Marker 4";
    case 10: return "Play Testing";
  }
}

function handleMouse(){
  if(mouseIsPressed){
    let x = int(mouseX/res);
    let y = int(mouseY/res);
    try{
      if(mode != 4 && mode != 5){
        grid[x][y] = mode;
      }
    }catch{
    }
   
  }
}

function mousePressed(){
  const x = (int(mouseX/res)*res);
  const y = (int(mouseY/res)*res);
  const mouse = {x:x,y:y}
  if(mouseButton === LEFT){
      if(mode == 4){
        if(x<=width && y<= height && y>=0 && x>= 0){
          balls.push(new Ball(x,y,null,(25/curSpeed)));
        }
    }else if(mode == 5){
      if(x<=width && y<= height && y>=0 && x>= 0){
          coins.push(new Coin(x+(res/4),y+(res/3)));
      }
    }
  }
  if(mouseButton == CENTER){
    if(mode == 4){
      for(var i =0;i<balls.length;i++){
        if(balls[i].mouseTouch(mouse) && touching == false){
           touching = true;
           balls[i].selected = true;
           id = i;
        }
      }
    }else if(mode == 5){
      const Newmouse = {x:x+(res/4),y:y+(res/3)}
      for(var k =0;k<coins.length;k++){
        if(coins[k].mouseTouch(Newmouse)){
           coins.splice(k,1);
        }
      }
    }
  }
  
  if(mouseButton === RIGHT){
    if(mode == 4){
      for(var j =0;j<balls.length;j++){
        if(balls[j].mouseTouch(mouse)){
           balls.splice(j,1);
        }
      }
    } 
  }
  if(mouseX>0 && mouseX < width && mouseY>0 && mouseY < height){
    MAP_POSSIBLE = false;
  }
}

function mouseDragged() {
   if(touching != false){
      balls[id].selected = true;
      const x = (int(mouseX/res)*res);
      const y = (int(mouseY/res)*res);
      if(!posEquals({x:x,y:y},balls[id].pos[balls[id].pos.length-1])){
          balls[id].pos.push({x:x,y:y});
      }
      
   }
}

function posEquals(p1,p2){
  return (p1.x == p2.x) && (p1.y == p2.y);
}

/*
   Colors:
   0 - Empty -> floor
   1 - Wall
   2 - Start
   3 - End 
   6 - Marker1
   7 - Marker2
   8 - Marker3
   9 - Marker4
*/

const colors = {
  1 : "#1cd1ed",
  2 : "#bffcb6",
  3 : "#ffc1a6",
  6 : "#ff8f70",
  7 : "#80a8ff",
  8 : "#ffffff",
  9 : "#000000"
}


function getData(){
  var data = {col:[empty1,empty2],map:grid,balls:balls,coins:coins};
  const strData = JSON.stringify(data);
  navigator.clipboard.writeText(strData);
  alert("Map Data Saved to ClipBoard");
}

function loadData(){
  let data = window.prompt("Paste your map string");
  data = JSON.parse(data);
  grid= data.map;
  balls = [];
  coins = [];
  for(var ball of data.balls){
    balls.push(new Ball(ball.x,ball.y,ball.i,ball.speed,ball.pos))
  }
  for(var coin of data.coins){
    coins.push(new Coin(coin.x,coin.y));
  }
}

function postToDataBase(event){
  if(MAP_POSSIBLE){
  let valid = true;
  const starts = getSquares(2);
  const ends = getSquares(3);
  if(starts.length<3){
    alert("Need At Least 3 Starts");
    valid = false;
    event.preventDefault();
  }
  if(ends.length<1){
    alert("Need At Least 1 End");
    valid = false;
    event.preventDefault();
  }
  if(valid){
  let myElt = document.getElementById("data");
  let myElt2  = document.getElementById("poster");
  myElt2.className = "data";
  var data = {col:[empty1,empty2],map:grid,balls:balls,coins:coins};
  const strData = JSON.stringify(data);
  myElt.value = strData;
  }
  }else{
    alert('TEST AND PASS YOUR MAP TO POST IT TO THE SERVER');
    event.preventDefault();
  }
}

function getSquares(num){
  let arr = [];
  for(var i =0;i<cols;i++){
    for(var j =0;j<rows;j++){
      if(grid[i][j] == num){
        arr.push(grid[i][j]);
      }
    }
  }
  return arr;
}

function getsingleNeighbors(grid,i,j){
  try{
    const spot =  grid[i][j];
    return spot;
  }catch{
    //spot dosnt exist
    return undefined;
  }
}

function getNeighbors(i,j){
  let arr = [];
  arr.push(getsingleNeighbors(grid,i-1,j-1));
  arr.push(getsingleNeighbors(grid,i-1,j));
  arr.push(getsingleNeighbors(grid,i-1,j+1));
  arr.push(getsingleNeighbors(grid,i,j-1));
  arr.push(getsingleNeighbors(grid,i,j+1));
  arr.push(getsingleNeighbors(grid,i+1,j-1));
  arr.push(getsingleNeighbors(grid,i+1,j));
  arr.push(getsingleNeighbors(grid,i+1,j+1));
  return arr;
}

function drawGrid(){
  for(var i=0;i<cols;i++){
    for(var j =0;j<rows;j++){
      let x = i*res;
      let y = j*res;
      push();
      if(grid[i][j] == 0){
        if((i+j) % 2 == 0){
          fill(empty1);
        }else{
          fill(empty2);
        }
      }else{
        fill(colors[grid[i][j]])
      }
      noStroke();
      rect(x,y,res,res);
      if(grid[i][j]==1){
      drawWalls(x,y,i,j);
      }
      pop();
    }
  }
}

function mouseReleased(){
  touching = false;
  try{
    balls[id].selected = false;
  }catch{
    
  }
}

function Ball(x,y,i,speed,pos=null){
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.r = 20;
  if(pos){
    this.pos = pos;
  }else{
    this.pos = [{x:this.x,y:this.y}];
  }
  this.selected = false;
  this.ind = 1;
  this.done = false;
  this.plane = "X";
  this.update = () =>{
    if(this.pos.length>1){
    const next = this.pos[this.ind];
    if(this.plane == "X"){
       if(this.x>next.x){
         this.x -= this.speed;
       }else if(this.x < next.x){
         this.x += this.speed;
       }
      if(this.x == next.x){
        this.plane = "Y";
      }
    }else if(this.plane == "Y"){
      if(this.y>next.y){
         this.y -= this.speed;
       }else if(this.y < next.y){
         this.y += this.speed;
       }
      if(this.y == next.y){
        this.done = true;
      }
    }
    if(this.done){
      if(this.ind<this.pos.length){
        this.ind++;
        this.done = false;
        this.plane = "X";
      }
      if(this.ind>=this.pos.length){
        this.x = this.pos[0].x
        this.y = this.pos[0].y
        this.ind = 1;
      }
    }
    }
  }
  
  this.show = () => {
      push()
      if(this.selected){
        for(var i=0;i<this.pos.length;i++){
          noStroke();
          fill('rgba(253, 255, 112,0.25)')
          rect(this.pos[i].x,this.pos[i].y,res,res);
        } 
      }
      fill("#0013bf")
      circle(this.x+(res/2),this.y+(res/2),this.r);
      pop()
  }
  
  this.mouseTouch = (mouse) =>{
    return dist(mouse.x,mouse.y,this.x,this.y)<this.r;
  }
    
}

function Coin(x,y){
  this.x = x;
  this.y = y;
  this.r = 5;
  this.show = ()=>{
    push()
    fill("#fff700");
    circle(this.x,this.y,this.r);
    pop()
  }
  this.mouseTouch = (mouse) =>{
    return dist(mouse.x,mouse.y,this.x,this.y)<this.r;
  }
}

//Renders the black lines or box edges
function drawWalls(x,y,i,j){
        stroke(0)
        const neigh = getNeighbors(i,j);
        for(var k =0;k<neigh.length;k++){
          if(neigh[1] != 1 && neigh[1] != null){
            push()
            strokeWeight(2);
            line(x,y,x,y+res)
            pop()
          }
          if(neigh[3] != 1 && neigh[3] != null){
            push()
            strokeWeight(2);
            line(x,y,x+res,y);
            pop()
          }
          if(neigh[4] != 1 && neigh[4] != null){
            push()
            strokeWeight(3);
            line(x,y+res,x+res,y+res);
            pop()
          }
          if(neigh[6] != 1 && neigh[6] != null){
            push()
            strokeWeight(3);
            line(x+res,y,x+res,y+res);
            pop()
          }
          
        }
}

function playTest(){
  if(getStarts(grid).length>2){
    playing = !playing;
  if(playing){
    let myElt = document.getElementById("playButton").innerHTML = "Stop Playing";
    myElt = document.getElementById("playButton").style.backgroundColor = "#fc3903";
  }else{
    let myElt = document.getElementById("playButton").innerHTML = "Play Test";
    myElt = document.getElementById("playButton").style.backgroundColor = "aquamarine";
    resetCoins()
    firstStart = true;
  }
  }
}

let pg;
let firstStart = true;
let p1;
let exitCoins,playerSpeed = 1.25;
function handlePlaying(){
  if(firstStart){
    pg = createGraphics(600, 400);
    getImageGrid();
    firstStart = false;
    const starts = getStarts(grid);
    let start = starts[int(random(starts.length))];
    p1 = new Player(start.x,start.y,"#c40000");
    exitCoins = coins.length;
    savedCoins  = [...coins];
  }
  background(220);
  image(pg, 0, 0);
  for(var ball of balls){
      ball.show();
      ball.update();
      p1.collidesBall(ball);
    }
    for(var k =0;k<coins.length;k++){
      coins[k].show();
      if(p1.collidesCoin(coins[k])){
        p1.coins++;
        coins.splice(k,1);
      }
    }
    p1.show();
    handelKeyBoard();

}

function resetCoins(){
  coins = [];
  for(var coin of savedCoins){
    coins.push(new Coin(coin.x,coin.y));
  }
  
}

function getStarts(grid){
  let starts = [];
  for(var i =0;i<cols;i++){
    for(var j =0;j<rows;j++){
      if(grid[i][j] == 2){
        starts.push({x:i*res,y:j*res});
      }
    }
  }
  return starts;
}

function CircleCircle(c1,c2){
   const d = dist(c1.x,c1.y,c2.x,c2.y);
   return d<(c1.r+c2.r)/2;
}

function Player(x,y,col){
  this.x = x;
  this.y = y;
  this.col = col;
  this.r = 10;
  this.coins = 0;
  this.collidesBall = (c) =>{
    const c2 = {x:c.x+(res/2),y:c.y+(res/2),r:c.r}
    const c1 = {x:this.x,y:this.y,r:this.r}
    if(CircleCircle(c1,c2)){
      const starts = getStarts(grid);
      let start = starts[int(random(starts.length))];
      this.x = start.x;
      this.y = start.y;
      this.coins = 0;
      resetCoins();
    }
  }
  this.collidesCoin = (c) =>{
    const c2 = {x:c.x,y:c.y,r:c.r}
    const c1 = {x:this.x,y:this.y,r:this.r}
    return CircleCircle(c1,c2);   
  }
  
  this.collidesWorld = (call) =>{
    const x = int(this.x/res);
    const y = int(this.y/res);
    if(call == "nextR"){
      let nX = int((this.x+10)/res);
      return grid[nX][y]
    }
    if(call == "nextD"){
      let nY = int((this.y+10)/res);
      return grid[x][nY]
    }
    return grid[x][y];
  }
    
  this.show = () => {
    push()
    fill(this.col);
    rect(this.x,this.y,10,10); 
    /* hitBox */
    // fill("green");
    // circle(this.x+(this.r/2),this.y+(this.r/2),this.r);
    pop()
  }
}

function handelKeyBoard(){
  if(keyIsDown(38)){ //Up
    p1.y -= playerSpeed;
    if(p1.collidesWorld() == 1){
      p1.y += playerSpeed;
    }
  }
  if(keyIsDown(40)){//Down
    p1.y += playerSpeed;
    if(p1.collidesWorld("nextD") == 1){
      p1.y -= playerSpeed;
    }
  }
  if(keyIsDown(39)){//Right
    p1.x += playerSpeed;
    if(p1.collidesWorld("nextR") == 1){
      p1.x -= playerSpeed;
    }
  }
  if(keyIsDown(37)){//Left
    p1.x -= playerSpeed;
    if(p1.collidesWorld() == 1){
      p1.x += playerSpeed;
    }
  }
  if(p1.collidesWorld() == 3 && p1.coins >= exitCoins){
      const starts = getStarts(grid);
      let start = starts[int(random(starts.length))];
      p1.x = start.x;
      p1.y = start.y;
      p1.coins = 0;
      resetCoins();
      MAP_POSSIBLE = true;
    }
}








function getImageGrid(){
  for(var i =0; i<cols;i++){
    for(var j =0;j<rows;j++){
       const x = i*res;
       const y = j*res;
       pg.push()
      if(grid[i][j] == 0){
        if((i+j) % 2 == 0){
          pg.fill(empty1);
        }else{
          pg.fill(empty2);
        }
      }else{
        try{
          pg.fill(colors[grid[i][j]])
        }catch{
          
        }
        
      }
      pg.noStroke();
      pg.rect(x,y,res,res);
      if(grid[i][j]==1){
      drawImageWalls(x,y,i,j);
      }
      pg.pop()
    }
  }
}

function drawImageWalls(x,y,i,j){
    pg.stroke(0)
        const neigh = getNeighbors(i,j);
        for(var k =0;k<neigh.length;k++){
          if(neigh[1] != 1 && neigh[1] != null){
            pg.push()
            pg.strokeWeight(2);
            pg.line(x,y,x,y+res)
            pg.pop()
          }
          if(neigh[3] != 1 && neigh[3] != null){
            pg.push()
            pg.strokeWeight(2);
            pg.line(x,y,x+res,y);
            pg.pop()
          }
          if(neigh[4] != 1 && neigh[4] != null){
            pg.push()
            pg.strokeWeight(3);
            pg.line(x,y+res,x+res,y+res);
            pg.pop()
          }
          if(neigh[6] != 1 && neigh[6] != null){
            pg.push()
            pg.strokeWeight(3);
            pg.line(x+res,y,x+res,y+res);
            pg.pop()
          }
          
        }
}