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
    },
    listeningToVoteStream = function (roomId) {
      PokerStream.on(roomId + ':room:vote', function () {
        var self = this;
        this.onDisconnect = function () {
          PokerStream.emit(roomId + ':room:user:disconnected', self.subscriptionId);
        };
      });
    };

var onRoomFreeze = function (roomId) {
  PokerStream.on('room:freeze', function (roomId) {
    var self = this;
    
    self.onDisconnect = function() {
      delete roomList[roomId];
    };
    
    if (!self.userId) {
      return;
    }
    
    if (!roomList[roomId]) {
      return;
    }
    
    if (roomList[roomId]
        && roomList[roomId].ownerId === self.userId) {
      roomList[roomId].status = "freeze";
      return;
    }
  });
};

var onRoomReset = function () {
  PokerStream.on('room:reset', function (roomId) {
    var self = this;
    
    self.onDisconnect = function() {
      delete roomList[roomId];
    };
    
    if (!self.userId) {
      return;
    }
    
    if (!roomList[roomId]) {
      return;
    }
    
    if (roomList[roomId]
        && roomList[roomId].ownerId === self.userId) {
      roomList[roomId].status = "voting";
      return;
    }
  });
};

console.log('start roomList', roomList);

PokerStream.permissions.read(function(eventName) {
  console.log('PokerStream perm read', eventName, this.subscriptionId, this.userId);

  if (eventName.match(/(.*):room:user:disconnected/)) {
    //console.log('disconnection', _.first(eventName.split(':')), this.subscriptionId, roomList);
    return true;
  }
  
  if (eventName.match(/(.*):room:create:(success|failure)/)) {
    //console.log('PokerStream perm read /room:create/');
    return _.first(eventName.split(':')) == this.userId ? true : false;
  }

  if (eventName.match(/(.*):room:vote/)) {
    //console.log('PokerStream perm read matched /(.*):room:vote/');
    if (roomList[_.first(eventName.split(':'))].ownerId != this.userId
       || roomList[_.first(eventName.split(':'))].status != "voting") {
      return false;
    }
    
    listeningToVoteStream(_.first(eventName.split(':')));
    return true;
  }
      
  if (eventName.match(/(.*):room/)) {
    //console.log('PokerStream perm read matched /(.*):room/');
    return true;
  }
  
  if (eventName.match(/room:create/)) {
    //console.log('PokerStream perm read /room:create/');
    return false;
  }

  //console.log('PokerStream perm read failed');
  return false;
});

PokerStream.permissions.write(function(eventName) {
  console.log('PokerStream perm write:', eventName, this.subscriptionId, this.userId);
  
  /**
   * seul els utilisateurs authentifiés peuvent créé une salle
   */
  if (eventName.match(/room:create/)) {
    //console.log('PokerStream perm write matched /room:create/', this.userId);
    return this.userId ? true : false;
  }
  
  /**
   * seul els utilisateurs authentifiés peuvent créé une salle
   */
  if (eventName.match(/(.*):room:(freeze|reset)/)) {
    //console.log('PokerStream perm write matched /(.*):room:(freeze|reset)/', this.userId);
    //onRoomFreeze(_.first(eventName.split(':')));
    //onRoomReset(_.first(eventName.split(':')));
    return this.userId ? true : false;
  }
  
  /**
   * n'importe qui peut accéder à une salle (normalement que pour voter
   */
  if (eventName.match(/(.*):room:vote/)) {
    //console.log('PokerStream perm write matched /(.*):room:vote/');
    return roomList[_.first(eventName.split(':'))].status == "voting" ? true : false;
  }

  //console.log('PokerStream perm write failed');
  return false;  
});

PokerStream.on('room:create', function (roomId) {
  var self = this,
      found,
      roomInfo = {ownerId: self.userId, 
                  subscriptionId: self.subscriptionId,
                  status: "voting"};
  
  self.onDisconnect = function() {
    delete roomList[roomId];// this.subscriptionId];
  };
  
  if (!self.userId) {
    //console.log(self.userId + ':room:create:failure');
    PokerStream.emit(self.userId + ':room:create:failure'); // self.userId = undefined ici
    return;
  }
  
  if (!roomList[roomId]) {
    //console.log(self.userId + ':room:create:success');
    PokerStream.emit(self.userId + ':room:create:success');
    roomList[roomId] = roomInfo;
    return;
  }
  
  if (roomList[roomId]
     && roomList[roomId].ownerId === self.userId) {
    //console.log(self.userId + ':room:create:success');
    PokerStream.emit(self.userId + ':room:create:success');
    roomList[roomId].subscriptionId = self.subscriptionId;
    return;
  }
  
  //console.log(self.userId + ':room:create:failure');
  PokerStream.emit(self.userId + ':room:create:failure');
});

// manage vote/reset/freeze event
// only master can reset or freeze => on Poker insert is there a way to get a subscriptionId from PokerStream ?
//     must also check if ownerId from Poker is the same as userId from stream
// no check on vote except to improve performance : don't rely to everybody but only to listeners of the event