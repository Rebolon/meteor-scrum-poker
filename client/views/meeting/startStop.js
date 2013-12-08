var intervals = {
	cost: null,
	time: null
    },

    initCounters = function (meeting) {
           var  meetingLib = (new MeetingTimeCost.Meeting),
		durationLib = new MeetingTimeCost.Duration,
		costBySeconds = meetingLib.getCostBySeconds(meeting),
		// j'aime pas passer par un timeout pour initialiser les boutons... comment faire mieux ?
	        domTimeCounter,
	        domCostCounter,
		duration = durationLib.getDuration(meeting),
		initialTimer;

	   if (duration) {
		initialTimer = duration.getHours()+":"+duration.getMinutes()+":"+duration.getSeconds();

 	        domTimeCounter = $('#timeCounter');
		domCostCounter = $("#costCounter");
 	        domTimeCounter.counter({initial: initialTimer});
         	domCostCounter.flipCounter({number: costBySeconds, imagePath:"/img/flipCounter-medium.png"});

     	        intervals.cost = setInterval(function () {
          	     var newCost = domCostCounter.flipCounter("getNumber") + costBySeconds;
          	     domCostCounter.flipCounter("setNumber", newCost);
          	}, 1000);
	  }
    };

Template.meetingStartStop.rendered = function () {
	var id = Session.get('selectedMeeting'),
            meeting = Meeting.findOne(id);

	if (!intervals.cost) {
		initCounters(meeting);
	}
}

Template.meetingStartStop.helpers({
	meeting: function () {
		var id = Session.get('selectedMeeting'),
		    meeting = Meeting.findOne(id);

		return meeting;
	},

	costBySeconds: function () {
		var id = Session.get('selectedMeeting'),
                    meeting = Meeting.findOne(id);

		return 10000000 * (new MeetingTimeCost.Meeting).getCostBySeconds(meeting);
	}
});

Template.meetingStartStop.events({
	'click #btnStartMeeting': function () {
                var id = Session.get('selectedMeeting'),
                    meeting = Meeting.findOne(id);
                if (meeting
                        && !meeting.startTime) {

                        // peut etre passer par le serveur, mais pour faire vite on garde ca pour l'instant
                        Meeting.update({_id: id}, {$set: {startTime: new Date()}});
                        document.querySelector('#btnStartMeeting').disabled = "disabled";
			
			initCounters(meeting);
                }
        },

        'click #btnEndMeeting': function () {
                var id = Session.get('selectedMeeting'),
                    meeting = Meeting.findOne(id);
                if (meeting
                        && !meeting.endTime) {

                        // peut etre passer par le serveur, mais pour faire vite on garde ca pour l'instant
                        Meeting.update({_id: id}, {$set: {endTime: new Date()}});
                        document.querySelector('#btnEndMeeting').disabled = "disabled";

			clearInterval(intervals.cost);
			clearInterval(intervals.time);

                        Meteor.Router.to('/meeting/summary/' + meeting._id);
                }
        }
});
