Emails = new Meteor.Collection('emails');
Members = new Meteor.Collection('members');

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
Emails.allow(DbAuthorization);

