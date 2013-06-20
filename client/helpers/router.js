Meteor.Router.add({
	'/': 'meetingList',

	'/meeting/:_id': {
		to: 'meetingPage',
		and: function(id) { Session.set('selectedMeeting', id); }
	},
	
	'/submit': {
		to: 'meetingSubmit',
		and: function() { Session.set('selectedMeeting', null); }
	},

	'/edit/:_id': {
		to: 'meetingSubmit',
		and: function(id) { Session.set('selectedMeeting', id); }
	},

	'/start-stop/:_id': {
		to: 'startStop',
		and: function(id) { Session.set('selectedMeeting', id); }
	},

	'/summary/:_id': {
		to: 'summary',
		and: function(id) { Session.set('selectedMeeting', id); }
	}
});

Meteor.Router.filters({
	'requireLogin': function(page) {
		if (Meteor.user())
			return page;
		else if (Meteor.loggingIn())
			return 'loading';
		else
			return 'accessDenied';
	},

	'ownerRedirectedToStartStop': function(page) {
		if (Meteor.user()) {
			var meeting = Meeting.findOne(Session.get('selectedMeeting'));
			if (meeting
				&& meeting.ownerId === Meteor.userId()
				&& !meeting.endTime) {
				return 'startStop';
			}
		}
		return 'summary';
	}
});

Meteor.Router.filter('requireLogin', {only: 'meetingSubmit'});
Meteor.Router.filter('ownerRedirectedToStartStop', {only: 'summary'});
