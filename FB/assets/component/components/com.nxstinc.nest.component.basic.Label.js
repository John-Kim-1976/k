/**
 * Label
 *
 * @author John Kim <john@nxstinc.com>
 */
NEST.define("com.nxstinc.nest.component", {
	Label : function() {
		var clazz = function(id) {
			this.id = id;
			this.size = undefined;
			this.style = {};
			this.padding = {};
			this.margin = {};
			this.floating = undefined;
			this.valign = undefined;
			this.textAlign = undefined;
			this.whiteSpace = undefined;
			this.text = "";
			this.html = "";
			this.dataStore = undefined;
			this.dataText = undefined;
			this.dataHtml = undefined;
			this.__value = undefined;
			this.styleClass = undefined;
		};
		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.VisualComponent");
		clazz.prototype.paint = function(context) {
			var ss = "";
			ss += "<span id='" + this.id + "'";
			if (this.styleClass)
				ss += " class=\""+this.styleClass+"\"";
			ss += " style=\"";
			if (this.floating)
				ss += "float: "+this.floating + ";";
			ss += this.toStyle(this.size);
			ss += this.toStyle(this.style);
			ss += this.toStyle(this.padding);
			ss += this.toStyle(this.margin);
			if (this.valign)
				ss += "vertical-align: "+this.valign + ";";
			if (this.triggerCount("onTap") > 0) {
				ss += this.toStyle({
					"cursor": "pointer",
				});
			}
			if (this.whiteSpace) {
				ss += this.toStyle({
			    	"white-space" : this.whiteSpace,
				});
			} else {
				if (NEST.env.os.name !== "Windows Phone")
					ss += this.toStyle({
						"display" : "inline-block",
						"overflow" : "hidden",
						"text-overflow" :"ellipsis",
				    	"white-space" : "nowrap",
					});
				else
					ss += this.toStyle({
				    	"display" : "inline-table",
					});
			}
			ss += this.toStyle({
		    	"text-align" : this.textAlign ? this.textAlign : "left",
			});
			ss += "\"";
			ss += ">";
			ss += "</span>";
			var parent = context.selector;
			var element = $(ss);
			$(parent).append(element);
			this.__element = element;
			var me = this;
			if (__designing && this.text === "" && this.html === "")  {
				element.text(this.id);
			} else {
				element.text(this.text);
				element.append(this.html);
			}
			me.on(element, "tap", function(ev) {
				me.trigger("onTap");
			});
			if (undefined !== me.dataStore) {
				me.dataStore.bind("onTake", function(p) {
					var table = p.content;
					//console.log(table);
					if (table && table.length > 0) {
						var row = table[0];
						if (row.hasOwnProperty(me.dataText))
							element.text(me.toSafeStr(row[me.dataText]));
						else if (row.hasOwnProperty(me.dataHtml))
							element.html(row[me.dataHtml]);
					}
				});
			}
		};
		clazz.prototype.value = function(v) {
			var element = this.__element;
			if (element) {
				if (v)
					element.html(this.toSafeStr(v));
				return element.html();
			}
			return "";
		};
		clazz.prototype.clear = function() {
			var element = this.__element;
			if (element) {
				element.html("");
			}
		};
		clazz.prototype.update = function() {
			var element = this.__element;
			if (element) {
				var s = "";
				s += this.toSafeStr(this.text);
				s += this.html;
				element.append(s);
			}
		};
		// #ifdef designing
		// #endif designing
		return clazz;
	}
});