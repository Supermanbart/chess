class Bishop extends Piece{
    constructor(color, rank, file) {
        super(color, rank, file);
        this.symbol = "";
        if (color === "white")
            this.symbol = "♗";

        else
            this.symbol = "♝";
    }
    canMove(endRank, endFile, game) {
        // Check if end is on the same diago than bishop but not at the same point
        if ((Math.abs(endRank - this.rank) != Math.abs(endFile - this.file)) || (endRank === this.rank && endFile === this.file))
            return false;

        //Check if there are no pieces on the way from the piece to the end
        let x = this.rank;
        let y = this.file;
        let endx = endRank;
        let endy = endFile;
        if ((this.rank > endRank && this.file > endFile) || (this.rank < endRank && this.file > endFile)) {
            x = endRank;
            y = endFile;
            endx = this.rank;
            endy = this.file;

        }
        if (x < endx && y < endy) {
            x += 1;
            y += 1;
            while (x < endx) {
                if (game.board.board[x][y] !== undefined)
                    return false;
                x++;
                y++;
            }
        }

        if (x > endx && y < endy) {
            x -= 1;
            y += 1;
            while (x > endx) {
                //console.log(x, y)
                if (game.board.board[x][y] !== undefined)
                    return false;
                x--;
                y++;
            }
        }

        //Check if there are a piece on the end of the same color
        if (game.board.board[endRank][endFile] !== undefined &&
            game.board.board[endRank][endFile].color === this.color)
            return false;

        return true;
    }
}

