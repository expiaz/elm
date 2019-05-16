import {promisify} from "../utils"
/*
import {assert, promisify} from "../utils"

assert(window.sqlitePlugin != null, 'sqlite missing');

const sqlite = window.sqlitePlugin;
*/

class Database {

    /**
     *
     * @param {SQLitePlugin} db
     */
    constructor(db) {
        this.db = db;
        this.q = promisify(db.executeSql, db);
        this.b = promisify(db.sqlBatch, db);
    }

    async query (sql, params = {}) {
        const args = [];
        const query = sql.replace(/\:(\w+)/g, (_, key) => {
            if (!params.hasOwnProperty(key)) {
                throw new Error(`Database::query missing parameter ${key}`);
            }
            args.push(params[key]);
            return '?';
        });
        console.log(query, args);
        return this.q(query, args)
            .catch(err => console.error(`Database::query ${query} failed : ${err.message}`));
    }

    async batch (queries, params) {
        return this.b(queries.map(sql => {
            const args = [];
            const query = sql.replace(/\:(\w+)/g, (_, key) => {
                if (!params.hasOwnProperty(key)) {
                    throw new Error(`Database::batch missing parameter ${key}`);
                }
                args.push(params[key]);
                return '?';
            });
            if (args.length) {
                return [query, args];
            }
            return query;
        })).catch(
            err => console.error(`Database::batch ${queries.join(', ')} failed : ${err.message}`)
        );
    }

}

/**
 * @return Promise<Database>
 */
async function connect(name = 'app.db') {
    return new Promise((resolve, reject) => {
        window.sqlitePlugin.openDatabase(
            { name, location: 'default' },
            db => resolve(new Database(db)),
            err => reject(err)
        );
    })
}

export default {
    connect
}