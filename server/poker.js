PokerStream.permissions.read(function(event) {
  
  console.log('PokerStream perm read', event);
  return true; // true for test only
  
  var matched = event.match(/(.*):currentRoom/); // or /(.*):message/ to limit only to message event
  if(matched) {
    return true;
  } else {
    return false;
  }
}, false); //end false make sure

PokerStream.permissions.write(function(event) {
  console.log('PokerStream perm write', event);
  return true; // true for test only
}, false); //end false make sure


// manage vote/reset/freeze event
// only master can reset or freeze => on Poker insert is there a way to get a subscriptionId from PokerStream ?
//     must also check if ownerId from Poker is the same as userId from stream
// no check on vote except to improve performance : don't rely to everybody but only to listeners of the event