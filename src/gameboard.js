import { Ship } from './ship';

const Gameboard = (array = null) => {
  let hits = [];
  let misses = [];
  let ships = [Ship(5), Ship(4), Ship(3), Ship(3), Ship(2)];

  const createBoard = () => {
    // create the default gameboard with specific placements
    return [
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [0, -1, -1, 3, 3, 3, -1, -1, -1, -1],
      [0, -1, -1, -1, -1, -1, -1, 2, -1, -1],
      [0, -1, -1, -1, -1, -1, -1, 2, -1, -1],
      [0, -1, -1, -1, -1, -1, -1, 2, -1, -1],
      [0, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, 4, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, 4, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, 1, 1, 1, 1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    ];

  };

  const receiveAttack = (CoordX, CoordY) => {
    let isHit = (board[CoordX][CoordY] > -1);

    if (isHit) {
      ships[board[CoordX][CoordY]].hit();
      hits.push([CoordX, CoordY]);
      isHit = true;
    }
    else misses.push([CoordX, CoordY]);

    return isHit;
  };

  const isOver = () => {
    for (let i = 0; i < ships.length; i++)
      if (!ships[i].isSunk()) return false;
    return true;
  };

  let board = array == null ? createBoard() : array;

  const getHits = () => hits;
  const getMisses = () => misses;
  const getShips = () => ships;
  const getBoard = () => board;

  return { receiveAttack, isOver, getHits, getMisses, getShips, getBoard };
};

export { Gameboard };