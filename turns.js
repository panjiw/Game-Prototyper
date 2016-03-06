/**
 * Represents the game turn system.
 * Properties:
 *  - h: height of the board
 *  - w: width of the board
 *  - actors: list of actors on that position
 *  - tile: the tile on that position
 */

(function() {
  var Turns = (function() {
    var Turns = function(h, w) {
      this.numTurns = 0;
      this.turnOrder = [];
    };

    Turns.prototype.getEmptyTurn = function() {
      return {
        actor: undefined,
        action: undefined,
        actee: undefined
      };
    };

    Turns.prototype.addTurn = function(turn) {
      this.turnOrder.push(turn);
    };

    return Turns;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = {
      Turns: Turns
    };
  else
    window.Turns = Turns;
})();