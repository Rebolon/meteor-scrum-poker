Template.sprintMemberItem.events({
	'click #btnRemoveMember': function () {
		var sprint = Sprint.findOne({_id: Session.get('selectedSprint')}),
		    members = [],
		    newMembers = [],
		    memberToRemove = this,
		    memberRemoved = false;

		if (sprint) {
			members = sprint.members;
			newMembers = _.filter(members, function(item) {
				if (!memberRemoved 
					&& item.email == memberToRemove.email 
					&& item.salary == memberToRemove.salary) {
					memberRemoved = true;
					return false;
				}

				return true;
			});
			
			// est ce utile de passer par le serveur pour ça ? je ne pense pas
			Sprint.update({_id: sprint._id}, {$set: {members: newMembers}});
		}

		
	}
});
