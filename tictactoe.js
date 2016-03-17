// Setup empty 3x3 board
var board = new Board(3, 3);

// Create an empty tile
// The symbol must be unique
var baseTile = new Tile("base", 'b', 'Base tile, does nothing');
board.setBorderColor("black");

// Place the tile on the board
// 'b' is the symbol given to the tile
// Every position will be filled by a cloned instance of the tile
var tiles2D = [['b', 'b', 'b'], ['b', 'b', 'b'], ['b', 'b', 'b']];
board.fillTiles(tiles2D);

// Create state storing actor
var xo = new Actor("XO", "", "X or O actor");
// Tiles will be presented to the Action as a possible acts
// To counter that have the tile blaclisted
baseTile.x = undefined;
baseTile.y = undefined;
// Blacklist are to contain requirements so any part ot the
// actor that is not a requirement must be undefined
xo.addBlacklist(baseTile);
// Tag can be any string
xo.addTag("Playable");

// Create transform action
// True only for yourself
var onlyMyself = function(self, other) {
  return self.set ? false : self === other;
};

// A requirement that no actor can fulfill as no actor has the "None" tag
var falseRequirement = Actor.getEmptyRequirement();
falseRequirement.addTag("None");

// The main action
var setSymbol = function(symbol, self) {
  // set is a field attached to the Actor
  // you can attach anything to Actor as it's just a JS object
  self.set = true;
  // Make the actor non-playable in the future
  var ind = self.tags.indexOf("Playable");
  self.tags.splice(ind, 1);
  // hasSet is also an attached field, this time to the final Game object
  CompleteGame.hasSet = true;
  self.symbol = symbol;
  // Turn all actors off
  CompleteGame.board.setActive(falseRequirement);
};

// Create the actions
var changeToX = new Action("X", "Change to X");
// applicability checker determines whether given the actor and potential actee
// that this action can be called on the actee
changeToX.setApplicabilityChecker(onlyMyself); // can only act on myself
changeToX.setAct(function (self, other) { setSymbol("X", self); }); // the action

var changeToO = new Action("O", "Change to O");
changeToO.setApplicabilityChecker(onlyMyself);
changeToO.setAct(function (self, other) { setSymbol("O", self); });

// Add the action to the actor
xo.addAction(changeToX);
xo.addAction(changeToO);

// fill the board
// again each symbol means that the position will be filled with a clone
// of the actor with that symbol
var actors3D = [[[''], [''], ['']], [[''], [''], ['']], [[''], [''], ['']]];
board.fillActors(actors3D);

// Setup the turns
var turns = new Turns();

// set what to check to see whether a turn has completed
turns.setTurnCompleteChecker(function(game) {
  return game.hasSet;
});

// Optional
// You can also set a checker that checks whether the game has finished or not
// Used to show a "Game Over" under the stats and nothing else
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

// Rquirement that any actor with "Playable" tag can pass
var activeReq = Actor.getEmptyRequirement();
activeReq.addTag("Playable");
var resetHasSet = function() {
  CompleteGame.hasSet = false;
};

// Add the turns in order
var xTurn = Turns.getPlayerTurn("Player 1");
xTurn.requirementForActiveStart = activeReq; // all actors will be active on turn start
xTurn.beforeStart = resetHasSet; // the hasSet field is reset at the end of a turn
turns.addTurn(xTurn);

var oTurn = Turns.getPlayerTurn("Player 2");
oTurn.requirementForActiveStart = activeReq;
oTurn.beforeStart = resetHasSet;
turns.addTurn(oTurn);

// Create game
var TicTacToe = new Game("Tic Tac Toe", board, turns);

// Setup whole game data
TicTacToe.hasSet = false;
