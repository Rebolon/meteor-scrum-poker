var alertBox = function (type, content) {
        var alertType = (_.contains(['error', 'success', 'info', 'block'], type) ? type : 'block'),
            html = null,
            existingEl = document.querySelector('#alert');

        if (existingEl) {
                existingEl.parent.removeChild(existingEl);
        }

        existingEl = document.createElement('div');
        existingEl.setAttribute('id', 'alert');
        existingEl.setAttribute('class', 'alert ' + ' alert-' + alertType + ' fade in out');
        existingEl.innerHTML = '<button type="button" class="close" data-dismiss="alert">&times;</button> \
                <h4>' + alertType + '</h4> ' + content;

        document.querySelector('#sprintUserMessage').appendChild(existingEl);

        Meteor.setTimeout(function() {
                $('#alert').alert('close');
        }, 5000);
        return true;
}

Template.sprintSubmit.helpers({
	selected: function funcSprintIsNewOrEdit() {
		var selected = Session.get('selectedSprint');
		if (selected) {
			return Sprint.findOne(selected);
		}
		return null;
	}
});

Template.sprintSubmit.events({
        'click #btnAddSprint': function() {
                var sprint = {
                        title: document.querySelector('#title').value
                };

                Meteor.call('createSprint', sprint, function(error, id) {
                        if (error)
                                return alertBox('error', error.reason);

                        Session.set('selectedSprint', id);
                        alertBox('success', 'Un sprint a bien &eacute;t&eacute; cr&eacute;&eacute;e.');

			Meteor.Router.to('/sprint/edit/' + id);
                });
        },

        'click #btnAddMember': function () {
                var member = {
                        email: document.querySelector('#email').value
                };

                Meteor.call('addMemberToSprint', Session.get('selectedSprint'), member, function(error, id) {
                        if (error)
                                return alertBox('error', error.reason);

                        document.querySelector('#email').value = '';
                });
        },

        'click #btnEditSprint': function () {
                var sprint = {
                        title: document.querySelector('#title').value
                }, selectedSprint = Session.get('selectedSprint');

                if (selectedSprint) {
                        sprint._id = selectedSprint;
                }

                if (sprint.title !== Sprint.findOne(selectedSprint).title) {
                        Meteor.call('createSprint', sprint, function(error, id) {
                                if (error)
                                        return alertBox('error', error.reason);

                                alertBox('success', 'Sprint mis &acute; jour');
                        });
                };
        }
});
