Template.meetingSubmit.helpers({
	selected: function funcMeetingIsNewOrEdit() {
		var selected = Session.get('selectedMeeting');
		if (selected) {
			return Meeting.findOne(selected);
		}
		return null;
	}
});
