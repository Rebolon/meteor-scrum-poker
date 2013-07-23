Session.setDefault('currentRoom', false);

var pokerQRCode,
    getVoteUrl = function (id) {
      return Meteor.Router.pokerVotePath(id);
    },
    
    buildQRCode = function (url) {
      var qrCodeElement = document.querySelector('#qrcode'),
          doQRCode = function () {
             pokerQRCode = new QRCode(qrCodeElement, {                                                                                                                                                                                                                                                                                                       
               text: url,                                                                                                                                  
               width: 128,                                                                                                                                                                    
               height: 128,                                                                                                                                                                   
               colorDark : "#000000",                                                                                                                                                         
               colorLight : "#ffffff",                                                                                                                                                        
               correctLevel : QRCode.CorrectLevel.L                                                                                                                                           
             });
             return pokerQRCode;
           };
      if (qrCodeElement.children.length >0
           && pokerQRCode) {
        pokerQRCode.clear(); // clear the code.
      }
      
      if (pokerQRCode) {
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
console.log('reset', Session.get('currentRoom') + ':currentRoom:reset');
    PokerStream.emit(Session.get('currentRoom') + ':currentRoom:reset');  
  },
  
  'click #btnFreezeVote': function () {
console.log('freeze', Session.get('currentRoom') + ':currentRoom:freeze');
    PokerStream.emit(Session.get('currentRoom') + ':currentRoom:freeze');  
  }
});

