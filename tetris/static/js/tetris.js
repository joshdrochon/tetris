const canvas = document.querySelector('#game-board')
const context = canvas.getContext('2d')// This will give the context of canvas that has properties and methods that allows us to do lot of thongs using canvas
canvas.height = 500
canvas.width = 250
const row = 20
const col = 10
const squareSz = 25 // Width and height of a square
const empty = '#d4d4d4' // color of an empty square

const themeMusic = document.getElementById('theme-music')
const placeTetrominoeSound = new Audio('audio/PlaceTetrominoe.wav')
const clearRowSound = new Audio('audio/ClearRow.wav')
const gameOverSound = new Audio('audio/GameOver.wav')
const rotateSound = new Audio('audio/RotateSound.wav')
const levelUpSound = new Audio('audio/LevelUp.flac')
const moveTetrominoeSound = new Audio('audio/MoveTetrominoe.wav')

themeMusic.controls = ""
placeTetrominoeSound.volume = .5
clearRowSound.volume = .5
rotateSound.volume = .5
moveTetrominoeSound.playbackRate = 16

// drawing squares in board
function drawSquares(x, y, color){
    context.fillStyle = color
    context.fillRect(x*squareSz, y*squareSz, squareSz, squareSz)

    context.strokeStyle = '#000000'
    context.strokeRect(x*squareSz, y*squareSz, squareSz, squareSz)
}

// create empty game board
let board = []
for (let r = 0; r < row; r++){
    board[r] = []
    for (let c = 0; c < col; c++){
        board[r][c] = empty
    }
}

// draw game board to the canvas
function drawBoard(){
    for (let r = 0; r < row; r++){
        for (let c = 0; c < col; c++){
            drawSquares(c, r, board[r][c])
        }
    }
}

drawBoard()

// Refer below variables Z,S,T,O,L,I,J to tetrominoes.js for each shape pattern declaration
const allPieces = [ 
    [Z, 'Green'], 
    [S, 'Blue'], 
    [T, 'Brown'], 
    [O, 'Red'], 
    [L, 'Orange'], 
    [I, 'LightCoral'], 
    [J, 'Purple'],
]


// generate a random piece from allPieces list
function randomTetromino(){

    // generating a random num from 0-6 which are indexes for allPieces list
    let randPc = Math.floor(Math.random() * allPieces.length)

    // Passed in two params for Piece func -
    //     [randPc][0] is the letter variable (tetromino), [randPc][1] is the color
    return new Piece(allPieces[randPc][0], allPieces[randPc][1])
}

// initiate one piece object
let newPc = randomTetromino()

// Below is a kind of constructor within the class ,here we called it as a constructor function
function Piece(tetromino, color){
    this.tetromino = tetromino 
    this.color = color 

    // start with pattern 0 (total 4 patterns when rotate, others are 1, 2, 3 - these are indexes of pattern) - refer to tetromonies.js
    this.tetrominoPattern = 0 
    // define the active/current tetromino pattern we are working on
    this.activeTetromino = this.tetromino[this.tetrominoPattern]

    // the coordinate for where the tetrominos first lands, can be changed to the top middle 
    this.x = 3
    this.y = -2

}
// Javascript object prototype is a way to create methods,new attributes.. using constructor function.
// fill the piece with a color. This method will be used when we draw and undraw the piece to the board
Piece.prototype.fill = function(color){
    for(r=0;r<this.activeTetromino.length;r++){
        for(c=0;c<this.activeTetromino.length;c++){
            // we draw only occupied squares
            if(this.activeTetromino[r][c]){
                drawSquares(this.x+c,this.y+r,color);
            }
        }

    }
}

// draw a piece to the board
Piece.prototype.draw = function(){
    this.fill(this.color)

}
// undraw the piece on the board
Piece.prototype.unDraw= function(){
    this.fill(empty)
}
// lock the piece to the board
let score=0;
Piece.prototype.lock=function(){
    for(r=0;r<this.activeTetromino.length;r++){
        for(c=0;c<this.activeTetromino.length;c++){
            // don't lock the vacant squares to the board
            if(!this.activeTetromino[r][c]){
                continue;
            }
            // pieces to get locked on top of the board=gameover
            if(this.y + r < 0){
                // gameover case
                console.log("I am in the gameOver")
                gameOverSound.play()
                // stop the animation frame 
                gameOver=true;
                console.log(gameOver)
                break;
            }
            // lock the piece
            placeTetrominoeSound.play()
            board[this.y+r][this.x+c]=this.color;
        }
    }
    // Remove fill rows
    for(r=0;r<row;r++){
        let isRowFull=true;
        for(c=0;c<col;c++){
            // keep checking if Row is filled
            isRowFull=isRowFull && (board[r][c]!=empty);
        }
        if(isRowFull){
            // Once the row is completely filled. Move down all the rows above the filled row
            // go in the reverse direction
            clearRowSound.play()
            for(y=r;y>1;y--){
                for(c=0;c<col;c++){
                    board[y][c]=board[y-1][c];
                }
            }
            // add an empty row at the top
            for(c=0;c<col;c++){
                board[0][c]=empty;
            }
            score+=10;
            
        }
    }
    // update the board
    drawBoard();
    console.log(score);
    scoreDisplay.innerHTML = score;
}

// Move down the Piece
Piece.prototype.moveDown = function(){

    if (!this.collision(0,1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    }
    else {
        //if there is a collision then lock the tetromino and generate a new one
        this.lock();
        newPc = randomTetromino();
    }
    
}
// Move left the Piece
Piece.prototype.moveLeft=function(){
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}
// Move right the Piece
Piece.prototype.moveRight=function(){
    if (!this.collision(1,0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}

// rotate the Piece
Piece.prototype.rotate=function(){
    let nextPattern = this.tetromino[(this.tetrominoPattern+1)%this.tetromino.length];
    let kick = 0;
    // If there is a collison need to check on which side the collision happend
    if (this.collision(0,0, nextPattern)) {
        if (this.x > col/2) {
            kick = -1;
        }
        else {
            kick = 1;
        }
    }
    // if there is no collision
    if (!this.collision(kick,0, nextPattern)) {
        this.unDraw();
        this.x += kick;

        rotateSound.play()
        // rotation is simply replacing a different shape of the tetrimone in an order inplace - Z=[[],[],[],[]]
                                                                                //  0->1->2->3
                                                                                //  3->2->1->0 
        this.tetrominoPattern= (this.tetrominoPattern+1)%this.tetromino.length ;// get the index of the tetromino shape
        this.activeTetromino=this.tetromino[this.tetrominoPattern]; // shape of the active tetromino
        this.draw();
    }
}

Piece.prototype.collision=function(x, y, piece){
    for(r=0;r<piece.length;r++) {
        for(c=0;c<piece.length;c++) {
            //if square is empty skip
            if (!piece[r][c]) {
                continue;
            }
            //coordinates of piece of potential movement
            let newX = this.x + c + x
            let newY = this.y + r + y

            //conditions
            if (newX < 0 || newX >= col || newY >= row) {
                return true;
            }
            //skip newY < 0, will crash game
            if (newY < 0) {
                continue;
            }
            //check for collision with locked piece
            if (board[newY][newX] != empty) {
                return true;
            }
        }
    }
    return false
}

// Let's control the piece with our key board
document.addEventListener("keydown",control);
// now define the control function as per our keyboard controls
function control(e){
    e.preventDefault()
    if (startstopBtn.value=="stop"){
        if(e.keyCode==37){
            moveTetrominoeSound.play()
            newPc.moveLeft();
            dropStart=Date.now(); // will reset the drop time 
        } else if(e.keyCode==38){
            moveTetrominoeSound.play()
            newPc.rotate();
            dropStart=Date.now();
        } else if (e.keyCode==39){
            moveTetrominoeSound.play()
            newPc.moveRight();
            dropStart=Date.now();
        } else if (e.keyCode==40){
            moveTetrominoeSound.play()
            newPc.moveDown();
        }
    }
}

// drop the piece every 1 sec
let dropStart = Date.now();
let gameOver=false;
console.log(gameOver)
function drop(){
    let rightNow = Date.now();
    let delta = rightNow - dropStart;
    if(delta > 1000 && startstopBtn.value=="stop"){
        newPc.moveDown();
        dropStart=Date.now();
    } else{
        cancelAnimationFrame(drop);
    }
    // requestAnimationFrame method will tell the browser that you wish to perform an animation
    // This method will takes a callback as an argument to be invoked before the rapaint
    if(!gameOver){
        requestAnimationFrame(drop);
    }    
}

// Start and stop button logic

const startstopBtn=document.querySelector("#strtstpbtn");
const scoreDisplay = document.querySelector(".sq_val")
const strtStpBtnTitle = document.querySelector("#strtstpbtntitle");


startstopBtn.addEventListener("click", startGame);

function startGame(){
    themeMusic.volume = 1
    themeMusic.play()
    console.log("start button starts working");
    drop();
    startstopBtn.removeEventListener("click", startGame);
    startstopBtn.addEventListener("click",stopGame);
    strtStpBtnTitle.innerHTML = "PAUSE";
    strtstpicon.innerHTML = "&#xe1a2;";
    startstopBtn.value = "stop";
}

function stopGame(){
    console.log("stop button starts working");
    themeMusic.volume = .3
    drop();
    startstopBtn.removeEventListener("click", stopGame);
    startstopBtn.addEventListener("click",startGame);
    strtStpBtnTitle.innerHTML = "PLAY";
    strtstpicon.innerHTML = "&#xe038;";
    startstopBtn.value="start";
}




