Template.meetingSummary.helpers({
	meeting: function() {
		var id = Session.get('selectedMeeting');
		if (id) {
			return Meeting.findOne(id);
		}
	},

	displayDate: function(dateToDisplay) {
		return (dateToDisplay ? dateToDisplay.toLocaleString() : null);
	},

	getDuration: function() {
		var id = Session.get('selectedMeeting'),
		    meeting = Meeting.findOne(id),
		    duration = (new MeetingTimeCost.Duration).getDuration(meeting),
		    hours, minutes, seconds;

		if (duration) {
			hours = duration.getHours().toString();
			minutes = duration.getMinutes().toString();
			seconds = duration.getSeconds().toString();
			return (hours.length === 2?'':'0') + hours + ':' + (minutes.length === 2?'':'0') + minutes + ':' + (seconds.length === 2?'':'0') + seconds;
		}
	},

	getCost: function() {
		var id = Session.get('selectedMeeting'),
                    meeting = Meeting.findOne(id),
		    cost = (new MeetingTimeCost.Meeting).getCost(meeting),
		    intVal = parseInt(cost);

		return (!isNaN(intVal) ? intVal : 0) ;
	}
});
