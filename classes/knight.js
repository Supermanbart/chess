class Knight extends Piece{
    constructor(color, rank, file) {
        super(color, rank, file);
        this.symbol = "";
        if (color === "white")
            this.symbol = "♘";

        else
            this.symbol = "♞";
    }
    canMove(endRank, endFile, game) {
        if (game.board.board[endRank][endFile] !== undefined &&
             game.board.board[endRank][endFile].color === this.color)
            return false;

        const absDiffRank = Math.abs(endRank - this.rank);
        const absDiffFile = Math.abs(endFile - this.file);

        if ((absDiffFile === 1 && absDiffRank === 2) || (absDiffFile === 2 && absDiffRank === 1))
            return true;

        return false;
    }
}

