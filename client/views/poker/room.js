Session.setDefault('currentRoom', false);

var currentRoom = Session.get('currentRoom');

Template.pokerRoom.helpers({
	isInRoom: function funcTplRoomRoomIsInRoom() {
		return Session.get('currentRoom');
	}
});

Template.pokerRoom.events({
  'click #btnCreateRoom': function funcTplRoomRoomClickBtnCreateRoom() {
    var toInsert = {}, 
        id, qrCode, qrCodeElement = document.querySelector('#qrcode');
    if (Meteor.UserId) {
      toInsert.ownerId = Meteor.UserId;
    }
    
    id = Poker.insert(toInsert);
    
    new QRCode(qrCodeElement, {
      text: location.protocol + "://" + location.host + (location.port ? ":" + location.port : "") 
        + "/" + location.pathname,
      width: 256,
      height: 256,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });
    
    document.querySelector('#btnCreateRoom').disabled = 'disabled';
    document.querySelector('#btnGoToResult').style.visibility = 'visible';
    document.querySelector('#btnGoToResult').style.display = 'block';
	},
  
  'click #btnGoToRoom': function funcTplRoomRoomClickBtnCreateRoom() {
    Session.set('currentRoom', id);
	},
  
  'click #btnResetVote': function () {
    PokerStream.emit(currentRoom + 'currentRoom');  
  }
});
