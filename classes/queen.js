class Queen extends Piece{
    constructor(color, rank, file) {
        super(color, rank, file);
        this.symbol = "";
        if (color === "white")
            this.symbol = "♕";

        else
            this.symbol = "♛";
    }
    canMove(endRank, endFile, game) {
        //Check if end is on the same rank or file or diagonal but not same square
        if ((endRank !== this.rank && endFile !== this.file && Math.abs(endRank - this.rank) != Math.abs(endFile - this.file))
            || (endRank === this.rank && endFile === this.file))
            return false;

        let x = this.rank;
        let y = this.file;
        let endx = endRank;
        let endy = endFile;

        if (endRank === this.rank) {
            if (y > endy) {
                y = endFile;
                endy = this.file;
            }
            y++;
            while (y < endy) {
                if (game.board.board[x][y] != undefined)
                    return false;
                y++;
            }
        }
        else if (endFile === this.file) {
            if (x > endx) {
                x = endRank;
                endx = this.rank;
            }
            x++;
            while (x < endx) {
                if (game.board.board[x][y] !== undefined)
                    return false;
                x++;
            }
        }

        else {
            if ((this.rank > endRank && this.file > endFile) || (this.rank < endRank && this.file > endFile)) {
                x = endRank;
                y = endFile;
                endx = this.rank;
                endy = this.file;
            }
            //console.log("x: " + x + "y: " + y + "endx: " + endx + 'endy:' + endy);
            if (x < endx && y < endy) {
                x++;
                y++;
                while (x < endx) {
                    if (game.board.board[x][y] !== undefined)
                        return false;
                    x++;
                    y++;
                }
            }
            else if (x > endx && y < endy) {
                x--;
                y++;
                while (x > endx) {
                    if (game.board.board[x][y] !== undefined)
                        return false;
                    x--;
                    y++;
                }
            }
        }

        if (game.board.board[endRank][endFile] !== undefined &&
             game.board.board[endRank][endFile].color === this.color)
            return false;

        return true;

    }
}

