// Set up the empty board
var board = new Board(8, 8);
var whiteTile = new Tile("White Tile", "w", "White Tile");
var blackTile = new Tile("Black Tile", "b", "Black Tile");
board.setBorderColor("brown");

var tiles2D = [];
var row = [];
for (var i = 0; i <= 8; i++) {
    row[i] = i % 2 == 0 ? "b" : "w";
}
for (var i = 0; i < 8; i++) {
    tiles2D[i] = i % 2 == 0 ? row.slice(0, 8) : row.slice(1, 9);
}
board.fillTiles(tiles2D);

// Create pieces
var pawn = new Actor("Pawn", "P", "Pawn");
pawn.addTag("Pawn");
var rook = new Actor("Rook", "R", "Rook");
rook.addTag("Rook");
var knight = new Actor("Knight", "N", "Knight");
knight.addTag("Knight");
var bishop = new Actor("Bishop", "B", "Bishop");
bishop.addTag("Bishop");
var queen = new Actor("Queen", "Q", "Queen");
queen.addTag("Queen");
var king = new Actor("King", "K", "King");
king.addTag("King");
var pieces = [pawn, rook, knight, bishop, queen, king];

// Create the actions for the pieces
var falseRequirement = Actor.getEmptyRequirement();
falseRequirement.addTag("None");

var movekill = function(self, other) {
    if (!other.hasTag("Tile")) {
        board.actors[other.x][other.y] = [];
    }
    board.moveActor(self, other.x, other.y);
    CompleteGame.hasPlayed = true;
    CompleteGame.board.setActive(falseRequirement);
};

var locationApplicability = function(self, other, kill) {
    if (self.x == other.x && self.y == other.y) {
        return false;
    }
    var numActors = kill ? 2 : 1;
    var pieceType = self.tags[0];
    var pieceColor = self.tags[1];
    var betweens = undefined;
    switch(pieceType) {
        case "Pawn":
            var dir = pieceColor == "White" ? 1 : -1;
            if (kill) {
                return other.y - self.y == dir && Math.abs(other.x - self.x) == 1;
            } else {
                return other.x == self.x && other.y == self.y + dir;
            }
        case "Rook":
            if (other.x == self.x || other.y == self.y) {
                betweens = board.getInBetween(self.x, self.y, other.x, other.y);
                if (typeof betweens !== 'undefined'){
                    return betweens.length == numActors;
                }
            }
            return false;
        case "Bishop":
            if (Math.abs(other.x - self.x) == Math.abs(other.y - self.y)) {
                betweens = board.getInBetween(self.x, self.y, other.x, other.y);
                if (typeof betweens !== 'undefined'){
                    return betweens.length == numActors;
                }
            }
            return false;
        case "Knight":
            var difX = Math.abs(self.x - other.x);
            var difY = Math.abs(self.y - other.y);
            return (difX == 2 && difY == 1) || (difX == 1 && difY == 2);
        case "Queen":
            if (other.x == self.x || other.y == self.y ||
              Math.abs(other.x - self.x) == Math.abs(other.y - self.y)) {
                betweens = board.getInBetween(self.x, self.y, other.x, other.y);
                if (typeof betweens !== 'undefined'){
                    return betweens.length == numActors;
                }
            }
            return false;
        case "King":
            return (Math.abs(other.x - self.x) == 1 && Math.abs(other.y - self.y) == 1) ||
              (Math.abs(other.x - self.x) == 0 && Math.abs(other.y - self.y) == 1) ||
              (Math.abs(other.x - self.x) == 1 && Math.abs(other.y - self.y) == 0);
        default:
            return false;
    }
};

var moveApplicability = function(self, other) {
    if (!other.hasTag("Tile") || board.actors[other.x][other.y].length > 0) {
        return false;
    }
    return locationApplicability(self, other, false);
};

var move = new Action("Move", "Move to a new position");
move.setApplicabilityChecker(moveApplicability);
move.setAct(movekill);

var killApplicability = function(self, other) {
    if (other.hasTag("Tile") || board.actors[other.x][other.y].length == 0) {
        return false;
    }
    return locationApplicability(self, other, true);
};

var kill = new Action("Kill", "Kill the actee piece");
kill.setApplicabilityChecker(killApplicability);
kill.setAct(movekill);

for (i = 0; i < pieces.length; i++) {
    pieces[i].addAction(move);
    pieces[i].addAction(kill);
}

// Create differentiated black and white pieces
var whitePieces = {};
var blackPieces = {};
var imgURL = "https://marcelk.net/bookie/img/chesspieces/wikipedia/";
var noWhitePieces = Actor.getEmptyRequirement();
noWhitePieces.addTag("White");
var noBlackPieces = Actor.getEmptyRequirement();
noBlackPieces.addTag("Black");
for (i = 0; i < 6; i++) {
    var piece = pieces[i];
    whitePieces[piece.name] = piece.clone();
    whitePieces[piece.name].name = "White " + whitePieces[piece.name].name;
    whitePieces[piece.name].setSymbol("w" + whitePieces[piece.name].symbol);
    whitePieces[piece.name].description = "White " + whitePieces[piece.name].description;
    whitePieces[piece.name].setRepresentation(imgURL + whitePieces[piece.name].symbol + ".png");
    whitePieces[piece.name].addTag("White");
    whitePieces[piece.name].addBlacklist(noWhitePieces);

    blackPieces[piece.name] = piece.clone();
    blackPieces[piece.name].name = "Black " + blackPieces[piece.name].name;
    blackPieces[piece.name].setSymbol("b" + blackPieces[piece.name].symbol);
    blackPieces[piece.name].description = "Black " + blackPieces[piece.name].description;
    blackPieces[piece.name].setRepresentation(imgURL + blackPieces[piece.name].symbol + ".png");
    blackPieces[piece.name].addTag("Black");
    blackPieces[piece.name].addBlacklist(noBlackPieces);
}

// Fill the board
var actors3D = [
    [['bR'], ['bN'], ['bB'], ['bQ'], ['bK'], ['bB'], ['bN'], ['bR']],
    [[], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], []],
    [['wR'], ['wN'], ['wB'], ['wQ'], ['wK'], ['wB'], ['wN'], ['wR']]
];
board.fillActors(actors3D);

// Setup the turns
var turns = new Turns();
turns.setTurnCompleteChecker(function(game) {
    return game.hasPlayed;
});

// Add turns in order
var resetHasPlayed = function() {
    CompleteGame.hasPlayed = false;
};
var whiteActiveReq = Actor.getEmptyRequirement();
whiteActiveReq.addTag("White");
var whiteTurn = Turns.getPlayerTurn("White");
whiteTurn.requirementForActiveStart = whiteActiveReq;
whiteTurn.beforeStart = resetHasPlayed;
turns.addTurn(whiteTurn);

var blackActiveReq = Actor.getEmptyRequirement();
blackActiveReq.addTag("Black");
var blackTurn = Turns.getPlayerTurn("Black");
blackTurn.requirementForActiveStart = blackActiveReq;
blackTurn.beforeStart = resetHasPlayed;
turns.addTurn(blackTurn);

// Create game
var Ches = new Game("Ches", board, turns);

// Setup whole game data
Ches.hasPlayed = false;
