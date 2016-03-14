/**
 * Represents the game board.
 * 0,0 is at the bottom left.
 * Properties:
 *  - h: height of the board
 *  - w: width of the board
 *  - actors: list of actors on that position
 *  - tile: the tile on that position
 */

if (typeof(module) !== 'undefined') {
  var Actor = require('./actor.js').Actor;
}

(function() {
  var Board = (function() {
    var Board = function(h, w) {
      this.h = h;
      this.w = w;
      this.borderColor = undefined;
      this.actors = [];
      this.tiles = [];
      for (var i = 0; i < w; i++) {
        this.actors[i] = [];
        this.tiles[i] = [];
        for (var j = 0; j < h; j++) {
          this.actors[i][j] = [];
        }
      }
      this.game = undefined;
    };

    Board.prototype.fillTiles = function(symbol2D) {
      for (var x = 0; x < this.w; x++) {
        for (var y = 0; y < this.h; y++) {
          var symbol = symbol2D[this.h - 1 - y][x];
          this.tiles[x][y] = Actor.symbolMap[symbol].clone();
          this.tiles[x][y].x = x;
          this.tiles[x][y].y = y;
        }
      }
    };

    Board.prototype.fillActors = function(symbol3D) {
      for (var x = 0; x < this.h; x++) {
        for (var y = 0; y < this.w; y++) {
          var symbols = symbol3D[this.h - 1 - y][x];
          for (var i = 0; i < symbols.length; i++) {
            this.moveActor(Actor.symbolMap[symbols[i]].clone(), x, y);
          }
        }
      }
    };

    Board.prototype.moveActor = function(actor, x, y) {
      if (actor.x != -1 && actor.y != -1) {
        var i = this.actors[actor.x][actor.y].indexOf(actor);
        if (i > -1) {
          this.actors[actor.x][actor.y] = this.actors[actor.x][actor.y].splice(i, 1);
        }
      }

      this.actors[x][y].push(actor);
      actor.x = x;
      actor.y = y;
    };

    Board.prototype.setBorderColor = function(color) {
      this.borderColor = color;
    };

    Board.prototype.setActive = function(requirement) {
      for (var x = 0; x < this.h; x++) {
        for (var y = 0; y < this.w; y++) {
          var actors = this.actors[x][y];
          for (var i = 0; i < actors.length; i++) {
            actors[i].active = actors[i].passRequirement(requirement);
          }
        }
      }
    };

    Board.prototype.getInBetween = function(x1, y1, x2, y2) {
      if (x1 != x2 && y1 != y2 && Math.abs(x1 - x2) != Math.abs(y1 - y2)) {
        return undefined;
      }
      var foundActors = [];
      if (x1 == x2) {
        for (var i = Math.min(y1, y2); i <= Math.max(y1, y2); i++) {
          foundActors = foundActors.concat(board.actors[x1][i]);
        }
      } else if (y1 == y2) {
        for (var i = Math.min(x1, x2); i <= Math.max(x1, x2); i++) {
          foundActors = foundActors.concat(board.actors[i][y1]);
        }
      } else {
        if (x1 < x2) {
          var tx = x1;
          var ty = y1;
          var fx = x2;
          var fy = y2;
        } else {
          var tx = x2;
          var ty = y2;
          var fx = x1;
          var fy = y1;
        }
        do {
          foundActors = foundActors.concat(board.actors[tx][ty]);
          if (tx < fx) {
            tx++;
          } else {
            tx--;
          }
          if (ty < fy) {
            ty++;
          } else {
            ty--;
          }
        } while (tx != fx && ty != fy);
        foundActors = foundActors.concat(board.actors[tx][ty]);
      }
      return foundActors;
    }

    return Board;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = {
      Board: Board
    };
  else
    window.Board = Board;
})();