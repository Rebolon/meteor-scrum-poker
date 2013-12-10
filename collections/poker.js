console.log('collections/poker.js');

if (Meteor.isClient) {
  Poker = new Meteor.Collection(null); // for room id generation 
  Vote = new Meteor.Collection(null); // to display Vote on master screen
}

RoomCounter = new Meteor.Collection('PokerRoomCounter');

RoomCounter.allow({
  "insert": function (userId, doc) {
    "use strict";
    return userId ? true : false;
  },
  
  "update": function (userId, doc, fieldNames, modifier) {
    var allowedUpdFields = ['room', 'vote'];
    if (userId
        && _.intersection(fieldNames, allowedUpdFields).length) {
      return true;
    }
    return false;
  }
});