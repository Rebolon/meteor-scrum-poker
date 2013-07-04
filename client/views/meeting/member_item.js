Template.memberItem.events({
	'click #btnRemoveMember': function () {
		var meeting = Meeting.findOne({_id: Session.get('selectedMeeting')}),
		    members = [],
		    newMembers = [],
		    memberToRemove = this,
		    memberRemoved = false;

		if (meeting) {
			members = meeting.members;
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
			Meeting.update({_id: meeting._id}, {$set: {members: newMembers}});
		}

		
	}
});
