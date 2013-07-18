console.log('client/views/poker/vote.js');

var currentRoom = Session.get('currentRoom'),
    resetSelection = function () {
      document.querySelectorAll('pokerValue').forEach(function (item) {
        item.selected = "";
      });
    };

if (Session.get('collectionsReady')) {
  PokerStream.on(currentRoom + ':freezeVote', function () {
    resetSelection();
  });
}

Template.pokerVote.events({
  'click .btn.pokerValue': function () {
    var vote = this.value;
    
    // reset previous selection if 
    if (vote !== Session.get('vote')) {
      resetSelection();
    }
    
    Session.set('vote', vote);
    this.selected = "selected";
    document.querySelector('#btnSendVote').disabled = "";
  },
  
  // maybe btnSendCote is useless and we should emit 
	'click #btnSendVote': function () {
    var vote = Session.get('vote');
    if (vote) {
      document.querySelector('#btnSendVote').disabled = disabled;
      PokerStream.emit(currentRoom + ':vote', vote);
      Session.set('vote', null);
    }
	}
});
