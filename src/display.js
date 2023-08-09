import { Gameboard } from "./gameboard";

const Display = (defaultGameboardDisplay) => {
  let displayDiv = document.querySelector('#display');

  const generateGrid = (array = null) => {
    let div = document.createElement('div');
    div.classList.add('grid');
    for (let i = 0; i < 10; i++) {
      let rowDiv = document.createElement('div');
      rowDiv.classList.add('row');
      for (let j = 0; j < 10; j++) {
        let cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.setAttribute('rowNumber', i);
        cellDiv.setAttribute('colNumber', j);
        if (array != null && array[i][j] >= 0) {
          cellDiv.innerText = 'O';
          cellDiv.setAttribute('shipNumber', array[i][j]);
        }
        rowDiv.appendChild(cellDiv);
      }
      div.appendChild(rowDiv);
    }
    return div;
  };

  const displayHitAndMiss = (gridDiv, gameboard) => {
    gameboard.getHits().forEach(hit => {
      let cell = gridDiv.querySelector(`.cell[rowNumber='${hit[0]}'][colNumber='${hit[1]}']`);
      cell.classList.add('hit');
      cell.innerText = 'O';
    });
    gameboard.getMisses().forEach(miss => {
      let cell = gridDiv.querySelector(`.cell[rowNumber='${miss[0]}'][colNumber='${miss[1]}']`);
      cell.classList.add('miss');
      cell.innerText = 'X';
    });
    return gridDiv;
  };

  const setPlayableCells = (gridDiv, playTurnFunction) => {
    let playableCells = gridDiv.querySelectorAll('.cell:not(.hit):not(.miss)');
    playableCells.forEach(cell => {
      cell.addEventListener('click', () => {
        playTurnFunction([cell.getAttribute('rowNumber'), cell.getAttribute('colNumber')]);
      })
    })
    return gridDiv;
  };

  const displayPlayerConfiguration = (addPlayerFunction) => {
    displayDiv.innerHTML = '';

    let title = document.createElement('h2');
    title.textContent = 'Player configuration';

    let nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', 'player-name');
    nameLabel.textContent = 'Name';
    let nameInput = document.createElement('input');
    nameInput.id = 'player-name';
    nameInput.type = 'text';
    let nameConfiguration = document.createElement('div');
    nameConfiguration.id = 'player-name-configuration';
    nameConfiguration.append(nameLabel, nameInput);


    let displayConfiguration = document.createElement('div');
    displayConfiguration.id = 'player-display-configuration';
    displayConfiguration.appendChild(generateGrid(defaultGameboardDisplay));

    let button = document.createElement('button');
    button.id = 'player-validation';
    button.innerText = 'Create';
    button.addEventListener('click', () => {
      let gridArray = [];
      let gridDiv = document.querySelector('.grid');
      gridDiv.querySelectorAll('.row').forEach(row => {
        let rowArray = [];
        row.querySelectorAll('.cell').forEach(cell => {
          if (cell.getAttribute('shipNumber') != null)
            rowArray.push(cell.getAttribute('shipNumber'));
          else
            rowArray.push(-1);
        });
        gridArray.push(rowArray);
      });
      console.log(gridArray);
      addPlayerFunction(nameInput.value, gridArray)
    });

    displayDiv.append(title, nameConfiguration, displayConfiguration, button);
  };

  const displayPlayer = (playerName, playerBoard, opponentBoard, playTurnFunction) => {
    let playableGrid = setPlayableCells(displayHitAndMiss(generateGrid(), opponentBoard), playTurnFunction);

    let displayConfiguration = document.createElement('div');
    displayConfiguration.id = 'playable-grid';
    displayConfiguration.appendChild(playableGrid);

    displayDiv.innerHTML = playerName;
    displayDiv.appendChild(displayConfiguration);
  };

  const displayAttackResult = (playerName, attackCoord, attackResult) => {
    alert(`${playerName} attacks coordinates ${attackCoord} ... it's a ${attackResult ? 'hit' : 'miss'}`);
  };

  const displayWin = (playerName) => {
    alert(`${playerName} wins !`);
  };

  return { displayPlayerConfiguration, displayPlayer, displayAttackResult, displayWin };
};

export { Display };