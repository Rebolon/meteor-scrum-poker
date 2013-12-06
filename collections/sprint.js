console.log('collections/sprint.js');

Sprint = new Meteor.Collection('sprint');

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

// @TODO add update allow for member of sprint, but only on members.mood field
Sprint.allow(DbAuthorization);

Meteor.methods({
  createSprint: function(sprintAttributes) {
    var user = Meteor.user(),
        sprintWithSameSubject = Sprint.findOne({title: sprintAttributes.title});
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to create a new sprint");
    // ensure the sprint has a title
    if (!sprintAttributes.title)
      throw new Meteor.Error(422, 'Please fill in a headline');
    // check that there are no previous sprint with the same title
    if (sprintAttributes.title && sprintWithSameSubject) {
      throw new Meteor.Error(302,
                             'This sprint has already been posted',
                             sprintWithSameSubject._id);
    }
    
    var sprint = {
      title: sprintAttributes.title + (this.isSimulation ? ' *' : ''),
      ownerId: user._id
    };
    
    // MaJ du champ cote client
    if (this.isSimulation) {
      document.querySelector('#title').value = sprint.title;
    }
    
    if (sprintAttributes._id) {
      var sprintId = Sprint.update({_id: sprintAttributes._id}, {$set: sprint});
    } else {
      sprint.submitted = new Date().getTime();
      var sprintId = Sprint.insert(sprint);
    }
    return sprintId;
  },
  
  addMemberToSprint: function(sprintId, memberAttributes) {
    var user = Meteor.user(),
        sprint = Sprint.findOne({_id: sprintId});
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to create a new sprint");
    // ensure member constraint
    if (!sprint)
      throw new Meteor.Error(422, 'Please create a sprint first');
    if (!memberAttributes.email)
      throw new Meteor.Error(422, 'Please fill email');
    
    var member = {
      email: memberAttributes.email + (this.isSimulation ? ' (new)' : '')
    };
    
    var sprintId = Sprint.update({_id: sprint._id}, {$push: {members: member}});
    return sprintId;
  }
});
