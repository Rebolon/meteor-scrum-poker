Template.meetingSubmit.helpers({
	list: function funcGetMemberListOfMeeting() {
		return Members.find({meeting: Session.get('selectedMeeting')});
	},

	selected: function() {
		var selected = Session.get('selectedMeeting');
		if (selected) {
			return Meeting.findOne(selected);
		}
		return null
	}
});
