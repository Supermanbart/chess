class King extends Piece{
    constructor(color, rank, file) {
        super(color, rank, file);
        this.symbol = "";
        if (color === "white")
            this.symbol = "♔";

        else
            this.symbol = "♚";

        this.canCastle = true;
    }
    castle(endRank, endFile, board) {
        if (!this.canCastle || (endFile !== 6 && endFile !== 2) || endRank !== this.rank)
            return false;

        let rookLeft = board.board[0][0];
        let rookRight = board.board[0][7];
        if (this.color === "black") {
            rookLeft = board.board[7][0];
            rookRight = board.board[7][7];
        }

        if (endFile === 2 && rookLeft !== undefined && rookLeft.canCastle &&
            board.board[this.rank][this.file - 1] === undefined &&
            board.board[this.rank][this.file - 2] === undefined &&
            board.board[this.rank][this.file - 3] === undefined) {
            rookLeft.move(this.rank, rookLeft.file + 3, board);
            return true;
        }

        if (endFile === 6 && rookRight !== undefined && rookRight.canCastle &&
            board.board[this.rank][this.file + 1] === undefined &&
            board.board[this.rank][this.file + 2] === undefined) {
            rookRight.move(this.rank, rookRight.file - 2, board);
            return true;
        }

        console.log("Hey");
        return false;
    }
    canMove(endRank, endFile, game) {
        if (this.castle(endRank, endFile, game.board))
            return true;

        //Check moveset of king : move only 1 square
        let diffRank = Math.abs(endRank - this.rank);
        let diffFile = Math.abs(endFile - this.file);
        if ((diffRank !== 0 && diffRank !== 1) || (diffFile !== 0 && diffFile !== 1) ||
            (diffFile === 0 && diffRank === 0))
            return false;

        let endPiece = game.board.board[endRank][endFile];
        if (endPiece !== undefined && endPiece.color === this.color)
            return false;

        let rank = this.rank;
        let file = this.file;
        this.move(endRank, endFile, game.board);
        let res = this.isChecked(game)
        this.move(rank, file, game.board);
        if (endPiece !== undefined)
            endPiece.move(endRank, endFile, game.board);

        return !res;
    }
    isChecked(game) {
        let ennemy = game.blackPieces;
        if (this.color === 'black')
            ennemy = game.whitePieces;

        for (let piece of ennemy)
        {
            if (piece instanceof Pawn)
            {
             if (piece.canCapture(this.rank, this.file, game.board))
                return true;
            }
            else if (piece.canMove(this.rank, this.file, game))
                return true;
        }
        return false;
    }
    isCheckMated(game){
        let allies = game.whitePieces;
        if (this.color === 'black')
        {
            allies = game.blackPieces;
        }
        for (let i = -1; i <= 1; i++)
        {
            for (let j = -1; j <= 1; j++)
                {
                    if (this.rank + i < 0 || this.rank + i > 7 || this.file + j < 0 || this.file + j > 7)
                        continue;
                    
                    if (this.canMove(this.rank + i, this.file + j, game))
                    {
                        console.log(this.rank + i, this.file + j)
                        return false;
                    }
                }
        }

        for (let ally of allies)
        {
            if (ally instanceof King)
                continue;
            for (let i = 0; i < 8; i++)
            {
                for (let j = 0; j < 8; j++)
                {
                    if (ally.canMove(i, j, game))
                    {
                        let startRank = ally.rank;
                        let startFile = ally.file;
                        let endRank = i;
                        let endFile = j;
                        let endPiece = game.board.board[i][j];
                        ally.move(i, j, game.board)
                        let res = this.isChecked(game);
                        ally.move(startRank, startFile, game.board);
                        if (endPiece !== undefined)
                            endPiece.move(endRank, endFile, game.board);
                        if (!res)
                            return false;
                    }
                }
            }
        }
        return true;
    }
}



