/**
 * Represents the game board.
 * 0,0 is at the bottom left.
 * Properties:
 *  - h: height of the board
 *  - w: width of the board
 *  - actors: list of actors on that position
 *  - tile: the tile on that position
 */

(function() {
  var Board = (function() {
    var Board = function(h, w) {
      this.h = h;
      this.w = w;
      this.actors = [];
      this.tiles = [];
      for (var i = 0; i < h; i++) {
        this.actors[i] = [];
        this.tiles[i] = [];
        for (var j = 0; j < w; j++) {
          this.actors[i][j] = [];
        }
      }
    };

    Board.prototype.fillTiles = function fillTiles(jsonMap) {

    };

    Board.prototype.fillActors = function fillActors(jsonMap) {

    };

    return Board;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = {
      Board: Board
    };
  else
    window.Board = Board;
})();