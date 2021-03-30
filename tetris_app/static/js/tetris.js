const canvas = document.querySelector('#game-board')
const context = canvas.getContext('2d')
canvas.height = 500
canvas.width = 250
const row = 20
const col = 10
const squareSz = 25
const empty = 'dimgrey'


// draw one square in board
function oneSquare(x, y, color){
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

// draw game board
function drawBoard(){
    for (let r = 0; r < row; r++){
        for (let c = 0; c < col; c++){
            oneSquare(c, r, board[r][c])
        }
    }
}

drawBoard()

