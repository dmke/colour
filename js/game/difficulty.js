'use strict';

/**
  * A difficulty has a threshold `t`, which is the last senseful level,
  * an upper bound `max` and an lover bound `min`.
  *
  * Technically, the bounding box is a triangle over (0,min),(0,max),(t,0).
  */
window.Difficulty = (function(){
  var Difficulty = function(t, min, max, name) {
    this.name       = name;
    this.threshold  = t;
    this.lowerBound = makeBound(min, t);
    this.upperBound = makeBound(max, t);
  };

  /**
    * For a given level, returns a random value between these bounding box.
    * For practical reasons, it returns 1 for any level > t or 1 instead of
    * values < 1.
    */
  Difficulty.prototype.getValue = function(level) {
    if (level > this.t)
      return 1;

    return Math.max(1, Util.rand(
      this.lowerBound(level),
      this.upperBound(level)
    ));
  };

  /**
    * Returns a function f(x), where (x,f(x)) lies on the line through the
    * points (0,y1) and (x2,0).
    */
  var makeBound = function(y1, x2) {
    return function(x) {
      return y1 - (y1*x)/x2;
    }
  };

  return Difficulty;
})();
