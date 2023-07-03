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
    castle(endRank, endFile, game)
    {
        let rook = (endFile === 2 ? game.board.board[endRank][0] : game.board.board[endRank][7]);
        if (endFile === 2)
        {
            rook.move(endRank, 3, game.board);
            this.move(endRank, endFile, game.board);
        }
        else if (endFile === 6)
        {
            rook.move(endRank, 5, game.board);
            this.move(endRank, endFile, game.board);
        }
        rook.canCastle = false;
        this.canCastle = false;
    }
    canCastlefunct(endRank, endFile, game) {
        if (!this.canCastle || (endFile !== 6 && endFile !== 2) || endRank !== this.rank ||
         this.isChecked(game))
            return false;

        let board = game.board.board;
        let rookLeft = board[0][0];
        let rookRight = board[0][7];
        if (this.color === "black") {
            rookLeft = board[7][0];
            rookRight = board[7][7];
        }

        if (endFile === 2 && rookLeft !== undefined && rookLeft.canCastle &&
            board[this.rank][this.file - 1] === undefined &&
            board[this.rank][this.file - 2] === undefined &&
            board[this.rank][this.file - 3] === undefined) 
        {
            this.move(this.rank, this.file - 1, game.board)
            {
                if (this.isChecked(game))
                {
                    this.move(this.rank, this.file + 1, game.board)
                    return false;
                }
            }
            this.move(this.rank, this.file - 1, game.board)
            {
                if (this.isChecked(game))
                {
                    this.move(this.rank, this.file + 2, game.board)
                    return false
                }
            }
            this.move(this.rank, this.file + 2, game.board);
            return true;
        }

        if (endFile === 6 && rookRight !== undefined && rookRight.canCastle &&
            board[this.rank][this.file + 1] === undefined &&
            board[this.rank][this.file + 2] === undefined) 
        {
            this.move(this.rank, this.file + 1, game.board)
            if (this.isChecked(game))
            {
                this.move(this.rank, this.file - 1, game.board);
                return false;
            }
            this.move(this.rank, this.file + 1, game.board);
            if (this.isChecked(game))
            {
                this.move(this.rank, this.file - 2, game.board);
                return false;
            }
            this.move(this.rank, this.file - 2, game.board);
            return true;
        }

        return false;
    }
    canMove(endRank, endFile, game) {
        if (this.canCastlefunct(endRank, endFile, game))
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
                        //console.log(this.rank + i, this.file + j)
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
                        ally.move(i, j, game.board);
                        if (endPiece !== undefined)
                            removePiece(endPiece);
                        let res = this.isChecked(game);
                        ally.move(startRank, startFile, game.board);
                        if (endPiece !== undefined)
                        {
                            endPiece.move(endRank, endFile, game.board);
                            addPiece(endPiece);
                        }
                        if (!res)
                            return false;
                    }
                }
            }
        }
        return true;
    }
}



