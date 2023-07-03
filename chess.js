const game = {
    turn: "white",
    board: new Board(),
    blackPieces: [],
    whitePieces: [],
    whiteKing: undefined,
    blackKing: undefined,
    pawn: undefined,
    checkedSquare: "",
    turnNumber: 0,
    moves: [],
    position: [],
    positionNumber: 1,
    isOver: false
};

let rotationButton = "changing";
let boardRotation = "white";

let pieceSelected = undefined;

//Used "https://stackoverflow.com/questions/26432492/chessboard-html5-only" to create the board
function createBoard(){
    let table = document.querySelector('.chess-board');

    let row = document.createElement("tr");
    row.style.display = "none";
    table.append(row);
    const rowString = " ABCDEFGH";
    for (let i = 0; i < 9; i++)
    {
        const curr = document.createElement("th");
        curr.innerText = `${rowString[i]}`;
        row.append(curr)
    }

    for (let i = 0; i < 8; i++) {
        row = document.createElement("tr");
        table.append(row);

        let curr = document.createElement("th");
        curr.innerText = `${8 - i}`;
        row.append(curr)

        for (let j = 0; j < 8; j++) {
            const square = document.createElement("td");
            square.setAttribute("id", `${rowString[j + 1]}${8 - i}`)
            square.addEventListener('click', move);
            if ((i + j) % 2 === 0)
            {
                square.setAttribute("class", "whiteSquare");
            }
            else
            {
                square.setAttribute("class", "blackSquare")
            }
            row.append(square);
        }
        curr = document.createElement("th");
        curr.innerText = `${8 - i}`;
        curr.style.display = "none";
        row.append(curr);
    }
    
    row = document.createElement("tr");
    table.append(row);
    for (let i = 0; i < 9; i++)
    {
        const curr = document.createElement("th");
        curr.innerText = `${rowString[i]}`;
        row.append(curr)
    }

}

function chessNotationtoindex(str)
{
    let res = [,]
    const fileStr = "ABCDEFGHI";
    res[1] = fileStr.indexOf(str[0]);
    res[0] = Number(str[1]) - 1;

    return res
}

function indexToChessNotation(rank, file)
{
    const fileStr = "ABCDEFGHI";
    return `${fileStr[file]}${rank + 1}`;
}

function isLightSquare(rank, file)
{
    if ((rank + file) % 2 === 0)
        return false;
    return true;
}

function fillBoard(board)
{
    for (let i = 0; i < 8; i++)
    {
        for (let j = 0; j < 8; j++)
        {
            let piece = board[i][j];
            if (piece !== undefined)
                document.getElementById(indexToChessNotation(piece.rank, piece.file)).innerText = piece.symbol;
            else
                document.getElementById(indexToChessNotation(i, j)).innerText = "";

        }
    }
}

function fillPieces(game)
{
    game.whiteKing = game.board.board[0][4];
    game.blackKing = game.board.board[7][4];
    for (let i = 0; i < 2; i++)
    {
        for (let j = 0; j < 8; j++)
        {
            game.blackPieces.push(game.board.board[7 - i][j]);
            game.whitePieces.push(game.board.board[i][j]);
        }
    }
}

function removePiece(piece)
{
    let pieces = piece.color === 'white' ? game.whitePieces : game.blackPieces;
    let index = pieces.indexOf(piece)
    if (index != - 1)
        pieces.splice(index, 1)
}

function addPiece(piece)
{
    if (piece.color === 'white')
    {
        game.whitePieces.push(piece);
    }
    else
    {
        game.blackPieces.push(piece);
    }
}


function promoteToQueen()
{
    let pawn = game.pawn;
    let queen = new Queen(pawn.color, pawn.rank, pawn.file);
    game.board.board[queen.rank][queen.file] = queen;
    let pieces = game.whitePieces;
    if (pawn.color === 'black')
        pieces = game.blackPieces;
    pieces.push(queen);
    document.getElementById("promotion").style.display = "none";
    fillBoard(game.board.board);
    endTurn(game);
}

function promoteToRook()
{
    let pawn = game.pawn;
    let rook = new Rook(pawn.color, pawn.rank, pawn.file);
    game.board.board[pawn.rank][pawn.file] = rook;
    let pieces = game.whitePieces;
    if (pawn.color === 'black')
        pieces = game.blackPieces;
    pieces.push(rook);
    document.getElementById("promotion").style.display = "none";
    fillBoard(game.board.board);
    endTurn(game);
}

function promoteToBishop()
{
    let pawn = game.pawn;
    let bishop = new Bishop(pawn.color, pawn.rank, pawn.file);
    game.board.board[pawn.rank][pawn.file] = bishop;
    let pieces = game.whitePieces;
    if (pawn.color === 'black')
        pieces = game.blackPieces;
    pieces.push(bishop);
    document.getElementById("promotion").style.display = "none";
    fillBoard(game.board.board);
    endTurn(game);
}

function promoteToKnight()
{
    let pawn = game.pawn;
    let knight = new Knight(pawn.color, pawn.rank, pawn.file);
    game.board.board[pawn.rank][pawn.file] = knight;
    let pieces = game.whitePieces;
    if (pawn.color === 'black')
        pieces = game.blackPieces;
    pieces.push(knight);
    document.getElementById("promotion").style.display = "none";
    fillBoard(game.board.board);
    endTurn(game);
}

function promotePawn(pawn)
{
    document.getElementById("promotion").style.display = "block";
    game.pawn = pawn;
    let pieces = game.whitePieces;
    if (pawn.color === 'black')
        pieces = game.blackPieces;
    pieces.splice(pieces.indexOf(pawn),1);
}

function move(e)
{
    if (document.getElementById("promotion").style.display !== 'none' || game.isOver)
        return;

    if (game.positionNumber !== game.position.length)
    {
        displayEnd();
        return;
    }

    if (pieceSelected === undefined)
    {
        let [rank, file] = chessNotationtoindex(e.target.id);
        pieceSelected = game.board.board[rank][file];
        if (pieceSelected != undefined && pieceSelected.color === game.turn)
        {
            e.target.style.backgroundColor = "red";
            return;
        }
        pieceSelected = undefined;
        return;
    }

    let [rank, file] = chessNotationtoindex(e.target.id);
    let pieceRank = pieceSelected.rank;
    let pieceFile = pieceSelected.file;
    if (pieceSelected.canMove(rank, file, game))
    {
        let endSquare = game.board.board[rank][file];

        let removedPiece = endSquare;
        if (endSquare !== undefined)
        {
            removePiece(removedPiece)
        }
        if (pieceSelected instanceof Pawn && pieceSelected.enPassant(rank, file, game))
        {
            removedPiece = game.board.board[pieceRank][file];
            game.board.board[removedPiece.rank][removedPiece.file] = undefined;
            removePiece(removedPiece);
            pieceSelected.move(rank, file, game.board);
            pieceSelected.canCastle = false;
        }
        else if (pieceSelected instanceof King && pieceSelected.canCastlefunct(rank, file, game))
        {
            pieceSelected.castle(rank, file, game);
        }
        else
        {
            pieceSelected.move(rank, file, game.board);
            pieceSelected.canCastle = false;
        }

        let king = game.whiteKing;
        let ennemyKing = game.blackKing;
        if (game.turn === 'black')
        {
            king = game.blackKing;
            ennemyKing = game.whiteKing
        }

        if (king.isChecked(game))
        {
            pieceSelected.move(pieceRank, pieceFile, game.board)
            if (removedPiece !== undefined)
            {
                addPiece(removedPiece);
                removedPiece.move(removedPiece.rank, removedPiece.file, game.board);
            }
        }
        else
        {
            fillBoard(game.board.board);
            game.moves.push([indexToChessNotation(pieceRank, pieceFile), indexToChessNotation(rank, file)])
            const move = document.getElementById("move");
            let row = undefined
            if (game.turn === "white")
            {
                row = document.createElement("tr");
                move.appendChild(row);
            }
            else
            {
                row = move.lastChild;
            }
            let td = document.createElement("td");
            row.appendChild(td);
            td.setAttribute("id", `positionNumber${game.positionNumber}`);
            td.style.backgroundColor = "Silver";
            if (game.positionNumber !== 1)
                document.getElementById(`positionNumber${game.positionNumber - 1}`).style.backgroundColor = 'White';
            td.innerText = `${game.moves[game.moves.length - 1][0]}-${game.moves[game.moves.length - 1][1]}`;
            
            if (game.checkedSquare !== "")
            {
                document.getElementById(game.checkedSquare).style.color = "black";
                game.checkedSquare = "";
            }


            if (pieceSelected instanceof Pawn && (rank === 7 || rank === 0))
                promotePawn(pieceSelected);
            else
                endTurn(game);
        }       
    }
    /*else
        console.log("Cant move" + pieceSelected.symbol + "at" + rank + "," + file);
    
    console.log(indexToChessNotation(pieceRank,pieceFile))*/
    if (isLightSquare(pieceRank, pieceFile))
        document.getElementById(indexToChessNotation(pieceRank, pieceFile)).style.backgroundColor = "#eee";
    else
        document.getElementById(indexToChessNotation(pieceRank, pieceFile)).style.backgroundColor = "#aaa";
    pieceSelected = undefined;
}

function isDraw(game){
    //Check Stalemate
    let ennemies = game.blackPieces;
    let ennemyKing = game.blackKing;
    if (game.turn === 'black')
    {
        ennemies = game.whitePieces;
        ennemyKing = game.whiteKing;
    }
    if (!ennemyKing.isChecked(game))
    {
        let canMove = false;
        for (piece of ennemies)
        {
            for (let i = 0; i < 8; i++)
            {
                for (let j = 0; j < 8; j++) {
                    if (piece.canMove(i, j, game))
                    {
                        canMove = true;
                        break;
                    }
                }
                if (canMove)
                    break;
            }
        }
        if (!canMove)
            return "Stalemate";
    }

    //Check insufficient material
    if (game.whitePieces.length === 1 && game.blackPieces.length === 1)
        return "Insufficient material";
    let pieces = game.whitePieces;
    if (game.whitePieces.length === 1)
        pieces = game.blackPieces;
    if (pieces.length === 2 && (game.whitePieces.length === 1 || game.blackPieces.length === 1) &&
        (pieces[0] instanceof Bishop || pieces[0] instanceof Knight ||
         pieces[1] instanceof Bishop || pieces[1] instanceof Knight))
        return "Insufficient material";
    if (game.whitePieces.length === 2 && game.blackPieces.length === 2 && 
        (game.whitePieces[0] instanceof Bishop || game.whitePieces[1] instanceof Bishop) &&
        (game.blackPieces[0] instanceof Bishop || game.blackPieces[1] instanceof Bishop))
    {
        let whiteBishop = game.whitePieces[0] instanceof Bishop ? game.whitePieces[0] : game.whitePieces[1];
        let blackBishop = game.blackPieces[0] instanceof Bishop ? game.blackPieces[0] : game.blackPieces[1];
        if (game.board.squareColor(whiteBishop.rank, whiteBishop.file) === game.board.squareColor(blackBishop.rank, blackBishop.file))
            return "Insufficient material";
    }

    //Check for repeted position three times
    let currPosition = game.board.toString();
    let findPosition = 0;
    while (findPosition < game.position.length - 1 && game.position[findPosition][0] !== currPosition)
        findPosition++;

    if (findPosition < game.position.length - 1)
    {
        game.position[findPosition][1] += 1;
        if (game.position[findPosition][1] === 3)
        {
            return "Repetition";
        }
    }
    
    return undefined;
}

function endTurn(game){
    let ennemyKing = game.blackKing;
    if (game.turn === 'black')
        ennemyKing = game.whiteKing;
    
    game.positionNumber++;
    game.position.push([game.board.toString(), 1]);

    let draw = undefined;
    if (ennemyKing.isChecked(game))
    {
        game.checkedSquare = indexToChessNotation(ennemyKing.rank, ennemyKing.file);
        document.getElementById(game.checkedSquare).style.color = "red";
        if (ennemyKing.isCheckMated(game))
        {
            game.isOver = true;
            let gameOver = document.getElementById("gameOver");
            gameOver.innerText = `GAME OVER ${game.turn} has won`
            return;
        }
    }
    else if (draw = isDraw(game))
    {
        game.isOver = true;
        let gameOver = document.getElementById("gameOver");
        gameOver.innerText = `IT'S A DRAW (${draw})`;
        return;
    }
    if (game.turn === "white")
    {
        game.turn = 'black';
        document.querySelector("#turn").innerText = "Black to play";
    }
    else
    {
        game.turn = 'white';
        document.querySelector("#turn").innerText = "White to play";
        game.turnNumber += 1;
        document.getElementById("turnNumber").innerText = `Turn: ${game.turnNumber}`;
    }

    // Rotate board
    if (rotationButton === "changing")
        rotateBoard();
}

function rotateBoard()
{
    const board = document.getElementById("board");
    if (boardRotation === 'black')
    {
        board.rows[0].style.display = "none";
        board.rows[9].style.display = "";
    }
    else
    {
        board.rows[9].style.display = "none";
        board.rows[0].style.display = "";
    }

    let degrees = (boardRotation === "white" ? 180 : 0);
    let firstCol = (boardRotation === "black" ? "" : "none");
    let lastCol = (boardRotation === "black" ? "none" : "");
    board.style.transform = `rotate(${degrees}deg)`;
    for (let i = 0, row; row = board.rows[i]; i++)
    {
        for (let j = 0, cell; cell = row.cells[j]; j++)
        {
            if (j === 0)
                cell.style.display = firstCol;
            if (j === 9)
                cell.style.display = lastCol;
            cell.style.transform = `rotate(${degrees}deg)`;
        }
    }
    boardRotation = (boardRotation === 'white' ? 'black' : "white");
}

function rotationButtonFunc()
{
    const button = document.getElementById("rotation");
    if (rotationButton === "changing")
    {
        if (boardRotation === 'black')
            rotateBoard();
        rotationButton = "white";
        button.innerText = "Rotation : White";
    }
    else if (rotationButton === "white")
    {
        rotateBoard();
        rotationButton = "black";
        button.innerText = "Rotation : Black";
    }
    else if (rotationButton === 'black')
    {
        if (game.turn === "white")
            rotateBoard();
        rotationButton = "changing";
        button.innerText = "Rotation : Changing";
    }
}

function displayFromStr(str)
{
    let c = 0;
    for (let i = 0; i < 8; i++){
        for (let j = 0; j < 8; j++)
        {
            if (str[c] === ".")
                document.getElementById(indexToChessNotation(i, j)).innerText = "";
            else
                document.getElementById(indexToChessNotation(i, j)).innerText = str[c];
            c++;
        }
    }
}

function changeMoveBackgroundColor(end, game)
{
    if (end !== 1)
    {
        document.getElementById(`positionNumber${end - 1}`).style.backgroundColor = "Silver";
    }

    if (game.positionNumber !== 1)
    {
        document.getElementById(`positionNumber${game.positionNumber - 1}`).style.backgroundColor = "White";
    }
}

function displayStart()
{        
    displayFromStr(game.position[0][0]);
    changeMoveBackgroundColor(1, game);
    game.positionNumber = 1;
}

function displayEnd()
{
    displayFromStr(game.position[game.position.length - 1][0]);
    changeMoveBackgroundColor(game.position.length, game);
    game.positionNumber = game.position.length;
}

function displayPrevious()
{
    if (game.positionNumber === 1)
        return;

    changeMoveBackgroundColor(game.positionNumber - 1, game);
    game.positionNumber--;
    displayFromStr(game.position[game.positionNumber - 1][0]);
}

function displayNext()
{
    if (game.positionNumber === game.position.length)
        return;

    changeMoveBackgroundColor(game.positionNumber + 1, game);
    game.positionNumber ++;
    displayFromStr(game.position[game.positionNumber - 1][0]);
}

function resign()
{
    if (game.isOver)
        return;
    if (!confirm("Are you sure you want to resign ?"))
        return;
    game.isOver = true;
    let gameOver = document.getElementById("gameOver");
    const winner = (game.turn === "white" ? "Black" : "White");
    gameOver.innerText = `GAME OVER ${winner} has won (resign)`;
}
//const board = new Board();
//let r = new Rook("white", 2, 0);
//let n = board.board[0][1];
//let b = new Bishop('white', 5, 0);
//board.board[5][0] = b;
//let q = new Queen('white', 2, 3);
//board.board[2][3] = q;

/*let k = new King('black', 4, 4);
board.board[4][4] = k;  

let p = new Pawn('white', 2, 3);
board.board[2][3] = p;*/
//board.printBoard();

document.getElementById("promotion").style.display = "none";
createBoard();
fillPieces(game);
fillBoard(game.board.board);
game.position.push([game.board.toString(), 1]);