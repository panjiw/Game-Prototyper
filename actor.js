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
 *               except for the properties required
 *               non-requireable properties:
 *                - actions
 *                - blacklist
 *  - x: x position on the board
 *  - y: y position on the board
 *  - active: whether this actor can do an action (usage optional)
 */

(function() {
  var Actor = (function() {
    var Actor = function(name, symbol, description) {
      this.name = name;
      this.symbol = symbol;
      if (typeof Actor.symbolMap === 'undefined') {
        Actor.symbolMap = {};
      }
      Actor.symbolMap[this.symbol] = this;
      this.representation = undefined;
      this.description = description;
      this.tags = [];
      this.color = undefined;
      this.actions = [];
      this.blacklist = [];
      this.x = -1;
      this.y = -1;
      this.active = false;
    };

    Actor.prototype.clone = function() {
      var newActor = new Actor(this.name, this.symbol, this.description);
      newActor.tags = this.tags.slice(0);
      newActor.actions = this.actions.slice(0);
      newActor.blacklist = this.blacklist.slice(0);
      newActor.representation = this.representation;
      newActor.color = this.color;
      newActor.x = this.x;
      newActor.y = this.y;
      newActor.active = this.active;
      return newActor;
    };

    Actor.prototype.setSymbol = function(symbol) {
      this.symbol = symbol;
      if (typeof Actor.symbolMap === 'undefined') {
        Actor.symbolMap = {};
      }
      delete Actor.symbolMap[this.symbol];
      this.symbol = symbol;
      Actor.symbolMap[symbol] = this;
    };

    Actor.prototype.setColor = function(color) {
      this.color = color;
    };

    Actor.prototype.setRepresentation = function(representation) {
      this.representation = representation;
    };

    Actor.prototype.addTag = function(tag) {
      this.tags.push(tag);
    };

    Actor.prototype.hasTag = function(tag) {
      return this.tags.indexOf(tag) >= 0
    };

    Actor.prototype.addAction = function(action) {
      this.actions.push(action);
    };

    Actor.prototype.addBlacklist = function(requirement) {
      this.blacklist.push(requirement);
    };

    Actor.getEmptyRequirement = function() {
      var empty = new Actor();
      empty.x = undefined;
      empty.y = undefined;
      empty.active = undefined;
      return empty;
    };

    Actor.prototype.passRequirement = function(requirement) {
      var res = true;
      var checkOnce = false;
      for(var key in this) {
        if (!this.hasOwnProperty(key)) continue;

        if (typeof requirement[key] !== 'undefined') {
          switch(key) {
            case "name":
            case "symbol":
            case "description":
            case 'x':
            case 'y':
            case "active":
              checkOnce = true;
              res = res && this[key] === requirement[key];
              break;
            case "tags":
              for (var i = 0; i < requirement.tags.length; i++) {
                checkOnce = true;
                res = res && this.hasTag(requirement.tags[i]);
              }
              break;
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