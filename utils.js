/**
 * wrap a callback function into a promise
 * @param {Function} fn
 * @param {Object?} to the context
 * @return {Function}
 */
export function promisify(fn, to = null) {
    /**
     * @return {Promise<*>}
     */
    return function() {
        const args = arguments;
        return new Promise((resolve, reject) => {
            fn.apply(to, [... args, res => resolve(res), err => reject(err)]);
        });
    }
}

export function assert(test, msg = '') {
    if (!test) throw new Error(msg);
}

export function kill () {
    navigator.app.exitApp();
}

export function toB64(data = '') {
    return `data:image/jpeg;base64,${data}`;
}

/**
 * bind an event to an object property
 * each time the returned function is called
 * it'll affect the event value to the property
 * @param {object} o
 * @param {string} prop
 * @return {function(e: Event)}
 */
export function bindModel(o, prop) {
    return e => {
        o[prop] = e.target.value;
    }
}

/**
 *
 * @param {string} browser the browser name (e.g. chrome, edge, trident (ie), opera, apple, mozilla ...)
 * @param {number?} version the minimal major release requested
 * @return {boolean}
 */
export function isBrowser(browser, version = 0) {
    const regExp = new RegExp(version ? `${browser}[^\\/]*\\/([\\w.]+)` : browser, 'i');
    const found = navigator.userAgent.match(regExp);
    // found = null|[matches]
    if (!found) {
        return false;
    }
    // no version specified => match only browser
    if (!version) {
        return true;
    }
    // match also major version
    // ['browser/65.52.63', '65.52.63'] => 65
    const v = found[1].split('.')[0] | 0;
    return v >= version;
}

/**
 * check for Grid display support in a browser
 * by checking 'gridTemplateColumns' existance
 * in the css declaration of div element
 * @return {boolean}
 */
export function isGridSupported() {
    return window.getComputedStyle(document.createElement('div')).hasOwnProperty('gridTemplateColumns');
}

/**
 * execute 'func' max every 'delay' milliseconds
 * @param {function} func the callback function
 * @param {number} delay the delay in milliseconds
 * @return {function}
 */
export function debounce(func, delay) {
    let timeout;
    return (... args) => {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => func.apply(this, args), delay)
    };
}