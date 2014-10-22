'use strict';

window.Game = (function(){
  function Game(stage, scoreboard, difficulty) {
    this.stage      = stage;
    this.scoreboard = scoreboard;
    this.level      = -1;
    this.highscore  = -1;
    this.difficulty = DIFFICULTIES[difficulty] || DIFFICULTIES[DIFFICULTIES.length-1];

    if (window.localStorage && typeof window.localStorage.getItem === 'function') {
      this.hsKey     = ['highscore', this.difficulty.name].join('-');
      this.highscore = Number(window.localStorage.getItem(this.hsKey)) || 0;
    }

    this.nextLevel();
  };

  /** Handles a click. */
  Game.prototype.click = function(onTarget) {
    if (this.level < 0)
      return this.nextLevel()
    if (onTarget) {
      this.playSound('chirp');
      this.nextLevel();
    } else {
      this.playSound('kick');
      this.gameOver();
    }
  };

  /** Advance and repeat. */
  Game.prototype.nextLevel = function() {
    this.level += 1;
    this.updateScoreboard();
    this.stage.removeClass('game-over').empty();
    this.currentLevel = new Stage(this.level, this.difficulty);
    this.currentLevel.start(this.stage);
  };

  /** Du-dun. */
  Game.prototype.gameOver = function() {
    this.level = -1;
    this.stage.addClass('game-over');
  };

  /**
    * Displays the current level in the scoreboard. Also updates and displays
    * the high score if the client supports localStorage.
    */
  Game.prototype.updateScoreboard = function() {
    this.scoreboard.empty().append('<h1>#'+ this.level +'</h1>')

    if (this.highscore >= 0) {
      this.scoreboard.append('<p>Best '+ this.highscore +'</p>')
      if (this.highscore < this.level) {
        this.highscore = this.level;
        window.localStorage.setItem(this.hsKey, this.level);
      }
    }
  };

  /** Plays a sound. Duh. */
  Game.prototype.playSound = function(name) {
    if (!SOUNDS[name])
      return;

    SOUNDS[name].pause();
    SOUNDS[name].currentTime = 0;
    SOUNDS[name].play();
  };

  /**
    * Difficulty configuration.
    *
    * I bet, I could define algorithmically "infinite" difficulties, but for
    * now, three should suffice.
    */
  var DIFFICULTIES = [
    new Difficulty(65, 20, 25, "easy"),
    new Difficulty(50, 12, 20, "medium"),
    new Difficulty(45,  8, 12, "hard")
  ]

  /** Sounde effects. Pew pew! */
  var SOUNDS = (new Audio()).canPlayType("audio/mpeg") ? {
    chirp:  new Audio("./snd/chirp.mp3"),
    kick:   new Audio("./snd/kick.mp3")
  } : {}

  return Game;
})();


$(function(){
  var field   = $("#field"),
      scores  = $("#points"),
      game    = new Game(field, scores, 0);

  $("#difficulty button").on("click", function(e){
    e.preventDefault();
    var difficulty = $(this)
      .siblings().removeClass('current').end()
      .addClass('current')
      .data("difficulty");
    game = new Game(field, scores, difficulty);
  });

  field.on("click", ".cell", function(e){
    e.preventDefault();
    game.click($(e.target).is(".target"));
  });
});
