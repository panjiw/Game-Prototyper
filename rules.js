if (typeof(module) !== 'undefined') {
  var Game = require('./game.js').Game;
  var Board = require('./board.js').Board;
  var Actor = require('./actor.js').Actor;
  var Tile = require('./tile.js').Tile;
  var Action = require('./action.js').Action;
  var Turns = require('./turns.js').Turns;
}

// SET THESE GLOBALS TO YOUR GAME
var GAME_RULES = 'tictactoe.js';

var rulesScript = document.createElement("script");
rulesScript.type = 'text/javascript';
rulesScript.src = GAME_RULES;

document.getElementsByTagName('head')[0].appendChild(rulesScript);

var exportScript = document.createElement("script");
exportScript.type = 'text/javascript';
exportScript.src = 'exporter.js';

document.getElementsByTagName('head')[0].appendChild(exportScript);
