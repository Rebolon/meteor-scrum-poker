Template.meetingList.helpers({
	meetings: function () {
		var meeting = Meeting.find({ownerId: Meteor.userId()}, {sort: {submitted: -1}});
		return meeting;
	}
});
