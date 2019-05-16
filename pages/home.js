import {h} from "snabbdom";
import {store} from "../store"
import {START_GAME, HYDRATE_PLAYER, INSERT_PLAYERS, SAVE_NAME} from "../action";
import {camera} from '../plugins';
import {Cell, Grid, Row} from "../grid";
import {bindModel, debounce} from "../utils";
import {styled} from "../elm";

const picHandler = player => camera.shot().then(image => {
    store.dispatch(HYDRATE_PLAYER, {
        player,
        image
    })
}).catch(() => {})

const gameHandler = _ => {
    store.dispatch(INSERT_PLAYERS);
}

const nameHandler = player => e => {
    store.dispatch(SAVE_NAME, { player, name: e.target.value })
};

function Home({ players }) {
    return Grid([
        Row([ Cell(h('h1', 'Morpion ELM'))]),

        Row(players.map((_, i) => Cell(h('h2', `Player ${++i}`)))),

        Row(players.map(player => Cell(h('input', {
            props: {
                type: 'text',
                placeholder: 'Pseudo',
                value: player.name
            },
            style: styled`
                margin-bottom: 25px;
                padding: 10px 0;
                width: 100%;
            `,
            on: {keyup: debounce(nameHandler(player), 500)}
        })))),

        Row(players.map(player => Cell(!player.hasImage()
            ? h('div', {
                style: styled`
                    width: 150px;
                    height: 150px;
                    border: black solid 1px;
                    text-align: center;
                    line-height: 150px;
                `,
                on: {click: e => picHandler(player)}
            }, 'Take picture')
            : h('img', {
                style: styled`
                    width: 150px;
                `,
                props: {
                    width: 150,
                    src: player.image,
                    alt: player.name
                },
                on: {click: e => picHandler(player)}
            })
        ))),

        Row([
            Cell(h('button', {
                style: styled`
                    margin-top: 50px;
                `,
                props: {disabled: !!players.find(player => !player.valid())},
                on: {click: gameHandler}
            }, 'Jouer'))
        ])
    ]);
}

export default store.connect(Home, ({players}) => ({
    players
}))