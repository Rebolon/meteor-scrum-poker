Session.setDefault('currentRoom', false);

var currentRoom = Session.get('currentRoom');

Template.pokerCreate.helpers({
	isInRoom: function funcTplRoomRoomIsInRoom() {
		return Session.get('currentRoom');
	}
});

Template.pokerCreate.events({
  'click #btnCreateRoom': function funcTplCreateRoomClickBtnCreateRoom() {
    var toInsert = {},
        getVoteUrl = function (id) {
          return location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") 
            + location.pathname + "/vote/" + id;
        },
        id, qrCode, qrCodeElement = document.querySelector('#qrcode');
    if (Meteor.UserId) {
      toInsert.ownerId = Meteor.UserId;
    }
    
    id = Poker.insert(toInsert);
    
    new QRCode(qrCodeElement, {
      text: getVoteUrl(id),
      width: 128,
      height: 128,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.L
    });
    
    document.querySelector('#btnCreateRoom').disabled = 'disabled';
    
    Session.set('currentRoom', id);
	},
  
  'click #btnResetVote': function () {
    PokerStream.emit(currentRoom + 'currentRoom');  
  }
});
