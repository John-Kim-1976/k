/**
 * ScrollPanel
 *
 * @author John Kim <john@nxstinc.com>
 */
NEST.define("com.nxstinc.nest.component.layout", {
	ScrollPanel : function() {
		var clazz = function(id) {
			this.id = id;
			this.size = {
				"width" : "100%",
				"height" : "100%",
			};
			this.style = undefined;
			this.padding = {};
			this.margin = {};
			//this.zoom = true;
			this.scroll = true;
			this.align = undefined;
			this.styleClass = undefined;
		};
		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.ContainerComponent");
		clazz.prototype.paint = function(context) {
			var ss = "";
			ss += "<div id='" + this.id + "'";;
			ss += " style=\"";
			ss += this.toStyle({
				//width: "100%",
				//height: "100%",
				"position" : "relative",
			});
			ss += this.toStyle(this.size);
			ss += this.toStyle(this.margin);
			ss += "\"";
			ss += ">";
			ss += "<div id='" + this.id + "_iscroll'";
			ss += " style=\"";
			var style1 = {
				"display" : ["-webkit-box", "-webkit-flex", "-ms-flex", "flex"],
				"-webkit-flex-direction" : "row",
				"-ms-flex-direction" : "row",
				"flex-direction" : "row",
				"-webkit-box-sizing" : "border-box",
				"-moz-box-sizing" : "border-box",
				"box-sizing" : "border-box",
				"position" : "absolute",
				"overflow" : "auto",
				"-webkit-overflow-scrolling" : "touch",
			};
			if (!__designing)
				ss += this.toStyle(style1);
			ss += this.toStyle({
				width : "100%",
				height : "100%",
			});
			ss += this.toStyle(this.style);
			ss += this.toStyle(this.padding);
			ss += "\"";
			ss += ">";
			ss += "<div data-role='scroller'";
			if (this.styleClass)
				ss += " class=\""+this.styleClass+"\"";
			ss += " style=\"";
			var style2 = {
				"position" : "absolute",
				"width" : "100%",
				"height" : "100%",
				"-webkit-touch-callout": "none",
				"-webkit-user-select": "none",
				"-moz-user-select": "none",
				"-ms-user-select": "none",
				"-ms-touch-action": "none",
				"user-select": "none",
			};
			if (!__designing)
				ss += this.toStyle(style2);
			if (this.align)
				ss += this.toStyle({"text-align": "center"});
			if (typeof __Android === "undefined") {
				// gallaxy s3, s4 bug
				ss += this.toStyle({
					"-webkit-transform": "translate3d(0,0,0)",
					"-moz-transform": "translate3d(0,0,0)",
					"-ie-transform": "translate3d(0,0,0)",
				});
			}
			ss += "\"";
			ss += ">";
			ss += "</div>";
			ss += "</div>";
			ss += "</div>";
			var parent = context.selector;
			var me = this;
			var element = $(ss);
			$(parent).append(element);
			me.on(element, "tap", function(ev) {
				me.trigger("onTap");
			});
			me.on(element, "doubletap", function(ev) {
				me.trigger("onDoubleTap");
			});
			var ctx = new NEST.c.com.nxstinc.nest.component.Context();
			ctx.parent = context;
			ctx.selector = $(parent).find("#" + this.id + "_iscroll > div");
			ctx.component = this;
			NEST.inherited(this).paint.call(this, ctx);
			this.form.bind("onInit", function(ev) {
				if (me.size !== undefined && me.size.height === "100%") {
					var header = $("#" + me.form.id + " [data-role=header]");
					var hh = header.length == 1 ? header[0].clientHeight : 0;
					var footer = $("#" + me.form.id + " [data-role=footer]");
					var fh = footer.length == 1 ? footer[0].clientHeight : 0;
					var top = document.getElementById(me.id).offsetTop;
					var C = 30;
					var offsetHeight = C + hh + fh + top;
					ctx.selector.append("<div style='min-height:"+offsetHeight+"px'></div>");
				}
			});
			var touchScrollNeeded = (NEST.env.os.name === "Windows Phone")
					|| (!('ontouchstart' in document.documentElement) && element.find("input").length === 0);
			if (!__designing && touchScrollNeeded) {
		        var handleHammer = function(ev) {
		            // disable browser scrolling
		            ev.gesture.preventDefault();
		            switch(ev.type) {
		                case 'dragright':
		                case 'dragleft':
		                    var pane_offset = -(100/pane_count)*current_pane;
		                    var drag_offset = ((100/pane_width)*ev.gesture.deltaX) / pane_count;
		                    if((current_pane == 0 && ev.gesture.direction == "right") ||
		                        (current_pane == pane_count-1 && ev.gesture.direction == "left")) {
		                        drag_offset *= .4;
		                    }
		                    setContainerOffset(drag_offset + pane_offset);
		                    break;
		                case 'swipeleft':
		                    self.next();
		                    ev.gesture.stopDetect();
		                    break;
		                case 'swiperight':
		                    self.prev();
		                    ev.gesture.stopDetect();
		                    break;
		                case 'release':
		                    break;
		            }
		        };
		        var pinchzoom = $(parent).find("#" + this.id)[0];
		        var rect = $(parent).find("#" + this.id + "_iscroll")[0];
		        var hammertime = Hammer(pinchzoom, {
		            preventDefault		: true,
		            transformMinScale   : 1,
		            dragBlockHorizontal : true,
		            dragBlockVertical   : true,
		            dragMinDistance     : 0
		        });
		        var posX=0, posY=0,
		        scale=1, last_scale = 1,
		        last_posX=0, last_posY=0,
		        max_pos_x=0, max_pos_y=0;
		        var actions = "touch drag transform dragend";
		        //if(!Hammer.HAS_TOUCHEVENTS) //2014.11.05
		        	actions += " dragdown dragup";
		        //if(!Hammer.HAS_TOUCHEVENTS) //2014.11.05
			    hammertime.on(actions, function(ev) {
			        switch(ev.type) {
			            case 'touch':
			                last_scale = scale;
			                break;
			            case 'drag':
			                if(scale != 1){
		                        posX = last_posX + ev.gesture.deltaX;
		                        posY = last_posY + ev.gesture.deltaY;
		                        if(posX > max_pos_x)
		                            posX = max_pos_x;
		                        if(posX < -max_pos_x)
		                            posX = -max_pos_x;
		                        if(posY > max_pos_y)
		                            posY = max_pos_y;
		                        if(posY < -max_pos_y)
		                            posY = -max_pos_y;
			                }else{
			                    posX = 0;
			                    posY = 0;
			                    saved_posX = 0;
			                    saved_posY = 0;
			                }
			                break;
			            case 'transform':
			                scale = Math.max(1, Math.min(last_scale * ev.gesture.scale, 10));
			                max_pos_x = Math.ceil((scale - 1) * rect.clientWidth / 2);
			                max_pos_y = Math.ceil((scale - 1) * rect.clientHeight / 2);
			                if(posX > max_pos_x)
			                    posX = max_pos_x;
			                if(posX < -max_pos_x)
			                    posX = -max_pos_x;
			                if(posY > max_pos_y)
			                    posY = max_pos_y;
			                if(posY < -max_pos_y)
			                    posY = -max_pos_y;
			                break;
			            case 'dragend':
			                last_posX = posX < max_pos_x ? posX: max_pos_x;
			                last_posY = posY < max_pos_y ? posY: max_pos_y;
			                break;
			            case 'dragdown':
			            	$(rect).scrollTo("+="+ ev.gesture.deltaY +"px");
			            	break;
			            case 'dragup':
			            	$(rect).scrollTo("-="+ Math.abs(ev.gesture.deltaY) +"px");
			            	break;
			        }
			        // transform!
			        var transform =
			                "translate3d(" + posX + "px," + posY + "px, 0) " +
			                "scale3d(" + scale + "," + scale + ", 1) " +
			                "rotate(" + 0 + "deg) ";
			        rect.style.transform = transform;
			        rect.style.oTransform = transform;
			        rect.style.msTransform = transform;
			        rect.style.mozTransform = transform;
			        rect.style.webkitTransform = transform;
			    });
			} // touch scroll
		};
		clazz.prototype.scrollTop = function() {
		};
		// #ifdef designing
		// #endif designing
		return clazz;
	}
});