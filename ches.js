// Set up the empty board
var board = new Board(8, 8);
var whiteTile = new Tile("White Tile", "w", "White Tile");
var blackTile = new Tile("Black Tile", "b", "Black Tile");
board.setBorderColor("brown");

// Create the checkerboard pattern then fill the board
// 'w' and 'b' are the symbols given to the tile
// Every position will be filled by a cloned instance of the tile
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
// A requirement that no actor can fulfill as no actor has the "None" tag
var falseRequirement = Actor.getEmptyRequirement();
falseRequirement.addTag("None");

// The action
// In chess move and kill are basically the same
var movekill = function(self, other) {
    if (!other.hasTag("Tile")) {
        board.actors[other.x][other.y] = []; // empty the new position
    }
    board.moveActor(self, other.x, other.y);
    // hasPlayed is a field attached to the final Game object
    // you can attach anything to the final Game, any Actor, or Action as they're just JS objects
    CompleteGame.hasPlayed = true;
    CompleteGame.board.setActive(falseRequirement);
};

// applicability indicate functions that are going to be given 2 actors
// and have to determine whether an action by one actor can be applied
// to an actee

// Returns whether the other's position can be moved to by self
var locationApplicability = function(self, other, kill) {
    if (self.x == other.x && self.y == other.y) {
        return false;
    }
    var numActors = kill ? 2 : 1;
    var pieceType = self.tags[0];
    var pieceColor = self.tags[1];
    var betweens = undefined;
    // Using one big switch instead of different functions for each type of actor
    // because it's simpler for the assignment part
    switch(pieceType) {
        case "Pawn":
            // Move forward 1 (or 2 once)
            var dir = pieceColor == "White" ? 1 : -1;
            if (kill) {
                return other.y - self.y == dir && Math.abs(other.x - self.x) == 1;
            } else {
                if ((self.y == 1 && pieceColor == "White") || (self.y == 6 && pieceColor == "Black")) {
                    return other.x == self.x && (other.y == self.y + dir * 2 || other.y == self.y + dir);
                }
                return other.x == self.x && other.y == self.y + dir;
            }
        case "Rook":
            // Move only in straight lines
            if (other.x == self.x || other.y == self.y) {
                // get getInBetween return the actors between self and other (including)
                // only if self and other are in 45 degree or straight line
                betweens = board.getInBetween(self.x, self.y, other.x, other.y);
                if (typeof betweens !== 'undefined'){
                    return betweens.length == numActors;
                }
            }
            return false;
        case "Bishop":
            // Move only in diagonals
            if (Math.abs(other.x - self.x) == Math.abs(other.y - self.y)) {
                betweens = board.getInBetween(self.x, self.y, other.x, other.y);
                if (typeof betweens !== 'undefined'){
                    return betweens.length == numActors;
                }
            }
            return false;
        case "Knight":
            // Move only in Ls
            var difX = Math.abs(self.x - other.x);
            var difY = Math.abs(self.y - other.y);
            return (difX == 2 && difY == 1) || (difX == 1 && difY == 2);
        case "Queen":
            // Move like Bishop + Rook
            if (other.x == self.x || other.y == self.y ||
              Math.abs(other.x - self.x) == Math.abs(other.y - self.y)) {
                betweens = board.getInBetween(self.x, self.y, other.x, other.y);
                if (typeof betweens !== 'undefined'){
                    return betweens.length == numActors;
                }
            }
            return false;
        case "King":
            // Move only one space any direction
            return (Math.abs(other.x - self.x) == 1 && Math.abs(other.y - self.y) == 1) ||
              (Math.abs(other.x - self.x) == 0 && Math.abs(other.y - self.y) == 1) ||
              (Math.abs(other.x - self.x) == 1 && Math.abs(other.y - self.y) == 0);
        default:
            return false;
    }
};

// Move and Kill have the same applicability except you can only move to empty position
var moveApplicability = function(self, other) {
    // all tiles will be tested as a possible actee
    // and in this case we just want to allow tiles with no actors on top of it
    if (!other.hasTag("Tile") || board.actors[other.x][other.y].length > 0) {
        return false;
    }
    return locationApplicability(self, other, false);
};

// Actually create the action
var move = new Action("Move", "Move to a new position");
move.setApplicabilityChecker(moveApplicability);
move.setAct(movekill);

// For kill you can only move to a position that has another actor (not tile)
var killApplicability = function(self, other) {
    if (other.hasTag("Tile") || board.actors[other.x][other.y].length == 0) {
        return false;
    }
    return locationApplicability(self, other, true);
};

var kill = new Action("Kill", "Kill the actee piece");
kill.setApplicabilityChecker(killApplicability);
kill.setAct(movekill);

// Add it to all pieces
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
    // Representation is used on the board in favor of the symbol if set
    // Representation should be a url to an image
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
// Every symbol represents a cloned instance of the actor to be placed there
// So there are 6 individual instances of white pawn, etc.
var actors3D = [
    [['bR'], ['bN'], ['bB'], ['bQ'], ['bK'], ['bB'], ['bN'], ['bR']],
    [['bP'], ['bP'], ['bP'], ['bP'], ['bP'], ['bP'], ['bP'], ['bP']],
    [[], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], []],
    [['wP'], ['wP'], ['wP'], ['wP'], ['wP'], ['wP'], ['wP'], ['wP']],
    [['wR'], ['wN'], ['wB'], ['wQ'], ['wK'], ['wB'], ['wN'], ['wR']]
];
board.fillActors(actors3D);

// Setup the turns
var turns = new Turns();

// set what to check to see whether a turn has completed
turns.setTurnCompleteChecker(function(game) {
    return game.hasPlayed;
});

// Add turns in order
var resetHasPlayed = function() {
    CompleteGame.hasPlayed = false;
};

// Rquirement that any actor with "White" tag can pass
var whiteActiveReq = Actor.getEmptyRequirement();
whiteActiveReq.addTag("White");

// So for the white turn all actors with the White tag will be active
// and once the turn finished hasPlayed is reset 
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
