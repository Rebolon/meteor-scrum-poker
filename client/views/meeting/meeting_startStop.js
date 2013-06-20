var intervals = {
	cost: null,
	time: null
};

Template.startStop.helpers({
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

Template.startStop.events({
	'click #btnStartMeeting': function () {
                var id = Session.get('selectedMeeting'),
                    meeting = Meeting.findOne(id);
                if (meeting
                        && !meeting.startTime) {

                        // peut etre passer par le serveur, mais pour faire vite on garde ca pour l'instant
                        Meeting.update({_id: id}, {$set: {startTime: new Date()}});
                        document.querySelector('#btnStartMeeting').disabled = "disabled";

			setTimeout(function funcDisplayCounters() {
				$('#timeCounter').counter();
				//$('#costCounter').counter();
				$("#costCounter").flipCounter({number: 0, imagePath:"/img/flipCounter-medium.png"});
			}, 1000);

			costBySeconds = (new MeetingTimeCost.Meeting).getCostBySeconds(meeting);
			intervals.cost = setInterval(function () {
				var dom = $("#costCounter"),
				    newCost = dom.flipCounter("getNumber") + costBySeconds;
console.log('newCost: ', newCost);
				dom.flipCounter("setNumber", newCost);
			}, 1000);
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

                        Meteor.Router.to('/summary/' + meeting._id);
                }
        }
});
