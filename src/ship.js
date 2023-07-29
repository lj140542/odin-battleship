const Ship = (length) => {
  let hitCount = 0;

  const hit = () => {
    if (!isSunk()) hitCount++;
  };
  const isSunk = () => {
    return (hitCount == length);
  };

  const getLength = () => length;
  const getHitCount = () => hitCount;

  return { getLength, getHitCount, hit, isSunk }
};

export { Ship };