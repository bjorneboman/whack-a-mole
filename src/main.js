import { Game } from './modules/Game.js';

// Hämta UI-element
const ui = {
    boardEl: document.querySelector('#board'),
    scoreEl: document.querySelector('#score'),
    timeEl: document.querySelector('#time'),
    missesEl: document.querySelector('#misses'),
    startBtn: document.querySelector('#startBtn'),
    resetBtn: document.querySelector('#resetBtn')
};
const game = new Game(ui);
game.init(); // Skapar bräde, binder events
ui.startBtn.addEventListener('click', () => game.start());
ui.resetBtn.addEventListener('click', () => game.reset());

console.log(game)