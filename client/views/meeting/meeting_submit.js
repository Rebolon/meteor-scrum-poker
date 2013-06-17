Template.meetingSubmit.helpers({
	list: function funcGetMemberListOfMeeting() {
		return Members.find({meeting: Session.get('selectedMeeting')});
	}
});
