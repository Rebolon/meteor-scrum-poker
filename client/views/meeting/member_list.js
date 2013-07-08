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

	selectedMeeting: function () {
		var selectedMeeting = Session.get('selectedMeeting');
                if (selectedMeeting) {
			return true;
                }
		return false;
	}
});

Template.memberList.events({
	'click #btnGotoSummary': function funcGotoSummary() {
		var selectedMeeting = Session.get('selectedMeeting');
		if (selectedMeeting) {
			Meteor.Router.to('/meeting/summary/' + selectedMeeting);
		}
	}
});
