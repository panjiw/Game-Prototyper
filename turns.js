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
      this.turnCompleteChecker = function(game) { return true; };
      this.game = undefined;
      this.gameOverChecker = function(game) { return false; }
    };

    Turns.getEmptyToDo = function() {
      var toDo = {
        actor: undefined,
        action: undefined,
        actee: undefined
      };
      toDo.setActor = function(actor) {
        this.actor = actor;
      };
      toDo.setAction = function(action) {
        this.action = action;
      };
      toDo.setActee = function(actee) {
        this.actee = actee;
      };
      return toDo;
    };

    Turns.getEmptyTurn = function(aName) {
      var turn = {
        name: aName,
        requirementForActiveStart: undefined,
        beforeStart: undefined,
        afterEndTurn: undefined,
        toDo: [],
        player: false
      };
      turn.addToDo = function(toDo) {
        this.toDo.push(toDo);
      };
      return turn;
    };

    Turns.getPlayerTurn = function(pName) {
      return {
        name: pName,
        requirementForActiveStart: undefined,
        beforeStart: undefined,
        afterEndTurn: undefined,
        player: true
      };
    };

    Turns.prototype.addTurn = function(turn) {
      this.turnOrder.push(turn);
    };

    Turns.prototype.setTurnCompleteChecker = function(checker) {
      this.turnCompleteChecker = checker;
    };

    Turns.prototype.isTurnComplete = function() {
      return this.turnCompleteChecker(this.game);
    };

    Turns.prototype.setGameOverChecker = function(checker) {
      this.gameOverChecker = checker;
    };

    Turns.prototype.isGameOver = function() {
      return this.gameOverChecker(this.game);
    };

    Turns.prototype.canCheckGameOver = function() {
      return (typeof this.gameOverChecker !== 'undefined');
    }

    Turns.prototype.finishTurn = function() {
      var thisTurn = this.getCurrentTurn();
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
      var thisTurn = this.getCurrentTurn();
      if (typeof thisTurn.requirementForActiveStart !== 'undefined') {
        this.game.board.setActive(thisTurn.requirementForActiveStart);
      }
      if (typeof thisTurn.beforeStart !== 'undefined') {
        thisTurn.beforeStart();
      }
      if (!thisTurn.player) {
        for (var i = 0; i < thisTurn.toDo.length; i++) {
          var task = thisTurn.toDo[i];
          if (task.action.applicable(task.actor, task.actee)) {
            task.action.act(task.actor, task.actee);
          }
        }
        this.finishTurn();
      }
    };

    Turns.prototype.getCurrentTurn = function() {
      return this.turnOrder[this.currentTurn];
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