import { Display } from "./display";
import { Player } from "./player";
import { Gameboard } from "./gameboard";

const Controller = (againstCPU, paramDisplay = null) => {
  const display = paramDisplay == null ? Display(Gameboard().createBoard()) : paramDisplay;
  let players = [];
  let currentPlayer;
  let currentOpponent;

  const toPlayerConfiguration = () => display.displayPlayerConfiguration(addPlayer);

  const addPlayer = (name, array) => {
    players.push(Player(name, array));
    if (againstCPU) players.push(Player('CPU'));
    if (players.length == 2) initGame();
    else toPlayerConfiguration();
  };

  const initGame = () => {
    if (againstCPU) {
      currentPlayer = 0;
      currentOpponent = 1;
    }
    else {
      currentPlayer = Math.floor(Math.random() * 2);
      currentOpponent = 0 + !currentPlayer;
    }
    display.displayPlayer(players[currentPlayer].getName(),
      players[currentPlayer].getGameboard(),
      players[currentOpponent].getGameboard(),
      turnPlayed);
  };

  const turnPlayed = (attackCoord) => {
    let attackResult = players[currentOpponent].getGameboard().receiveAttack(attackCoord);
    display.displayAttackResult(players[currentPlayer].getName(), attackCoord, attackResult);
    if (attackResult && players[currentOpponent].getGameboard().isOver()) return gameOver(currentPlayer);
    else {
      turnChange();
      if (againstCPU) {
        // play the CPU round
        attackCoord = players[currentPlayer].generateAttack(players[currentOpponent].getGameboard());
        attackResult = players[currentOpponent].getGameboard().receiveAttack(attackCoord);
        display.displayAttackResult(players[currentPlayer].getName(), attackCoord, attackResult);
        if (attackResult && players[currentOpponent].getGameboard().isOver()) return gameOver(currentPlayer);
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
      players[currentOpponent].getGameboard(),
      turnPlayed);
  };

  const gameOver = (winner) => {
    display.displayWin(players[winner].getName());
    reset();
    return true;
  };

  const reset = () => {
    location.reload();
  };

  return { toPlayerConfiguration, addPlayer, turnPlayed, reset };
};

export { Controller };