const canvas = document.querySelector('#game-board')
const context = canvas.getContext('2d')// This will give the context of canvas that has properties and methods that allows us to do lot of thongs using canvas
canvas.height = 500
canvas.width = 250
const row = 20
const col = 10
const squareSz = 25 // Width and height of a square
const empty = 'dimgrey' // color of an empty square

 
// drawing squares in board
function drawSquares(x, y, color){
    context.fillStyle = color
    context.fillRect(x*squareSz, y*squareSz, squareSz, squareSz)

    context.strokeStyle = 'mintcream'
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
    this.y = 0

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

// Move down the Piece
Piece.prototype.moveDown = function(){

    if (!this.collision(0,1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    }
    else {
        newPc = randomTetromino()
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

    if (this.collision(0,0, nextPattern)) {
        if (this.x > col/2) {
            kick = -1;
        }
        else {
            kick = 1;
        }
    }
    if (!this.collision(kick,0, nextPattern)) {
        this.unDraw();
        this.x += kick;
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
    if(e.keyCode==37){
        e.preventDefault()
        newPc.moveLeft();
        dropStart=Date.now(); // will reset the drop time 
    } else if(e.keyCode==38){
        e.preventDefault()
        newPc.rotate();
        dropStart=Date.now();
    } else if (e.keyCode==39){
        e.preventDefault()
        newPc.moveRight();
        dropStart=Date.now();
    } else if (e.keyCode==40){
        e.preventDefault()
        newPc.moveDown();
        dropStart=Date.now();
    }
}

// drop the piece every 1 sec
let dropStart = Date.now();
console.log(dropStart)
function drop(){
    let rightNow = Date.now();
    let delta = rightNow - dropStart;
    if(delta > 1000){
        newPc.moveDown();
        dropStart=Date.now();
    }
    // requestAnimationFrame method will tell the browser that you wish to perform an animation
    // This method will takes a callback as an argument to be invoked before the rapaint
    requestAnimationFrame(drop);
}
drop();




