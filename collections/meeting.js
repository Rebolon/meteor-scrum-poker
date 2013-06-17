Members = Meteor.Collection('members');
Meeting = Meteor.Collection('meeting');

var checkDbRights = function funcCheckRights (userId, ownerId) {
	return userId === ownerId;
};

var DbAuthorization = {
        update: function funcUpdMember(userId, doc) {
                return checkDbRights(userId, doc.ownerId);
        },

        delete: function funcDelMember(userId, doc) {
                return checkDbRights(userId, doc.ownerId);
        },

        insert: function funcAddMember(userId, doc) {
                return !! userId;
        }
};

Members.allow(DbAuthorization);
Meeting.allow(DbAuthorization);

Meteor.methods({
	post: function(meetingAttributes) {
		var user = Meteor.user(),
		meetingWithSameLink = Meeting.findOne({title: meetingAttributes.title});
		// ensure the user is logged in
		if (!user)
			throw new Meteor.Error(401, "You need to login to create a new meeting");
		// ensure the meeting has a title
		if (!meetingAttributes.title)
			throw new Meteor.Error(422, 'Please fill in a headline');
		// check that there are no previous meeing with the same title
		if (meetingAttributes.url && meetingWithSameLink) {
			throw new Meteor.Error(302,
				'This meeting has already been posted',
				meetingWithSameLink._id);
		}

		// pick out the whitelisted keys
		var meeting = _.extend(_.pick(meetingAttributes, 'url'), {
			title: meetingAttributes.title + (this.isSimulation ? '(client)' : '(server)'),
			ownerId: user._id,
			author: user.username,
			submitted: new Date().getTime()
		});

		var meetingId = Meeting.insert(meeting);
		return meetingId;
	}
});
