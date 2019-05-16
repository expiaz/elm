import {toB64} from "./utils";
import {insertPlayer, playerExists, updatePlayer} from "./repository";

export class Board {

    constructor() {
        this.grid = Array(9).fill(null);
        this.combinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
    }

    /**
     *
     * @return {Player|null}
     */
    winner() {
        for (let i = 0; i < this.combinations.length; i++) {
            const [a, b, c] = this.combinations[i];
            if (this.grid[a] && this.grid[a] === this.grid[b] && this.grid[a] === this.grid[c]) {
                return this.grid[a];
            }
        }
        return null;
    }

    full() {
        return this.grid.indexOf(null) === -1;
    }

}

export class Player {

    constructor(name = '', image = '', wins = 0, equals = 0, defeats = 0) {
        this.name = name;
        this.image = image;

        this.wins = wins;
        this.equals = equals;
        this.defeats = defeats;
    }

    set name(name) {
        this._name = name.trim().substr(0, 40);
    }

    get name() {
        return this._name;
    }

    set image(data) {
        this._image = data.startsWith(toB64()) ? data : toB64(data);
    }

    get image() {
        return this._image;
    }

    hasImage() {
        return this.image.startsWith(toB64()) && this.image.length > toB64().length;
    }

    valid() {
        return this.name.length && this.hasImage();
    }

    insert() {
        return insertPlayer(this);
    }

    update() {
        return updatePlayer(this);
    }

    exists() {
        return playerExists(this);
    }


}