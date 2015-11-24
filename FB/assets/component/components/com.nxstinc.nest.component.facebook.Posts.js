/**
 * Facebook Posts
 *
 * @author John Kim <john@nxstinc.com>
 */
NEST.define("com.nxstinc.nest.component.facebook", {
	Posts : function() {
		var clazz = function(id) {
			this.id = id;
			this.__dataColumns = ["id",
				  			        "message",
				  			        "story",
							        "created_time"];
		};
		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.DataStoreComponent");
		clazz.prototype.paint = function(context) {
		};
		clazz.prototype.take = function() {
			var me = this;
			if (window.__facebookMe == undefined) {
				me.__error = "Login required";
            	me.trigger("onNeedLogin");
				return;
			}
			if (NEST.xlib.execute) {
				var fk = NEST.xlib.callback(function(err, data) {
					me.triggerData(err, data);
				});
				NEST.xlib.execute("facebook.graphrequest", fk, "/" + window.__facebookMe.id + "/posts");
			} else {
				setTimeout(function() {
					if (NEST.xlib.execute) {
						me.take();
					} else {
		            	me.__error = "Unsupported function";
		            	me.trigger("onError");
					}
				}, 500);
			}
		};
		clazz.prototype.triggerData = function(err, data) {
			var me = this;
			if (err === 0) {
				var d = data;
				if (typeof d === "string")
					d = JSON.parse(d);
	            console.log(d.data);
            	me.data = d.data;
            	me.paging = d.paging;
	            var p = {
					v : 1.0,
					a : 1,
					ts : (new Date()).getTime(),
					content : me.data,
    			};
	            me.trigger("onTake", p);
			} else if (err === 99) {
            	me.__error = data;
            	me.trigger("onNeedLogin");
			} else {
            	me.__error = data;
            	me.trigger("onError");
			}
		};
		// #ifdef designing
		// #endif designing
		return clazz;
	}
});