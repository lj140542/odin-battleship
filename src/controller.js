import { Display } from "./display";
import { Player } from "./player";
import { Gameboard } from "./gameboard";

const Controller = (againstCPU, paramDisplay = null) => {
  const display = paramDisplay == null ? Display(Gameboard().createBoard()) : paramDisplay;
  let players = [];
  let currentPlayer;
  let currentOpponent;

  const toPlayerConfiguration = () => display.displayPlayerConfiguration();

  const addPlayer = (name, array) => {
    players.push(Player(name, array));
    if (againstCPU) players.push(Player('CPU'));
    if (players.length == 2) initGame();
  };

  const initGame = () => {
    currentPlayer = Math.floor(Math.random() * 2);
    currentOpponent = 0 + !currentPlayer;
    display.displayPlayer(players[currentPlayer].getName(),
      players[currentPlayer].getGameboard(),
      players[currentOpponent].getGameboard());
  };

  const turnPlayed = (attackCoord) => {
    let attackResult = players[currentOpponent].getGameboard().receiveAttack(attackCoord);
    display.displayAttackResult(players[currentPlayer].getName(), attackResult);
    if (attackResult && players[currentOpponent].getGameboard().isOver()) return gameOver(currentPlayer);
    else {
      turnChange();
      if (againstCPU) {
        // play the CPU round
        attackResult = players[currentPlayer].getGameboard().receiveAttack(players[currentOpponent].generateAttack(players[currentPlayer].getGameboard()));
        display.displayAttackResult(players[currentPlayer].getName(), attackResult);
        if (attackResult && players[currentPlayer].getGameboard().isOver()) return gameOver(currentOpponent);
        else turnChange();
      }
    }
    return false;
  };

  const turnChange = () => {
    currentPlayer = currentOpponent;
    currentOpponent = 0 + !currentOpponent;
    display.displayPlayer(players[currentPlayer].getName(),
      players[currentPlayer].getGameboard(),
      players[currentOpponent].getGameboard());
  };

  const gameOver = (winner) => {
    display.displayWin(players[winner].getName());
    return true;
  };

  const reset = () => {
    players = [];
    display.reset();
  };

  return { toPlayerConfiguration, addPlayer, turnPlayed, reset };
};

export { Controller };