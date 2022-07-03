// player factory function
const Player = (sign) => {
    this.sign = sign;
    const getSign = () => sign;
    return { getSign };
}

// board module
const gameBoard = (() => {
    const board = ['', '', '', '', '', '', '', '', ''];

    const setSquare = (index, sign) => {
        if (index > board.length) return;
        board[index] = sign;
    }

    const getSquare = (index) => {
        if (index > board.length) return;
        return board[index];
    }

    const resetGame = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
    }

    return { setSquare, getSquare, resetGame};
})();

// controller module
const gameController = (() => {
    const playerX = Player('X');
    const playerO = Player('O');
    let round = 1;
    let isGameOver = false;

    const playRound = (squareIndex) => {
        gameBoard.setSquare(squareIndex, getCurrentPlayerSign());
        if (checkWinner(squareIndex)) {
            displayController.setResultMessage(getCurrentPlayerSign());
            isGameOver = true;
            return;
        }
        if (round === 9) {
            displayController.setResultMessage('Draw');
            isGameOver = true;
            return;
        }
        round++;
        displayController.setDisplayGameStatus(`Player ${getCurrentPlayerSign()}'s turn.`);
    }

    // double check this works properly
    const getCurrentPlayerSign = () => {
        if (round % 2 === 1) return playerX.getSign();
        else return playerO.getSign();
    }

    const checkWinner = (squareIndex) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        
        return winConditions.filter((combination) => combination.includes(squareIndex))
            .some((possibleCombination) => possibleCombination.every(
                (index) => gameBoard.getSquare(index) === getCurrentPlayerSign()
            ));
    }

    const getIsGameOver = () => {
        return isGameOver;
    }

    const resetGame = () => {
        round = 1;
        isGameOver = false;
    }

    return { playRound, getIsGameOver, resetGame };
})();

// display controller
const displayController = (() => {
    const squares = document.querySelectorAll('.square');
    const displayGameStatus = document.querySelector('.display-game-status');
    const resetGameButton = document.querySelector('.restart');

    squares.forEach(square => {
        square.addEventListener('click', (e) => {
            if (gameController.getIsGameOver() || e.target.textContent !== '') return;
            // update html to use data set attribute
            gameController.playRound(parseInt(e.target.dataset.index));
            updateGameBoard();
        })
    })

    resetGameButton.addEventListener('click', () => {
        gameBoard.resetGame();
        gameController.resetGame();
        updateGameBoard();
        setDisplayGameStatus(`Player X's Turn`);
    })

    // double check this works properly (vs. standard for loop)
    const updateGameBoard = () => {
        squares.forEach((square, index) => {
            squares[index].textContent = gameBoard.getSquare(index);
        })
    }

    const setResultMessage = (winner) => {
        if (winner === 'Draw') {
            setDisplayGameStatus('Draw!');
        } else {
            setDisplayGameStatus(`Player ${winner} has won!`);
        }
    }

    const setDisplayGameStatus = (message) => {
        displayGameStatus.textContent = message;
    }

    return { setResultMessage, setDisplayGameStatus }
})();;

