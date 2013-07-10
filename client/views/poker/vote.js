Template.pokerVote.events({
	'click #btn#vote': function () {
		console.log(this);
		PokerStream.emit('vote', this.value);
	}
});
