/**
 * Image
 *
 * @author John Kim <john@nxstinc.com>
 */
NEST.define("com.nxstinc.nest.component", {
	Image : function() {
		var clazz = function(id) {
			this.id = id;
			this.src = undefined;
			this.size = {};
			this.style = {};
			this.padding = {};
			this.margin = {};
			this.floating = undefined;
			this.valign = undefined;
			this.dataStore = undefined;
			this.dataImage = undefined;
			this.styleClass = undefined;
		};
		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.VisualComponent");
		clazz.prototype.paint = function(context) {
			var src = this.src;
			if (!src) {
				src = "assets/system/noimage.png";
			}
			var ss = "";
			ss += "<img id='" + this.id + "'";
			if (src !== undefined)
				ss += " src='" + src + "'";
			if (this.styleClass)
				ss += " class=\""+this.styleClass+"\"";
			ss += " style=\"";
			ss += this.toStyle(this.size);
			if (!src && __designing)
				ss += this.toStyle({
					"min-width" : "30px",
					"min-height" : "30px",
				});
			if (this.valign)
				ss += "vertical-align: "+this.valign + ";";
			ss += this.toStyle(this.style);
			ss += this.toStyle(this.padding);
			ss += this.toStyle(this.margin);
			if (this.floating)
				ss += "float: "+this.floating + ";";
			if (this.triggerCount("onTap") > 0) {
				ss += this.toStyle({
					"cursor": "pointer",
				});
			}
			ss += "\"";
			ss += ">";
			var parent = context.selector;
			var element = $(ss);
			$(parent).append(element);
			this.__element = element;
			var me = this;
			me.on(element, "tap", function(ev) {
				me.trigger("onTap");
			});
			if (undefined !== me.dataStore) {
				me.dataStore.bind("onTake", function(p) {
					var table = p.content;
					//console.log(table);
					if (table && table.length > 0) {
						var row = table[0];
						if (row.hasOwnProperty(me.dataImage)) {
							me.value(row[me.dataImage]);
						}
					}
				});
			}
		};
		clazz.prototype.value = function(v) {
			var element = this.__element;
			if (element) {
				if (v) {
					var script = document.createElement("img");
					script.setAttribute("src", v);
					script.onreadystatechange = script.onload = function(a) {
						element.attr("src", v);
					};
				}
				return element.attr("src");
			}
			return this.src;
		};
		clazz.prototype.grayscaleEnabled = function() {
			var element = this.__element;
			if (element)
				element.css("-webkit-filter", "grayscale(1)");
		};
		clazz.prototype.grayscaleDisabled = function() {
			var element = this.__element;
			if (element)
				element.css("-webkit-filter", "grayscale(0)");
		};
		clazz.prototype.hide = function() {
			var element = this.__element;
			if (element) {
				element.hide();
				this.trigger("onHide");
			}
		};
		clazz.prototype.show = function() {
			var element = this.__element;
			if (element) {
				element.show();
				this.trigger("onShow");
			}
		};
		clazz.prototype.animatedShow = function() {
			var element = this.__element;
			if (element)
				element.fadeIn("slow");
		};
		clazz.prototype.animatedHide = function() {
			var element = this.__element;
			if (element)
				element.fadeOut("slow");
		};
		clazz.prototype.isVisible = function() {
			var element = this.__element;
			if (element)
				return element.is(":visible");
			return false;
		};
		// #ifdef designing
		// #endif designing
		return clazz;
	}
});