/** HSL colour vector. */
window.HSL = (function(){
  /**
    * @constructor
    * Takes hue, saturation and lightness to repesent a colour.
    *
    * @param {Numeric} h Hue, 0 <= h <= 360
    * @param {Numeric} s Saturation, 0 <= s <= 100
    * @param {Numeric} l Lightness, 0 <= l <= 100
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
    * TODO: Rethink this approach. Instead of capping the S/L values and
    * adding arbitrary values to #adjust, we could just implement a #shuffle
    * function, which auto-adjusts the current colour (i.e. "darken when
    * lightness > 50, else lighten").
    *
    * This requires some a bunch of additional functionality (lighten, darken,
    * saturate, desaturate, adjust hue), which I am currently not willing to
    * implement ("and is left as exercise for the reader").
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
