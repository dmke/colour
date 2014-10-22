'use strict';

/**
  * A stage defines the level of the game. The higher stags spawn more
  * items and decrease the colour differences.
  *
  * How fast the colour differences are decreasing is defined by the difficulty.
  */
window.Stage = (function(){
  /** @constructor */
  function Stage(level, difficulty){
    this.l = level;
    this.d = difficulty;

    this.chooseColours(level);
    this.calculateGrid(level + 1);
    this.injectCSS();
  }


  /** Some other configuration options. Not fully independent. */
  var STAGE_WIDTH   = 800,      // in px
      ITEM_MARGIN   = 0.2,      // in %
      ROW_INCREASE  = 6,        // every 6 level
      WIDTH_FACTOR  = STAGE_WIDTH/ITEM_MARGIN;

  /** Picks a random base colour and adjusts it a little. */
  Stage.prototype.chooseColours = function(level) {
    // keep on playing when reached the current threshold, but keep the
    // difficulty high
    if (level >= this.d.t) {
      level = this.d.t - 1;
    }

    this.baseColour = HSL.rand();

    /*
      TODO: make the randomness dependent.

      This currently allows an adjustment of [min,min,min] or [max,max,max]
      for a given level, which results in almost the same colour or a completely
      different colour. It would be more fair to the player, if the values
      average on (min+max)/2, so that, if the hue changes a lot, saturation and
      luminance stay somewhat the same. Or if all values change, they only change
      a little.
    */
    this.targetColour = this.baseColour.adjust(
      // move freely on the rainbow
      (Math.random()     < 0.5 ? -1 : 1) * this.d.getValue(level),
      // desaturate if colourful, saturate if not
      (this.baseColour.s > 50  ? -1 : 1) * this.d.getValue(level),
      // lighten the dark, but darken the light
      (this.baseColour.l > 50  ? -1 : 1) * this.d.getValue(level)
    );
  };

  /**
    * Starts a level by spawning in the items. A random item is selected to
    * be the target.
    */
  Stage.prototype.start = function(stage) {
    var i, j, row,
        rnd = Util.rand(0, this.rows * this.cols);

    for (var i=0; i<this.rows; ++i) {
      row = $('<div class="row"></div>');
      for (var j=0; j<this.cols; ++j) {
        $('<div class="cell"></div>').appendTo(row);
      }
      row.appendTo(stage);
    }
    stage.find(".cell").eq(rnd).addClass("target");
  };

  Stage.prototype.injectCSS = function() {
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

  /** Calculates some metrics based the level number. */
  Stage.prototype.calculateGrid = function(level) {
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

  return Stage;
})();
