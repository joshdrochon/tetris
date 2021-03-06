const canvas = document.querySelector('#game-board')
const context = canvas.getContext('2d')// This will give the context of canvas that has properties and methods that allows us to do lot of thongs using canvas

const queue = document.querySelector("#queue-board")
const queueCtx = queue.getContext('2d')

//initial game values
let speed = 1000,
score=0,
level = 1,
scoreToReachNextLevel = 50,
scoreDict = {
    1 : 5,
    2 : 10,
    3 : 50,
    4 : 200,
    5 : 500,
    6 : 2000,
    7 : 5000,
    8 : 20000,
    9 : 50000,
}

canvas.height = 500
canvas.width = 250
const row = 20
const col = 10
const squareSz = 25 // Width and height of a square
const empty = '#d4d4d4' // color of an empty square

const themeMusic = document.getElementById('theme-music')
const placeTetrominoeSound = new Audio('/static/audio/PlaceTetrominoe.wav')
const clearRowSound = new Audio('/static/audio/ClearRow.wav')
const gameOverSound = new Audio('/static/audio/GameOver.wav')
const rotateSound = new Audio('/static/audio/RotateSound.wav')
const levelUpSound = new Audio('/static/audio/LevelUp.flac')
const moveTetrominoeSound = new Audio('/static/audio/MoveTetrominoe.wav')

// Refer below variables Z,S,T,O,L,I,J to tetrominoes.js for each shape pattern declaration
const allPieces = [ 
    [Z, '#51bb71'], 
    [S, '#5082b1'], 
    [T, '#cfba44'], 
    [O, '#c76c6c'], 
    [L, '#d48e31'], 
    [I, '#89499c'], 
    [J, '#504c83'],
]

themeMusic.controls = ""
themeMusic.loop = true
placeTetrominoeSound.volume = .5
clearRowSound.volume = .5
rotateSound.volume = .5
moveTetrominoeSound.playbackRate = 16
levelUpSound.volume = .5

class Piece {
    constructor(tetromino, color) {
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
    // fill the piece with a color. This method will be used when we draw and undraw the piece to the board
    fill(color) {
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino.length; c++) {
                // we draw only occupied squares
                if (this.activeTetromino[r][c]) {
                    drawSquares(this.x + c, this.y + r, color, context)
                }
            }
        }
    }
    // draw a piece to the board
    draw() {
        this.fill(this.color)
    }
    // undraw the piece on the board
    unDraw() {
        this.fill(empty)
    }
    drawOutline(btmYPos) {
        this.y += btmYPos
        for (var r = 0; r < this.activeTetromino.length; r++) {
            for (var c = 0; c < this.activeTetromino.length; c++) {
                // We want to outline only occupied squares
                if (this.activeTetromino[r][c]) {
                    outlineSquare(this.x + c, this.y + r, '#ffffff')
                }
            }
        }
        this.y -= btmYPos
    }
    rmOutline(btmYPos, xPos) {
        this.y += btmYPos
        for (var r = 0; r < this.activeTetromino.length; r++) {
            for (var c = 0; c < this.activeTetromino.length; c++) {
                // We want to outline only occupied squares
                if (this.activeTetromino[r][c]) {
                    outlineSquare(this.x + c + xPos, this.y + r, empty)
                }
            }
        }
        this.y -= btmYPos
    }
    // lock the piece to the board
    lock() {
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino.length; c++) {
                // don't lock the vacant squares to the board
                if (!this.activeTetromino[r][c]) {
                    continue
                }
                // pieces to get locked on top of the board=gameover
                if (this.y + r < 0) {
                    // gameover case
                    console.log("I am in the gameOver case")
                    gameOverSound.play()
                    console.log(this.y)
                    // stop the animation frame 
                    gameOver = true
                    alert("GameOver!!!. Start Over ?? Click OK")
                    location.reload()
                    //reset();
                    return false
                }
                // lock the piece
                placeTetrominoeSound.play()
                board[this.y + r][this.x + c] = this.color
            }
        }
        // Remove fill rows
        for (let r = 0; r < row; r++) {
            let isRowFull = true
            for (let c = 0; c < col; c++) {
                // keep checking if Row is filled
                isRowFull = isRowFull && (board[r][c] != empty)
            }
            if (isRowFull) {
                // Once the row is completely filled. Move down all the rows above the filled row
                // go in the reverse direction
                for (let y = r; y > 1; y--) {
                    for (let c = 0; c < col; c++) {
                        board[y][c] = board[y - 1][c]
                    }
                }
                // add an empty row at the top
                for (let c = 0; c < col; c++) {
                    board[0][c] = empty
                }
                score += scoreDict[level]
                if (!playerLevel(score))
                    clearRowSound.play()
            }
        }
        // update the board
        drawBoard()
        scoreDisplay.innerHTML = score
    }
    // Move down the Piece
    moveDown() {

        if (!this.collision(0, 1, this.activeTetromino)) {
            console.log("in the movedown")
            this.unDraw()
            this.y++
            this.draw()
        }
        else {
            //if there is a collision then lock the tetromino and generate a new one
            console.log("in the lock Function")
            this.lock()
            newPc = nextPiece
            nextTetromino()
        }

    }
    // Move left the Piece
    moveLeft(btmPrevPos) {
        if (!this.collision(-1, 0, this.activeTetromino)) {
            this.unDraw()
            this.x--
            this.draw()
            let btmPos = this.findBottomPos()
            this.rmOutline(btmPrevPos, 1)
            this.drawOutline(btmPos)
        }
    }
    // Move right the Piece
    moveRight(btmPrevPos) {
        if (!this.collision(1, 0, this.activeTetromino)) {
            this.unDraw()
            this.x++
            this.draw()
            let btmPos = this.findBottomPos()
            this.rmOutline(btmPrevPos, -1)
            this.drawOutline(btmPos)
        }
    }
    // rotate the Piece
    rotate() {
        let nextPattern = this.tetromino[(this.tetrominoPattern + 1) % this.tetromino.length]
        let kick = 0
        // If there is a collison need to check on which side the collision happend
        if (this.collision(0, 0, nextPattern)) {
            if (this.x > col / 2) {
                kick = -1
            }
            else {
                kick = 1
            }
        }
        // if there is no collision
        if (!this.collision(kick, 0, nextPattern)) {
            this.unDraw()
            this.x += kick

            rotateSound.play()
            // rotation is simply replacing a different shape of the tetrimone in an order inplace - Z=[[],[],[],[]]
            //  0->1->2->3
            //  3->2->1->0 
            this.tetrominoPattern = (this.tetrominoPattern + 1) % this.tetromino.length // get the index of the tetromino shape
            this.activeTetromino = this.tetromino[this.tetrominoPattern] // shape of the active tetromino
            this.draw()
            let btmPos = this.findBottomPos()
            // this.rmOutline(btmPrevPos, 0)
            this.drawOutline(btmPos)

        }
    }
    collision(x, y, piece) {
        for (let r = 0; r < piece.length; r++) {
            for (let c = 0; c < piece.length; c++) {
                //if square is empty skip
                if (!piece[r][c]) {
                    continue
                }
                //coordinates of piece of potential movement
                let newX = this.x + c + x
                let newY = this.y + r + y

                //conditions
                if (newX < 0 || newX >= col || newY >= row) {
                    return true
                }
                //skip newY < 0, will crash game
                if (newY < 0) {
                    continue
                }
                //check for collision with locked piece
                if (board[newY][newX] != empty) {
                    return true
                }
            }
        }
        return false
    }
    findBottomPos() {

        // find out last empty rows in active tetromino pattern, I[0] has two, all others have one
        let tLastEmptyRows = 0
        for (let rowIndex = this.activeTetromino.length - 1; rowIndex >= 0; rowIndex--) {
            if (!this.activeTetromino[rowIndex].reduce((a, b) => a + b, 0)) {
                tLastEmptyRows++
            } else {
                break
            }
        }

        // set tetromino's last occupied row as the start point
        let curTetrominoLastRow = this.y + (this.activeTetromino.length - tLastEmptyRows)
        let CtEmptyRow = 0
        let moveDownStep = 1

        // count empty row from tetromino to the bottom when collision occurs
        while (curTetrominoLastRow < row) {
            if (!this.collision(0, moveDownStep, this.activeTetromino)) {
                CtEmptyRow++
            } else {
                break
            }
            curTetrominoLastRow++
            moveDownStep++
        }

        return CtEmptyRow

    }
    hardDrop() {

        let emptyR = this.findBottomPos()
        this.unDraw()
        this.y += emptyR
        this.draw()
        this.lock()
        newPc = nextPiece
        nextTetromino()
    }
}

// drawing squares in board
function drawSquares(x, y, color, ctx){
    
    ctx.fillStyle = color
    ctx.fillRect(x*squareSz, y*squareSz, squareSz, squareSz)

    ctx.strokeStyle = "#000000"
    ctx.strokeRect(x*squareSz, y*squareSz, squareSz, squareSz)
   
}

function playerLevel(score) {
    if (score >= scoreToReachNextLevel) {
        level+=1
        levelDisplay.innerHTML = level
        scoreToReachNextLevel = Math.ceil(score * Math.pow(level, 1.005)/100)*100
        speed -= 100
        themeMusic.playbackRate += .05
        levelUpSound.play()
        return true
    }
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
            drawSquares(c, r, board[r][c], context)
        }
    }
}

// // undraw gameboard to both canvas
// function undrawBoard(){
//     for (let r = 0; r < row; r++){
//         for (let c = 0; c < col; c++){
//             if(board[r][c]){
//                 console.log("I am in undrawBoard Function")
//                 drawSquares(c, r, empty, context);
//                 drawSquares(c, r, empty, queueCtx);
//             }
            
//         }
//     }
//     queueCtx.clearRect(0, 0, canvas.width, canvas.height)
// }

function outlineSquare(x, y, color){
    context.fillStyle = color
    context.fillRect(x*squareSz, y*squareSz, squareSz, squareSz)

    context.strokeStyle = '#000000'
    context.strokeRect(x*squareSz, y*squareSz, squareSz, squareSz)
}


//draw queue canvas
let queueBoard,
nextPiece

//set tetromono center 
function setCenter(color) {
    queue.style.left = null;
    queue.style.top = null;
    
    if (color == "#c76c6c") {
        queue.style.left = `${18}px`
        queue.style.top = `${-15}px`
    }

    if (color == "#89499c") {
        queue.style.left = `${18}px`
        queue.style.top = `${0}px`
    }
}

//set and draw next tetromino
function nextTetromino(){
    nextPiece = randomTetromino()
    queueBoard = []
    let { 
        activeTetromino: next,
        color, 
    } = nextPiece
    queueBoard = next

    setCenter(color)

    //clear canvas
    queueCtx.clearRect(0, 0, canvas.width, canvas.height)

    for (let r = 0; r < next.length; r++){
        for (let c = 0; c < next[r].length; c++){
            if (next[r][c]) {
                drawSquares(c, r, color, queueCtx)
            }
        }
    }
}

drawBoard()

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

















// Let's control the piece with our key board
document.addEventListener("keydown",control);
// now define the control function as per our keyboard controls
function control(e){
    e.preventDefault()
    if (startstopBtn.value=="stop"){
        if(e.keyCode==37){
            moveTetrominoeSound.play()
            btmPrevPos = newPc.findBottomPos()
            newPc.moveLeft(btmPrevPos);
            dropStart=Date.now(); // will reset the drop time 
        } else if(e.keyCode==38){
            moveTetrominoeSound.play()
            btmPrevPos = newPc.findBottomPos()
            newPc.rmOutline(btmPrevPos, 0)
            newPc.rotate();
            dropStart=Date.now();
        } else if (e.keyCode==39){
            moveTetrominoeSound.play()
            btmPrevPos = newPc.findBottomPos()
            newPc.moveRight(btmPrevPos);
            dropStart=Date.now();
        } else if (e.keyCode==40){
            moveTetrominoeSound.play()
            newPc.moveDown();
        } else if (e.keyCode==32){
            newPc.hardDrop()
        }
    }
}

// drop the piece every 1 sec
let dropStart = Date.now();
let gameOver=false;

function drop(){
    let rightNow = Date.now();
    let delta = rightNow - dropStart;
    if(delta > speed && startstopBtn.value=="stop"){
        newPc.moveDown();
        dropStart=Date.now();
    } else{
        cancelAnimationFrame(drop);
    }
    // requestAnimationFrame method will tell the browser that you wish to perform an animation
    // This method will takes a callback as an argument to be invoked before the rapaint
    if(!gameOver){
        requestAnimationFrame(drop);
        
    } else{
       cancelAnimationFrame(drop)
    }   
}

// Start and stop button logic

const startstopBtn=document.querySelector("#strtstpbtn");
const scoreDisplay = document.querySelector("#score")
const levelDisplay = document.querySelector("#level")
const strtStpBtnTitle = document.querySelector("#strtstpbtntitle");

startstopBtn.addEventListener("click", startGame);

function startGame(){
    themeMusic.volume = 1
    themeMusic.play()
    console.log("start button starts working");
    drop();
    if(!nextPiece)
        nextTetromino()
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

// Reset function

// function reset(){
//     console.log("I am in the reset function")
//     gameOver=false;
//     undrawBoard();
//     if(score){
//         score=0;
//         scoreDisplay.innerHTML = score;
//     }
//     startstopBtn.removeEventListener("click", stopGame);
//     startstopBtn.addEventListener("click",startGame);
//     strtStpBtnTitle.innerHTML = "PLAY";
//     strtstpicon.innerHTML = "&#xe038;";
//     startstopBtn.value="start";
    
// }




