Meteor.Router.add({
	// to dashboard with meetingList and SprintList
	'/': 'meetingList',

	/**
	 * Meeting tools
	 */
/*	'/meeting/:_id': { // au fait ça sert à quoi ça ?
		to: 'meetingItem',
		and: function(id) { Session.set('selectedMeeting', id); }
	},
*/	
	'/meeting/submit': {
		to: 'meetingSubmit',
		and: function() { Session.set('selectedMeeting', null); }
	},

	'/meeting/edit/:_id': {
		to: 'meetingSubmit',
		and: function(id) { Session.set('selectedMeeting', id); }
	},

	'/meeting/start-stop/:_id': {
		to: 'meetingStartStop',
		and: function(id) { Session.set('selectedMeeting', id); }
	},

	'/meeting/summary/:_id': {
		to: 'meetingSummary',
		and: function(id) { Session.set('selectedMeeting', id); }
	}//,

	/**
	 * Sprint mood tools
	 */
/*	'/sprint/:_id': {
		to: 'sprintPage',
                and: function(id) { Session.set('selectedSprint', id); }
	},

	'/sprint/submit': {
                to: 'sprintSubmit',
                and: function() { Session.set('selectedSprint', null); }
        },

        '/sprint/edit/:_id': {
                to: 'sprintMoodSubmit',
                and: function(id) { Session.set('selectedSprint', id); }
        },

	'/sprint/summary/:_id': {
                to: 'sprintMoodSummary',
                and: function(id) { Session.set('selectedSprint', id); }
        },
*/
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
				return 'meetingStartStop';
			}
		}

		return 'meetingSummary';
	},

	'noMorePossibleToEdit': function(page) {
		var meeting = Meeting.findOne(Session.get('selectedMeeting'));
		if (meeting
			&& meeting.startTime) {
			return 'meetingSummary';
		}

		return page;
	}
});

Meteor.Router.filter('requireLogin', {only: ['meetingSubmit', 'meetingVote']}); //, 'sprintSubmit', 'sprintVote']});
Meteor.Router.filter('ownerRedirectedToStartStop', {only: ['meetingSummary']}); //, 'sprintSummary']});
Meteor.Router.filter('noMorePossibleToEdit', {only: ['meetingSubmit']});
