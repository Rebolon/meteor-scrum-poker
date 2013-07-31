console.log('client/main.js');

Meteor.startup(function () {
  Session.setDefault('selectedMeeting', null);
  Session.setDefault('selectedSprint', null);
  Session.setDefault('currentRoom', null);
  
  (function logRenders () {
    _.each(Template, function (template, name) {
      var oldRender = template.rendered;
      var counter = 0;
 
      template.rendered = function () {
        console.log(name, "render count: ", ++counter);
        oldRender && oldRender.apply(this, arguments);
      };
    });
  })();

});