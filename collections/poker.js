console.log('collections/common.js');

if (Meteor.isClient) {
  Poker = new Meteor.Collection(null);
}
  // @TODO allow what ? user must be logged ? insert/edit only authorize ownerId field to lighter the collection ?