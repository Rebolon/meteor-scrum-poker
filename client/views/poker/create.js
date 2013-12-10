Session.setDefault('currentRoom', false);

var pokerQRCode,
    getVoteUrl = function (id) {
      return Meteor.Router.pokerVotePath(id);
    },
    
    buildQRCode = function (url) {
      var qrCodeElement = document.querySelector('#qrcode'),
          doQRCode = function () {
            qrCodeElement.innerHTML = "";
            
            pokerQRCode = new QRCode(qrCodeElement, {                                                                                                                                                                                                                                                                                                       
              text: url,                                                                                                                                  
              width: 128,                                                                                                                                                                    
              height: 128,                                                                                                                                                                   
              colorDark : "#000000",                                                                                                                                                         
              colorLight : "#ffffff",                                                                                                                                                        
              correctLevel : QRCode.CorrectLevel.L                                                                                                                                           
            });
            return pokerQRCode;
          },
          url = location.protocol + '//' + location.host + url;
      
      if (pokerQRCode) {
        // because of re-rendering the qrCodeElement stored in pokerQRCode is no more in DOM
        //pokerQRCode.clear();
        //pokerQRCode.makeCode(url); // make another code.  
        doQRCode();
      } else {
        if (typeof QRCode != "undefined") {
          doQRCode();
        } else {
          Meteor.setTimeout(doQRCode, 1000);
        }
      }
      
      console.log('room vote url', url);
    };

Meteor.startup(function () {
  
  Deps.autorun(function funcReloadStreamListeningOnNewRoom () {
    PokerStream.on(Session.get('currentRoom') + ':room:user:disconnected', function (subscriptionId) {
      // remove vote from a disconnected user, only if room is in voting status
      if (Session.get('pokerVoteStatus') === 'voting') {
        Vote.remove({subscriptionId: subscriptionId})
      }
    });
    
    PokerStream.on(Session.get('currentRoom') + ':room:vote', function (vote) {
      var voteFound = 0;
      // update is now allowed
      if (Session.get('pokerVoteStatus') === 'voting') {
        voteFound = Vote.findOne({subscriptionId: this.subscriptionId});
        if (!voteFound) {
          Vote.insert({value: vote, userId: this.userId, subscriptionId: this.subscriptionId});
        } else {
          Vote.update({_id: voteFound._id}, {$set: {value: vote}});
        }
      } else {
        PokerStream.emit(Session.get('currentRoom') + ':room:freeze');
      }
    });
  });
  
});

Template.pokerCreate.helpers({
	isInRoom: function funcTplRoomRoomIsInRoom() {
		return Session.get('currentRoom');
	}
});

Template.pokerCreate.rendered = function () {
  var currentRoom = Session.get('currentRoom');
  if (currentRoom) {
    buildQRCode(getVoteUrl(currentRoom));
    PokerStream.emit('room:create', currentRoom); // in case we arrive here directly after a server restart => re-create the room
    
    PokerStream.on(Meteor.userId() + ':room:create:failure', function () {
      PokerStream.removeListener(Meteor.userId() + ':room:create:failure');
      $('#wrap .navbar').before('<div class="alert alert-danger"><strong>Error:</strong> something wrong happened, room destroyed</div>');
      Meteor.setTimeout(function () {
        $("#wrap .alert").alert('close');
        Meteor.Router.to('/poker');
      }, 1000);
    });
  }
};

Template.pokerCreate.getRoomStatus = function() {
  var roomStatus;
  
  switch(Session.get('pokerVoteStatus')) {
    case 'freeze':
      roomStatus = 'Vote freezed';
      break;
    default:
      roomStatus = 'Vote pending';
  }

  return roomStatus;
};
 // @TODO how to mutualize with getRoomStatus using params ?
Template.pokerCreate.getRoomStatusClass = function() {
  var className;
  
  switch(Session.get('pokerVoteStatus')) {
    case 'freeze':
      className = 'warning';
      break;
    default:
      className = 'info';
  }
  
  return className;
};

Template.pokerCreate.events({
  'click #btnCreateRoom': function funcTplCreateRoomClickBtnCreateRoom() {
    var toInsert = {},
        id, qrCode, qrCodeElement = document.querySelector('#qrcode');

    if (Meteor.userId()) {
      toInsert.ownerId = Meteor.userId();
    }
    
    id = Poker.insert(toInsert);
    PokerStream.emit('room:create', id);
    
    PokerStream.on(Meteor.userId() + ':room:create:success', function () {
      Session.set('currentRoom', id);
      Session.get('pokerVoteStatus', 'voting');
      
      Meteor.Router.to(Meteor.Router.pokerRoomCreatedPath(id));
      Vote.find().forEach(function funcResetVote(item) {
        Vote.remove({_id: item._id});
      });
      PokerStream.removeListener(Meteor.userId() + ':room:create:success');
      PokerStream.removeListener(Meteor.userId() + ':room:create:failure');
    });
    
    PokerStream.on(Meteor.userId() + ':room:create:failure', function () {
      $('#wrap .navbar').before('<div class="alert alert-danger"><strong>Error:</strong> you need to be logged</div>');
      Meteor.setTimeout(function () {
        $("#wrap .alert").alert('close');
        Meteor.Router.to('/poker');
      }, 1000);
      PokerStream.removeListener(Meteor.userId() + ':room:create:success');
      PokerStream.removeListener(Meteor.userId() + ':room:create:failure');
    });
	},
  
  'click #btnResetVote': function () {
    PokerStream.emit(Session.get('currentRoom') + ':room:reset');  
    Vote.find({}).forEach(function (item) {
      Vote.remove({_id: item._id});
    });

    var freezeBtn = document.querySelector('#btnFreezeVote');
    freezeBtn.className = freezeBtn.className.replace(/(?:^|\s)btn-inverse(?!\S)/g, "");
    
    Session.set('displayVoteResult', false);
    Session.set('pokerVoteStatus', 'voting');
  },
  
  // @TODO on server side, freeze should block any client try
  'click #btnFreezeVote': function () {
    PokerStream.emit(Session.get('currentRoom') + ':room:freeze');

    this.className += " btn-inverse";
    
    Session.set('displayVoteResult', true);
    Session.set('pokerVoteStatus', 'freeze');
  }
});

