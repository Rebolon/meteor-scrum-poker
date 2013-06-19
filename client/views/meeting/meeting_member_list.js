Template.memberList.helpers({
	member: function funcGetMemberListOfMeeting() {
                var members = [],
		    meeting = Meeting.findOne({_id: Session.get('selectedMeeting')});
		// manage first time tempalte is rendered whereas data is maybe not arrived
		if (meeting) {
			members = meeting.members;
		}

                return members;
        },
});
