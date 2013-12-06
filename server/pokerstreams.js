var roomList = {},
    isRoomAdmin = function (roomId, ownerId, subscriptionId) {
       var found = _.chain(roomList)
       .keys(roomList)
       .contains(roomId)
       .value(); 
      
      // salle inexistante
      if (!found) {
        return false;
      }
      
      // tentative de fraude d'un utilisateur
      if (found.ownerId !== ownerId) {
        return false;
      }
      
      // l'utilisateur a modifié sa session
      if (found.subscriptionId !== subscriptionId) {
        return false;
      }
      
      return true;
    };

console.log('start roomList', roomList);

PokerStream.permissions.read(function(eventName) {
  console.log('PokerStream perm read', eventName, this);
  
  if (eventName.match(/(.*):currentRoom/)) {
    console.log('PokerStream perm read matched /(.*):currentRoom/');
    return true;
  }
  
  if (eventName.match(/(.*):room:create/)) {
    var isOwner = _.first(eventName.split(':')) === this.userId + "" ? true : false; // use + "" to force null to "null"
    console.log('PokerStream perm read /(.*):room:create/', isOwner);
    return isOwner ? true : false;
  }

  console.log('PokerStream perm read failed');
  return false;
});

PokerStream.permissions.write(function(eventName) {
  console.log('PokerStream perm write:', eventName, this, roomList);
  
  /**
   * n'importe qui peut accéder à une salle (normalement que pour voter
   */
  if (eventName.match(/(.*):currentRoom/)) {
    console.log('PokerStream perm write matched /(.*):currentRoom/');
    return true;
  } 
  
  /**
   * seul els utilisateurs authentifiés peuvent créé une salle
   */
  if (eventName.match(/room:create/)) {
    console.log('PokerStream perm write matched /room:create/', this.userId);
    return this.userId ? true : false;
  }
  
  /**
   * seul le créateur de la salle peut 
   */
  if (eventName.match(/(.*):room:create/)) {
    var isOwner = _.first(eventName.split(':')) === this.userId 
      && roomList[this.subscriptionId].ownerId ? true : false;
    console.log('PokerStream perm write /(.*):room:create/', isOwner);
    return isOwner ? true : false;
  }

  console.log('PokerStream perm write failed');
  return false;  
});

PokerStream.on('room:create', function (roomId) {
  var self = this,
      found,
      roomInfo = {ownerId: self.userId, 
                  subscriptionId: self.subscriptionId};
  
  self.onDisconnect = function() {
    delete roomList[this.subscriptionId];
  };
  
  if (!self.userId) {
    console.log(self.userId + ':room:create:failure');
    PokerStream.emit(self.userId + ':room:create:failure'); // self.userId = undefined ici
    return;
  }
  
  if (!roomList[roomId]) {
    console.log(self.userId + ':room:create:success');
    PokerStream.emit(self.userId + ':room:create:success');
    roomList[roomId] = roomInfo;
    return;
  }
  
  if (roomList[roomId]
     && roomList[roomId].ownerId === self.userId) {
    console.log(self.userId + ':room:create:success');
    PokerStream.emit(self.userId + ':room:create:success');
    roomList[roomId].subscriptionId = self.subscriptionId;
    return;
  }
  
  console.log(self.userId + ':room:create:failure');
  PokerStream.emit(self.userId + ':room:create:failure');
});


// manage vote/reset/freeze event
// only master can reset or freeze => on Poker insert is there a way to get a subscriptionId from PokerStream ?
//     must also check if ownerId from Poker is the same as userId from stream
// no check on vote except to improve performance : don't rely to everybody but only to listeners of the event