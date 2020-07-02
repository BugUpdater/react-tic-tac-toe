import React from 'react';
import ReactDOM from 'react-dom'
import './index.css';

function Square(props) {
  return (
    <button className="square" style={{
        color: props.lineItem ? 'orange': '#000',
        backgroundColor: props.nextStep ? 'lightyellow' : '#fff',
      }}
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    const {
      squares,
      row,
      col,
      line,
    } = this.props.data;
    const lineItem = line.includes(i);
    // nextStep提示原本下一步的位置
    const nextStep = i === (row - 1) * 3 + col - 1;
    return (
      <Square key={i}
        value={squares[i]}
        lineItem={lineItem}
        nextStep={nextStep}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        {/* <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div> */}
        {Array(3).fill(null).map((n, i) => (
          <div className="board-row" key={i}>
            {Array(3).fill(null).map((n, j) => {
              return this.renderSquare(i * 3 + j);
            })}
          </div>
        ))}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        // 下一步放置的坐标：行号和列号
        row: null,
        col: null,
        // 胜利时连线的索引
        line: [],
      }],
      stepNumber: 0,
      xIsNext: true,
      inc: true, // 升序
    };
  }

  getNextChar() {
    return this.state.xIsNext ? 'X' : 'O';
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(current) || squares[i]) {
      return;
    }

    // 增加每一步坐标记录
    current.row = Math.floor(i / 3) + 1;
    current.col = i % 3 + 1;

    squares[i] = this.getNextChar();
    this.setState({
      history: history.concat([{
        squares: squares,
        row: null,
        col: null,
        line: [],
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  getMoves(history, inc, stepNumber) {
    const moves = history.map((step, move) => {
      const desc = move ? `Go to move #${move}` : 'Go to game start';
      // 用坐标组合唯一key值
      const uniqKey = `${step.row || 0}_${step.col || 0}`;
      // 放置的坐标
      const place = step.row ? `(${step.row}, ${step.col})` : '';
      return (
        <li key={uniqKey} style={{backgroundColor: move === stepNumber ? 'bisque' : '#fff'}}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>{place}
        </li>
      );
    });

    // 如果不是升序，翻转一下再渲染
    if (!inc) {
      moves.reverse();
    }
    return moves;
  }

  getStatus(winner, stepNumber) {
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (stepNumber === 3 * 3) {
      status = 'no one wins';
    } else {
      status = 'Next player: ' + this.getNextChar();
    }
    return status;
  }

  render() {
    const { history, stepNumber,inc } = this.state;
    const current = history[stepNumber];
    const winner = calculateWinner(current);

    const moves = this.getMoves(history, inc, stepNumber);
    const status = this.getStatus(winner, stepNumber);

    return (
      <div className="game">
        <div className="game-board">
          <Board
            data={current}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className="order-btn">
            <button onClick={() => this.setState({inc: !inc})}>
              {inc ? '升序' : '降序'}
            </button>
          </div>
          <ul>{moves}</ul>
        </div>
      </div>
    );
  }
}

function calculateWinner(current) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  const squares = current.squares;
  current.line = [];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // 保存胜利时连线的位置
      current.line = lines[i];
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
