Meteor.Router.add({
	'/': 'meetingList',

	'/meeting/:_id': {
		to: 'meetingPage',
		and: function(id) { Session.set('currentMeetingId', id); }
	},

	'/submit': 'meetingSubmit'
});

Meteor.Router.filters({
	'requireLogin': function(page) {
	if (Meteor.user())
		return page;
	else if (Meteor.loggingIn())
		return 'loading';
	else
		return 'accessDenied';
	}
});
Meteor.Router.filter('requireLogin', {only: 'meetingSubmit'});
