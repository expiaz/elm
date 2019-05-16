import {
    CHANGE_PAGE, END_PAGE, GAME_PAGE, HOME_PAGE, RESTART_GAME, SQUARE_CLICK, START_GAME,
    WIN_GAME, INSERT_PLAYERS, SAVE_SCORES, SAVE_NAME, HYDRATE_PLAYER
} from "./action"
import {Board} from "./model";
import {getPlayer, playerExists} from "./repository";

function randomPlayer(players) {
    return players[Math.floor(Math.random() * players.length)];
}

/**
 * home page reducer
 * @param state
 * @param action
 * @param payload
 * @return {*}
 */
function homeReducer(state, action, payload) {
    switch (action) {
        case INSERT_PLAYERS:
            return (dispatch) => {
                return Promise.all(state.players.map(
                    (player) => getPlayer(player.name).catch(_ => player.insert())
                )).then(() => dispatch(START_GAME))
            }
        case START_GAME:
            return {
                ... state,
                page: GAME_PAGE,
                winner: null,
                board: new Board(),
                player: randomPlayer(state.players)
            };
            break;
        case SAVE_NAME: {
            const { player, name } = payload
            player.name = name.trim()
            return async dispatch => {
                try {
                    // hydrate the player from found one
                    const { image, wins, equals, defeats } = await getPlayer(name)
                    dispatch(HYDRATE_PLAYER, { player, image, wins, equals, defeats })
                } catch (e) {
                    // doesn't exists
                }
            }
        }
        case HYDRATE_PLAYER: {
            const { player, image, wins, equals, defeats } = payload
            return {
                ... state,
                players: state.players.map(p => {
                    if (p === player) {
                        p.image = image;
                        if (wins) {
                            p.wins = wins;
                        }
                        if (equals) {
                            p.equals = equals;
                        }
                        if (defeats) {
                            p.defeats = defeats;
                        }
                    }
                    return p;
                })
            }
        }
        default:
            return state;
    }
}

/**
 * game page reducer
 * @param state
 * @param action
 * @param payload
 * @return {*}
 */
function gameReducer(state, action, payload) {
    switch (action) {
        case SAVE_SCORES:
            return (dispatch) => {
                return Promise.all(state.players.map(player => player.update()))
                    .then(() => dispatch(WIN_GAME, payload))
            }
        case SQUARE_CLICK:
            // payload contains the position of the click on the grid
            state.board.grid[payload] = state.player;
            const win = state.board.winner();
            if (win) {
                // the winner scores 1 point
                ++win.wins;
                // looser scores a defeat
                ++state.players[win === state.players[0] ? 1 : 0].defeats;
                return dispatch => {
                    dispatch(SAVE_SCORES, win);
                }
            }
            if (state.board.full()) {
                // null
                state.players.forEach(player => {
                    ++player.equals;
                });
                return dispatch => {
                    dispatch(SAVE_SCORES);
                }
            }
            return {
                ... state,
                player: state.players[state.player === state.players[0] ? 1 : 0]
            }
            break;
        case WIN_GAME:
            if (payload) {
                return {
                    ... state,
                    winner: payload,
                    page: END_PAGE
                }
            }
            // match nul
            return {
                ... state,
                winner: null,
                page: END_PAGE
            }
        default:
            return state;
    }
}

/**
 * end page reducer
 * @param state
 * @param action
 * @param payload
 * @return {*}
 */
function endReducer(state, action, payload) {
    switch (action) {
        case RESTART_GAME:
            return {
                ... state,
                page: GAME_PAGE,
                player: randomPlayer(state.players),
                winner: null,
                board: new Board()
            };
            break;
        default:
            return state;
    }
}

/**
 * Root Reducer, called each re-rendering
 * it'll only serve as router for now
 * @param state
 * @param action
 * @param payload
 * @return {*}
 */
export function reducer(state, action, payload) {
    if (action === CHANGE_PAGE) {
        return { ... state, page: payload };
    }
    switch (state.page) {
        case GAME_PAGE:
            return gameReducer(state, action, payload);
        case HOME_PAGE:
            return homeReducer(state, action, payload);
        case END_PAGE:
            return endReducer(state, action, payload);
        default:
            return state;
    }
}