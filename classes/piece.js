class Piece {
    constructor(color, rank, file) {
        this.color = color;
        this.rank = rank;
        this.file = file;
        this.symbol = "i ";
        this.canCastle = false;
    }
    move(endRank, endFile, board) {
        board.board[this.rank][this.file] = undefined;
        board.board[endRank][endFile] = this;

        this.rank = endRank;
        this.file = endFile;
    }
}