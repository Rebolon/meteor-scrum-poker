Meteor.startup(function() {
  var currentRoom = Session.get('currentRoom');      

  PokerStream.on(currentRoom + ':currentRoom:vote', function () {
    console.log('event vote received', arguments);              
  });
});
