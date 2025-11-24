 // Klass som *lägger till* och *tar bort* DOM-element dynamiskt.
export class Mole {
    constructor(id, cellEl, ttl = 900) {
        this.id = id
        this.cellEl = cellEl;
        this.ttl = ttl;
        this._timeout = null;
        this._root = null; // själva mullvadens DOM-nod
        this.whacked = false
    }
    appear(onExpire) {
        // Skapa en DOM-nod för mullvaden inuti cellen
        this._root = document.createElement('span');
        this._root.className = 'mole'; // stilas i CSS
        this.cellEl.appendChild(this._root);
        this.cellEl.classList.add('has-mole');
        // Försvinn efter ttl om ingen träff
        this._timeout = setTimeout(() => {
            if (typeof onExpire === 'function') onExpire();
            this.disappear();
        }, this.ttl);
    }
    // Anropas vid träff eller timeout
    disappear() {
        if (this._timeout) clearTimeout(this._timeout);
        this._timeout = null;
        if (this._root?.isConnected) this._root.remove();
        this.cellEl.classList.remove('has-mole');
        this._root = null;
    }
    isVisible() {
        return this.cellEl.classList.contains('has-mole');
    }
 }
