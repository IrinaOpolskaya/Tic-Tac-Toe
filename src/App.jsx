import { useState } from 'react'
import './App.css'

function App() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const [isAscending, setIsAscending] = useState(true)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  function toggleSort() {
    setIsAscending(!isAscending)
  }

  function resetGame() {
    setHistory([Array(9).fill(null)])
    setCurrentMove(0)
    setIsAscending(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Крестики-нолики
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="lg:w-1/2 w-full flex justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
          </div>


          <div className="lg:w-1/2 w-full bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">История ходов</h2>
              <div className="space-x-2">
                <button
                  onClick={toggleSort}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200 font-medium"
                >
                  {isAscending ? '↓ Сначала новые' : '↑ Сначала старые'}
                </button>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                >
                  Новая игра
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              <Moves 
                history={history} 
                currentMove={currentMove}
                isAscending={isAscending}
                onJumpTo={jumpTo}
              />
            </div>

            {/* Статус игры */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <StatusMessage 
                xIsNext={xIsNext} 
                squares={currentSquares}
                onReset={resetGame}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


function Board({ xIsNext, squares, onPlay }) {
  const winnerInfo = calculateWinner(squares)
  const winner = winnerInfo ? winnerInfo.winner : null
  const winningLine = winnerInfo ? winnerInfo.line : []

  function handleClick(i) {
    if (winner || squares[i]) {
      return
    }
    const nextSquares = squares.slice()
    if (xIsNext) {
      nextSquares[i] = 'X'
    } else {
      nextSquares[i] = 'O'
    }
    onPlay(nextSquares)
  }

  const status = winner 
    ? `Победитель: ${winner}` 
    : squares.every(square => square) 
    ? 'Ничья!' 
    : `Следующий ход: ${xIsNext ? 'X' : 'O'}`

  return (
    <div>
      <div className="mb-6 text-center">
        <div className={`text-2xl font-bold p-4 rounded-xl ${
          winner ? 'bg-green-100 text-green-700' : 
          squares.every(square => square) ? 'bg-yellow-100 text-yellow-700' : 
          xIsNext ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {status}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 bg-gray-100 p-4 rounded-xl">
        {[0, 1, 2].map(row => (
          [0, 1, 2].map(col => {
            const index = row * 3 + col
            const isWinningSquare = winningLine.includes(index)
            
            return (
              <button
                key={index}
                className={`
                  w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32
                  bg-white rounded-xl shadow-lg
                  text-5xl font-bold
                  hover:shadow-xl transition-all duration-200
                  transform hover:scale-105
                  ${squares[index] === 'X' ? 'text-red-600' : ''}
                  ${squares[index] === 'O' ? 'text-green-600' : ''}
                  ${!squares[index] && 'hover:bg-gray-50'}
                  focus:outline-none focus:ring-4 focus:ring-purple-300
                  {/* ИЗМЕНЕНИЕ: Добавляем подсветку для выигрышных клеток */}
                  ${isWinningSquare ? 
                    squares[index] === 'X' 
                      ? 'bg-red-200 border-4 border-red-500 animate-pulse' 
                      : 'bg-green-200 border-4 border-green-500 animate-pulse' 
                    : ''
                  }
                `}
                onClick={() => handleClick(index)}
              >
                {squares[index]}
              </button>
            )
          })
        ))}
      </div>
    </div>
  )
}

function Moves({ history, currentMove, isAscending, onJumpTo }) {
  const moves = history.map((squares, move) => {
    const winnerInfo = move > 0 ? calculateWinner(squares) : null
    const hasWinner = winnerInfo !== null
    
    const description = move === 0 
      ? 'Начало игры' 
      : `Ход #${move} (${move % 2 === 0 ? 'O' : 'X'}) - ${move % 2 === 0 ? 'зеленый O' : 'красный X'}`
    
    const isCurrent = move === currentMove

    return (
      <li key={move} className="mb-2">
        <button
          className={`
            w-full text-left px-4 py-3 rounded-lg transition-all duration-200
            ${isCurrent 
              ? 'bg-purple-500 text-white font-bold shadow-md' 
              : hasWinner
                ? 'bg-yellow-100 hover:bg-yellow-200 text-gray-700 border-l-4 border-yellow-500'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }
          `}
          onClick={() => onJumpTo(move)}
        >
          <div className="flex items-center justify-between">
            <span>{description}</span>
            {isCurrent && (
              <span className="bg-white text-purple-600 px-2 py-1 rounded text-sm font-bold">
                Текущий
              </span>
            )}
            {hasWinner && !isCurrent && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm font-bold">
                Победа!
              </span>
            )}
          </div>
        </button>
      </li>
    )
  })

  const sortedMoves = isAscending ? moves : [...moves].reverse()

  return <ul className="space-y-2">{sortedMoves}</ul>
}

function StatusMessage({ xIsNext, squares, onReset }) {
  const winnerInfo = calculateWinner(squares)
  const winner = winnerInfo ? winnerInfo.winner : null
  const isDraw = !winner && squares.every(square => square)

  return (
    <div className="text-center">
      {winner && (
        <div className="mb-3">
          <span className={`text-2xl font-bold ${winner === 'X' ? 'text-red-600' : 'text-green-600'}`}>
            🎉 Победитель: {winner} 🎉
          </span>
        </div>
      )}
      {isDraw && (
        <div className="mb-3">
          <span className="text-2xl font-bold text-yellow-600">
             Ничья! 
          </span>
        </div>
      )}
      {!winner && !isDraw && (
        <div className="mb-3">
          <span className="text-xl text-gray-600">
            Сейчас ходит: 
            <span className={`ml-2 text-2xl font-bold ${
              xIsNext ? 'text-red-600' : 'text-green-600'
            }`}>
              {xIsNext ? 'X' : 'O'}
            </span>
          </span>
        </div>
      )}
      {(winner || isDraw) && (
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
        >
          Начать новую игру
        </button>
      )}
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], 
    [3, 4, 5],
    [6, 7, 8], 
    [0, 3, 6], 
    [1, 4, 7], 
    [2, 5, 8], 
    [0, 4, 8], 
    [2, 4, 6], 
  ]
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c]
      }
    }
  }
  return null
}

export default App