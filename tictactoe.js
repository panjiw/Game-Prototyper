var board = new Board(3, 3);

var baseTile = new Tile("base", 'b', 'Base tile, does nothing');
board.setBorderColor("black");

var tiles2D = [['b', 'b', 'b'], ['b', 'b', 'b'], ['b', 'b', 'b']];
board.fillTiles(tiles2D);

var xo = new Actor("XO", "", "X or O actor");
baseTile.x = undefined;
baseTile.y = undefined;
xo.addBlacklist(baseTile);
xo.addTag("Playable");

var onlyMyself = function(self, other) {
  return self.set ? false : self === other;
};

var falseRequirement = Actor.getEmptyRequirement();
falseRequirement.addTag("None");

var setSymbol = function(symbol, self) {
  self.set = true;
  var ind = self.tags.indexOf("Playable");
  self.tags.splice(ind, 1);
  CompleteGame.hasSet = true;
  self.symbol = symbol;
  CompleteGame.board.setActive(falseRequirement);
};

var changeToX = new Action("X", "Change to X");
changeToX.setApplicabilityChecker(onlyMyself);
changeToX.setAct(function (self, other) { setSymbol("X", self); });

var changeToO = new Action("O", "Change to O");
changeToO.setApplicabilityChecker(onlyMyself);
changeToO.setAct(function (self, other) { setSymbol("O", self); });

xo.addAction(changeToX);
xo.addAction(changeToO);

var actors3D = [[[''], [''], ['']], [[''], [''], ['']], [[''], [''], ['']]];
board.fillActors(actors3D);

var turns = new Turns();
turns.setTurnCompleteChecker(function(game) {
  return game.hasSet;
});

turns.setGameOverChecker(function(game) {
   var bh = game.board.getInBetween(0, 0, 2, 0);
   var bv = game.board.getInBetween(0, 0, 0, 2);
   var mh = game.board.getInBetween(0, 1, 2, 1);
   var mv = game.board.getInBetween(1, 0, 1, 2);
   var th = game.board.getInBetween(2, 2, 0, 2);
   var tv = game.board.getInBetween(2, 2, 2, 0);
   var d1 = game.board.getInBetween(0, 0, 2, 2);
   var d2 = game.board.getInBetween(2, 0, 0, 2);
   return ((bh[0].symbol === bh[1].symbol) && (bh[1].symbol === bh[2].symbol)) && (bh[0].symbol === 'X' || bh[0].symbol === 'O') ||
          ((bv[0].symbol === bv[1].symbol) && (bv[1].symbol === bv[2].symbol)) && (bv[0].symbol === 'X' || bv[0].symbol === 'O') ||
          ((mh[0].symbol === mh[1].symbol) && (mh[1].symbol === mh[2].symbol)) && (mh[0].symbol === 'X' || mh[0].symbol === 'O') ||
          ((mv[0].symbol === mv[1].symbol) && (mv[1].symbol === mv[2].symbol)) && (mv[0].symbol === 'X' || mv[0].symbol === 'O') ||
          ((th[0].symbol === th[1].symbol) && (th[1].symbol === th[2].symbol)) && (th[0].symbol === 'X' || th[0].symbol === 'O') ||
          ((tv[0].symbol === tv[1].symbol) && (tv[1].symbol === tv[2].symbol)) && (tv[0].symbol === 'X' || tv[0].symbol === 'O') ||
          ((d1[0].symbol === d1[1].symbol) && (d1[1].symbol === d1[2].symbol)) && (d1[0].symbol === 'X' || d1[0].symbol === 'O') ||
          ((d2[0].symbol === d2[1].symbol) && (d2[1].symbol === d2[2].symbol)) && (d2[0].symbol === 'X' || d2[0].symbol === 'O');
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

var TicTacToe = new Game("Tic Tac Toe", board, turns);
TicTacToe.hasSet = false;
