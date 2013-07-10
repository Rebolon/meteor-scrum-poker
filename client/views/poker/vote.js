Template.pokerVote.events({
	'click #btn#vote': function () {
		console.log(this);
		pokerStream.emit('vote', this.value);
	}
});
