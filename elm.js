import {init} from 'snabbdom';
import toVNode from 'snabbdom/tovnode';

import * as className from 'snabbdom/modules/class';
import props from 'snabbdom/modules/props';
import attrs from 'snabbdom/modules/attributes';
import style from 'snabbdom/modules/style';
import eventlisteners from 'snabbdom/modules/eventlisteners';

/**
 * are two objects the same ? (by reference or symbol)
 * @param x {*}
 * @param y {*}
 * @return {boolean}
 */
const is = (x, y) => {
    if (x === y) {
        return x !== 0 || y !== 0 || 1 / x === 1 / y
    } else {
        return x !== x && y !== y
    }
}

/**
 * are the shapes of two object identical ?
 * @param a {Object}
 * @param b {Object}
 * @return {boolean}
 */
const shallowDiff = (a, b) => {
    if (is(a, b)) return false;
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return true;
    for (var key in a) if (a.hasOwnProperty(key) && (!b.hasOwnProperty(key) || !is(a[key], b[key]))) return true;
    for (var key in b) if (b.hasOwnProperty(key) && !a.hasOwnProperty(key)) return true;
    return false;
}

/**
 *
 * @param a {*}
 * @return {*}
 */
const identity = a => a;

/**
 * my-name => myName
 * @param str {String}
 * @return {String}
 */
function camelize(str) {
    return str.replace(/([\w])[_-]([\w])/g, function (fullMatch, before, after) {
        return before + after.toUpperCase();
    })
}

/**
 * myName => my-name
 * @param str {String}
 * @return {String}
 */
function hyphenize(str) {
    return str.replace(/[A-Z]/g, t => `-${t.toLowerCase()}`);
}

/**
 * diff two dom trees and update the first one acording to the diff between them
 * @type {(oldVnode: (Element | VNode), vnode: VNode) => VNode}
 */
const patch = init([
    className,
    props,
    attrs,
    style,
    eventlisteners
]);

/**
 * css style declaration into an object to DOM node
 * @param stylesheet
 * @return {CSSStyleDeclaration}
*/
export const styled = (styles, ... args) =>
    (args.length && args.map((v, i) => styles[i] + v) || styles)
        .join('').split('\n')
        .filter(line => !!line.trim().length)
        .reduce((css, line) => {
            const [prop, val] = line.trim().split(':');
            css[camelize(prop)] = val.replace(';', '').trim();
            return css;
        }, {})


export {h} from 'snabbdom';

/**
 * handle the state of the application and re-render the app when it changes
 */
export class Store {

    /**
     *
     * @param initialState {Object} the state shape of the app
     * @param reducer {Function} the 'controller' of the app, will be called every dispatch
     * @constructor
     */
    constructor(initialState, reducer) {
        this.state = initialState;
        this.reducer = reducer;
    }

    /**
     * mount the app on a DOM node
     * @param root {HTMLElement}
     * @param app {Function}
     * @return {HTMLElement} the mount point of the app
     */
    mount(root, app) {
        this.rootNode = toVNode(root);
        this.render = app;
        this.vNode = this.render(this.state);
        patch(this.rootNode, this.vNode);
    }

    unmount() {
        patch(this.rootNode, this.rootNode);
    }

    /**
     * call every reducer to his parameters to compute the new state
     * from the action and payload before re-rendering the app with it
     * @param {String|Object} action
     * @param {Object?} payload
     * @return {Object|Promise<Object>} the new state
     */
    dispatch(action, payload) {
        if (typeof action === 'object') {
            payload = action.payload;
            action = action.action;
        }

        const actualState = this.getState();
        const reducerRet = this.reducer(actualState, action, payload);

        // async call, pass it dispatch as an hook when data comes back from async call
        if (typeof reducerRet === 'function') {
            // async calls mostly returns Promises
            return Promise.resolve(
                reducerRet(this.dispatch.bind(this))
            ).then(() => this.getState());
        }

        if (typeof reducerRet !== 'object') {
            throw new Error(`Reducer must return a function, ${reducerRet} returned in ${this.reducer.name}`);
        }

        const newState = reducerRet;
        if (newState !== actualState || shallowDiff(actualState, newState)) {
            this.state = newState;
            var newVNode = this.render(this.getState());
            // compute shadow dom modifications
            patch(this.vNode, newVNode);
            this.vNode = newVNode;
        }

        return this.getState();
    }

    /**
     * subscribe a component to the store
     * each time the component is rendered
     * part of the new state will be passed as props
     * @param {Function} component
     * @param {Function} mapStateToProps
     * @return {Function}
     */
    connect(component, mapStateToProps) {
        return (nextProps, nextChildrens) => component(
            { ... nextProps, ... (mapStateToProps || identity)(this.getState()) },
            nextChildrens
        );
    }

    /**
     *
     * @param {Object} state
     * @param {String} action
     * @param {Object} payload
     * @return {Object}
     */
    reducer(state, action, payload) {
        switch (action) {
            default:
                return state;
        }
    }

    /**
     *
     * @return {Object}
     */
    getState() {
        return { ... this.state };
    }

}