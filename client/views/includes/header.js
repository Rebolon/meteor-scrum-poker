// for cache system to avoid call gravatar api more than once by page call
var imageUrl;

Template.header.gravatar = function funcTplHeaderGravatar() {
  if (Meteor.user()
     && !imageUrl) {
    _.each(Meteor.user().emails, function funcLoopOverEmailForGravatar(item) {
      var imgUrl = Gravatar.imageUrl(item.address);
      if (imgUrl) {
        imageUrl = imgUrl;
      }
    });
  }
  return (Meteor.user() && imageUrl ? imageUrl : '');
};