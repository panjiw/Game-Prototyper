if (typeof(module) !== 'undefined') {
  var Game = require('./game.js').Game;
  var Board = require('./board.js').Board;
  var Actor = require('./actor.js').Actor;
  var Tile = require('./tile.js').Tile;
  var Action = require('./action.js').Action;
  var Turns = require('./turns.js').Turns;
}

var board = new Board(3, 3);

var baseTile = new Tile("base", 'b', 'Base tile, does nothing');
var tiles2D = [['b', 'b', 'b'],
               ['b', 'b', 'b'],
               ['b', 'b', 'b']];
board.fillTiles(tiles2D);

var xo = new Actor("XO", "p", "X or O actor");
xo.addBlacklist(baseTile);
xo.addTag("Playable");

var onlyMyself = function(self, other) {
  return self.set ? false : self === other;
};

var changeToX = new Action("X", "Change to X");
changeToX.setApplicabilityChecker(onlyMyself);
changeToX.setAct(function(self, other) {
  self.set = true;
  self.value = 'x';
  self.active = false;
});

var changeToO = new Action("O", "Change to O");
changeToO.setApplicabilityChecker(onlyMyself);
changeToO.setAct(function(self, other) {
  self.set = true;
  self.value = 'o';
  self.active = false;
});

xo.addAction(changeToX);
xo.addAction(changeToO);

var actors3D = [[['p'], ['p'], ['p']],
  [['p'], ['p'], ['p']],
  [['p'], ['p'], ['p']]];
board.fillActors(actors3D);

var turns = new Turns();
turns.setTurnCompleteChecker(function(game) {
  return game.hasSet;
});

var activeReq = Actor.getEmptyRequirement();
activeReq.addTag("Playable");
var xTurn = Turns.getPlayerTurn();
xTurn.requirementForActiveStart = activeReq;
xTurn.controllableTag.push("Playable");
turns.addTurn(xTurn);

var oTurn = Turns.getPlayerTurn();
oTurn.requirementForActiveStart = activeReq;
oTurn.controllableTag.push("Playable");
turns.addTurn(oTurn);

var TicTacToe = new Game(board, turns);
TicTacToe.hasSet = false;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
  module.exports = {
    CompleteGame: TicTacToe
  };
else
  window.CompleteGame = TicTacToe;