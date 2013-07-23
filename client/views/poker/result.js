Meteor.startup(function() {
  var currentRoom = Session.get('currentRoom'); 
  
  Session.setDefault('displayVoteResult', false);

});

Template.voteResult.helpers({
  votes: function () {
    if (Session.get('displayVoteResult')) {
      return Vote.find({}, {sort: {value: 1}});
    }
  },
  
  nbVotes: function () {
    return Vote.find().count();
  }
});