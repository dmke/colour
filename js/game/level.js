/**
  * A level defines the difficulty of the game. The higher levels spawn more
  * items and decrease the colour differences.
  */
window.Level = (function(){
  /** @constructor */
  function Level(game){
    this.game = game;

    this.chooseColours();
    this.calculateGrid(game.level + 1);
    this.injectCSS();
  }

  /** Picks a random base colour and adjusts it a little. */
  Level.prototype.chooseColours = function() {
    this.baseColour = HSL.rand();

    this.targetColour = this.baseColour.adjust(
      (Math.random() > 0.5 ? 1 : -1) * Util.rand(5, 10),
      (Math.random() > 0.5 ? 1 : -1) * Util.rand(5, 10),
      (Math.random() > 0.5 ? 1 : -1) * Util.rand(5, 10)
    );
  };

  /**
    * Starts a level by spawning in the items. A random item is selected to
    * be the target.
    */
  Level.prototype.start = function() {
    var i, j, row,
        rnd = Util.rand(0, this.rows * this.cols);

    for (var i=0; i<this.rows; ++i) {
      row = $('<div class="row"></div>');
      for (var j=0; j<this.cols; ++j) {
        $('<div class="cell"></div>').appendTo(row);
      }
      row.appendTo(this.game.stage);
    }
    this.game.stage.find(".cell").eq(rnd).addClass("target");
  };

  Level.prototype.injectCSS = function() {
    var rule;
    if (rule = cssManipulator.add('#field .cell')) {
      rule.style.backgroundColor = this.baseColour;
      rule.style.width        = ""+this.itemWidth+"px";
      rule.style.height       = ""+this.itemWidth+"px";
      rule.style.marginRight  = ""+this.itemMargin+"px";
      rule.style.marginBottom = ""+this.itemMargin+"px";
    }

    if (rule = cssManipulator.add('#field .cell.target')) {
      rule.style.backgroundColor = this.targetColour;
    }
  };

  var STAGE_WIDTH   = 800, // in px
      ITEM_MARGIN   = 0.2, // in %
      WIDTH_FACTOR  = STAGE_WIDTH/ITEM_MARGIN,
      ROW_INCREASE  = 6;   // every 6 level

  /** Calculates some metrics based the level number. */
  Level.prototype.calculateGrid = function(level) {
    // a new row every 6 rounds
    this.rows = Math.ceil(level/ROW_INCREASE);

    // choose # of colums so, that the # of items (cols*rows)
    // does not increase excessively
    this.cols = (level+1)%4 + ~~((level+1)/this.rows);

    if (this.rows > this.cols) {
      var tmp = this.rows;
      this.rows = this.cols;
      this.cols = tmp;
    }

    // width of an item, so that
    // cols*itemWitdth + (cols-1)*itemMargin == 800
    this.itemWidth  = Math.floor( WIDTH_FACTOR/(6*this.cols - 1) );
    this.itemMargin = Math.floor( ITEM_MARGIN * this.itemWidth );
  };

  return Level;
})();
