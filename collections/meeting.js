Emails = new Meteor.Collection('emails');
Members = new Meteor.Collection('members');
Meeting = new Meteor.Collection('meeting');

var checkDbRights = function funcCheckRights (userId, ownerId) {
	return userId === ownerId;
};

var DbAuthorization = {
        update: function funcUpdMember(userId, doc) {
                return checkDbRights(userId, doc.ownerId);
        },

        remove: function funcDelMember(userId, doc) {
                return checkDbRights(userId, doc.ownerId);
        },

        insert: function funcAddMember(userId, doc) {
                return !! userId;
        }
};

Members.allow(DbAuthorization);
Meeting.allow(DbAuthorization);

Meteor.methods({
	createMeeting: function(meetingAttributes) {
		var user = Meteor.user(),
		meetingWithSameSubject = Meeting.findOne({title: meetingAttributes.title});
		// ensure the user is logged in
		if (!user)
			throw new Meteor.Error(401, "You need to login to create a new meeting");
		// ensure the meeting has a title
		if (!meetingAttributes.title)
			throw new Meteor.Error(422, 'Please fill in a headline');
		// check that there are no previous meeing with the same title
		if (meetingAttributes.title && meetingWithSameSubject) {
			throw new Meteor.Error(302,
				'This meeting has already been posted',
				meetingWithSameSubject._id);
		}

		var meeting = {
			title: meetingAttributes.title + (this.isSimulation ? ' *' : ''),
			ownerId: user._id
		};

		if (meetingAttributes._id) {
			var meetingId = Meeting.update({_id: meetingAttributes._id}, {$set: meeting});
		} else {
			meeting.submitted = new Date().getTime();
			var meetingId = Meeting.insert(meeting);
		}
		return meetingId;
	}
});
