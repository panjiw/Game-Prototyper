// Set this to the game instance you created
var GAME_INSTANCE = Ches;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
  module.exports = {
    CompleteGame: GAME_INSTANCE
  };
else
  window.CompleteGame = GAME_INSTANCE;