import { Player } from "../player";

test('initiate a new player', () => {
  let p = Player('John');
  expect(p.getName()).toBe('John');
  expect(p.getGameboard().isOver()).toBe(false);
});

test('attacks the player gameboard', () => {
  let p = Player('Jack');

  expect(p.getGameboard().receiveAttack([1, 0])).toBe(true); // it's a hit!
});

test('generates a random attack as a computer player', () => {
  let p = Player('Joshua');
  let cpt = Player('Computer');

  let playerBoard = p.getGameboard();
  let attack = cpt.generateAttack(playerBoard);

  expect(playerBoard.getHits()).not.toContain(attack);
  expect(playerBoard.getMisses()).not.toContain(attack);

  expect(playerBoard.receiveAttack(attack)).not.toBe(null);
});

test('attacks until the computer wins', () => {
  let p = Player('Joshua');
  let cpt = Player('Computer');

  let playerBoard = p.getGameboard();
  let attack;

  while (!playerBoard.isOver()) {
    attack = cpt.generateAttack(playerBoard);
    expect(playerBoard.getHits()).not.toContain(attack);
    expect(playerBoard.getMisses()).not.toContain(attack);
    expect(playerBoard.receiveAttack(attack)).not.toBe(null);
  }
  expect(playerBoard.isOver()).toBe(true);
});