// game pages
export const HOME_PAGE = 'HOME_PAGE'
export const GAME_PAGE = 'GAME_PAGE'
export const END_PAGE = 'END_PAGE'
// to change the view
export const CHANGE_PAGE = 'CHANGE_PAGE'

// initialize the game board, reset the winner and navigate to game page
export const START_GAME = 'START_GAME';
// affect the winner and navigate to end page
export const WIN_GAME = 'WIN_GAME';
// same as START_GAME but from end page to game page
export const RESTART_GAME = 'RESTART_GAME';
// a player clicked a square, affect the player on the board
// then calculate winner, looser, or nul match and dispatch
// to corresponding action
export const SQUARE_CLICK = 'SQUARE_CLICK'
// affect data (from db) to a player
export const HYDRATE_PLAYER = 'HYDRATE_PLAYER';
// insert the newly created players into the database
export const INSERT_PLAYERS = 'INSERT_PLAYERS';
// save the player scores into the database
export const SAVE_SCORES = 'SAVE_SCORES';
// save the player name into the model and search
// for an existing player into the database
// if found, dispatch PLAYER_IMAGE
export const SAVE_NAME = 'SAVE_NAME';

