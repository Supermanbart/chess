class Board {
    constructor() {
        const board = [];
        let row = [];
        board.push(row);
        row.push(new Rook('white', 0, 0, true));
        row.push(new Knight('white', 0, 1));
        row.push(new Bishop('white', 0, 2));
        row.push(new Queen('white', 0, 3));
        row.push(new King('white', 0, 4));
        row.push(new Bishop('white', 0, 5));
        row.push(new Knight('white', 0, 6));
        row.push(new Rook('white', 0, 7, true));
        row = [];
        board.push(row);
        for (let i = 0; i < 8; i++) {
            row.push(new Pawn("white", 1, i));
        }
        for (let i = 0; i < 4; i++) {
            row = [, , , , , , , ,];
            board.push(row);
        }
        row = [];
        board.push(row);
        for (let i = 0; i < 8; i++) {
            row.push(new Pawn("black", 6, i));
        }
        row = [];
        board.push(row);
        row.push(new Rook('black', 7, 0, true));
        row.push(new Knight('black', 7, 1));
        row.push(new Bishop('black', 7, 2));
        row.push(new Queen('black', 7, 3));
        row.push(new King('black', 7, 4));
        row.push(new Bishop('black', 7, 5));
        row.push(new Knight('black', 7, 6));
        row.push(new Rook('black', 7, 7, true));

        this.board = board;
    }
    printBoard() {
        for (let i = 0; i < 8; i++) {
            let line = "";
            for (let j = 0; j < 8; j++) {
                if (this.board[7 - i][j] == undefined) {
                    if ((i + j) % 2 === 0)
                        line += "□ ";

                    else
                        line += "■ ";
                }

                else
                    line += this.board[7 - i][j].symbol + "";
            }
            console.log(line);
        }
    }
    squareColor(rank, file)
    {
        return ((rank + file) % 2 === 0 ? 'black' : 'white');
    }
}