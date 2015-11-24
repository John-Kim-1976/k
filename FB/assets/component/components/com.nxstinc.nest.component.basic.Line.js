/**
 * Line
 *
 * @author John Kim <john@nxstinc.com>
 */
NEST.define("com.nxstinc.nest.component.basic", {
	Line : function() {
		var clazz = function(id) {
			this.id = id;
			this.weight = 1;
			this.color = "#000000";
		};
		//https://developer.apple.com/library/safari/documentation/appleapplications/reference/safaricssref/Articles/StandardCSSProperties.html#//apple_ref/doc/uid/TP30001266-UserInterface
		//https://developer.mozilla.org/en-US/docs/Web/CSS/-moz-appearance
		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.VisualComponent");
		clazz.prototype.paint = function(context) {
			var ss = "";
			ss += "<div id='" + this.id + "'";
			ss += " style=\"";
			ss += "width: 100%; height: "+this.weight+"px; background-color: " + this.color;
			ss += "\"";
			ss += "></div>";
			var parent = context.selector;
			var me = this;
			var element = $(ss);
			$(parent).append(element);
		};
		// #ifdef designing
		// #endif designing
		return clazz;
	}
});