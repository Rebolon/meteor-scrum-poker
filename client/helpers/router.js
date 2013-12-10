var loadQRCodeScript = function funcLoadQRCodeScript(callback) {
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
