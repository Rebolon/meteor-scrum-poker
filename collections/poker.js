console.log('collections/poker.js');

if (Meteor.isClient) {
  Poker = new Meteor.Collection(null); // for room id generation 
  Vote = new Meteor.Collection(null); // to display Vote on master screen
}
  // @TODO allow what ? user must be logged ? insert/edit only authorize ownerId field to lighter the collection ?