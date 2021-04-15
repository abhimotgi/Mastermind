import React from 'react';
import Tile from './Tile'


function MainButton(props) {
    return (
        <button disabled={props.disabled} className={props.className} onClick={props.onClick}>
            <div>
                {props.value}
            </div>
        </button>
    );
}

function DisplayMessage(props) {
    return (
        <div className={props.className}>
            {props.value}
        </div>
    );
}

const colors = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5']
const evalColors = {
    rcrp: 'c6',
    rcwp: 'c7'
}

class Game extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            board: Array(props.rows * props.cols).fill(null),
            evals: Array(props.rows * props.cols).fill(null),
            solution: this.generateSolution(),
            guessRow: Array(props.cols).fill(null),
            currentRow: 0,
            selectedColor: 0,
            dialog: {
                message: null,
                messageState: 'dialog'
            }
        }
    }

    generateSolution = () => {
        var solution = Array(this.props.cols).fill(null)
        for (var i = 0; i < solution.length; i++) {
            solution[i] = colors[Math.floor(Math.random() * colors.length)]
        }
        return solution
    }

    renderTile(i, active) {
        return (
            <Tile value={this.state.board[i]} active={active} className="tile board"></Tile>
        );
    }

    renderGuessRow = () => {
        var tiles = []
        for (let i = 0; i < this.state.guessRow.length; i++) {
            tiles.push(<Tile className="tile guess" value={this.state.guessRow[i]} onClick={() => this.guessTileClicked(i)}></Tile>)
        }
        return <div className="row board">{tiles}</div>
    }

    renderBoard = () => {
        var tiles = []
        var row = []

        var startCell = this.state.currentRow
        var endCell = startCell + this.props.cols

        for (let i = 0; i < this.state.board.length; i++) {
            if (i >= startCell && i < endCell) {
                row.push(this.renderTile(i, "active"))
            } else {
                row.push(this.renderTile(i, "inactive"))
            }
            if ((i + 1) % this.props.cols === 0) {
                tiles.push(<div className="row board">{row}</div>)
                row = []
            }
        }
        return tiles
    }

    renderEvalTiles = () => {
        var tiles = []
        var row = []
        for (let i = 0; i < this.state.evals.length; i++) {
            row.push(<Tile className="tile eval" value={this.state.evals[i]}></Tile>)
            if ((i + 1) * 2 % this.props.cols === 0) {
                tiles.push(<div className="row eval">{row}</div>)
                row = []
            }
        }
        return tiles
    }

    colorSelected = (i) => {
        this.setState({
            selectedColor: i
        })
    }

    renderColorSelect = () => {

        var tiles = []

        for (let i = 0; i < colors.length; i++) {
            let css = (i === this.state.selectedColor) ? "tile color active" : "tile color inactive"
            tiles.push(<Tile className={css} value={colors[i]} onClick={() => this.colorSelected(i)}></Tile>)
        }

        return tiles
    }

    nextTurn = () => {
        var newActiveRow = parseInt(this.state.currentRow) + parseInt(this.props.cols)
        if (newActiveRow <= this.state.board.length) {
            return newActiveRow
        }
    }

    evaluateMove = () => {
        var myGuess = this.state.guessRow.slice()
        /* Determine how many tiles are the right color & wrong place OR right color & right place */
        var rightColorRightPlace = 0

        var solnCopy = []
        var guessCopy = []

        for (let i = 0; i < myGuess.length; i++) {
            if (myGuess[i] === this.state.solution[i]) {
                rightColorRightPlace++
            } else {
                solnCopy.push(this.state.solution[i])
                guessCopy.push(myGuess[i])
            }
        }

        var rightColorWrongPlace = 0

        for (let i = 0; i < guessCopy.length; i++) {
            if (solnCopy.includes(guessCopy[i])) {
                rightColorWrongPlace++;

                // remove from soln array so doesn't get same element twice
                var index = solnCopy.indexOf(guessCopy[i]);
                if (index !== -1) {
                    solnCopy.splice(index, 1);
                }
            }

        }

        var newEval = this.state.evals.slice()
        for (let i = 0; i < rightColorRightPlace; i++) {
            newEval[i + this.state.currentRow] = evalColors['rcrp']
        }
        for (let i = 0; i < rightColorWrongPlace; i++) {
            newEval[i + this.state.currentRow + rightColorRightPlace] = evalColors['rcwp']
        }

        return newEval
    }

    submitMove = () => {

        var myGuess = this.state.guessRow.slice()
        var newBoard = this.state.board.slice()

        // Check that myGuess does not contain null fieldd
        var guessIsValid = !myGuess.includes(null)


        if (guessIsValid) {

            // set the last row to the guess
            for (let i = 0; i < this.props.cols; i++) {
                newBoard[i + this.state.currentRow] = myGuess[i]
            }

            // populate the evaluations
            let newEval = this.evaluateMove()
            let newActiveRow = this.nextTurn()
            
            // compute game status with new board state
            let gameStatus = this.getGameStatus(newBoard, newEval, this.state.currentRow)

            // update the board and message
            this.setState({
                board: newBoard,
                evals: newEval,
                currentRow: newActiveRow,
                dialog: gameStatus
            })


        } else {
            this.setState({
                dialog: {
                    message: 'Guess is incomplete',
                    messageState: 'dialog alert'
                }
            })
        }
    }

    clearDialog = () => {
        this.setState({
            dialog: {
                message: null,
                messageState: 'dialog'
            }
        })
    }

    guessTileClicked = (i) => {
        var newRow = this.state.guessRow.slice()
        newRow[i] = colors[this.state.selectedColor]
        this.setState({
            guessRow: newRow
        })
    }

    resetGame = () => {
        this.setState({
            board: Array(this.props.rows * this.props.cols).fill(null),
            evals: Array(this.props.rows * this.props.cols).fill(null),
            guessRow: Array(this.props.cols).fill(null),
            solution: this.generateSolution(),
            currentRow: 0,
            color: null,
            dialog: {
                message: null,
                messageState: 'dialog'
            }
        })
    }

    getGameStatus = (board, evals, currentRow) => {
        // check if last row evaluations are right color, right place
        let lastRow = evals.slice(currentRow, currentRow + this.props.cols)

        // If last row is all 'right color right place' then the user won
        if (JSON.stringify(lastRow) === JSON.stringify((Array(this.props.cols).fill(evalColors['rcrp'])))) {
            return {
                message: 'You won!',
                messageState: 'dialog won'
            }
        }
        else if (currentRow + this.props.cols === board.length) {
            return {
                message: 'You lost...',
                messageState: 'dialog lost'
            }
        } else {
            return {
                message: '',
                messageState: 'dialog'

            }
        }
    }


    getTurnNumber = () => {
        for (let i = 0; i < this.props.rows; i++) {
            if (this.state.board[i * this.props.cols] === null) {
                return i;
            }
        }
        return -1;
    }

    clearGuess = () => {
        this.setState({
            guessRow: Array(this.props.cols).fill(null)
        })
    }

    render() {

        const wonOrLost = this.state.dialog.messageState.includes('won') || this.state.dialog.messageState.includes('lost')

        return (
            <div class="container">
                <DisplayMessage className={this.state.dialog.messageState} value={this.state.dialog.message}></DisplayMessage>
                <div className="game-container board">
                    <div className="board">
                        {this.renderBoard()}
                    </div>
                    <div className="evals">
                        {this.renderEvalTiles()}
                    </div>
                </div>


                <div className="game-container guess">
                    {this.renderGuessRow()}
                    <MainButton value={"x"} className="button clear-guess" onClick={this.clearGuess}></MainButton>
                </div>
                <div className="game-container colors">
                    {this.renderColorSelect()}
                </div>
                <div className="game-container buttons">
                    <MainButton onClick={this.submitMove} value="Guess" className="button guess" disabled={wonOrLost ? "disabled" : ""}></MainButton>
                    <MainButton onClick={this.resetGame} value="New Game" className="button new-game" disabled=""></MainButton>
                </div>
            </div>
        );
    }

}

export default Game;
