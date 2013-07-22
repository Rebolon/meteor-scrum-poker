Session.setDefault('currentRoom', false);

var pokerQRCode,
    getVoteUrl = function (id) {
      return location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") 
      + location.pathname + "/vote/" + id;
    },
    
    buildQRCode = function (url) {
      var qrCodeElement = document.querySelector('#qrcode');
      if (qrCodeElement.children.length >0
           && pokerQRCode) {
        pokerQRCode.clear(); // clear the code.
      }
      
      if (pokerQRCode) {
         pokerQRCode.makeCode(url); // make another code.  
      } else {
         pokerQRCode = new QRCode(qrCodeElement, {                                                                                                                                                                                                                                                                                                       
           text: url,                                                                                                                                  
           width: 128,                                                                                                                                                                    
           height: 128,                                                                                                                                                                   
           colorDark : "#000000",                                                                                                                                                         
           colorLight : "#ffffff",                                                                                                                                                        
           correctLevel : QRCode.CorrectLevel.L                                                                                                                                           
         });
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
	},
  
  'click #btnResetVote': function () {
    PokerStream.emit(Session.get('currentRoom') + ':currentRoom:reset');  
  },
  
  'click #btnFreezeVote': function () {
    PokerStream.emit(Session.get('currentRoom') + ':currentRoom:freeze');  
  }
});

