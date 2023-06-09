class Pawn extends Piece {
    constructor(color, rank, file) {
        super(color, rank, file);
        if (color === "white")
            this.symbol = "♙";

        else
            this.symbol = "♟";
    }
    canMove(endRank, endFile, game) {
        //Check if can move 2 spaces at the starting position
        if (this.color == 'white' && (endRank - this.rank === 2) && this.rank === 1 &&
            endFile === this.file && game.board.board[this.rank + 1][this.file] === undefined &&
            game.board.board[endRank][endFile] === undefined)
            return true;

        if (this.color == 'black' && (endRank - this.rank === -2) && this.rank === 6 &&
            endFile === this.file && game.board.board[this.rank - 1][this.file] === undefined &&
            game.board.board[endRank][endFile] === undefined)
            return true;

        //Check if pawn only move one square up or down
        if (Math.abs(endRank - this.rank) != 1)
            return false;

        //Check en passant TODO
        //if going straight check if there is nothing
        if (endFile === this.file && game.board.board[endRank][endFile] === undefined)
            return true;

        if (endFile !== this.file && game.board.board[endRank][endFile] !== undefined)
            return true;

        //if going diagonaly check if there is a piece of the opposite color
        if ((endFile - this.file === -1 || endFile - this.file === 1) &&
            game.board.board[endRank][endFile] !== undefined && game.board.board[endRank][endFile].color !== this.color)
            return true;

        //en passant

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


