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
			this.appId = undefined;
			this.appSecret = undefined;
			this.appName = undefined;
		};
		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.DataStoreComponent");
		clazz.prototype.paint = function(context) {
		};
		clazz.prototype.validate = function() {
			console.log("validate");
			console.log(NEST.xlib);
			var me = this;
			if (NEST.xlib.execute) {
				var fk = NEST.xlib.callback(function(err, data) {
					if (err === 0) {
						me.triggerData(err, data);
					} else {
						me.trigger("onNeedLogin");
					}
				});
				console.log("facebook.status");
				NEST.xlib.execute("facebook.status", fk, undefined);
			} else {
				setTimeout(function() {
					if (NEST.xlib.execute) {
						me.validate();
					} else {
		            	me.__error = "Unsupported function";
		            	me.trigger("onError");
					}
				}, 500);
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
				setTimeout(function() {
					if (NEST.xlib.execute) {
						me.login();
					} else {
		            	me.__error = "Unsupported function";
		            	me.trigger("onError");
					}
				}, 500);
			}
		};
		clazz.prototype.loginInternal = function() {
			var me = this;
			if (NEST.xlib.execute) {
				var fk = NEST.xlib.callback(function(err, data) {
					me.triggerData(err, data);
		        });
		        NEST.xlib.execute("facebook.login", fk, JSON.stringify({
		        	appId : me.appId,
		        	appSecret : me.appSecret,
		        	appName : me.appName,
		        }));
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
	            // console.log(d);
	            window.__facebookMe = d;
            	me.data = d;
	            var p = {
					v : 1.0,
					a : 1,
					ts : (new Date()).getTime(),
					content : [d],
    			};
	            me.trigger("onTake", p);
	            me.trigger("onLogin");
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
		// #endif designing
		return clazz;
	}
});