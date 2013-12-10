Meteor.startup(function funcMeteorStartup() {
  // set Publish
  Meteor.publish("RoomCounter", function () {
    return RoomCounter.find();
  }); 
});