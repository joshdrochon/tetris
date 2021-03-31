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

// Javascript object prototype is a way to create objects using constructor function.

// create Object 

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


// the object piece 
// below can also be created as class object
function Piece(tetromino, color){
    this.tetromino = tetromino 
    this.color = color 

    // start with pattern 0 (total 4 patterns when rotate, others are 1, 2, 3 - these are indexes of pattern) - refer to tetromonies.js
    this.tetrominoPattern = 0 
    // define the active/current tetromino pattern we are working on
    this.activeTetromino = this.tetromino[this.tetrominoPattern]

    // the coordinate for where the tetrominos first lands, can be changed to the top middle 
    this.x = 0
    this.y = 0

}

Piece.prototype.draw = function(){
    for (let r = 0; r < this.activeTetromino.length; r++){
        for (let c = 0; c < this.activeTetromino.length; c++){
            // only draw the occupied squares in the tetromino shape 
            // refer to tetrominoes.js for tetromino square indexes (0 is empty, 1 is occupied)
            if (this.activeTetromino[r][c]){
                drawSquares(this.x + c, this.y + r, this.color)
            }
        }
    }
}

newPc.draw()



