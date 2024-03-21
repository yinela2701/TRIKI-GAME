import React, { useState } from "react"
import confetti from "canvas-confetti" 

import { Square } from "./components/Square.jsx"
import { TURNS} from "./constants.js"
import { checkWinnerFrom, checkEndGame } from "./logic/board.js"
import { WinnerModal } from "./components/WinnerModal.jsx"
import { saveGameToStorage, resetGameStorage } from "./logic/storage/index.js"
 
function App() {

  // Estado para actualizar el tablero
  const [board, setBoard] = useState(()=> {
    // incializar el estado dependiendo si hay o no partida guardada
    const boardFromStorage = window.localStorage.getItem('board')
    if(boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  }) 

  // Estado para actualizar el turno 
  const [turn,setTurn] = useState(() =>{
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  }) //Inicia el turno el la X, retorna el estado del turno (turn) y la actualización de ese estado (setTurn)

  //Estado para conocer ganador 
  const [winner, setWinner] = useState(null)  // null no hay ganado, false hay un empate

  const resetGame = () =>{
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()
  }

  //función para actualizar estados, cambiar turnos, ver ganador
  const updateBoard =(index) =>{

    //El indice no se actualiza si ya tiene algo 
    if(board[index] || winner) return

    // actualiza el tablero
    const newBoard = [... board] //Los estados son inmutables por lo tanto se crea un nuevo array con el valor nuevo (spread y rest operator)
    newBoard[index] = turn // x u o 
    setBoard(newBoard)

    // actualiza el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    saveGameToStorage({board: newBoard, turn:newTurn})

    //revisar si hay ganador 
    const newWinner = checkWinnerFrom(newBoard)
    if(newWinner){
      confetti()
      setWinner(newWinner)
    } // revisar si el juego terminó sin ganador 
    else if (checkEndGame(newBoard))
    {
      setWinner(false) //empate
    }
  }

  return (
    <main className="board">
      <h1> TRIKI GAME </h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        {
          board.map((square,index) => {
            return (
              <Square
                key={index} // En este caso los indices del tablero serán únicos por eso se utilizan como llaves
                index = {index} // Propiedad del index del Square
                updateBoard={updateBoard} //pasar la función y no su ejecución (esto permite ejecutar la función dentro del square)
              >
                {square} 
                
              </Square>
            )
          })
        }
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>
      
      <WinnerModal resetGame={resetGame} winner={winner}/>

    </main>
    
  )
}

export default App
