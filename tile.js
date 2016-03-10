/**
 * Represents a Tile of the board in the game.
 * Same properties as Actor but will have a "Tile" tag.
 */

if (typeof(module) !== 'undefined') {
  var Actor = require('./actor.js').Actor;
}

(function() {
  var Tile = (function() {
    var Tile = function(name, symbol, description) {
      Actor.apply(this, [name, symbol, description]);
      this.addTag("Tile");
    };

    Tile.prototype = Object.create(Actor.prototype);
    Tile.prototype.constructor = Tile;

    return Tile;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = {
      Tile: Tile
    };
  else
    window.Tile = Tile;
})();