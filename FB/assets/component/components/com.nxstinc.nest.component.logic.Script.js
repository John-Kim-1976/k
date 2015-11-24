/**
 * Script
 *
 * @author John Kim <john@nxstinc.com>
 */
NEST.define("com.nxstinc.nest.component.logic", {
	Script : function() {
		var clazz = function(id) {
			this.id = id;
			this.script = function(me, param) {return "Hello!";};
		};
		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.NonVisualComponent");
		clazz.prototype.paint = function(context) {
		};
		clazz.prototype.run = function(param) {
			var me = this;
			try {
				if (typeof me.script === "function") {
					me.__value = me.script(me, param);
					me.trigger("onSuccess");
					if (me.__value === true)
						me.trigger("onYes");
					else if (me.__value === true)
						me.trigger("onNo");
				}
			} catch(ex) {
				if (ex.message)
					me.__error = ex.message;
				else
					me.__error = ex;
				me.trigger("onError");
			}
		};
		clazz.prototype.value = function() {
			return this.__value;
		};
		// #ifdef designing
		// #endif designing
		return clazz;
	}
});