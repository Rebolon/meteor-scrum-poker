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
        var duration = this.initDuration(),
	    current = new Date(),
	    start = (meeting.startTime ? meeting.startTime : current),
	    end = (meeting.endTime ? meeting.endTime : current);

        if (meeting
                        && meeting.startTime) {
                duration.setMilliseconds(end - start);
                return duration;
        }
};

MeetingTimeCost.Meeting = function() {};

MeetingTimeCost.Meeting.prototype.getCost = function (meeting) {
	var costBySeconds = this.getCostBySeconds(meeting),
	    cost = 0,
	    start = meeting.startTime,
	    end = (meeting.endTime ? meeting.endTime : new date());
	
        if (costBySeconds 
			&& costBySeconds > 0) {
                cost = costBySeconds / ((end - start)*1000);
        }
console.log('currentCost: ', cost);
	return cost;
}

MeetingTimeCost.Meeting.prototype.getCostBySeconds = function (meeting) {
	var dailyCost = 0,
            costBySeconds = 0;

        if (meeting
			&& meeting.members
			&& meeting.members.length > 0) {
                meeting.members.forEach(function(item) {
                        dailyCost += item.salary;
                });

                costBySeconds = dailyCost / 24 / 60 / 60;
        }

	return costBySeconds;
}
