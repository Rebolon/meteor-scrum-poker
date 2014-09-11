Meteor.Router.add({
  // to dashboard with meetingList and SprintList
  '/': {
    to: 'dashboard',
    and: function funcGoToDashboard() {// clear session
      Session.set('currentRoom', false);
    }
  },
  
  /**
	 * Poker tools
	 */
  '/poker': {
    to: 'pokerCreate',
    and: function funcGoToCreateRoom() {
      console.log('router', '/poker'); 
      Rebolon.ScriptLoader.build('/js/qrcode.min.js');
      
      // clear session
      Session.set('currentRoom', false);
    }
  },
  
  '/poker/:id': {
    as: 'pokerRoomCreated',
    to: 'pokerCreate',
    and: function funcVote(id) {
      console.log('router', '/poker/' + id); 
      Rebolon.ScriptLoader.build('/js/qrcode.min.js');
      
      Session.set('currentRoom', id); 
    }
  },
  
  '/poker/:id/result': {
    to: 'pokerResult',
    and: function funcCreateRoomAndWait() {
      console.log('router', '/poker/' + id + '/result'); 
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
  'requireLogin': function funcRouterFilterRequireLogin(page) {
    if (Meteor.user()) {
      return page;
    } else if (Meteor.loggingIn()) {
      return 'spinner';
    }
    return 'accessDenied';
  },
  
  'reRouteToVote': function (page) {
    if (!Meteor.user()
        && !Meteor.loggingIn()) {
      return 'pokerVote';
    }
    return page;
  }
});

Meteor.Router.filter('reRouteToVote', {only: ['pokerCreate']});
Meteor.Router.filter('requireLogin', {only: ['pokerCreate']});
