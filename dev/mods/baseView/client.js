define([], function(){

	return {
		init: function() {
			this.clientSetup.call(this);
			this.serverSetup.call(this);
		},
		bindEvents: function() {},
		clientSetup: function() {
			this.bindEvents.call(this);
		},
		serverSetup: function() {}
	};

});