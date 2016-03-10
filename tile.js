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
      this.color = undefined;
    };

    Tile.prototype = Object.create(Actor.prototype);
    Tile.prototype.constructor = Tile;

    Tile.prototype.setColor = function(color) {
      this.color = color;
    };

    Tile.prototype.clone = function() {
      var newTile = new Actor(this.name, this.symbol, this.description);
      newTile.tags = this.tags.slice(0);
      newTile.actions = this.actions.slice(0);
      newTile.blacklist = this.blacklist.slice(0);
      newTile.x = this.x;
      newTile.y = this.y;
      newTile.active = this.active;
      newTile.color = this.color;
      return newTile;
    };

    return Tile;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = {
      Tile: Tile
    };
  else
    window.Tile = Tile;
})();