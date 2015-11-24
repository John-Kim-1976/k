/**
 * Button
 *
 * @author John Kim <john@nxstinc.com>
 */
NEST.define("com.nxstinc.nest.component", {
	Button : function() {
		var clazz = function(id) {
			this.id = id;
			this.text = undefined;
			this.image = undefined;
			this.size = {};
			this.style = {};
			this.padding = {};
			this.margin = {};
			this.floating = undefined;
			this.valign = undefined;
			this.styleClass = "button";
		};
		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.VisualComponent");
		clazz.prototype.paint = function(context) {
			var me = this;
			var type = 0;
			if (this.image) type++;
			if (this.image && this.text && this.text !== "")  type++;
			var $ss;
			if (type === 1) {
				$ss = $("<input type='image' id='" + this.id + "' src='" + this.image + "'>");
				if (this.text !== undefined)
					$ss.attr("title", this.text);
			} else if (type === 2) {
				if (!document.createElement("canvas").getContext) {
					$ss = $("<input type='image' id='" + this.id + "' src='" + this.image + "'>");
					if (this.text !== undefined)
						$ss.attr("title", this.text);
				} else {
					$ss = $("<canvas id='" + this.id + "'></canvas>");
					$ss.css({
						"max-width" : "100%",
						"max-height" : "100%",
					});
					if (this.size) {
						if (this.size.width)
							$ss.attr("width", this.size.width);
						if (this.size.height)
							$ss.attr("height", this.size.height);
					}
					var c = $ss[0];
					var w = 24; // img.width
					var h = 24; // img.height
					var bo = 4;
					var ctx = c.getContext("2d");
					var img = new Image();
					img.onload = function() {
						ctx.drawImage(img, (c.width-w)/2, (c.height-h)/2 - bo, w, h * img.width / img.height);
						//ctx.font = '10px sans-serif';
						ctx.textAlign = 'center';
						ctx.textBaseline = 'bottom';
						ctx.imageSmoothingEnabled = true;
						ctx.fillText(me.text, c.width/2, c.height - bo);
					};
					img.src = this.image;
				}
			} else {
				$ss = $("<input type='button' id='" + this.id + "'>");
				if (this.text !== undefined)
					$ss.attr("value", this.text);
			}
			if (this.styleClass)
				$ss.addClass(this.styleClass);
			if (this.floating)
				$ss.css("float", this.floating);
			if (this.valign)
				$ss.css("vertical-align", this.valign);
			if (this.image === undefined && this.text === undefined) {
				$ss.css({
					"min-width" : "30px",
					"min-height" : "28px",
				});
			}
			$ss.css(this.size);
			$ss.css(this.style);
			$ss.css(this.padding);
			$ss.css(this.margin);
			$ss.css("-webkit-appearance".replace(/-webkit-/gi, "-webkit-"),  "none");
			var parent = context.selector;
			var element = $ss;
			$(parent).append(element);
			me.on(element, "click", function(ev) {
				me.trigger("onTap");
				ev.stopImmediatePropagation();
				return false;
			}, true);
			this.__element = element;
		};
		clazz.prototype.hide = function() {
			if (this.__element)
			this.__element.hide();
		};
		clazz.prototype.show = function() {
			if (this.__element)
			this.__element.show();
		};
		clazz.prototype.disable = function() {
			if (this.__element) {
				this.__element.prop("disabled", true);
				this.__element.css("-webkit-filter", "grayscale(1)");
			}
		};
		clazz.prototype.enable = function() {
			if (this.__element) {
				this.__element.prop("disabled", false);
				this.__element.css("-webkit-filter", "grayscale(0)");
			}
		};
		// #ifdef designing
		// #endif designing
		return clazz;
	}
});