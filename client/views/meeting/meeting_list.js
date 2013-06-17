Template.meetingList.helpers({
	list: function () {
		return Meeting.find({ownerId: Meteor.userId});
	}
});
