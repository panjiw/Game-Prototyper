/**
 * Represents an Actor in the game.
 * Properties:
 *  - name: name of the actor
 *  - symbol: char to represent this Actor in the maps for board.js
 *  - description: description of the actor
 *  - tags: list containing strings which are tags describing the actor
 *  - actions: list of action that this Actor can do
 *  - blacklist: list of actors that this actor cannot do action onto
 *               where actors in the list can have every property undefined
 *               except for the properties to match
 *               non-matchable properties:
 *                - actions
 *                - blacklist
 *  - x: x position on the board
 *  - y: y position on the board
 *  - active: whether this actor can do an action
 */

(function() {
  var Actor = (function() {
    var Actor = function(name, symbol, description) {
      this.name = name;
      this.symbol = symbol;
      if (typeof Actor.prototype.symbolMap === 'undefined') {
        Actor.prototype.symbolMap = {};
      }
      Actor.prototype.symbolMap[this.symbol] = this;
      this.description = description;
      this.tags = [];
      this.actions = [];
      this.blacklist = [];
      this.x = -1;
      this.y = -1;
      this.active = false;
    };

    Actor.prototype.addTag = function(type) {
      this.tags.push(type);
    };

    Actor.prototype.addAction = function(action) {
      this.actions.push(action);
    };

    Actor.prototype.getEmptyBlacklistActor = function() {
      return {
        name: undefined,
        symbol: undefined,
        description: undefined,
        tags: undefined,
        x: undefined,
        y: undefined,
        active: undefined
      }
    };

    Actor.prototype.match = function(other) {
      var res = true;
      var checkOnce = false;
      for(var key in this) {
        if (!this.hasOwnProperty(key)) continue;

        if (typeof other[key] !== 'undefined') {
          checkOnce = true;
          switch(key) {
            case name:
            case symbol:
            case description:
            case x:
            case y:
            case active:
              res &= this[key] === other[key]
              break;
            case tags:
              for (var i = 0; i < other.tags.length; i++) {
                res &= this.tags.indexOf(other.tags[i]) >= 0;
              }
            default:
              break;
          }
        }
      }
      return res && checkOnce;
    };

    return Actor;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = {
      Actor: Actor
    };
  else
    window.Actor = Actor;
})();