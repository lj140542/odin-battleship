import { Gameboard } from './gameboard';

const Player = (name) => {
  let board = Gameboard();

  const generateAttack = (opponentBoard) => {
    let guess = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    while (opponentBoard.getMisses().find(element => element == guess) != undefined
      || opponentBoard.getHits().find(element => element == guess) != undefined)
      guess = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];

    return guess;
  };

  const getName = () => name;
  const getGameboard = () => board;

  return { generateAttack, getName, getGameboard };
};

export { Player };