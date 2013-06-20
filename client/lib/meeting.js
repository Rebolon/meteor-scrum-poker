MeetingTimeCost = {};

MeetingTimeCost.Duration = function() {};

MeetingTimeCost.Duration.prototype.initDuration = function () {
        var duration = new Date();
        duration.setMonth(0);
        duration.setDate(1);
        duration.setHours(0);
        duration.setMinutes(0);
        duration.setSeconds(0);

        return duration;
};

MeetingTimeCost.Duration.prototype.getDuration = function (meeting) {
        var duration = this.initDuration();

        if (meeting
                        && meeting.startTime
                        && meeting.endTime) {
                duration.setMilliseconds(meeting.endTime - meeting.startTime);
                return duration;
        }
};

MeetingTimeCost.Meeting = function() {};

MeetingTimeCost.Meeting.prototype.getCost = function (meeting) {
	var costBySeconds = this.getCostBySeconds(meeting),
	    cost = 0;
	
        if (costBySeconds 
			&& costBySeconds > 0) {
                cost = costBySeconds / ((meeting.endTime - meeting.startTime)*1000);
        }

	return cost;
}

MeetingTimeCost.Meeting.prototype.getCostBySeconds = function (meeting) {
	var dailyCost = 0,
            costBySeconds = 0;

        if (meeting.members.length > 0) {
                meeting.members.forEach(function(item) {
                        dailyCost += item.salary;
                });

                costBySeconds = dailyCost / 24 / 60 / 60;
        }

	return costBySeconds;
}
