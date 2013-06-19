Template.summary.helpers({
	meeting: function() {
		var meeting = Session.get('selectedMeeting');
		if (meeting) {
			return Meeting.findOne(meeting);
		}
	}
});
