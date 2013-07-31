var loadQRCodeScript = function (callback) {
  var js, s;
      
  // load required script
  js = document.createElement('script');
  js.type = 'text/javascript';
  js.async = true;
  js.src = 'https://raw.github.com/davidshimjs/qrcodejs/master/qrcode.min.js';
  
  // @TODO finish that part to be compatible with IE, FF, Chrome, Opera and mobile
  if (callback) {
    js.onload = callback;
  }
  
  s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(js, s);
};

Meteor.Router.add({
	// to dashboard with meetingList and SprintList
	'/': 'dashboard',

	/**
	 * Meeting tools
	 */
/*	'/meeting/:_id': { // au fait ca sert a quoi ca ?
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
	},

	/**
	 * Sprint mood tools
	 */
/*  '/sprint/:_id': { // idem meeting... ?
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

  /**
	 * Poker tools
	 */
  '/poker': {
    to: 'pokerCreate',
    and: function funcGotToCreateRoom() {
      console.log('router', '/poker'); 
      loadQRCodeScript();
      
      // clear session
      Session.set('currentRoom', false);
    }
  },
  
  '/poker/:id': {
    as: 'pokerRoomCreated',
    to: 'pokerCreate',
    and: function funcVote(id) {
      console.log('router', '/poker/' + id); 
      loadQRCodeScript();

      Session.set('currentRoom', id); 
    }
  },
  
  '/poker/:id/result': {
    to: 'pokerResult',
		and: function funcCreateRoomAndWait() {
      console.log('router', '/poker/' + id + '/result'); 
      // @TODO manque la création du channel pour le user courant
      // @TODO euh je voulais dire quoi ?
			/*PokerStream.on('vote', function (message) {
			});*/
    }
  },
    
  '/poker/:id/vote': {
    as: 'pokerVote',
    to: 'pokerVote',
    and: function funcVote(id) {
      console.log('router', '/poker/' + id + '/vote'); 
      Session.set('currentRoom', id); 
    }
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
		switch (page.substr(0, 6)) {
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
