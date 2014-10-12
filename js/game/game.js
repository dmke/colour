window.Game = (function(){
  function Game(stage, scoreboard) {
    this.stage      = stage;
    this.scoreboard = scoreboard;
    this.level      = -1;
    this.highscore  = 0;

    this.nextLevel();

    this.stage.on("click", ".cell", (function(_this) {
      return function() {
        var i = $(this);
        if (i.is('.target')) {
          _this.playSound('chirp');
          _this.nextLevel();
        } else {
          _this.playSound('kick');
          _this.gameOver();
        }
      }
    })(this));
  };

  Game.prototype.nextLevel = function() {
    this.level += 1;
    this.updateScoreboard();
    this.stage.empty();
    this.currentLevel = new Level(this);
    this.currentLevel.start();
  };

  Game.prototype.gameOver = function() {

    this.level = -1;
    this.nextLevel()
  };

  Game.prototype.updateScoreboard = function() {
    this.highscore = Number(CookieJar.get('highscore')) || 0;
    if (this.highscore < this.level)
      CookieJar.set('highscore', this.level, { expires: 365*24*60*60 });
    this.scoreboard
      .empty()
      .append('<h1>#'+ this.level +'</h1>')
      .append('<p>Best '+ this.highscore +'</p>')
  };

  var sounds = (new Audio()).canPlayType("audio/mpeg") ? {
    chirp:  new Audio("/snd/chirp.mp3"),
    kick:   new Audio("/snd/kick.mp3")
  } : null

  Game.prototype.playSound = function(name) {
    if (sounds && sounds[name]) {
      sounds[name].pause();
      sounds[name].currentTime = 0;
      sounds[name].play();
    }
  };

  return Game;
})();

$(function(){
  window.game = new Game($("#field"), $('#points'));
});
