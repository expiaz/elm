import {store} from "./store"
import {database} from './plugins';
import {Home, Game, End} from './pages';
import {END_PAGE, GAME_PAGE, HOME_PAGE} from "./action";
import {getPlayer, initDatabase} from "./repository";

const app = ({ page }) => {
    switch (page) {
        case HOME_PAGE:
            return Home();
        case GAME_PAGE:
            return Game();
        case END_PAGE:
            return End();
    }
}

document.addEventListener('deviceready', () => {
    const root = document.querySelector('#app');

    initDatabase().then(db => {
        store.mount(root, app);
        window.db = db;
        window.store = store;
    })
})
