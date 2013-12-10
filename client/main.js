console.log('client/main.js');

var myScriptLoader = function funcMyScriptLoader(jsEl, callback) {
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
},
    getRightBackgroundImage = function funcGetRightBackgroundImage() {
      var availableWidth = [2048, 1600, 1400, 1024, 800, 640],
          currentWidth = verge.viewportW(),
          currentImage;

      for (var i = 0; i<availableWidth[i] && availableWidth[i] >= currentWidth ; i++) {
        currentImage = '/img/zen/' + availableWidth[i] + '.jpg';
      }

      if (currentImage) {
        $('body').css('background', 'url(' + currentImage + ')'); // no-repeat center center fixed;');
      }
      return currentImage;
    };

var myElJs = document.createElement('script'),
    s = document.getElementsByTagName('script')[0];
    myElJs.type = 'text/javascript';
    myElJs.async = true;
    myElJs.src = '/js/verge.min.js';
    myScriptLoader(myElJs, getRightBackgroundImage);
    s.parentNode.insertBefore(myElJs, s);

Meteor.startup(function () {
  Session.setDefault('currentRoom', null);
  
  Deps.autorun(function funcMeteorAutorun() {  
    Meteor.subscribe("RoomCounter");
    Meteor.subscribe("VoteCounter");
  });
  
  /*(function logRenders () {
    _.each(Template, function (template, name) {
      var oldRender = template.rendered;
      var counter = 0;
 
      template.rendered = function () {
        console.log(name, "render count: ", ++counter);
        oldRender && oldRender.apply(this, arguments);
      };
    });
  })();*/

});