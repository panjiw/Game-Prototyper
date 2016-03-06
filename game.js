(function() {
  var Game = (function() {
    var Game = function() {
      this.actors = [];
      this.board = undefined;
      this.turns = undefined;
    };

    return Game;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = {
      Game: Game
    };
  else
    window.Game = Game;
})();