Template.startStop.helpers({
	meeting: function () {
		var id = Session.get('selectedMeeting'),
		    meeting = Meeting.findOne(id);

		return meeting;
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
                        Meteor.Router.to('/summary/' + meeting._id);
                }
        }
});
