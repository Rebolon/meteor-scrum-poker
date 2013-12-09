console.log('collections/poker.js');

if (Meteor.isClient) {
  Poker = new Meteor.Collection(null); // for room id generation 
  Vote = new Meteor.Collection(null); // to display Vote on master screen
}

RoomCounter = new Meteor.Collection('PokerRoomCounter');
VoteCounter = new Meteor.Collection('VoteCounter');