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
/*	'/sprint/:_id': { // idem meeting... ?
		to: 'sprintPage',
                and: function(id) { Session.set('selectedSprint', id); }
	},
*/
	'/sprint/submit': {
                to: 'sprintSubmit',
                and: function() { Session.set('selectedSprint', null); }
        },

        '/sprint/edit/:_id': {
                to: 'sprintSubmit',
                and: function(id) { Session.set('selectedSprint', id); }
        },

	'/sprint/summary/:_id': {
                to: 'sprintSummary',
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

	'meetingOwnerRedirectedToStartStop': function(page) {
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
		var pageName = page;
		switch (substr(page, 0, 6) {
			case 'sprint':
				var sprint = Sprint.findOne(Session.get('selectedSprint'));
                                if (sprint
                                        && sprint.startTime) {
                                        pageName = 'sprintSummary';
                                }
				break;
			case 'meetin':
				var meeting = Meeting.findOne(Session.get('selectedMeeting'));
				if (meeting
					&& meeting.startTime) {
					pageName = 'meetingSummary';
				}

				break;

			default:
				new Meteor.Error(500, 'unknown page: ' + page);
		}

		return pageName;
	}
});

Meteor.Router.filter('requireLogin', {only: ['meetingSubmit', 'meetingVote']}); //, 'sprintSubmit', 'sprintVote']});
Meteor.Router.filter('meetingOwnerRedirectedToStartStop', {only: ['meetingSummary']});
Meteor.Router.filter('noMorePossibleToEdit', {only: ['meetingSubmit', 'sprintSubmit']});
