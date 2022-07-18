import { useState, useEffect } from 'react';
import './App.css';

const cleanBoard = Array(9).fill('');
const player1 = 'x';
const player2 = 'o';

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const ClickableBlock = ({ id, value, onClick }) => {
  return (
    <button id={id} className='board-button' onClick={onClick} disabled={value}>
      {value}
    </button>
  );
}

const TotalScore = ({ score }) => {
  return <div className='score-counter'>Score: {`player ${player1}: ${score[player1]} | player ${player2}: ${score[player2]}`}</div>
}

const ResetGameButton = ({ onClick, label = 'Restart Game' }) => (
  <button className='button' onClick={onClick}>{label}</button>
)

const WinnerOverlay = ({ winnerPlayer, onResetGameClick }) => (
  <div className='winner-overlay'>
    <div className='white-wrapper'>
      <h3>We have a winner!</h3>
      <h2>{winnerPlayer}</h2>
      <ResetGameButton onClick={onResetGameClick} />
    </div>
  </div>
)


function App() {
  const [scoreCount, setScoreCount] = useState({ [player1]: 0, [player2]: 0 });
  const [turn, setTurn] = useState(player1);
  const [board, setBoard] = useState(cleanBoard);
  const [winnerPlayer, setWinnerPlayer] = useState(null);

  function toggleTurn() {
    setTurn(turn === player1 ? player2 : player1);
  }

  function onResetGameClick() {
    if (winnerPlayer) {
      const modifiedScore = { ...scoreCount }
      modifiedScore[winnerPlayer] += 1;
      setScoreCount(modifiedScore)
    }
    setBoard(cleanBoard);
  }

  const onBlockClick = ({ target }) => {
    const boardCopy = [...board];

    boardCopy[target.id] = turn;
    setBoard(boardCopy);
  }

  function checkWinner() {
    let winner = null;
    winningCombos.forEach((combo) => {
      if (board[combo[0]] && (board[combo[0]] === board[combo[1]] && board[combo[0]] === board[combo[2]])) {
        winner = board[combo[0]];
      }
    });

    winner ? setWinnerPlayer(winner) : toggleTurn();
  };

  useEffect(() => {
    if (board !== cleanBoard) {
      checkWinner();
    } else {
      setWinnerPlayer(null);
      setTurn(player1);
    }
  }, [board]); // eslint-disable-line

  return (
    <>
      {winnerPlayer && <WinnerOverlay onResetGameClick={onResetGameClick} winnerPlayer={winnerPlayer} />}
      <div className='main-wrapper'>
        <h3>Tic Tac Toe React!</h3>
        <div>
          <TotalScore score={scoreCount} />
          <p>It's player {turn} turn!</p>
        </div>
        <div className='grid-container'>
          {
            board.map((block, index) => <ClickableBlock key={index} id={index} value={block} onClick={onBlockClick} />)
          }
        </div>
        <ResetGameButton onClick={onResetGameClick} />
      </div>
    </>
  );
}

export default App;
