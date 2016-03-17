/*


This is a variant of connect 4, the game where pieces are dropped from the top of a 
standing board and would drop to the bottom. It's like tic tac toe but you must place
from the bottom up.

It's a prototype testing how it might play
with changing board dimensions, and times each player can place a piece per turn.


*/


var maxX = 10;
var maxY = 10;
var TURNS_PER_PLAYER = 1;

var board = new Board(maxX, maxY);

var baseTile = new Tile("base", 'b', 'Base tile, does nothing');
baseTile.setColor("white");
board.setBorderColor("black")

// Filling the board with white tiles2D

// var tiles2D = [['b', 'b', 'b', 'b', 'b', 'b', 'b'],
//                ['b', 'b', 'b', 'b', 'b', 'b', 'b'], 
//                ['b', 'b', 'b', 'b', 'b', 'b', 'b'], 
//                ['b', 'b', 'b', 'b', 'b', 'b', 'b'], 
//                ['b', 'b', 'b', 'b', 'b', 'b', 'b'], 
//                ['b', 'b', 'b', 'b', 'b', 'b', 'b'], 
//                ['b', 'b', 'b', 'b', 'b', 'b', 'b'], 
//                ];


var tiles2D = [];
for (var i = 0; i < maxY; i++) {
  var arr = [];
  for (var j = 0; j < maxX; j++) {
    arr.push('b');
  }
  tiles2D.push(arr);
}

board.fillTiles(tiles2D);


// fallThrough represents places on the board that the piece cannot be place. 

var fallThrough = new Actor("cantChange", "no", "");

// make transparent since I don't want symbol 'no' appearing on board
fallThrough.setRepresentation("http://pgmagick.readthedocs.org/en/latest/_images/transparent.png");
var xo = new Actor("Checker", "", "Red Or Black Checker Piece");
xo.addBlacklist(baseTile);

// These are the actors that will change into pieces on the board.
// When clicked they will have actors checked against for playability against.
xo.addTag("Playable");

// The actors that the xo (playable) can interact with
// Just going to only change this one
var onlyMyself = function(self, other) {
  return self.set ? false : self === other;
};


// when 
var falseRequirement = Actor.getEmptyRequirement();
falseRequirement.addTag("None");

var setSymbol = function(symbol, self) {
  if (self.y < maxY - 1) {
    CompleteGame.board.actors[self.x][self.y + 1][0] = self.clone();
    CompleteGame.board.actors[self.x][self.y + 1][0].y = self.y + 1;
  }
  self.set = true;
  var ind = self.tags.indexOf("Playable");
  self.tags.splice(ind, 1);
  if (turns.getCurrentTurn().name == "Player 1") {
    self.setRepresentation("http://bristle.com/~michael/grey-checker.png");
  } else {
    self.setRepresentation("http://bristle.com/~michael/red-checker.png");
  }
  self.symbol = symbol;
  CompleteGame.board.setActive(falseRequirement);
  CompleteGame.hasSet = true;
}

var dropPiece = new Action("Drop Piece", "Places piece at location");
dropPiece.setApplicabilityChecker(onlyMyself);
dropPiece.setAct(function (self, other) { setSymbol("O", self); });

xo.addAction(dropPiece);

// var actors3D = [[['no'], ['no'], ['no'], ['no'], ['no'], ['no'], ['no']],
//                [['no'], ['no'], ['no'], ['no'], ['no'], ['no'], ['no']],
//                [['no'], ['no'], ['no'], ['no'], ['no'], ['no'], ['no']],
//                [['no'], ['no'], ['no'], ['no'], ['no'], ['no'], ['no']],
//                [['no'], ['no'], ['no'], ['no'], ['no'], ['no'], ['no']],
//                [['no'], ['no'], ['no'], ['no'], ['no'], ['no'], ['no']],
//                [[''], [''], [''], [''], [''], [''], ['']],
//                ];

var actors3D = [];
for (var i = 0; i < maxY - 1; i++) {
  var arr = [];
  for (var j = 0; j < maxX; j++) {
    arr.push(['no']);
  }
  actors3D.push(arr);
}
var arr = [];
for (var i = 0; i < maxX; i++) {
  arr.push(['']);
}
actors3D.push(arr);

// put the array representation into the board
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

var blackTurn = Turns.getPlayerTurn("Player 1");
blackTurn.requirementForActiveStart = activeReq;
blackTurn.beforeStart = resetHasSet;

var redTurn = Turns.getPlayerTurn("Player 2");
redTurn.requirementForActiveStart = activeReq;
redTurn.beforeStart = resetHasSet;

for (var i = 0; i < TURNS_PER_PLAYER; i++) {
  turns.addTurn(blackTurn);
}
for (var i = 0; i < TURNS_PER_PLAYER; i++) {
  turns.addTurn(redTurn);
}

// Create the game
// called by exporter.js which will connect your game to the webpage
var ConnectN = new Game("Connect N", board, turns);
ConnectN.hasSet = false;
