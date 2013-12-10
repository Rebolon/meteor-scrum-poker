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

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'spinner',
  autoRender: true
});

Router.map(function () {
  this.route('dashboard', {
    path: '/',
    template: 'dashboard',
    action : function funcGoToDashboard() {// clear session
      console.log('action dashboard');
      Session.set('currentRoom', false);
    }
  });
  
  this.route('pokerCreate', {
    path: '/poker',
    template: 'pokerCreate',
    before: [function () {
      if (Meteor.loggingIn()) {
        console.log('before loggingin pokerCreate');
        this.render('spinner');
        this.stop();
      }
      
      if (!Meteor.user()) {
        console.log('before user pokerCreate');
        this.render('accessDenied');
        this.stop();
      }
    }],
    action : function funcGoToPokerCreate() {
      console.log('action pokerCreate'); 
      loadQRCodeScript();
      
      // clear session
      Session.set('currentRoom', false);
    }
  });
  
  this.route('pokerRoomCreated', {
    path: '/poker/:id',
    template: 'pokerCreate',
    before : [function () {
      console.log('before pokerRoomCreated'); 
      if (!Meteor.userId()
          && !Meteor.loggingIn()) {
        console.log('before not logged pokerRoomCreated', Router.routes['pokerVote'].path({id: this.params.id}));
        Router.go('pokerVote', {id: this.params.id});
        this.stop();
      }
    }],
    action : function funcGoToPokerRoomCreated() {
      console.log('action pokerRoomCreated', '/poker/' + this.params.id);
      Session.set('currentRoom', this.params.id);
      loadQRCodeScript();
    }
  });
  
  this.route('pokerResult', {
    path: '/poker/:id/result',
    template: 'pokerResult',
    action : function funcGoToPokerResult() {
      console.log('action pokerResult', '/poker/' + this.params.id + '/result'); 
    }
  });
  
  this.route('pokerVote', {
    path: '/poker/:id/vote',
    template: 'pokerVote',
    action : function funcGoToPokerVote() {
      console.log('action pokerVoteouter', '/poker/' + this.params.id  + '/vote'); 
      Session.set('currentRoom', id);
    }
  });
  
});