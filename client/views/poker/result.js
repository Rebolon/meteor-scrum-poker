Meteor.startup(function() {
  var currentRoom = Session.get('currentRoom'); 
  
  Session.setDefault('displayVoteResult', false);

});

Template.voteResult.getColor = function () {
  if (this.value <= 1) {
    return 'success';
  }
  
  if (this.value <= 8) {
    return 'info';
  }
  
  if (this.value <= 20) {
    return 'warning';
  }
  
  return 'danger';
};

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