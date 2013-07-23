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
  
  PokerStream.on(Session.get('currentRoom') + ':currentRoom:vote', function (vote) {
console.log('vote', vote, this);
    // actually don't update, only one vote accepted, but maybe update is a better idea
    if (!Vote.find({subscriptionId: this.subscriptionId}).count()) {
      Vote.insert({value: vote, userId: this.userId, subscriptionId: this.subscriptionId});
    }
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
    Meteor.Router.to(Meteor.Router.pokerRoomCreatedPath(id));
	},
  
  'click #btnResetVote': function () {
    PokerStream.emit(Session.get('currentRoom') + ':currentRoom:reset');  
    Vote.find({}).forEach(function (item) {
      Vote.delete({_id: item._id});
    });
    Session.set('displayVoteResult', false);
  },
  
  // @TODO on server side, freeze should block any client try
  'click #btnFreezeVote': function () {
    PokerStream.emit(Session.get('currentRoom') + ':currentRoom:freeze');
    Session.set('displayVoteResult', true);
  }
});

