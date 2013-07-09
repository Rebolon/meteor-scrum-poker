Template.sprintMemberList.helpers({
	member: function funcGetMemberListOfSprint() {
                var members = [],
		    sprint = Sprint.findOne({_id: Session.get('selectedSprint')});
		// manage first time tempalte is rendered whereas data is maybe not arrived
		if (sprint) {
			members = sprint.members;
		}

                return members;
        },

	selectedSprint: function () {
		var selectedSprint = Session.get('selectedSprint');
                if (selectedSprint) {
			return true;
                }
		return false;
	}
});

Template.sprintMemberList.events({
	'click #btnGotoSummary': function funcGotoSummary() {
		var selectedSprint = Session.get('selectedSprint');
		if (selectedSprint) {
			Meteor.Router.to('/nikoniko/summary/' + selectedSprint);
		}
	}
});
