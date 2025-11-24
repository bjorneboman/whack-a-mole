import { Mole } from './Mole.js';

// Centrera eventhantering via delegering på brädet (se vecko-materialet om addEventListener & bubbling).

// TODO-markeringar lämnar utrymme för egna lösningar.

export class Game {
    constructor({ boardEl, scoreEl, timeEl, missesEl }) {
        this.boardEl = boardEl;
        this.scoreEl = scoreEl;
        this.timeEl = timeEl;
        this.missesEl = missesEl;
        this.gridSize = 3;
        this.handleBoardClick = this.handleBoardClick.bind(this);
        this.spawnMole = this.spawnMole.bind(this)
        this._initState()
    }
    init() {
        this.createGrid(this.gridSize);
        this.updateHud();
        // Eventdelegering: en lyssnare hanterar alla barn-noder.
        this.boardEl.addEventListener('mousedown', this.handleBoardClick);
        this.boardEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') this.handleBoardClick(e);
        });
    }
    _initState() {
        this.duration = 60; // sekunder
        this.state = { score: 0, misses: 0, timeLeft: this.duration, running: false };
        this._tickId = null;
        this._spawnId = null;
        this._activeMoles = new Set();
    }
    createGrid(size = 3) {
        this.boardEl.innerHTML = '';
        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('button');
            cell.type = 'button';
            cell.className = 'cell';
            cell.setAttribute('aria-label', `Hål ${i + 1}`);
            this.boardEl.appendChild(cell);
        }
    }
    start() {
        if (this.state.running) return;
        this.state.running = true;
        this.state.score = 0;
        this.state.misses = 0;
        this.state.timeLeft = this.duration;
        this.updateHud();

        // TODO: implementera spelloop
        // 1) setInterval: nedräkning av timeLeft
        this._tickId = setInterval(() => {
            this.state.timeLeft -= 1
            this.updateHud()
            if (this.state.timeLeft === 0) return this.gameOver()
        }, 1000)
        
        // 2) setInterval eller rekursiva setTimeout: spawn av mullvadar (variera TTL/frekvens över tid)
        setTimeout(this.spawnMole, 1000)
    }
    gameOver() {
        clearInterval(this._tickId)
        this.state.running = false
    }
    reset() {
        // TODO: städa timers, ta bort aktiva mullvadar, nollställ state och UI
        clearInterval(this._tickId)
        // Tips: loopa this._activeMoles och kalla .disappear()
        for (const mole of this._activeMoles) mole.disappear()
        this._activeMoles.clear()
        this._initState()
        this.updateHud()
    }
    spawnMole() {
        // TODO: välj slumpmässig tom cell och mounta en ny Mole
        if (!this.state.running) return
        const emptyCells = [...document.querySelectorAll('.cell:not(.has-mole)')];
        const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this._spawnId = Date.now()
        const mole = new Mole(this._spawnId, cell /* ttl i ms */);
        this._activeMoles.add(mole);
        mole.appear(() => { 
            if (!mole.cellEl.querySelector(".whacked")) this.state.misses += 1 /* miss om utgång utan träff */ 
            this._activeMoles.delete(mole); 
            this.updateHud
        });
        setTimeout(this.spawnMole, 800);
    }
    handleBoardClick(e) {
        const cell = e.target.closest('.cell');
        if (!cell || !this.state.running) return;
        // TODO: om cellen innehåller en aktiv mullvad => poäng; annars öka missar
        if (cell.className.includes("has-mole")) {
            this.state.score += 1
            cell.querySelector(".mole").classList.add("whacked")
            this.updateHud() 
        } else {
            this.state.misses += 1
            this.updateHud()
        }
        
        // Uppdatera HUD varje gång.
    }
    updateHud() {
        this.scoreEl.textContent = `Poäng: ${this.state.score}`;
        this.timeEl.textContent = `Tid: ${this.state.timeLeft}`;
        this.missesEl.textContent = `Missar: ${this.state.misses}`;
    }
}
