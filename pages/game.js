import {h} from "snabbdom";
import {store} from "../store"
import {SQUARE_CLICK} from "../action";

import {Cell as cell, Row as row, Grid as grid} from "../grid"

const clickHandler = (i, value) => e => store.dispatch(SQUARE_CLICK, i);

function Cell(value, handler) {
    return h('div.cell', {
        on: value ? {} : { click: handler },
        style: { width: '50px', height: '50px', margin: '5px', background: 'red' }
    }, value ? [
            h('img', {
                props: { src: value.image, width: 50, height: 50 }
            })
        ] : []
    );
}

function Board(board) {
    return [0, 1, 2].map(
        (_, i) => row(board.slice(i*3, i*3+3).map(
            (c, j) => cell(Cell(c, clickHandler(j+i*3)))
        ))
    )
}

function Header(player) {
    return h('h1', {
        style: {marginBottom: '50px'}
    }, `Tour de ${player.name}`);
}

export function Game ({ player, board }) {
    return grid([
        row([ cell(Header(player)) ]),
        ...Board(board)
    ]);
}

export default store.connect(Game, ({ player, board }) => ({
    player,
    board: board.grid
}))