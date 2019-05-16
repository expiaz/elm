import {Store} from './elm';
import {HOME_PAGE} from "./action";
import {reducer} from "./reducer";
import {Player} from './model';
import {Board} from "./model";

const initialState = {
    // home
    players: Array(2).fill(null).map(() => new Player()),
    // game
    board: new Board(),
    player: null,
    // end
    winner: null,
    // router
    page: HOME_PAGE,
}

export const store = new Store(initialState, reducer);