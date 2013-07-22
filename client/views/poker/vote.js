console.log('client/views/poker/vote.js');

var resetSelection = function () {
      document.querySelectorAll('pokerValue').forEach(function (item) {
        item.selected = "";
      });
    },
    disableSelection = function () {
      document.querySelectorAll('pokerValue').forEach(function (item) {
        item.disabled = "disabled";
      });
    },
    enableSelection = function () {
      document.querySelectorAll('pokerValue').forEach(function (item) {
        item.disabled = "";
      });
    };

if (Session.get('collectionsReady')) {
  PokerStream.on(Session.get('currentRoom') + ':currentRoom:freeze', function () {
    disableSelection();
  });
  
  PokerStream.on(Session.get('currentRoom') + ':currentRoom:reset', function () {
    resetSelection();
    enableSelection();
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
    var vote = Session.get('vote'),
        currentRoom = Session.get('currentRoom');
    if (vote) {
      document.querySelector('#btnSendVote').disabled = disabled;
      PokerStream.emit(currentRoom + ':currentRoom:vote', vote);
      Session.set('vote', null);
    }
	}
});
