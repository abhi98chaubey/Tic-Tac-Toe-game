import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// this is function for tell about status of game
function getGameStatus(squares) {
  // this array store all wining combination for same type like -> "X" or "O" fill in sqaure cube

  let winCombs = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winCombs.length; i++) {
    //take one row of winning combination array
    let winComb = winCombs[i];
    // take element of those row which is selected
    let s1 = winComb[0];
    let s2 = winComb[1];
    let s3 = winComb[2];

    // condision for win
    if (
      squares[s1] != null &&
      squares[s1] === squares[s2] &&
      squares[s2] === squares[s3]
    ) {
      return squares[s1];
    }
  }

  // if not win then null
  return null;
}

class Board extends React.Component {
  // when click on square of box then impliment fuction of parent class click handle
  handleBoxClick(i) {
    this.props.handlerForBoxClick(i);
  }
// this function make for button impiment on webpage---> square box in game as HTML
  renderSquare(i) {
    return (
      <button onClick={() => this.handleBoxClick(i)}>
        {/* boxes array at that option null --> empty --if not null then --> value of that element  */}
        {this.props.boxes[i] == null ? "" : this.props.boxes[i]}
      </button>
    );
  }
  render() {
    return (
      <div className="board">
        <div className="title">Tic Tac Toe</div>
        <div className="content">
          <div className="ttt">
            <div className="row">
             
              {/* 3 buttons impliment for click */}
              {this.renderSquare(0)} 
              {this.renderSquare(1)}
              {this.renderSquare(2)}
            </div>
            <div className="row">

              {/* 3 buttons impliment for click */}
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
            </div>
            <div className="row">

              {/* 3 buttons impliment for click */}
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
              
            </div>
          </div>
        </div>
      </div>
    );
  }
}


// this class make for show states of game and steps which are click previously 
class Display extends React.Component {
  moveHistory(i) {
    this.props.handlerForHistory(i);
  }

  render() {
   // this is for give title of desplay status--> win or loss or whose term to click-----------------
    let gameTitle;
// game status --> null
    if (this.props.gameStatus == null) {
      gameTitle =
        "Next move for " + (this.props.stepNumber % 2 === 0 ? "X" : "O");
    } 
    // if status of game is draw or win then title of display
    else {
      if (this.props.gameStatus === "draw") {
        gameTitle = "It's a draw";
      } else {
        gameTitle = this.props.gameStatus + " wins";
      }
    }
//----------------------------------------------------------------------------------------------
    
// array make for store in history of step click ---> as button so that we can click on step and can return on that step
let buttons = [];
    for (let i = 0; i <= this.props.stepNumber; i++) {
      let button;

      if (i === 0) {
        button = (
          <button key={i} onClick={() => this.moveHistory(i)}>
            Go to start
          </button>
        );
      } else {
        button = (
          <button key={i} onClick={() => this.moveHistory(i)}>
            Go to step number {i}
          </button>
        );
      }

      buttons.push(button);
    }

    return (
      <div className="display">
        <div className="title">{gameTitle}</div>
        <div className="content">
          <div className="history">{buttons}</div>
        </div>
      </div>
    );
  }
}


// main class for update all classes through this App class------

class App extends React.Component {


  // constructor make for give starting state to game--
  constructor(props) {
    super(props);

    // this is make 2d array for store box event--------- store --> 9box-value,,,stepnumber->at starting 0,,gamestatus also store
    // prevoisly give all box(9 boxs) of game is null value----
    this.state = {
      history: [[null, null, null, null, null, null, null, null, null]],
      stepNumber: 0,
      gameStatus: null,
    };
  }


  // this function make of -> when click on Square box in game
  handleSquareClick(i) {
    // for take all privious history
    let oldHistory = this.state.history.slice();
    // for take last move of histry---> last row of 2d matrix
    let currentSquares = oldHistory[oldHistory.length - 1].slice();
    // for handle if previosly clicke square again click then nothing happen
    if (currentSquares[i] != null || this.state.gameStatus != null) {
      return;
    }
    // if even turms to click then ->"X" and for odd term -> "O"
    currentSquares[i] = this.state.stepNumber % 2 === 0 ? "X" : "O";
    // for add this click event in 2d matrix-----------
    oldHistory.push(currentSquares);

    //for give staus " draw" if game is draw-> if all square box clicked and still no one win or at last stutas of game is null
    let newGameStatus = getGameStatus(currentSquares);
    if (this.state.stepNumber === 8 && newGameStatus == null) {
      newGameStatus = "darw";
    }
    // update this status on previous state
    this.setState({
      history: oldHistory,
      stepNumber: this.state.stepNumber + 1,
      gameStatus: newGameStatus,
    });
  }

  
  // function for record moves for display in set history
  moveToStep(i) {
    // take copy of array of state
    let oldHistory = this.state.history.slice(0, i + 1);
    // take copy last row array of state
    let currentSquares = oldHistory[oldHistory.length - 1];
    // this is for take status of game --> win or loss
    let newGameStatus = getGameStatus(currentSquares);

    // update status of game wining or lossing in state array
    this.setState({
      history: oldHistory,
      stepNumber: i,
      gameStatus: newGameStatus,
    });
  }
  render() {
    // store state array in a variable for use 
    let squares = this.state.history[this.state.history.length - 1];
    // rende all class through this render
    return (
      <>
      {/* board class call */}
        <Board
          handlerForBoxClick={(i) => this.handleSquareClick(i)}
          boxes={squares}
        />
        {/* Display class call for excute */}
        <Display
          stepNumber={this.state.stepNumber}
          gameStatus={this.state.gameStatus}
          handlerForHistory={(i) => this.moveToStep(i)}
        />
      </>
    );
  }
}
ReactDOM.render(<App />, document.getElementById("root"));
