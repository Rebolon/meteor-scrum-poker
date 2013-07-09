Template.sprintSummary.helpers({
	sprint: function() {
		var id = Session.get('selectedSprint');
		if (id) {
			return Sprint.findOne(id);
		}
	},

	displayDate: function(dateToDisplay) {
		return (dateToDisplay ? dateToDisplay.toLocaleString() : null);
	}
});
