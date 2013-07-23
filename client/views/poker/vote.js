console.log('client/views/poker/vote.js');

var resetSelection = function () {
      var list = document.querySelectorAll('pokerValue');
      _.each(list, function (item) {
        item.selected = "";
      });
    },
    disableSelection = function () {
      var list = document.querySelectorAll('pokerValue');
      _.each(list, function (item) {
        item.disabled = "disabled";
      });
    },
    enableSelection = function () {
      var list = document.querySelectorAll('pokerValue');
      _.each(list, function (item) {
        item.disabled = "";
      });
    };

Meteor.startup(function () {
  
  PokerStream.on(Session.get('currentRoom') + ':currentRoom:freeze', function (event) {
console.log('freeze', event);
    disableSelection();
  });
    
  PokerStream.on(Session.get('currentRoom') + ':currentRoom:reset', function (event) {
console.log('freeze', event);
    resetSelection();
    enableSelection();
  });

});

Template.pokerVote.events({
  'click .btn.pokerValue': function (event) {
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
    var vote = Session.get('vote'),
        currentRoom = Session.get('currentRoom');
    if (vote) {
      document.querySelector('#btnSendVote').disabled = "disabled";
      document.querySelector('#btnSendVote').className += " disabled";
      
console.log('emit', currentRoom + ':currentRoom:vote');
      PokerStream.emit(currentRoom + ':currentRoom:vote', vote);
      Session.set('vote', null);
    }
    
    PokerStream.emit('emitEvent', 'test');
	}
});
