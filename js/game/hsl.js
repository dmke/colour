'use strict';

/** HSL colour vector. */
window.HSL = (function(){
  /**
    * @constructor
    * Takes hue, saturation and lightness to repesent a colour.
    *
    * @param {Numeric} h Hue, 0 <= h <= 360
    * @param {Numeric} s Saturation, 0 <= s <= 100
    * @param {Numeric} l Luminance, 0 <= l <= 100
    */
  function HSL(h,s,l) {
    this.h = ~~h % 360;
    this.s = Util.cap(~~s, 0, 100);
    this.l = Util.cap(~~l, 0, 100);
  };

  /** @return {String} CSS-compatible String repesentation */
  HSL.prototype.toString = function() {
    return "hsl("+this.h+","+this.s+"%,"+this.l+"%)";
  };

  /** @return {HSL} new colour adjusted by given arguments */
  HSL.prototype.adjust = function(h,s,l) {
    return new HSL(this.h+h, this.s+s, this.l+l);
  };

  /**
    * Creates a new, random colour. This colour can be of any hue, but
    * saturation and lightness won't be below 20% or above 80%.
    *
    * This cap is by design (KISS), since we'd like to #adjust it later.
    *
    * @return {HSL} a random colour
    */
  HSL.rand = function() {
    return new HSL(
      Util.rand(0, 360),
      Util.rand(20, 80),
      Util.rand(20, 80)
    );
  };

  return HSL;
})();
