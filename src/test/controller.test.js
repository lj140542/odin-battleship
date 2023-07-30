import { Controller } from "../controller";

let paramDisplay = (() => {
  const displayPlayerConfiguration = () => { };
  const displayPlayer = (playerName, playerBoard, opponentBoard) => { };
  const displayAttackResult = (playerName, attackResult) => { };
  const displayWin = (playerName) => { };
  const reset = () => { };
  return { displayPlayerConfiguration, displayPlayer, displayAttackResult, displayWin, reset };
})();
let defaultGameboardDisplay = [
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

test('initiate a controller', () => {
  expect(() => { let c = Controller(true, paramDisplay) }).not.toThrow()
});

test('add a player to the controller', () => {
  let cont = Controller(true, paramDisplay);
  expect(() => cont.addPlayer('John', defaultGameboardDisplay)).not.toThrow();
});

test('play a turn', () => {
  let cont = Controller(true, paramDisplay);
  cont.addPlayer('Jack', defaultGameboardDisplay);
  expect(() => cont.turnPlayed([1, 0])).not.toThrow();
});

test('play until the CPU wins the game', () => {
  let cont = Controller(true, paramDisplay);
  cont.addPlayer('Jack', defaultGameboardDisplay);
  expect(() => {
    while (!cont.turnPlayed([1, 0])) { }
  }).not.toThrow();
});