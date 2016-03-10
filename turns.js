/**
 * Represents the game turn system.
 * Properties:
 */

if (typeof(module) !== 'undefined') {
  var Board = require('./board.js').Board;
}

(function() {
  var Turns = (function() {
    var Turns = function() {
      this.numTurns = 0;
      this.numCycles = 0;
      this.currentTurn = 0;
      this.turnOrder = [];
      this.turnCompleteChecker = function() { return true; };
      this.game = undefined;
    };

    Turns.getEmptyToDo = function() {
      return {
        actor: undefined,
        action: undefined,
        actee: undefined
      }
    };

    Turns.getEmptyTurn = function() {
      return {
        requirementForActiveStart: undefined,
        beforeStart: undefined,
        afterEndTurn: undefined,
        toDo: [],
        controllableTag: [],
        player: false
      };
    };

    Turns.getPlayerTurn = function() {
      return {
        requirementForActiveStart: undefined,
        beforeStart: undefined,
        afterEndTurn: undefined,
        toDo: [],
        controllableTag: [],
        player: true
      };
    };

    Turns.prototype.addTurn = function(turn) {
      this.turnOrder.push(turn);
    };

    Turns.prototype.setTurnCompleteChecker = function(checker) {
      this.turnCompleteChecker = checker;
    };

    Turns.prototype.isTurnComplete= function() {
      return this.turnCompleteChecker(this.game);
    };

    Turns.prototype.finishTurn = function() {
      var thisTurn = this.turnOrder[this.currentTurn];
      if (typeof thisTurn.afterEndTurn !== 'undefined') {
        thisTurn.afterEndTurn();
      }
      this.numTurns++;
      this.currentTurn++;
      this.currentTurn %= this.turnOrder.length;
      this.numCycles += this.currentTurn == 0 ? 1 : 0;
      this.startTurn();
    };

    Turns.prototype.startTurn = function() {
      var thisTurn = this.turnOrder[this.currentTurn];
      if (typeof thisTurn.requirementForActiveStart !== 'undefined') {
        this.game.board.setActive(thisTurn.requirementForActiveStart);
      }
      if (typeof thisTurn.beforeStart !== 'undefined') {
        thisTurn.beforeStart();
      }
      if (!thisTurn.player) {
        for (var task in thisTurn.toDo) {
          if (task.action.applicable(task.actor, task.actee)) {
            task.action(task.actor, task.actee);
          }
        }
        thisTurn.finishTurn();
      }
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