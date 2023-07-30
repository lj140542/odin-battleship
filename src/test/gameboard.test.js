import { Gameboard } from "../gameboard";

let game = Gameboard();

test('initate a gameboard', () => {
  expect(game.getBoard()).toStrictEqual(game.createBoard());
  expect(game.getMisses()).toStrictEqual([]);
});

test('give a board display to the gameboard', () => {
  let board = new Array(10).fill(-1);
  board[8] = 2;
  game = Gameboard(board);
  expect(game.getBoard()).toStrictEqual(board);
});

test('miss on the board', () => {
  game = Gameboard();
  expect(game.receiveAttack([1, 1])).toBe(false);
  expect(game.getMisses()[0]).toStrictEqual([1, 1]);
});

test('hit a ship on the board', () => {
  game = Gameboard();
  expect(game.receiveAttack([1, 0])).toBe(true);
  expect(game.getShips()[0].getHitCount()).toBe(1);
  expect(game.getHits()[0]).toStrictEqual([1, 0]);
  expect(game.isOver()).toBe(false);
});

test('a ship is sunk on the board', () => {
  game = Gameboard();
  expect(game.receiveAttack([1, 0])).toBe(true);
  expect(game.receiveAttack([2, 0])).toBe(true);
  expect(game.receiveAttack([3, 0])).toBe(true);
  expect(game.receiveAttack([4, 0])).toBe(true);
  expect(game.receiveAttack([5, 0])).toBe(true);
  expect(game.getShips()[0].isSunk()).toBe(true);
  expect(game.isOver()).toBe(false);
});

test('all the ships are sunk and so the game is over', () => {
  game = Gameboard();
  // first boat
  expect(game.receiveAttack([1, 0])).toBe(true);
  expect(game.receiveAttack([2, 0])).toBe(true);
  expect(game.receiveAttack([3, 0])).toBe(true);
  expect(game.receiveAttack([4, 0])).toBe(true);
  expect(game.receiveAttack([5, 0])).toBe(true);
  // second boat 
  expect(game.receiveAttack([8, 4])).toBe(true);
  expect(game.receiveAttack([8, 5])).toBe(true);
  expect(game.receiveAttack([8, 6])).toBe(true);
  expect(game.receiveAttack([8, 7])).toBe(true);
  // third boat 
  expect(game.receiveAttack([2, 7])).toBe(true);
  expect(game.receiveAttack([3, 7])).toBe(true);
  expect(game.receiveAttack([4, 7])).toBe(true);
  // fourth boat 
  expect(game.receiveAttack([1, 3])).toBe(true);
  expect(game.receiveAttack([1, 4])).toBe(true);
  expect(game.receiveAttack([1, 5])).toBe(true);
  // fifth boat 
  expect(game.receiveAttack([6, 2])).toBe(true);
  expect(game.receiveAttack([7, 2])).toBe(true);
  expect(game.isOver()).toBe(true);
});
