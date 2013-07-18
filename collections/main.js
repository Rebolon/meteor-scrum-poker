console.log('collections/main.js');

if (Meteor.isClient) {
 Session.set('collectionsReady', true); 
}