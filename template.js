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
// baseTile.setColor("White");
board.setBorderColor("black")
// var tiles2D = [['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
//               ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
//               ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
//               ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
//               ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
//               ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
//               ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
//               ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
//               ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']];
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

var falseRequirement = Actor.getEmptyRequirement();
falseRequirement.addTag("None");

var changeToX = new Action("X", "Change to X");
changeToX.setApplicabilityChecker(onlyMyself);
changeToX.setAct(function(self, other) {
  self.set = true;
  var ind = self.tags.indexOf("Playable");
  self.tags.splice(ind, 1);
  CompleteGame.hasSet = true;
  self.symbol = 'X';
  CompleteGame.board.setActive(falseRequirement);
});

var changeToO = new Action("O", "Change to O");
changeToO.setApplicabilityChecker(onlyMyself);
changeToO.setAct(function(self, other) {
  self.set = true;
  var ind = self.tags.indexOf("Playable");
  self.tags.splice(ind, 1);
  CompleteGame.hasSet = true;
  self.symbol = 'O';
  CompleteGame.board.setActive(falseRequirement);
});

xo.addAction(changeToX);
xo.addAction(changeToO);

var other = new Actor("Other", 'O', "gdfhdhfj");
other.setRepresentation("https://marcelk.net/bookie/img/chesspieces/wikipedia/wK.png");

var o2 = new Actor("o2", 'H', "hkkgg");
o2.setRepresentation("https://marcelk.net/bookie/img/chesspieces/wikipedia/bR.png");

var actors3D = [[['p'], ['p'], ['p']], 
  // [['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p']],
  // [['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p']],
  // [['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p']],
  // [['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p']],
  // [['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p']],
  // [['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p']],
  // [['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p']],
  // [['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p']],
  // [['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p'], ['p']]];
  [['p'], ['p'], ['p']],
  [['p'], ['p'], ['p']]];
board.fillActors(actors3D);

var turns = new Turns();
turns.setTurnCompleteChecker(function(game) {
  return game.hasSet;
});

var activeReq = Actor.getEmptyRequirement();
activeReq.addTag("Playable");
var resetHasSet = function() {
  CompleteGame.hasSet = false;
};
var xTurn = Turns.getPlayerTurn("Player 1");
xTurn.requirementForActiveStart = activeReq;
xTurn.beforeStart = resetHasSet;
turns.addTurn(xTurn);

var oTurn = Turns.getPlayerTurn("Player 2");
oTurn.requirementForActiveStart = activeReq;
oTurn.beforeStart = resetHasSet;
turns.addTurn(oTurn);

var autoTurn = Turns.getEmptyTurn("Auto");
var toDo = Turns.getEmptyToDo();
toDo.setActor(board.actors[2][2][0]);
toDo.setAction(changeToX);
toDo.setActee(board.actors[2][2][0]);
autoTurn.addToDo(toDo);
toDo = Turns.getEmptyToDo();
toDo.setActor(board.actors[0][0][0]);
toDo.setAction(changeToX);
toDo.setActee(board.actors[1][0][0]);
autoTurn.addToDo(toDo);
turns.addTurn(autoTurn);

var TicTacToe = new Game("Tic Tac Toe", board, turns);
TicTacToe.hasSet = false;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
  module.exports = {
    CompleteGame: TicTacToe
  };
else
  window.CompleteGame = TicTacToe;