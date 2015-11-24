/**
 * Panel
 *
 * @author John Kim <john@nxstinc.com>
 */
NEST.define("com.nxstinc.nest.component.layout", {
	Panel : function() {
		var clazz = function(id) {
			this.id = id;
			this.text = undefined;
			this.size = {
				"width" : "100%",
				"min-height" : "20px",
			};
			this.style = {};
			this.padding = {};
			this.margin = {};
			this.display = undefined;
			this.floating = undefined;
			this.align = undefined;
			this.valign = undefined;
			this.animationSpeed = 400;
			this.showAtStart = true;
			this.styleClass = undefined;
		};
		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.ContainerComponent");
		clazz.prototype.paint = function(context) {
			var style1 = {
				"display" : ["-webkit-flex", "-ms-flex", "flex"],
				"-webkit-flex-direction" : "row",
				"-ms-flex-direction" : "row",
				"flex-direction" : "row",
			}; //-webkit-box is for old safari ios6
			var ss = "";
			ss += "<div id='" + this.id + "'";
			if (this.styleClass)
				ss += " class=\""+this.styleClass+"\"";
			ss += " style=\"";
			ss += this.toStyle(this.size);
			if (!this.floating) {
				ss += this.toStyle(style1);
				if (this.align) {
					ss += "-webkit-justify-content:" + this.align + ";";
					ss += "-ms-justify-content:" + this.align + ";";
					ss += "justify-content:" + this.align + ";";
					//ss += "display: -webkit-box;";
					ss += "-webkit-box-pack:" + this.align + ";";
				}
				if (this.valign) {
					ss += "-webkit-align-items:" + this.valign + ";";
					ss += "-ms-align-items:" + this.valign + ";";
					ss += "align-items:" + this.valign + ";";
				}
			} else {
				if (this.floating)
					ss += "float:" + this.floating + ";";
				else
					ss += this.toStyle(style1);
			}
			if (this.align === "center") {
				ss += "text-align:center;";
			} else if (this.align === "flex-start") {
				ss += "text-align:left;";
			} else if (this.align === "flex-end") {
				ss += "text-align:right;";
			}
			ss += this.toStyle(this.style);
			ss += this.toStyle(this.padding);
			ss += this.toStyle(this.margin);
			if (this.display) {
				ss += "display:" + this.display + ";";
			}
			ss += "\"";
			ss += ">";
			ss += "</div>";
			// console.log(ss);
			var parent = context.selector;
			var me = this;
			var element = $(ss);
			me.__element = element;
			$(parent).append(element);
			if (this.text !== undefined) {
				//ss += this.toSafeStr(this.text);
				var $lb = $("<span></span>");
				element.append($lb);
				$lb.text(this.text);
			}
			me.on(element, "tap", function(ev) {
				me.trigger("onTap");
			});
			me.on(element, "doubletap", function(ev) {
				me.trigger("onDoubleTap");
			});
			if (!__designing && !me.showAtStart) {
				me.hide();
			}
			var ctx = new NEST.c.com.nxstinc.nest.component.Context();
			ctx.parent = context;
			ctx.selector = element;
			ctx.component = this;
			NEST.inherited(this).paint.call(this, ctx);
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
		clazz.prototype.animatedHide = function() {
			var me = this;
			var element = me.__element;
			element.hide(me.animationSpeed, function() {
				me.trigger("onHide");
			});
		};
		clazz.prototype.animatedShow = function() {
			var me = this;
			var element = me.__element;
			element.show(me.animationSpeed, function() {
				me.trigger("onShow");
			});
		};
		clazz.prototype.toggle = function() {
			if (this.isVisible())
				this.hide();
			else
				this.show();
		};
		clazz.prototype.animatedToggle = function() {
			if (this.isVisible())
				this.animatedHide();
			else
				this.animatedShow();
		};
		clazz.prototype.isVisible = function() {
			var element = me.__element;
			return element.is(":visible");
		};
		clazz.prototype.scroll = function() {
			$("#"+this.form.id).scrollTo("#"+this.id);
		};
		// #ifdef designing
		// #endif designing
		return clazz;
	}
});