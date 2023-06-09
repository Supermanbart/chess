class Pawn extends Piece {
    constructor(color, rank, file) {
        super(color, rank, file);
        if (color === "white")
            this.symbol = "♙";

        else
            this.symbol = "♟";
    }
    canMove(endRank, endFile, game) {
        let endSquare = game.board.board[endRank][endFile];

        //Check if can move 2 spaces at the starting position
        if (this.color == 'white' && (endRank - this.rank === 2) && this.rank === 1 &&
            endFile === this.file && game.board.board[this.rank + 1][this.file] === undefined &&
            endSquare === undefined)
            return true;

        if (this.color == 'black' && (endRank - this.rank === -2) && this.rank === 6 &&
            endFile === this.file && game.board.board[this.rank - 1][this.file] === undefined &&
            endSquare === undefined)
            return true;

        //Check if pawn only move one square up or down
        if (Math.abs(endRank - this.rank) != 1)
            return false;

        //Check en passant TODO
        //if going straight check if there is nothing
        if (endFile === this.file && endSquare === undefined)
            return true;

        if (endFile !== this.file && endSquare !== undefined)
            return true;

        //if going diagonaly check if there is a piece of the opposite color
        if ((endFile - this.file === -1 || endFile - this.file === 1) &&
            endSquare !== undefined && endSquare.color !== this.color)
            return true;

        //en passant -> pawn 4 or 5 rank and last move is a pawn move 2 squares
        let pawnEaten = game.board.board[this.rank][endFile]
        let lastMove = game.moves[game.moves.length - 1];
        if (this.color == 'white' && this.rank == 4 && Math.abs(endFile - this.file) === 1 && 
         pawnEaten !== undefined && pawnEaten instanceof Pawn &&
         lastMove[0] === `${indexToChessNotation(6, endFile)}` &&
         lastMove[1] === `${indexToChessNotation(4, endFile)}`)
            return true;
        if (this.color == 'black' && this.rank == 3 && Math.abs(endFile - this.file) === 1 &&
         pawnEaten !== undefined instanceof Pawn &&
         lastMove[0] === `${indexToChessNotation(1, endFile)}` &&
         lastMove[1] === `${indexToChessNotation(3, endFile)}`)
            return true;

        return false;

    }
    enPassant(rank, file, game){
        let pawnEaten = game.board.board[this.rank][file]
        let lastMove = game.moves[game.moves.length - 1];
        if (this.color == 'white' && this.rank == 4 &&  rank === 5 && Math.abs(file - this.file) === 1 && 
         pawnEaten !== undefined && pawnEaten instanceof Pawn &&
         lastMove[0] === `${indexToChessNotation(6, file)}` &&
         lastMove[1] === `${indexToChessNotation(4, file)}`)
            return true;
        if (this.color == 'black' && this.rank == 3 && rank === 2 && Math.abs(endFile - this.file) === 1 &&
         pawnEaten !== undefined instanceof Pawn &&
         lastMove[0] === `${indexToChessNotation(1, file)}` &&
         lastMove[1] === `${indexToChessNotation(3, file)}`)
            return true;

        return false;
    }
    canCapture(endRank, endFile, board) {

        let goingUpward = 1;
        if (this.color == 'black')
            goingUpward = -1;

        if (this.rank + goingUpward !== endRank)
            return false;

        if (this.file - 1 === endFile || this.file + 1 === endFile)
            return true;

        return false;
    }
}


