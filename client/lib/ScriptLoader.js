(function (w) {
  var ScriptLoader = {
      "build": function(src, callback) {
        var js = this.createEl(src);
        this.load(js, callback);
        this.addToDom(js);
      },

      "createEl": function funcBuildEl(src) {
        var js;

        js = document.createElement('script');
        js.type = 'text/javascript';
        js.async = true;
        js.src = src;

        return js;
      },

      "addToDom": function funcAddToDom(jsEl) {
        var s;

        s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(jsEl, s);
      },

      "load": function funcMyScriptLoader(jsEl, callback) {
        if (window.attachEvent) {
          // for IE (sometimes it doesn't send loaded event but only complete)
          jsEl.onreadystatechange = function funcOnReadyStateChange() {
            if (jsEl.readyState === 'complete') {
              jsEl.onreadystatechange = "";
            } else if (jsEl.readyState === 'loaded') {
              jsEl.onreadystatechange = "";
            }

            if (typeof callback === 'function') {
              callback();
            }
          };
        } else {
          // most browsers
          jsEl.onload = function funcOnLoad () {
            if (typeof callback === 'function') {
              callback();
            }
          };
        }
      }
    };
  
  if (typeof w.Rebolon !== "undefined") {
    w.Rebolon.ScriptLoader = {};
    _.extend(Rebolon.ScriptLoader, w.Rebolon.ScriptLoader);
  } else {
    w.Rebolon = {ScriptLoader: ScriptLoader};
  }
})(window);