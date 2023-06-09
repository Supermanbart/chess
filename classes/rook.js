class Rook extends Piece{
    constructor(color, rank, file, canCastle=false) {
        super(color, rank, file);
        this.symbol = "";
        if (color === "white")
            this.symbol = "♖";

        else
            this.symbol = "♜";
        this.canCastle = canCastle;
    }
    canMove(endRank, endFile, game) {
        //Check if end is on same rank or file but not both
        if ((endRank !== this.rank && endFile !== this.file) || (endRank === this.rank && endFile === this.file))
            return false;

        //Check if there is nothing blocking the piece
        if (endRank === this.rank) {
            let x = this.file;
            let y = endFile;
            if (x > y) {
                x = endFile;
                y = this.file;
            }
            x += 1;
            while (x < y) {
                if (game.board.board[this.rank][x] !== undefined)
                    return false;
                x += 1;
            }
        }

        else {
            let x = this.rank;
            let y = endRank;
            if (x > y) {
                x = endRank;
                y = this.rank;
            }
            x += 1;
            while (x < y) {
                if (game.board.board[x][this.file] !== undefined)
                    return false;
                x += 1;
            }
        }
        // If there is piece at the end check it is the opposite color
        if (game.board.board[endRank][endFile] !== undefined &&
             game.board.board[endRank][endFile].color === this.color)
            return false;

        return true;
    }
}

