console.log('client/views/poker/vote.js');

Session.setDefault('pokerVoteStatus', 'voting'); // status available : voting, freeze

var disableSelection = function () {
console.log('disableSelection');
      var list = document.querySelectorAll('.pokerValue');
      _.each(list, function (item) {
        item.disabled = "disabled";
      });
      
      document.querySelector('#btnSendVote').disabled = "disabled";
      document.querySelector('#btnSendVote').className += " disabled";
      
      Session.get('pokerVoteStatus', 'freeze');
    },
    
    resetSelection = function () {
console.log('resetSelection');
      enableSelection();
    },
    
    enableSelection = function () {
console.log('enableSelection');
      var list = document.querySelectorAll('.pokerValue');
      _.each(list, function (item) {
        item.disabled = "";
      });
      
      resetAndSelectSelection();
      
      document.querySelector('#btnSendVote').disabled = "";
      document.querySelector('#btnSendVote').className = document.querySelector('#btnSendVote').className.replace(/(?:^|\s)disabled(?!\S)/g, "");
    },
    
    resetAndSelectSelection = function (voteValue) {
console.log('resetAndSelectSelection', voteValue); 
      var list = document.querySelectorAll('.pokerValue');
      _.each(list, function (item) {
        item.className = item.className.replace(/(?:^|\s)btn-inverse(?!\S)/g, "");
        if (voteValue
              && item.value == voteValue)
          item.className += " btn-inverse";
      });
      
      Session.get('pokerVoteStatus', 'voting');
    };

Meteor.startup(function () {
  
  PokerStream.on(Session.get('currentRoom') + ':currentRoom:freeze', function () {
console.log('freeze', arguments);
    disableSelection();
  });
    
  PokerStream.on(Session.get('currentRoom') + ':currentRoom:reset', function () {
console.log('reset', arguments);
    resetSelection();
  });

});

Template.pokerVote.events({
  'click .btn.pokerValue': function (event) {
console.log('click .btn.pokerValue');
    if (Session.get('pokerVoteStatus') !== 'voting')
      return;
    
console.log('click .btn.pokerValue', 'continue');
    var vote = event.currentTarget.value;

    // reset previous selection if 
    if (vote !== Session.get('vote')) {
      resetSelection();
    }
    
    Session.set('vote', vote);
    this.selected = "selected";
    document.querySelector('#btnSendVote').disabled = "";
    document.querySelector('#btnSendVote').className = document.querySelector('#btnSendVote').className.replace(/(?:^|\s)disabled(?!\S)/g, "");
  },
  
  // maybe btnSendCote is useless and we should emit 
	'click #btnSendVote': function () {
console.log('click #btnSendVote');
    if (Session.get('pokerVoteStatus') !== 'voting')
      return;
    
console.log('click #btnSendVote', 'continue');
    var vote = Session.get('vote'),
        currentRoom = Session.get('currentRoom');
    
    if (vote) {
      document.querySelector('#btnSendVote').disabled = "disabled";
      document.querySelector('#btnSendVote').className += " disabled";

      resetAndSelectSelection(vote);
      
      PokerStream.emit(currentRoom + ':currentRoom:vote', vote);
      Session.set('vote', null);
    }
	}
});
