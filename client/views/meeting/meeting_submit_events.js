Template.meetingSubmit.events({
	'click #btnAddMeeting': function(event) {
		event.preventDefault();

		var meeting = {
			title: $(event.target).find('[name=title]').val()
		};

		Meteor.call('createMeeting', meeting, function(error, id) {
			if (error)
				return alert(error.reason);

			Session.set('selectedMeeting', id);
		});
	},

	'click #btnAddMember': function () {

	},

	'click #btnStartMeeting': function () {
		Meteor.Router.to('counter');
	}
});
