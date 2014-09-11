console.log('client/views/poker/vote.js');

Session.setDefault('pokerVoteStatus', 'voting'); // status available : voting, freeze

var enableSendButton = function () {
  var btnSendVoteList = document.querySelectorAll('.btnSendVote');
  _.each(btnSendVoteList, function (item) {
    item.disabled = "";
    item.className = document.querySelector('.btnSendVote').className.replace(/(?:^|\s)disabled(?!\S)/g, "");
  });
},  
    disableSendButton = function () {
      var btnSendVoteList = document.querySelectorAll('.btnSendVote');
      _.each(btnSendVoteList, function (item) {
        item.disabled = "disabled";
        item.className += " disabled";
      });
},  
    disableSelection = function () {
      var btnValueList = document.querySelectorAll('.pokerValue');
      _.each(btnValueList, function (item) {
        item.disabled = "disabled";
      });
      
      disableSendButton();
      
      Session.set('pokerVoteStatus', 'freeze');
    },
    
    resetSelection = function (doResetAndSelect) {
      enableSelection();
      
      if (doResetAndSelect) {
        resetAndSelectSelection();
        
        Session.set('pokerVoteStatus', 'voting');
      }
    },
    
    enableSelection = function () {
      var list = document.querySelectorAll('.pokerValue');
      _.each(list, function (item) {
        item.disabled = "";
      });
      
      enableSendButton();
    },
    
    resetAndSelectSelection = function (voteValue) {
      var list = document.querySelectorAll('.pokerValue');
      _.each(list, function (item) {
        item.className = item.className.replace(/(?:^|\s)btn-default(?!\S)/g, "");
        if (item.className.search('btn-primary') === -1) {
          item.className += " btn-primary";
        }
        
        if (voteValue
            && item.value == voteValue) {
          item.className += " btn-default";
          item.className = item.className.replace(/(?:^|\s)btn-primary(?!\S)/g, "");
        }
      });
      
      Session.get('pokerVoteStatus', 'voting');
    },
    
    closeRoom = function () {
       Session.set('closed', true); 
    };

Meteor.startup(function () {
  
  PokerStream.on(Session.get('currentRoom') + ':room:freeze', function () {
    disableSelection();
  });
    
  PokerStream.on(Session.get('currentRoom') + ':room:reset', function () {
    resetSelection(true);
  });
  
  PokerStream.on(Session.get('currentRoom') + 'room:delete', function () {
    console.log("close room: " + Session.get('currentRoom') + 'room:delete');
    closeRoom();
  });

});

Template.pokerVote.events({
  'click .btn.pokerValue': function (event) {
    if (Session.get('pokerVoteStatus') !== 'voting')
      return;
    
    var vote = event.currentTarget.value;

    // reset previous selection if 
    if (vote !== Session.get('vote')) {
      resetSelection();
    }
    
    Session.set('vote', vote);
    this.selected = "selected";
    enableSendButton();
  },
  
  // maybe btnSendCote is useless and we should emit 
	'click .btnSendVote': function () {
    if (Session.get('pokerVoteStatus') !== 'voting')
      return;

    var vote = Session.get('vote'),
        currentRoom = Session.get('currentRoom');
    
    if (vote) {
      
      disableSendButton();
      
      resetAndSelectSelection(vote);
      
      PokerStream.emit(currentRoom + ':room:vote', vote);
      Session.set('vote', null);
    }
	}
});

Template.pokerVote.helpers({
  "isRoomOpened": function funcTplPokerVoteHelperIsRoomOpened() {
    return !Session.get('closed');
  }
});