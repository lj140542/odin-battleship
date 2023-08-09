/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/controller.js":
/*!***************************!*\
  !*** ./src/controller.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Controller: () => (/* binding */ Controller)
/* harmony export */ });
/* harmony import */ var _display__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./display */ "./src/display.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");



const Controller = function (againstCPU) {
  let paramDisplay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  const display = paramDisplay == null ? (0,_display__WEBPACK_IMPORTED_MODULE_0__.Display)((0,_gameboard__WEBPACK_IMPORTED_MODULE_2__.Gameboard)().createBoard()) : paramDisplay;
  let players = [];
  let currentPlayer;
  let currentOpponent;
  const toPlayerConfiguration = () => display.displayPlayerConfiguration(addPlayer);
  const addPlayer = (name, array) => {
    players.push((0,_player__WEBPACK_IMPORTED_MODULE_1__.Player)(name, array));
    if (againstCPU) players.push((0,_player__WEBPACK_IMPORTED_MODULE_1__.Player)('CPU'));
    if (players.length == 2) initGame();else toPlayerConfiguration();
  };
  const initGame = () => {
    if (againstCPU) {
      currentPlayer = 0;
      currentOpponent = 1;
    } else {
      currentPlayer = Math.floor(Math.random() * 2);
      currentOpponent = 0 + !currentPlayer;
    }
    display.displayPlayer(players[currentPlayer].getName(), players[currentPlayer].getGameboard(), players[currentOpponent].getGameboard(), turnPlayed);
  };
  const turnPlayed = attackCoord => {
    let attackResult = players[currentOpponent].getGameboard().receiveAttack(attackCoord);
    display.displayAttackResult(players[currentPlayer].getName(), attackCoord, attackResult);
    if (attackResult && players[currentOpponent].getGameboard().isOver()) return gameOver(currentPlayer);else {
      turnChange();
      if (againstCPU) {
        // play the CPU round
        attackCoord = players[currentPlayer].generateAttack(players[currentOpponent].getGameboard());
        attackResult = players[currentOpponent].getGameboard().receiveAttack(attackCoord);
        display.displayAttackResult(players[currentPlayer].getName(), attackCoord, attackResult);
        if (attackResult && players[currentOpponent].getGameboard().isOver()) return gameOver(currentPlayer);else turnChange();
      }
    }
    return false;
  };
  const turnChange = () => {
    currentPlayer = currentOpponent;
    currentOpponent = 0 + !currentOpponent;
    display.displayPlayer(players[currentPlayer].getName(), players[currentPlayer].getGameboard(), players[currentOpponent].getGameboard(), turnPlayed);
  };
  const gameOver = winner => {
    display.displayWin(players[winner].getName());
    reset();
    return true;
  };
  const reset = () => {
    location.reload();
  };
  return {
    toPlayerConfiguration,
    addPlayer,
    turnPlayed,
    reset
  };
};


/***/ }),

/***/ "./src/display.js":
/*!************************!*\
  !*** ./src/display.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Display: () => (/* binding */ Display)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");

const Display = defaultGameboardDisplay => {
  let displayDiv = document.querySelector('#display');
  const generateGrid = function () {
    let array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
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
      });
    });
    return gridDiv;
  };
  const displayPlayerConfiguration = addPlayerFunction => {
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
          if (cell.getAttribute('shipNumber') != null) rowArray.push(cell.getAttribute('shipNumber'));else rowArray.push(-1);
        });
        gridArray.push(rowArray);
      });
      console.log(gridArray);
      addPlayerFunction(nameInput.value, gridArray);
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
  const displayWin = playerName => {
    alert(`${playerName} wins !`);
  };
  return {
    displayPlayerConfiguration,
    displayPlayer,
    displayAttackResult,
    displayWin
  };
};


/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Gameboard: () => (/* binding */ Gameboard)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/ship.js");

const Gameboard = function () {
  let array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  let hits = [];
  let misses = [];
  let ships = [(0,_ship__WEBPACK_IMPORTED_MODULE_0__.Ship)(5), (0,_ship__WEBPACK_IMPORTED_MODULE_0__.Ship)(4), (0,_ship__WEBPACK_IMPORTED_MODULE_0__.Ship)(3), (0,_ship__WEBPACK_IMPORTED_MODULE_0__.Ship)(3), (0,_ship__WEBPACK_IMPORTED_MODULE_0__.Ship)(2)];
  const createBoard = () => {
    // create the default gameboard with specific placements
    return [[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, -1, -1, 3, 3, 3, -1, -1, -1, -1], [0, -1, -1, -1, -1, -1, -1, 2, -1, -1], [0, -1, -1, -1, -1, -1, -1, 2, -1, -1], [0, -1, -1, -1, -1, -1, -1, 2, -1, -1], [0, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, 4, -1, -1, -1, -1, -1, -1, -1], [-1, -1, 4, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, 1, 1, 1, 1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]];
  };
  const receiveAttack = attack => {
    let CoordX = attack[0];
    let CoordY = attack[1];
    let isHit = board[CoordX][CoordY] > -1;
    if (isHit) {
      ships[board[CoordX][CoordY]].hit();
      hits.push([CoordX, CoordY]);
      isHit = true;
    } else misses.push([CoordX, CoordY]);
    return isHit;
  };
  const isOver = () => {
    for (let i = 0; i < ships.length; i++) if (!ships[i].isSunk()) return false;
    return true;
  };
  let board = array == null ? createBoard() : array;
  const getHits = () => hits;
  const getMisses = () => misses;
  const getShips = () => ships;
  const getBoard = () => board;
  return {
    createBoard,
    receiveAttack,
    isOver,
    getHits,
    getMisses,
    getShips,
    getBoard
  };
};


/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Player: () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");

const Player = function (name) {
  let array = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  let board = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard)(array);
  const generateAttack = opponentBoard => {
    let guess = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    while (opponentBoard.getMisses().find(element => element == guess) != undefined || opponentBoard.getHits().find(element => element == guess) != undefined) guess = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    return guess;
  };
  const getName = () => name;
  const getGameboard = () => board;
  return {
    generateAttack,
    getName,
    getGameboard
  };
};


/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ship: () => (/* binding */ Ship)
/* harmony export */ });
const Ship = length => {
  let hitCount = 0;
  const hit = () => {
    if (!isSunk()) hitCount++;
  };
  const isSunk = () => {
    return hitCount == length;
  };
  const getLength = () => length;
  const getHitCount = () => hitCount;
  return {
    getLength,
    getHitCount,
    hit,
    isSunk
  };
};


/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./controller */ "./src/controller.js");


const displayDiv = document.querySelector('#display');
const button1P = document.querySelector('#button1P');
const button2P = document.querySelector('#button2P');
let controller;
button1P.addEventListener('click', () => {
  controller = (0,_controller__WEBPACK_IMPORTED_MODULE_1__.Controller)(true);
  controller.toPlayerConfiguration();
});
button2P.addEventListener('click', () => {
  controller = (0,_controller__WEBPACK_IMPORTED_MODULE_1__.Controller)(false);
  controller.toPlayerConfiguration();
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SSxHQUFHLEVBQUU7RUFDYixJQUFJQyxNQUFNLEdBQUcsRUFBRTtFQUNmLElBQUlDLEtBQUssR0FBRyxDQUFDSCwyQ0FBSSxDQUFDLENBQUMsQ0FBQyxFQUFFQSwyQ0FBSSxDQUFDLENBQUMsQ0FBQyxFQUFFQSwyQ0FBSSxDQUFDLENBQUMsQ0FBQyxFQUFFQSwyQ0FBSSxDQUFDLENBQUMsQ0FBQyxFQUFFQSwyQ0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBRXpELE1BQU1yRixXQUFXLEdBQUdBLENBQUEsS0FBTTtJQUN4QjtJQUNBLE9BQU8sQ0FDTCxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQ3hDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQ3BDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUN0QyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDdEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQ3RDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQ3ZDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQ3ZDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQ3ZDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQ3BDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDekM7RUFDSCxDQUFDO0VBRUQsTUFBTW9C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TUFBTXFFLFFBQVEsR0FBR3RFLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFdBQVcsQ0FBQztBQUNwRCxNQUFNc0UsUUFBUSxHQUFHdkUsUUFBUSxDQUFDQyxhQUFhLENBQUMsV0FBVyxDQUFDO0FBQ3BELElBQUl1RSxVQUFVO0FBRWRGLFFBQVEsQ0FBQzNDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNO0VBQ3ZDNkMsVUFBVSxHQUFHaEgsdURBQVUsQ0FBQyxJQUFJLENBQUM7RUFDN0JnSCxVQUFVLENBQUNyRyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ3BDLENBQUMsQ0FBQztBQUVGb0csUUFBUSxDQUFDNUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07RUFDdkM2QyxVQUFVLEdBQUdoSCx1REFBVSxDQUFDLEtBQUssQ0FBQztFQUM5QmdILFVBQVUsQ0FBQ3JHLHFCQUFxQixDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvLi9zcmMvY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvLi9zcmMvZGlzcGxheS5qcyIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL29kaW4tYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlzcGxheSB9IGZyb20gXCIuL2Rpc3BsYXlcIjtcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuL3BsYXllclwiO1xuaW1wb3J0IHsgR2FtZWJvYXJkIH0gZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5cbmNvbnN0IENvbnRyb2xsZXIgPSAoYWdhaW5zdENQVSwgcGFyYW1EaXNwbGF5ID0gbnVsbCkgPT4ge1xuICBjb25zdCBkaXNwbGF5ID0gcGFyYW1EaXNwbGF5ID09IG51bGwgPyBEaXNwbGF5KEdhbWVib2FyZCgpLmNyZWF0ZUJvYXJkKCkpIDogcGFyYW1EaXNwbGF5O1xuICBsZXQgcGxheWVycyA9IFtdO1xuICBsZXQgY3VycmVudFBsYXllcjtcbiAgbGV0IGN1cnJlbnRPcHBvbmVudDtcblxuICBjb25zdCB0b1BsYXllckNvbmZpZ3VyYXRpb24gPSAoKSA9PiBkaXNwbGF5LmRpc3BsYXlQbGF5ZXJDb25maWd1cmF0aW9uKGFkZFBsYXllcik7XG5cbiAgY29uc3QgYWRkUGxheWVyID0gKG5hbWUsIGFycmF5KSA9PiB7XG4gICAgcGxheWVycy5wdXNoKFBsYXllcihuYW1lLCBhcnJheSkpO1xuICAgIGlmIChhZ2FpbnN0Q1BVKSBwbGF5ZXJzLnB1c2goUGxheWVyKCdDUFUnKSk7XG4gICAgaWYgKHBsYXllcnMubGVuZ3RoID09IDIpIGluaXRHYW1lKCk7XG4gICAgZWxzZSB0b1BsYXllckNvbmZpZ3VyYXRpb24oKTtcbiAgfTtcblxuICBjb25zdCBpbml0R2FtZSA9ICgpID0+IHtcbiAgICBpZiAoYWdhaW5zdENQVSkge1xuICAgICAgY3VycmVudFBsYXllciA9IDA7XG4gICAgICBjdXJyZW50T3Bwb25lbnQgPSAxO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGN1cnJlbnRQbGF5ZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgICAgIGN1cnJlbnRPcHBvbmVudCA9IDAgKyAhY3VycmVudFBsYXllcjtcbiAgICB9XG4gICAgZGlzcGxheS5kaXNwbGF5UGxheWVyKHBsYXllcnNbY3VycmVudFBsYXllcl0uZ2V0TmFtZSgpLFxuICAgICAgcGxheWVyc1tjdXJyZW50UGxheWVyXS5nZXRHYW1lYm9hcmQoKSxcbiAgICAgIHBsYXllcnNbY3VycmVudE9wcG9uZW50XS5nZXRHYW1lYm9hcmQoKSxcbiAgICAgIHR1cm5QbGF5ZWQpO1xuICB9O1xuXG4gIGNvbnN0IHR1cm5QbGF5ZWQgPSAoYXR0YWNrQ29vcmQpID0+IHtcbiAgICBsZXQgYXR0YWNrUmVzdWx0ID0gcGxheWVyc1tjdXJyZW50T3Bwb25lbnRdLmdldEdhbWVib2FyZCgpLnJlY2VpdmVBdHRhY2soYXR0YWNrQ29vcmQpO1xuICAgIGRpc3BsYXkuZGlzcGxheUF0dGFja1Jlc3VsdChwbGF5ZXJzW2N1cnJlbnRQbGF5ZXJdLmdldE5hbWUoKSwgYXR0YWNrQ29vcmQsIGF0dGFja1Jlc3VsdCk7XG4gICAgaWYgKGF0dGFja1Jlc3VsdCAmJiBwbGF5ZXJzW2N1cnJlbnRPcHBvbmVudF0uZ2V0R2FtZWJvYXJkKCkuaXNPdmVyKCkpIHJldHVybiBnYW1lT3ZlcihjdXJyZW50UGxheWVyKTtcbiAgICBlbHNlIHtcbiAgICAgIHR1cm5DaGFuZ2UoKTtcbiAgICAgIGlmIChhZ2FpbnN0Q1BVKSB7XG4gICAgICAgIC8vIHBsYXkgdGhlIENQVSByb3VuZFxuICAgICAgICBhdHRhY2tDb29yZCA9IHBsYXllcnNbY3VycmVudFBsYXllcl0uZ2VuZXJhdGVBdHRhY2socGxheWVyc1tjdXJyZW50T3Bwb25lbnRdLmdldEdhbWVib2FyZCgpKTtcbiAgICAgICAgYXR0YWNrUmVzdWx0ID0gcGxheWVyc1tjdXJyZW50T3Bwb25lbnRdLmdldEdhbWVib2FyZCgpLnJlY2VpdmVBdHRhY2soYXR0YWNrQ29vcmQpO1xuICAgICAgICBkaXNwbGF5LmRpc3BsYXlBdHRhY2tSZXN1bHQocGxheWVyc1tjdXJyZW50UGxheWVyXS5nZXROYW1lKCksIGF0dGFja0Nvb3JkLCBhdHRhY2tSZXN1bHQpO1xuICAgICAgICBpZiAoYXR0YWNrUmVzdWx0ICYmIHBsYXllcnNbY3VycmVudE9wcG9uZW50XS5nZXRHYW1lYm9hcmQoKS5pc092ZXIoKSkgcmV0dXJuIGdhbWVPdmVyKGN1cnJlbnRQbGF5ZXIpO1xuICAgICAgICBlbHNlIHR1cm5DaGFuZ2UoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGNvbnN0IHR1cm5DaGFuZ2UgPSAoKSA9PiB7XG4gICAgY3VycmVudFBsYXllciA9IGN1cnJlbnRPcHBvbmVudDtcbiAgICBjdXJyZW50T3Bwb25lbnQgPSAwICsgIWN1cnJlbnRPcHBvbmVudDtcbiAgICBkaXNwbGF5LmRpc3BsYXlQbGF5ZXIocGxheWVyc1tjdXJyZW50UGxheWVyXS5nZXROYW1lKCksXG4gICAgICBwbGF5ZXJzW2N1cnJlbnRQbGF5ZXJdLmdldEdhbWVib2FyZCgpLFxuICAgICAgcGxheWVyc1tjdXJyZW50T3Bwb25lbnRdLmdldEdhbWVib2FyZCgpLFxuICAgICAgdHVyblBsYXllZCk7XG4gIH07XG5cbiAgY29uc3QgZ2FtZU92ZXIgPSAod2lubmVyKSA9PiB7XG4gICAgZGlzcGxheS5kaXNwbGF5V2luKHBsYXllcnNbd2lubmVyXS5nZXROYW1lKCkpO1xuICAgIHJlc2V0KCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgcmVzZXQgPSAoKSA9PiB7XG4gICAgbG9jYXRpb24ucmVsb2FkKCk7XG4gIH07XG5cbiAgcmV0dXJuIHsgdG9QbGF5ZXJDb25maWd1cmF0aW9uLCBhZGRQbGF5ZXIsIHR1cm5QbGF5ZWQsIHJlc2V0IH07XG59O1xuXG5leHBvcnQgeyBDb250cm9sbGVyIH07IiwiaW1wb3J0IHsgR2FtZWJvYXJkIH0gZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5cbmNvbnN0IERpc3BsYXkgPSAoZGVmYXVsdEdhbWVib2FyZERpc3BsYXkpID0+IHtcbiAgbGV0IGRpc3BsYXlEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGlzcGxheScpO1xuXG4gIGNvbnN0IGdlbmVyYXRlR3JpZCA9IChhcnJheSA9IG51bGwpID0+IHtcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2dyaWQnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgIGxldCByb3dEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHJvd0Rpdi5jbGFzc0xpc3QuYWRkKCdyb3cnKTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICBsZXQgY2VsbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjZWxsRGl2LmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcbiAgICAgICAgY2VsbERpdi5zZXRBdHRyaWJ1dGUoJ3Jvd051bWJlcicsIGkpO1xuICAgICAgICBjZWxsRGl2LnNldEF0dHJpYnV0ZSgnY29sTnVtYmVyJywgaik7XG4gICAgICAgIGlmIChhcnJheSAhPSBudWxsICYmIGFycmF5W2ldW2pdID49IDApIHtcbiAgICAgICAgICBjZWxsRGl2LmlubmVyVGV4dCA9ICdPJztcbiAgICAgICAgICBjZWxsRGl2LnNldEF0dHJpYnV0ZSgnc2hpcE51bWJlcicsIGFycmF5W2ldW2pdKTtcbiAgICAgICAgfVxuICAgICAgICByb3dEaXYuYXBwZW5kQ2hpbGQoY2VsbERpdik7XG4gICAgICB9XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQocm93RGl2KTtcbiAgICB9XG4gICAgcmV0dXJuIGRpdjtcbiAgfTtcblxuICBjb25zdCBkaXNwbGF5SGl0QW5kTWlzcyA9IChncmlkRGl2LCBnYW1lYm9hcmQpID0+IHtcbiAgICBnYW1lYm9hcmQuZ2V0SGl0cygpLmZvckVhY2goaGl0ID0+IHtcbiAgICAgIGxldCBjZWxsID0gZ3JpZERpdi5xdWVyeVNlbGVjdG9yKGAuY2VsbFtyb3dOdW1iZXI9JyR7aGl0WzBdfSddW2NvbE51bWJlcj0nJHtoaXRbMV19J11gKTtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gICAgICBjZWxsLmlubmVyVGV4dCA9ICdPJztcbiAgICB9KTtcbiAgICBnYW1lYm9hcmQuZ2V0TWlzc2VzKCkuZm9yRWFjaChtaXNzID0+IHtcbiAgICAgIGxldCBjZWxsID0gZ3JpZERpdi5xdWVyeVNlbGVjdG9yKGAuY2VsbFtyb3dOdW1iZXI9JyR7bWlzc1swXX0nXVtjb2xOdW1iZXI9JyR7bWlzc1sxXX0nXWApO1xuICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdtaXNzJyk7XG4gICAgICBjZWxsLmlubmVyVGV4dCA9ICdYJztcbiAgICB9KTtcbiAgICByZXR1cm4gZ3JpZERpdjtcbiAgfTtcblxuICBjb25zdCBzZXRQbGF5YWJsZUNlbGxzID0gKGdyaWREaXYsIHBsYXlUdXJuRnVuY3Rpb24pID0+IHtcbiAgICBsZXQgcGxheWFibGVDZWxscyA9IGdyaWREaXYucXVlcnlTZWxlY3RvckFsbCgnLmNlbGw6bm90KC5oaXQpOm5vdCgubWlzcyknKTtcbiAgICBwbGF5YWJsZUNlbGxzLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBwbGF5VHVybkZ1bmN0aW9uKFtjZWxsLmdldEF0dHJpYnV0ZSgncm93TnVtYmVyJyksIGNlbGwuZ2V0QXR0cmlidXRlKCdjb2xOdW1iZXInKV0pO1xuICAgICAgfSlcbiAgICB9KVxuICAgIHJldHVybiBncmlkRGl2O1xuICB9O1xuXG4gIGNvbnN0IGRpc3BsYXlQbGF5ZXJDb25maWd1cmF0aW9uID0gKGFkZFBsYXllckZ1bmN0aW9uKSA9PiB7XG4gICAgZGlzcGxheURpdi5pbm5lckhUTUwgPSAnJztcblxuICAgIGxldCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSAnUGxheWVyIGNvbmZpZ3VyYXRpb24nO1xuXG4gICAgbGV0IG5hbWVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgbmFtZUxhYmVsLnNldEF0dHJpYnV0ZSgnZm9yJywgJ3BsYXllci1uYW1lJyk7XG4gICAgbmFtZUxhYmVsLnRleHRDb250ZW50ID0gJ05hbWUnO1xuICAgIGxldCBuYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIG5hbWVJbnB1dC5pZCA9ICdwbGF5ZXItbmFtZSc7XG4gICAgbmFtZUlucHV0LnR5cGUgPSAndGV4dCc7XG4gICAgbGV0IG5hbWVDb25maWd1cmF0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbmFtZUNvbmZpZ3VyYXRpb24uaWQgPSAncGxheWVyLW5hbWUtY29uZmlndXJhdGlvbic7XG4gICAgbmFtZUNvbmZpZ3VyYXRpb24uYXBwZW5kKG5hbWVMYWJlbCwgbmFtZUlucHV0KTtcblxuXG4gICAgbGV0IGRpc3BsYXlDb25maWd1cmF0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGlzcGxheUNvbmZpZ3VyYXRpb24uaWQgPSAncGxheWVyLWRpc3BsYXktY29uZmlndXJhdGlvbic7XG4gICAgZGlzcGxheUNvbmZpZ3VyYXRpb24uYXBwZW5kQ2hpbGQoZ2VuZXJhdGVHcmlkKGRlZmF1bHRHYW1lYm9hcmREaXNwbGF5KSk7XG5cbiAgICBsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYnV0dG9uLmlkID0gJ3BsYXllci12YWxpZGF0aW9uJztcbiAgICBidXR0b24uaW5uZXJUZXh0ID0gJ0NyZWF0ZSc7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbGV0IGdyaWRBcnJheSA9IFtdO1xuICAgICAgbGV0IGdyaWREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZCcpO1xuICAgICAgZ3JpZERpdi5xdWVyeVNlbGVjdG9yQWxsKCcucm93JykuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICBsZXQgcm93QXJyYXkgPSBbXTtcbiAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jZWxsJykuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICBpZiAoY2VsbC5nZXRBdHRyaWJ1dGUoJ3NoaXBOdW1iZXInKSAhPSBudWxsKVxuICAgICAgICAgICAgcm93QXJyYXkucHVzaChjZWxsLmdldEF0dHJpYnV0ZSgnc2hpcE51bWJlcicpKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByb3dBcnJheS5wdXNoKC0xKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGdyaWRBcnJheS5wdXNoKHJvd0FycmF5KTtcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coZ3JpZEFycmF5KTtcbiAgICAgIGFkZFBsYXllckZ1bmN0aW9uKG5hbWVJbnB1dC52YWx1ZSwgZ3JpZEFycmF5KVxuICAgIH0pO1xuXG4gICAgZGlzcGxheURpdi5hcHBlbmQodGl0bGUsIG5hbWVDb25maWd1cmF0aW9uLCBkaXNwbGF5Q29uZmlndXJhdGlvbiwgYnV0dG9uKTtcbiAgfTtcblxuICBjb25zdCBkaXNwbGF5UGxheWVyID0gKHBsYXllck5hbWUsIHBsYXllckJvYXJkLCBvcHBvbmVudEJvYXJkLCBwbGF5VHVybkZ1bmN0aW9uKSA9PiB7XG4gICAgbGV0IHBsYXlhYmxlR3JpZCA9IHNldFBsYXlhYmxlQ2VsbHMoZGlzcGxheUhpdEFuZE1pc3MoZ2VuZXJhdGVHcmlkKCksIG9wcG9uZW50Qm9hcmQpLCBwbGF5VHVybkZ1bmN0aW9uKTtcblxuICAgIGxldCBkaXNwbGF5Q29uZmlndXJhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpc3BsYXlDb25maWd1cmF0aW9uLmlkID0gJ3BsYXlhYmxlLWdyaWQnO1xuICAgIGRpc3BsYXlDb25maWd1cmF0aW9uLmFwcGVuZENoaWxkKHBsYXlhYmxlR3JpZCk7XG5cbiAgICBkaXNwbGF5RGl2LmlubmVySFRNTCA9IHBsYXllck5hbWU7XG4gICAgZGlzcGxheURpdi5hcHBlbmRDaGlsZChkaXNwbGF5Q29uZmlndXJhdGlvbik7XG4gIH07XG5cbiAgY29uc3QgZGlzcGxheUF0dGFja1Jlc3VsdCA9IChwbGF5ZXJOYW1lLCBhdHRhY2tDb29yZCwgYXR0YWNrUmVzdWx0KSA9PiB7XG4gICAgYWxlcnQoYCR7cGxheWVyTmFtZX0gYXR0YWNrcyBjb29yZGluYXRlcyAke2F0dGFja0Nvb3JkfSAuLi4gaXQncyBhICR7YXR0YWNrUmVzdWx0ID8gJ2hpdCcgOiAnbWlzcyd9YCk7XG4gIH07XG5cbiAgY29uc3QgZGlzcGxheVdpbiA9IChwbGF5ZXJOYW1lKSA9PiB7XG4gICAgYWxlcnQoYCR7cGxheWVyTmFtZX0gd2lucyAhYCk7XG4gIH07XG5cbiAgcmV0dXJuIHsgZGlzcGxheVBsYXllckNvbmZpZ3VyYXRpb24sIGRpc3BsYXlQbGF5ZXIsIGRpc3BsYXlBdHRhY2tSZXN1bHQsIGRpc3BsYXlXaW4gfTtcbn07XG5cbmV4cG9ydCB7IERpc3BsYXkgfTsiLCJpbXBvcnQgeyBTaGlwIH0gZnJvbSAnLi9zaGlwJztcblxuY29uc3QgR2FtZWJvYXJkID0gKGFycmF5ID0gbnVsbCkgPT4ge1xuICBsZXQgaGl0cyA9IFtdO1xuICBsZXQgbWlzc2VzID0gW107XG4gIGxldCBzaGlwcyA9IFtTaGlwKDUpLCBTaGlwKDQpLCBTaGlwKDMpLCBTaGlwKDMpLCBTaGlwKDIpXTtcblxuICBjb25zdCBjcmVhdGVCb2FyZCA9ICgpID0+IHtcbiAgICAvLyBjcmVhdGUgdGhlIGRlZmF1bHQgZ2FtZWJvYXJkIHdpdGggc3BlY2lmaWMgcGxhY2VtZW50c1xuICAgIHJldHVybiBbXG4gICAgICBbLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTFdLFxuICAgICAgWzAsIC0xLCAtMSwgMywgMywgMywgLTEsIC0xLCAtMSwgLTFdLFxuICAgICAgWzAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIDIsIC0xLCAtMV0sXG4gICAgICBbMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgMiwgLTEsIC0xXSxcbiAgICAgIFswLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAyLCAtMSwgLTFdLFxuICAgICAgWzAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTFdLFxuICAgICAgWy0xLCAtMSwgNCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTFdLFxuICAgICAgWy0xLCAtMSwgNCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTFdLFxuICAgICAgWy0xLCAtMSwgLTEsIC0xLCAxLCAxLCAxLCAxLCAtMSwgLTFdLFxuICAgICAgWy0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xXVxuICAgIF07XG4gIH07XG5cbiAgY29uc3QgcmVjZWl2ZUF0dGFjayA9IChhdHRhY2spID0+IHtcbiAgICBsZXQgQ29vcmRYID0gYXR0YWNrWzBdO1xuICAgIGxldCBDb29yZFkgPSBhdHRhY2tbMV07XG4gICAgbGV0IGlzSGl0ID0gKGJvYXJkW0Nvb3JkWF1bQ29vcmRZXSA+IC0xKTtcblxuICAgIGlmIChpc0hpdCkge1xuICAgICAgc2hpcHNbYm9hcmRbQ29vcmRYXVtDb29yZFldXS5oaXQoKTtcbiAgICAgIGhpdHMucHVzaChbQ29vcmRYLCBDb29yZFldKTtcbiAgICAgIGlzSGl0ID0gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBtaXNzZXMucHVzaChbQ29vcmRYLCBDb29yZFldKTtcblxuICAgIHJldHVybiBpc0hpdDtcbiAgfTtcblxuICBjb25zdCBpc092ZXIgPSAoKSA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwcy5sZW5ndGg7IGkrKylcbiAgICAgIGlmICghc2hpcHNbaV0uaXNTdW5rKCkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBsZXQgYm9hcmQgPSBhcnJheSA9PSBudWxsID8gY3JlYXRlQm9hcmQoKSA6IGFycmF5O1xuXG4gIGNvbnN0IGdldEhpdHMgPSAoKSA9PiBoaXRzO1xuICBjb25zdCBnZXRNaXNzZXMgPSAoKSA9PiBtaXNzZXM7XG4gIGNvbnN0IGdldFNoaXBzID0gKCkgPT4gc2hpcHM7XG4gIGNvbnN0IGdldEJvYXJkID0gKCkgPT4gYm9hcmQ7XG5cbiAgcmV0dXJuIHsgY3JlYXRlQm9hcmQsIHJlY2VpdmVBdHRhY2ssIGlzT3ZlciwgZ2V0SGl0cywgZ2V0TWlzc2VzLCBnZXRTaGlwcywgZ2V0Qm9hcmQgfTtcbn07XG5cbmV4cG9ydCB7IEdhbWVib2FyZCB9OyIsImltcG9ydCB7IEdhbWVib2FyZCB9IGZyb20gJy4vZ2FtZWJvYXJkJztcblxuY29uc3QgUGxheWVyID0gKG5hbWUsIGFycmF5ID0gbnVsbCkgPT4ge1xuICBsZXQgYm9hcmQgPSBHYW1lYm9hcmQoYXJyYXkpO1xuXG4gIGNvbnN0IGdlbmVyYXRlQXR0YWNrID0gKG9wcG9uZW50Qm9hcmQpID0+IHtcbiAgICBsZXQgZ3Vlc3MgPSBbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCldO1xuICAgIHdoaWxlIChvcHBvbmVudEJvYXJkLmdldE1pc3NlcygpLmZpbmQoZWxlbWVudCA9PiBlbGVtZW50ID09IGd1ZXNzKSAhPSB1bmRlZmluZWRcbiAgICAgIHx8IG9wcG9uZW50Qm9hcmQuZ2V0SGl0cygpLmZpbmQoZWxlbWVudCA9PiBlbGVtZW50ID09IGd1ZXNzKSAhPSB1bmRlZmluZWQpXG4gICAgICBndWVzcyA9IFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKV07XG5cbiAgICByZXR1cm4gZ3Vlc3M7XG4gIH07XG5cbiAgY29uc3QgZ2V0TmFtZSA9ICgpID0+IG5hbWU7XG4gIGNvbnN0IGdldEdhbWVib2FyZCA9ICgpID0+IGJvYXJkO1xuXG4gIHJldHVybiB7IGdlbmVyYXRlQXR0YWNrLCBnZXROYW1lLCBnZXRHYW1lYm9hcmQgfTtcbn07XG5cbmV4cG9ydCB7IFBsYXllciB9OyIsImNvbnN0IFNoaXAgPSAobGVuZ3RoKSA9PiB7XG4gIGxldCBoaXRDb3VudCA9IDA7XG5cbiAgY29uc3QgaGl0ID0gKCkgPT4ge1xuICAgIGlmICghaXNTdW5rKCkpIGhpdENvdW50Kys7XG4gIH07XG4gIGNvbnN0IGlzU3VuayA9ICgpID0+IHtcbiAgICByZXR1cm4gKGhpdENvdW50ID09IGxlbmd0aCk7XG4gIH07XG5cbiAgY29uc3QgZ2V0TGVuZ3RoID0gKCkgPT4gbGVuZ3RoO1xuICBjb25zdCBnZXRIaXRDb3VudCA9ICgpID0+IGhpdENvdW50O1xuXG4gIHJldHVybiB7IGdldExlbmd0aCwgZ2V0SGl0Q291bnQsIGhpdCwgaXNTdW5rIH1cbn07XG5cbmV4cG9ydCB7IFNoaXAgfTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnLi9zdHlsZS5jc3MnO1xuaW1wb3J0IHsgQ29udHJvbGxlciB9IGZyb20gJy4vY29udHJvbGxlcic7XG5cbmNvbnN0IGRpc3BsYXlEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGlzcGxheScpO1xuY29uc3QgYnV0dG9uMVAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uMVAnKTtcbmNvbnN0IGJ1dHRvbjJQID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbjJQJyk7XG5sZXQgY29udHJvbGxlcjtcblxuYnV0dG9uMVAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGNvbnRyb2xsZXIgPSBDb250cm9sbGVyKHRydWUpO1xuICBjb250cm9sbGVyLnRvUGxheWVyQ29uZmlndXJhdGlvbigpO1xufSk7XG5cbmJ1dHRvbjJQLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBjb250cm9sbGVyID0gQ29udHJvbGxlcihmYWxzZSk7XG4gIGNvbnRyb2xsZXIudG9QbGF5ZXJDb25maWd1cmF0aW9uKCk7XG59KTtcbiJdLCJuYW1lcyI6WyJEaXNwbGF5IiwiUGxheWVyIiwiR2FtZWJvYXJkIiwiQ29udHJvbGxlciIsImFnYWluc3RDUFUiLCJwYXJhbURpc3BsYXkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJkaXNwbGF5IiwiY3JlYXRlQm9hcmQiLCJwbGF5ZXJzIiwiY3VycmVudFBsYXllciIsImN1cnJlbnRPcHBvbmVudCIsInRvUGxheWVyQ29uZmlndXJhdGlvbiIsImRpc3BsYXlQbGF5ZXJDb25maWd1cmF0aW9uIiwiYWRkUGxheWVyIiwibmFtZSIsImFycmF5IiwicHVzaCIsImluaXRHYW1lIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiZGlzcGxheVBsYXllciIsImdldE5hbWUiLCJnZXRHYW1lYm9hcmQiLCJ0dXJuUGxheWVkIiwiYXR0YWNrQ29vcmQiLCJhdHRhY2tSZXN1bHQiLCJyZWNlaXZlQXR0YWNrIiwiZGlzcGxheUF0dGFja1Jlc3VsdCIsImlzT3ZlciIsImdhbWVPdmVyIiwidHVybkNoYW5nZSIsImdlbmVyYXRlQXR0YWNrIiwid2lubmVyIiwiZGlzcGxheVdpbiIsInJlc2V0IiwibG9jYXRpb24iLCJyZWxvYWQiLCJkZWZhdWx0R2FtZWJvYXJkRGlzcGxheSIsImRpc3BsYXlEaXYiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJnZW5lcmF0ZUdyaWQiLCJkaXYiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwiaSIsInJvd0RpdiIsImoiLCJjZWxsRGl2Iiwic2V0QXR0cmlidXRlIiwiaW5uZXJUZXh0IiwiYXBwZW5kQ2hpbGQiLCJkaXNwbGF5SGl0QW5kTWlzcyIsImdyaWREaXYiLCJnYW1lYm9hcmQiLCJnZXRIaXRzIiwiZm9yRWFjaCIsImhpdCIsImNlbGwiLCJnZXRNaXNzZXMiLCJtaXNzIiwic2V0UGxheWFibGVDZWxscyIsInBsYXlUdXJuRnVuY3Rpb24iLCJwbGF5YWJsZUNlbGxzIiwicXVlcnlTZWxlY3RvckFsbCIsImFkZEV2ZW50TGlzdGVuZXIiLCJnZXRBdHRyaWJ1dGUiLCJhZGRQbGF5ZXJGdW5jdGlvbiIsImlubmVySFRNTCIsInRpdGxlIiwidGV4dENvbnRlbnQiLCJuYW1lTGFiZWwiLCJuYW1lSW5wdXQiLCJpZCIsInR5cGUiLCJuYW1lQ29uZmlndXJhdGlvbiIsImFwcGVuZCIsImRpc3BsYXlDb25maWd1cmF0aW9uIiwiYnV0dG9uIiwiZ3JpZEFycmF5Iiwicm93Iiwicm93QXJyYXkiLCJjb25zb2xlIiwibG9nIiwidmFsdWUiLCJwbGF5ZXJOYW1lIiwicGxheWVyQm9hcmQiLCJvcHBvbmVudEJvYXJkIiwicGxheWFibGVHcmlkIiwiYWxlcnQiLCJTaGlwIiwiaGl0cyIsIm1pc3NlcyIsInNoaXBzIiwiYXR0YWNrIiwiQ29vcmRYIiwiQ29vcmRZIiwiaXNIaXQiLCJib2FyZCIsImlzU3VuayIsImdldFNoaXBzIiwiZ2V0Qm9hcmQiLCJndWVzcyIsImZpbmQiLCJlbGVtZW50IiwiaGl0Q291bnQiLCJnZXRMZW5ndGgiLCJnZXRIaXRDb3VudCIsImJ1dHRvbjFQIiwiYnV0dG9uMlAiLCJjb250cm9sbGVyIl0sInNvdXJjZVJvb3QiOiIifQ==