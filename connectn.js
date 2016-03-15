var maxX = 7;
var maxY = 7;
var TURNS_PER_PLAYER = 1;

var board = new Board(maxX, maxY);

var baseTile = new Tile("base", 'b', 'Base tile, does nothing');
baseTile.setColor("white");
board.setBorderColor("black")

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
  for (var j = 0; j < maxY; j++) {
    arr.push('b')
  }
}

board.fillTiles(tiles2D);

var fallThrough = new Actor("cantChange", "no", "");
fallThrough.setRepresentation("http://pgmagick.readthedocs.org/en/latest/_images/transparent.png");
var xo = new Actor("Checker", "", "Red Or Black Checker Piece");
xo.addBlacklist(baseTile);
xo.addTag("Playable");

var onlyMyself = function(self, other) {
  return self.set ? false : self === other;
};

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

var actors3D = [[['no'], ['no'], ['no'], ['no'], ['no'], ['no'], ['no']],
               [['no'], ['no'], ['no'], ['no'], ['no'], ['no'], ['no']],
               [['no'], ['no'], ['no'], ['no'], ['no'], ['no'], ['no']],
               [['no'], ['no'], ['no'], ['no'], ['no'], ['no'], ['no']],
               [['no'], ['no'], ['no'], ['no'], ['no'], ['no'], ['no']],
               [['no'], ['no'], ['no'], ['no'], ['no'], ['no'], ['no']],
               [[''], [''], [''], [''], [''], [''], ['']],
               ];

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
var ConnectN = new Game("Connect N", board, turns);
ConnectN.hasSet = false;
