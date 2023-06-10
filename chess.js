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
    isOver: false
};

let pieceSelected = undefined;

//Used "https://stackoverflow.com/questions/26432492/chessboard-html5-only" to create the board
function createBoard(){
    let table = document.querySelector('.chess-board');

    let row = document.createElement("tr");
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

        const curr = document.createElement("th");
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
            }
            pieceSelected.move(rank, file, game.board);
            pieceSelected.canCastle = false;

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
                document.getElementById("move").innerText += `${game.moves[game.moves.length - 1][0]}-${game.moves[game.moves.length - 1][1]}, `
                if (game.checkedSquare !== "")
                {
                    document.getElementById(game.checkedSquare).style.color = "black";
                    game.checkedSquare = "";
                }


                if (pieceSelected instanceof Pawn && (rank === 7 || rank === 0))
                    promotePawn(pieceSelected)
                endTurn(game);
                if (game.turn === "white")
                {
                    game.turn = 'black';
                    document.querySelector("#turn").innerText = "Black to move";
                }
                else
                {
                    game.turn = 'white';
                    document.querySelector("#turn").innerText = "White to move";
                    game.turnNumber += 1;
                    document.getElementById("turnNumber").innerText = `n° de tour: ${game.turnNumber}`;
                }
            }       
        }
        else
            console.log("Cant move" + pieceSelected.symbol + "at" + rank + "," + file);
        
        console.log(indexToChessNotation(pieceRank,pieceFile))
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
    
    return undefined;
}

function endTurn(game){
    let ennemyKing = game.blackKing;
    if (game.turn === 'black')
        ennemyKing = game.whiteKing;
    
    let draw = undefined
    if (ennemyKing.isChecked(game))
    {
        game.checkedSquare = indexToChessNotation(ennemyKing.rank, ennemyKing.file);
        document.getElementById(game.checkedSquare).style.color = "red";
        if (ennemyKing.isCheckMated(game))
        {
            game.isOver = true;
            let gameOver = document.getElementById("gameOver");
            gameOver.innerText = `GAME OVER ${game.turn} has won`
        }
    }
    else if (draw = isDraw(game))
    {
        game.isOver = true;
        let gameOver = document.getElementById("gameOver");
        gameOver.innerText = `IT'S A DRAW (${draw})`;
    }
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