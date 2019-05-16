import {h} from 'snabbdom';
import {styled} from "./elm"
import {isGridSupported} from "./utils";

// OLD APIS

function Grid__({ size = 12, gutter = 15, alignment, margin, width }, items) {

    const style = styled`
        display: grid;
        grid-template-columns: repeat(${size}, 1fr);
        grid-template-rows: auto;
        grid-column-gap: ${gutter}px;
        grid-row-gap: ${gutter}px;
    `;

    if (alignment) {
        style.placeItems = alignment;
        style.placeContent = alignment;
    }

    if (width) {
        style.width = width;
    }
    if (margin) {
        style.margin = margin;
    }

    // TODO object representation ? shadow classes vs empty arrays
    const grid = {
        index: 0,
        size
    }; // linear representation of the grid

    return h('div.grid', { style }, items.map((e, i) => {
        var a = e(grid, i);
        console.log({... grid});
        return a;
    }));
}

function Cell__({ cols = 1, rows = 0, col, row, alignment }, component) {
    return (grid, id) => {
        // in css grid layout, the grid-column-[start|end] is comprised between [1, gridSize[
        // to have a full row you'll need grid-column: 1 / gridSize + 1

        // index and size are 0 based [0, gridSize - 1]
        const { index, size } = grid;

        // zero based indexes
        const cellIndex = (col || row) ? row * size + col : index;
        const cellSize = rows * size + cols;
        // auto positionning increment
        if (cellIndex === index) {
            grid.index += cellSize;
        }

        // fill the grid
        const l = cellIndex + cols;
        for(let i = cellIndex; i < l; ++i) {
            grid[i] = id;
        }

        // col and row positionning from inline grid
        const colStart = cellIndex > size ? cellIndex - size : cellIndex; // reste => columns
        const rowStart = cellIndex > size ? (cellIndex / size) | 0 : 0;
        const colEnd = colStart + cols;
        const rowEnd = rowStart + rows;

        const style = styled`
            grid-column-start: ${colStart + 1};
            grid-column-end: ${colEnd + 1};
            grid-row-start: ${rowStart + 1};
            grid-row-end: ${rowEnd + 1};
        `;

        if (alignment) {
            style.alignSelf = alignment;
            style.justifySelf = alignment;
        }

        return h('div.cell', { style }, component);
    }
}

// NEW APIS

/**
 * component approach to define a Grid within Elm application
 */

const defaultOptions = {
    margin: '5%',
    alignment: 'center'
};

/**
 * a grid got rows and columns
 * @param options
 * @param rows
 * @return {VNode}
 */
export function Grid(options, rows) {

    if (Array.isArray(options)) {
        rows = options;
        options = defaultOptions;
    }

    const { size = 12, gutter = 15, alignment, margin, width } = options;

    const style = styled`
        display: grid;
        height: 100%;
        grid-template-columns: repeat(${size}, 1fr);
        grid-template-rows: auto;
        grid-column-gap: ${gutter}px;
        grid-row-gap: ${gutter}px;
    `;

    if (alignment) {
        style.alignItems = alignment;
        style.justifyItems = alignment;
    }

    if (width) {
        style.width = width;
    }
    if (margin) {
        style.margin = margin;
    }

    // TODO object representation ? shadow classes vs empty arrays
    const grid = new class {

        constructor(size) {
            this.size = size;
            this.col = 1;
            this._row = 0;
        }

        get row() {
            return this._row;
        }

        set row(row) {
            this.col = 1;
            this._row = row;
        }

    }(size); // linear representation of the grid

    return h('div.grid', { style }, rows.reduce((acc, row) => [...acc, ...row(grid)], []));
}

/**
 * a row got a number
 * @param row
 * @param cells
 * @return {function(*=)}
 */
export function Row(row, cells) {
    return grid => {
        if(Array.isArray(row)) {
            cells = row;
            grid.row += 1;
        }
        const avgSize = ((grid.size / cells.length) | 0) || 1;
        return cells.map(cell => cell(grid, avgSize)).filter(e => !!e);
    }
}

export function Offset(size) {
    return grid => {
        grid.col += size;
    }
}

/**
 * a cell got a size
 * @param size
 * @param component
 * @return {function(*, *)}
 */
export function Cell(size, component) {
    return (grid, defaultSize) => {
        if (isNaN(parseInt(size))) {
            component = size;
            size = defaultSize;
        }

        const style = styled`
            grid-column-start: ${grid.col};
            grid-column-end: ${grid.col += size};
            grid-row-start: ${grid.row};
            grid-row-end: ${grid.row};
        `;

        return h('div.cell', { style }, component);
    }
}