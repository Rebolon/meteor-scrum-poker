Template.meetingList.helpers({
	meetings: function () {
		var meeting = Meeting.find({ownerId: Meteor.userId()}, {sort: {submitted: -1}});
		return meeting;
	}
});

Template.meetingList.events({
	'click #alertRemoveMeeting .btn-primary': function () {
		var idToRemove = Session.get('selectedMeeting');

		if (idToRemove) {
			Meeting.remove({_id: idToRemove});
			Session.set('selectedMeeting', null);
		}

		$('#alertRemoveMeeting').modal('hide');
	}
});
