Template.meetingItem.events({
	'click a .icon-remove-circle': function (id) {
		var meeting = this,
		    modal = "<p>R&eacute;union du " + new Date(meeting.submitted) + ": " + meeting.title + "</p>";
		document.querySelector('#alertRemoveMeeting .modal-body').innerHTML = modal;

		Session.set('selectedMeeting', this._id);
		$('#alertRemoveMeeting').modal({});
	}
});
