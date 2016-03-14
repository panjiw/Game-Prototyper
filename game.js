(function() {
  var Game = (function() {
    var Game = function(title, board, turns) {
      this.title = title;
      this.board = board;
      this.turns = turns;
      this.board.game = this;
      this.turns.game = this;
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