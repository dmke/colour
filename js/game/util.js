/** Some utility functions. */
window.Util = {
  /** Returns a random integer from [min..max). */
  rand: function(min, max) {
    return Math.floor(min + Math.random() * (max-min));
  },

  /** Ensures, that a given `val` is contained in [min..max]. */
  cap: function(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }
}
