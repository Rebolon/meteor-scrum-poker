Template.meetingSubmit.events({
	'click #btnAddMeeting': function() {
		var meeting = {
			title: document.querySelector('#title').value
		};

		Meteor.call('createMeeting', meeting, function(error, id) {
			if (error)
				return alert(error.reason);

			Session.set('selectedMeeting', id);
		});
	},

	'click #btnAddMember': function () {

	},

	'click #btnEditMeeting': function () {
		var meeting = {
                        title: document.querySelector('#title').value
                };

		if (Session.get('selectedMeeting')) {
			meeting._id = Session.get('selectedMeeting');
		}

		if (meeting.title !== Meeting.findOne(Session.get('selectedMeeting')).title) {
	                Meteor.call('createMeeting', meeting, function(error, id) {
	                        if (error)
	                                return alert(error.reason);
	                });
		};
	},

	'click #btnStartMeeting': function () {
		Meteor.Router.to('counter');
	}
});
