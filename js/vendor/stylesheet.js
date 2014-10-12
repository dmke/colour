/*! based on http://www.hunlock.com/blogs/Totally_Pwn_CSS_with_Javascript */

window.cssManipulator = (function(){
  return {
    get: function(name, deleteFlag) {
      name = name.toLowerCase();
      deleteFlag = deleteFlag === 'delete'

      if (!document.styleSheets || document.styleSheets.length <= 0) {
        return false;
      }

      var rules, deleter;

      for (var i=0, len=document.styleSheets.length; i<len; ++i) {
        var styleSheet = document.styleSheets[i],
            j = 0, cssRule = false;

        // rules ||= styleSheet.respond_to?(:cssRules) ? :cssRules : :rules
        rules || (rules = styleSheet.cssRules ? 'cssRules' : 'rules');

        do {
          cssRule = styleSheet[rules][j++];
          if (!cssRule || !cssRule.selectorText)
            continue;

          if (cssRule.selectorText.toLowerCase() != name)
            continue;

          if (!deleteFlag)
            return cssRule;

          deleter || (deleter = styleSheet.deleteRule ? 'deleteRule' : 'removeRule')
          styleSheet[deleter](j);

          return true;
        } while (cssRule)
      }
    },

    kill: function(name) {
      return cssManipulator.get(name, 'delete');
    },

    add: function(name) {
      if (document.styleSheets) {
        var present = cssManipulator.get(name);
        if (present)
          return present;

        if (document.styleSheets[0].addRule) {
          if (document.styleSheets[0].addRule.length == 2)
            document.styleSheets[0].addRule(name, null);
          else
            document.styleSheets[0].addRule(name, null, 0);
        }
        else {
          if (document.styleSheets[0].insertRule.length == 1)
            document.styleSheets[0].insertRule(name+' { }');
          else
            document.styleSheets[0].insertRule(name+' { }', -1);
        }
      }

      return cssManipulator.get(name);
    }
  };
})();
