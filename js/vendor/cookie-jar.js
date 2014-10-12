window.CookieJar = {
  set: function(key, value, options) {
    options||(options={});
    var expires, path;

    expires = options.expires ? "; expires=" + new Date(options.expires).toUTCString() : "";
    path    = "; path=" + (options.path || "/");
    secure  = options.secure ? "; secure" : "";

    document.cookie = [ key, "=", value, expires, path, secure ].join("");
  },

  get: function(key) {
    var matches = document.cookie.match(new RegExp(key + "=(.*)(;)?"));
    return matches ? matches[1] : null;
  },

  remove: function(key, options) {
    CookieJar.set(key, "", { expires: 0, path: ((options||{}).path||"/") })
  },

  clear: function() {
    document.cookie.split(";").forEach(function(cookie) {
      var key = cookie.replace(/=.*/, "");
      this.remove(key);
    }.bind(this));
  }
};
