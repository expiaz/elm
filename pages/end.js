import {h} from "snabbdom"
import {store} from "../store"
import {CHANGE_PAGE, HOME_PAGE} from "../action";
import {Cell, Grid, Row} from "../grid";

const replayHandler = e => {
    store.dispatch(CHANGE_PAGE, HOME_PAGE)
}

function End ({ winner, players }) {
    return Grid([
        Row([ Cell(h('h1', winner ? `${winner.name} Wins !` : 'Match nul !')) ]),
        Row([ Cell(h('h2', 'Scores')) ]),
        Row([
            Cell(h('div')),
            Cell(h('div','Wins')),
            Cell(h('div', 'Equals')),
            Cell(h('div', 'Defeats')),
        ]),
        ... players.map(player => Row([
            Cell(h('h3', {
                style: {marginTop: '15px'}
            }, player.name)),
            Cell(h('div', player.wins)),
            Cell(h('div', player.equals)),
            Cell(h('div', player.defeats))
        ])),
        Row([ Cell(h('button', {
                on: {click: replayHandler},
                style: {marginTop: '50px'}
            }, 'Rejouer')) ])
    ]);
}

export default store.connect(End, ({ winner, players }) => ({
    winner,
    players
}))