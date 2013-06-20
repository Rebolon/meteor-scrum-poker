Template.summary.helpers({
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
		    duration = (new MeetingTimeCost.Duration).getDuration(meeting);

		if (duration) {
			return duration.getHours() + ':' + duration.getMinutes() + ':' + duration.getSeconds();
		}
	},

	getCost: function() {
		var id = Session.get('selectedMeeting'),
                    meeting = Meeting.findOne(id),
		    cost = (new MeetingTimeCost.Meeting).getCost(meeting);

		return cost.toPrecision(1);
	}
});
