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
         pokerQRCode.clear();
         pokerQRCode.makeCode(url); // make another code.  
      } else {
        if (typeof QRCode != "undefined") {
          doQRCode();
        } else {
          Meteor.setTimeout(doQRCode, 1000);
        }
      }
      
      console.log('url', url);
    };

Meteor.startup(function () {
  
  Deps.autorun(function funcReloadStreamListeningOnNewRoom () {
    PokerStream.on(Session.get('currentRoom') + ':currentRoom:vote', function (vote) {
      var voteFound = 0;
      // update is now allowed
      if (Session.get('pokerVoteStatus') === 'voting') {
        voteFound = Vote.find({subscriptionId: this.subscriptionId});
        if (!voteFound.count()) {
          Vote.insert({value: vote, userId: this.userId, subscriptionId: this.subscriptionId});
        } else {
          Vote.update({_id: voteFound._id}, {$set: {value: vote}});
        }
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
  }
};

Template.pokerCreate.events({
  'click #btnCreateRoom': function funcTplCreateRoomClickBtnCreateRoom() {
    var toInsert = {},
        id, qrCode, qrCodeElement = document.querySelector('#qrcode');
    
    if (Meteor.UserId) {
      toInsert.ownerId = Meteor.UserId;
    }
    
    id = Poker.insert(toInsert);
    Session.set('currentRoom', id);
    Session.get('pokerVoteStatus', 'voting');
    
    Meteor.Router.to(Meteor.Router.pokerRoomCreatedPath(id));
    Vote.find().forEach(function funcResetVote(item) {
      Vote.remove({_id: item._id});
    });
    
// only for test purpose
PokerStream.emit(Session.get('currentRoom') + ':currentRoom:created');
	},
  
  'click #btnResetVote': function () {
    PokerStream.emit(Session.get('currentRoom') + ':currentRoom:reset');  
    Vote.find({}).forEach(function (item) {
      Vote.remove({_id: item._id});
    });

    var freezeBtn = document.querySelector('#btnFreezeVote');
    freezeBtn.className = freezeBtn.className.replace(/(?:^|\s)btn-inverse(?!\S)/g, "");
    
    Session.set('displayVoteResult', false);
    Session.get('pokerVoteStatus', 'voting');
  },
  
  // @TODO on server side, freeze should block any client try
  'click #btnFreezeVote': function () {
    PokerStream.emit(Session.get('currentRoom') + ':currentRoom:freeze');

    this.className += " btn-inverse";
    
    Session.set('displayVoteResult', true);
    Session.get('pokerVoteStatus', 'freeze');
  }
});

