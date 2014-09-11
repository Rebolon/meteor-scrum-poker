console.log('client/main.js');

var getRightBackgroundImage = function funcGetRightBackgroundImage() {
      var availableWidth = [2048, 1600, 1400, 1024, 800, 640],
          currentWidth = verge.viewportW(),
          currentImage;

      for (var i = 0; i<availableWidth[i] && availableWidth[i] >= currentWidth ; i++) {
        currentImage = '/img/zen/' + availableWidth[i] + '.jpg';
      }

      if (currentImage) {
        $('body').css('background', 'url(' + currentImage + ')  no-repeat center center fixed grey'); // no-repeat center center fixed;');
      }
      return currentImage;
    };

Rebolon.ScriptLoader.build('/js/verge.min.js', getRightBackgroundImage);

Meteor.startup(function () {
  Session.setDefault('currentRoom', null);
  Session.setDefault('closed', false);
  
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