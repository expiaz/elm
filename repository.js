import database from "./plugins/database";
import {Player} from "./model";

let dbPtr = null;
export function initDatabase() {
    return database
        .connect()
        .then(db => dbPtr = db)
        .then(() => dbPtr.query(
            `CREATE TABLE IF NOT EXISTS player (
              \`name\` TEXT PRIMARY KEY,
              \`image\` TEXT NOT NULL,
              \`wins\` INTEGER DEFAULT 0,
              \`equals\` INTERGER DEFAULT 0,
              \`defeats\` INTEGER DEFAULT 0
            );`
        ))
        .catch(err => {
            alert('Could not init DB');
            console.error(err);
        })
}

export function insertPlayer({ name, image }) {
    return dbPtr.query('INSERT INTO player (name, image) VALUES (:name, :image)', {
        name,
        image
    })
}

export function updatePlayer({ name, wins, equals, defeats }) {
    return dbPtr.query('UPDATE player SET `wins` = :wins, `equals` = :equals, `defeats` = :defeats WHERE name = :name', {
        name,
        wins,
        equals,
        defeats
    })
}

export function getPlayer(name) {
    return dbPtr.query('SELECT * FROM player WHERE name = :name', { name })
        .then(res => {
            return res.rows.length ? res.rows.item(0) : Promise.reject();
        }).then(({ name, image, wins, equals, defeats }) => {
            return new Player(name, image, wins, equals, defeats);
        })
}

export function playerExists(name) {
    return getPlayer(name)
        .then(_ => true)
        .catch(_ => false)
}