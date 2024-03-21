import { WINNER_COMBOS } from "../constants.js"

export const checkWinnerFrom = (boardToCheck) =>{

    //se revisan todas las combinaciones ganadoras para ver si X u O ganó
    for(const combo of WINNER_COMBOS){
      const[a,b,c] = combo
      if(
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[b] === boardToCheck[c]
      ) {
        return boardToCheck[a]
      }
    }
    //si no hay ganador
    return null
}

export const checkEndGame = (newBoard) =>{
    //Se revisa si hay empate; si no hay espacios vacíos en el tablero
    return newBoard.every((square) => square != null)
  }