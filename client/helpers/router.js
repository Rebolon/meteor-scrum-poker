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
	}
});

Meteor.Router.filter('requireLogin', {only: 'meetingSubmit'});
