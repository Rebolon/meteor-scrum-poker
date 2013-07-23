console.log('client/main.js');

Meteor.startup(function () {
  Session.setDefault('selectedMeeting', null);
  Session.setDefault('selectedSprint', null);
  Session.setDefault('currentRoom', null);
});
