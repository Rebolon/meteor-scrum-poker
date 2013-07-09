Template.sprintList.helpers({
	sprints: function () {
		var sprints = Sprint.find({ownerId: Meteor.userId()}, {sort: {submitted: -1}});
		return sprints;
	}
});

Template.sprintList.events({
	'click #alertRemoveSprint .btn-primary': function () {
		var idToRemove = Session.get('selectedSprint');

		if (idToRemove) {
			Sprint.remove({_id: idToRemove});
			Session.set('selectedSprint', null);
		}

		$('#alertRemoveSprint').modal('hide');
	}
});
