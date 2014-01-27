define([], function(){

	return {
		init: function() {
			this.clientSetup.call(this);
			this.serverSetup.call(this);
		},
		bindEvents: function() {},
		clientSetup: function() {},
		serverSetup: function() {}
	};

});