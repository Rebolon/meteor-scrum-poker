Template.sprintItem.events({
	'click a .icon-remove-circle': function (id) {
		var sprint = this,
		    modal = "<p>Sprint du " + new Date(sprint.submitted) + ": " + sprint.title + "</p>";
		document.querySelector('#alertRemoveSprint .modal-body').innerHTML = modal;

		Session.set('selectedSprint', this._id);
		$('#alertRemoveSprint').modal({});
	}
});
