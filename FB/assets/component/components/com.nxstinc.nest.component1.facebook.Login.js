/**
 * Facebook Login
 *  
 * @author John Kim <john@nxstinc.com>
 */
NEST.define("com.nxstinc.nest.component.facebook", {
	Login : function() {
		var clazz = function(id) {
			this.id = id;
			this.__dataColumns = ["email", "id", 
				  			        "name", "first_name", 
							        "last_name", "gender", 
							        "picture", "origin"];
		};

		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.DataStoreComponent");
		
		clazz.prototype.paint = function(context) {
		};
				
		clazz.prototype.validate = function() {
			var me = this;
			if (NEST.xlib.execute) {
				var fk = NEST.xlib.callback(function(err, data) {
					if (err === 0) {
						me.triggerData(err, data);
					} else {
						me.trigger("onNeedLogin");
					}
				});
				NEST.xlib.execute("facebook.status", fk, undefined);
			} else {
            	me.__error = "Unsupported function";
            	me.trigger("onError");
			}
		};

		clazz.prototype.login = function() {
			var me = this;
			if (NEST.xlib.execute) {
				var fk = NEST.xlib.callback(function(err, data) {
					if (err === 0) {
						me.triggerData(err, data);
					} else {
						me.loginInternal();
					}
				});
				NEST.xlib.execute("facebook.status", fk, undefined);
			} else {
            	me.__error = "Unsupported function";
            	me.trigger("onError");
			}
		};
		
		clazz.prototype.loginInternal = function() {
			var me = this;			
			if (NEST.xlib.execute) {
				var fk = NEST.xlib.callback(function(err, data) {
					me.triggerData(err, data);
		        });
		        NEST.xlib.execute("facebook.login", fk, undefined);
			} else {
            	me.__error = "Unsupported function";
            	me.trigger("onError");
			}
		};
		
		clazz.prototype.triggerData = function(err, data) {
			var me = this;
			if (err === 0) {
				var d = data;
				if (typeof d === "string")
					d = JSON.parse(d);

	            if (d && d.picture && d.picture.data && d.picture.data.url) {
            		d.picture = d.picture.data.url;
            	}
	            console.log(d);
	            
            	me.data = d;			            
	            var p = {
					v : 1.0, //version marker
					a : 1, // action type 1: new data, 2: append data
					ts : (new Date()).getTime(), // generated timestamp
					content : [d],
    			};
	            me.trigger("onLogin", p);
			} else if (err === 1) {
            	me.__error = "Login cancel";
            	me.trigger("onError");
			} else if (err === 2) {
            	me.__error = data;
            	me.trigger("onError");
			}
		};
		
		clazz.prototype.logout = function() {
			var me = this;
			if (NEST.xlib.execute) {
				var fk = NEST.xlib.callback(function(err, data) {
					me.trigger("onLogout");
				});
				NEST.xlib.execute("facebook.logout", fk, undefined);
			} else {
            	me.__error = "Unsupported function";
            	me.trigger("onError");
			}
		};
		
		clazz.prototype.getEmail = function() {
			var d = this.data;
			if (d && d.email) {
				return d.email;
			}
			if (d && d.id) {
				return d.id + "@facebook.com";
			}
		};
		clazz.prototype.getId = function() {
			var d = this.data;
			if (d && d.id) {
				return d.id;
			}
		};
		clazz.prototype.getName = function() {
			var d = this.data;
			if (d && d.name) {
				return d.name;
			}
		};
		clazz.prototype.getFirstName = function() {
			var d = this.data;
			if (d && d.first_name) {
				return d.first_name;
			}
		};
		clazz.prototype.getLastName = function() {
			var d = this.data;
			if (d && d.last_name) {
				return d.last_name;
			}
		};
		clazz.prototype.getGender = function() {
			var d = this.data;
			if (d && d.gender) {
				return d.gender;
			}
		};
		clazz.prototype.getPicture = function() {
			var d = this.data;
			if (d && d.picture) {
				return d.picture;
			}
		};
				
		// #ifdef designing
		clazz.prototype.editor = function() {
			var d = {
				warning : "Windows Phone is not supported yet",
				palette : {
					category : "FaceBook",
					alias : undefined,
					priority : 99,
					description : "FaceBook",
				},
				property : {
				},
				event : {
					onLogin : {
						priority : 1,
						description : "",						
					},
					onLogout : {
						priority : 2,
						description : "",						
					},
					onNeedLogin : {
						priority : 3,
						description : "",						
					},
					onError : {
						priority : 9,
						description : "",						
					},
				},
				method : {
					login : {
						priority : 1,
						value : true,
					},
					logout : {
						priority : 2,
						value : true,
					},
					validate : {
						priority : 3,
						value : true,
					},
					getEmail : {
						priority : 11,
						value : true,						
					},
					getId : {
						priority : 12,
						value : true,					
					},
					getName : {
						priority : 13,
						value : true,						
					},
					getFirstName : {
						priority : 14,
						value : true,						
					},
					getLastName : {
						priority : 15,
						value : true,					
					},
					getGender : {
						priority : 16,
						value : true,					
					},
					getPicture : {
						priority : 17,
						value : true,					
					},
				},
				plugin : {
					include : ["Facebook"],					
				},
			};
			return d;
		};
		// #endif designing

		return clazz;
	}
});
