import { Ship } from '../ship';

test('create a ship', () => {
  let boat = Ship(2);
  expect(boat.getLength()).toBe(2);
  expect(boat.getHitCount()).toBe(0);
  expect(boat.isSunk()).toBe(false);
});

test('a ship is hit', () => {
  let boat = Ship(2);
  boat.hit();
  expect(boat.getHitCount()).toBe(1);
  expect(boat.isSunk()).toBe(false);
})

test('a ship is sunk', () => {
  let boat = Ship(2);
  boat.hit() // first hit tested previously
  boat.hit();
  expect(boat.getHitCount()).toBe(2);
  expect(boat.isSunk()).toBe(true);
});