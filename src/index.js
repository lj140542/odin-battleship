import './style.css';
import { Controller } from './controller';

const displayDiv = document.querySelector('#display');
const button1P = document.querySelector('#button1P');
const button2P = document.querySelector('#button2P');
let controller;

button1P.addEventListener('click', () => {
  controller = Controller(true);
  controller.toPlayerConfiguration();
});

button2P.addEventListener('click', () => {
  controller = Controller(false);
  controller.toPlayerConfiguration();
});
