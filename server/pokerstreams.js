PokerStream.permissions.read(function(eventName) {
console.log('PokerStream perm read', eventName, this);
  var matched = eventName.match(/(.*):currentRoom/); // or /(.*):message/ to limit only to message event
console.log('PokerStream perm read matched', matched);
  return matched ? true : false;
});

PokerStream.permissions.write(function(eventName) {
console.log('PokerStream perm write', eventName, this);
  var matched = eventName.match(/(.*):currentRoom/); // or /(.*):message/ to limit only to message event
console.log('PokerStream perm write matched', matched);
  return matched ? true : false;
});

// manage vote/reset/freeze event
// only master can reset or freeze => on Poker insert is there a way to get a subscriptionId from PokerStream ?
//     must also check if ownerId from Poker is the same as userId from stream
// no check on vote except to improve performance : don't rely to everybody but only to listeners of the event