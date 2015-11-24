/**
 * ListItem
 * 
 * @author John Kim <john@nxstinc.com>
 */
NEST.define("com.nxstinc.nest.component.list", {
	ListItem : function() {
		var clazz = function(id) {
			this.id = id;
			this.size = {};
			this.style = {};
			this.margin = {};
			this.padding = {};
			this.fullSelection = true;
			this.floating = undefined;
			this.display = undefined;
			this.selectionColor = undefined;
			this.key1 = "";
			this.key2 = "";
			this.key3 = "";
			this.key4 = "";
			this.key5 = "";
			this.icon = undefined;
			this.image = undefined;
			this.title = "";
			this.text = "";
			this.name = undefined;
			this.email = undefined;
			this.date = undefined;
			this.count = undefined;
			this.description = undefined;
			this.__selected = false;
			this.itemRenderer = function(me) {
				var image = me.image;
				var title = me.title;
				var text = me.text;
				var ss = "";
				if (image) {
					ss += "<img src='"+image+"' style='margin: 0 0 10px 0;padding: 2px; vertical-align: middle;'>";
				}
				ss += "<span>";
				ss += me.toSafeStr(title);
				if (text && text !== "") {
					ss += "<p>";
					ss += text;
					ss += "</p>";				
				}
				ss += "</span>";
				return $(ss);
			};
		};
		
		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.ListItemComponent");

		clazz.prototype.paint = function(context) {
			var ss = "";
			ss += "<li id='" + this.id + "'";
			ss += " data-key='" + this.toSafeStr(this.key) + "'";
			ss += " style=\"";
			ss += this.toStyle(this.size);
			ss += this.toStyle(this.style);
			ss += this.toStyle(this.margin);
			ss += this.toStyle(this.padding);			
			if (this.floating)
				ss += "float: "+this.floating + ";";
			if (this.display)
				ss += "display: "+this.display + ";";
			ss += "vertical-align: top;";
			if (__designing)
				ss += this.toStyle({"min-height": "20px"});
			ss += "\"";
			ss += ">";
			ss += "</li>";

			var parent = context.selector;
			var me = this;
			var element = $(ss);
			$(parent).append(element);

			me.__element = element;
			me.__unselectedColor = undefined;
			
			if (me.__hide)
				me.hide();
			
			var $rendered;
			try {
				if (me.itemRenderer)
					$rendered = me.itemRenderer(me);				
			} catch(ex) {
				console.log(ex);
			}
			
			if ($rendered) {
				if (element.children().length === 0)
					element.append($rendered);
				
				var children = $rendered.children();
				if (children !== undefined && !me.fullSelection) {
					children.css("cursor", "pointer");
					$.each(children, function() {
						me.on($(this), "tap", function(ev) {
							me.select(true);
							me.parent.selectionChanged(me);
							me.trigger("onTap");
							me.parent.trigger("onTap");
							me.parent.trigger("onChange");
						}, true);					
						me.on($(this), "doubletap", function(ev) {
							me.select(true);
							me.parent.selectionChanged(me);
							me.trigger("onDoubleTap");
							me.parent.trigger("onDoubleTap");
							me.parent.trigger("onChange");
						}, true);
					});
				} else {
					element.css("cursor", "pointer");
					me.on(element, "tap", function(ev) {
						me.select(true);
						me.parent.selectionChanged(me);
						me.trigger("onTap");
						me.parent.trigger("onTap");
						me.parent.trigger("onChange");
					}, true);					
					me.on(element, "doubletap", function(ev) {
						me.select(true);
						me.parent.selectionChanged(me);
						me.trigger("onDoubleTap");
						me.parent.trigger("onDoubleTap");
						me.parent.trigger("onChange");
					}, true);
				}
			}
		};
		
		clazz.prototype.select = function(selected) {
			var me = this;			
			if (selected === true) {
				me.parent.__key1 = me.Key1();
				me.parent.__key2 = me.Key2();
				me.parent.__key3 = me.Key3();
				me.parent.__key4 = me.Key4();
				me.parent.__key5 = me.Key5();
				me.parent.__data = me.data();
				me.parent.selected = me.__index;
			}
			if (me.selectionColor && (me.__selected != selected)) {				
				if (selected === true) {
					me.__unselectedColor = me.__element.css("background-color");
					me.__element.css("background-color", me.selectionColor);
				} else {
					if (me.__unselectedColor)
						me.__element.css("background-color", me.__unselectedColor);						
				}
			}			
			me.__selected = selected;
		};
		
		clazz.prototype.hide = function() {
			if (this.__element) {
				this.__element.hide();				
			} else {
				this.__hide = true;
			}
		};
		
		clazz.prototype.show = function() {
			if (this.__element) {
				this.__element.show();				
			} else {
				this.__hide = false;
			}
		};

		clazz.prototype.Key1 = function() {
			return this.key1;
		};
		clazz.prototype.Key2 = function() {
			return this.key2;
		};
		clazz.prototype.Key3 = function() {
			return this.key3;
		};
		clazz.prototype.Key4 = function() {
			return this.key4;
		};
		clazz.prototype.Key5 = function() {
			return this.key5;
		};

		clazz.prototype.data = function() {
			return this.__data;
		};	
		
		clazz.prototype.remove = function() {
			if (this.__element)
				this.__element.remove();
		};
		
		// #ifdef designing
		clazz.prototype.editor = function() {
			var d = {
				palette : {
					category : "List",
					alias : undefined,
					priority : 2,
					description : "ListItem",
				},
				property : {
					size : {
						type : "size",
						editor : "SizeEditor",
						category : "Decoration",
						priority : 1,
						description : "",
					},
					style : {
						type : "style",
						editor : "StyleEditor",
						category : "Decoration",
						priority : 2,
						description : "",
					},						
					padding : {
						type : "padding",
						editor : "PaddingEditor",
						category : "Decoration",
						priority : 3,
						description : "",
					},
					margin : {
						type : "margin",
						editor : "MarginEditor",
						category : "Decoration",
						priority : 4,
						description : "",
					},
					floating : {
						type : ["left", "right"],
						category : "Decoration",
						priority : 5,
						description : "",
					},
					display : {
						type : ["inline-block"],
						category : "Decoration",
						priority : 5,
						description : "",
					},
					fullSelection : {
						category : "Decoration",
						priority : 11,
						description : "",
					},
					selectionColor : {
						type : "color",
						editor : "ColorEditor",
						category : "Decoration",
						priority : 12,
						description : "",						
					},
					key1 : {
						type : "String",
						category : "Setup",
						priority : 1,
						description : "",
					},				
					key2 : {
						type : "String",
						category : "Setup",
						priority : 2,
						description : "",
					},				
					key3 : {
						type : "String",
						category : "Setup",
						priority : 3,
						description : "",
					},			
					key4 : {
						type : "String",
						category : "Setup",
						priority : 4,
						description : "",
					},			
					key5 : {
						type : "String",
						category : "Setup",
						priority : 5,
						description : "",
					},
					icon : {
						type : "string",
						editor : "ImageFileSelectionEditor",
						category : "Setup",
						priority : 6,
						alias : undefined,
						description : "",
						hint : function(thisObj, v) {
							return undefined;
						},
					},
					image : {
						type : "string",
						editor : "ImageFileSelectionEditor",
						category : "Setup",
						priority : 7,
						alias : undefined,
						description : "",
						hint : function(thisObj, v) {
							return undefined;
						},
					},
					title : {
						type : "MultiLineText",	
						editor : "MultiLineTextEditor",
						category : "Setup",
						priority : 8,
						description : "",
					},
					text : {
						type : "MultiLineText",	
						editor : "MultiLineTextEditor",
						category : "Setup",
						priority : 9,
						description : "",
					},
					name : {
						type : "String",
						category : "Setup",
						priority : 10,
						description : "",
					},	
					email : {
						type : "String",
						category : "Setup",
						priority : 11,
						description : "",
					},
					date : {
						type : "String",
						category : "Setup",
						priority : 12,
						description : "",
					},
					count : {
						type : "String",
						category : "Setup",
						priority : 13,
						description : "",
					},
					description : {
						type : "MultiLineText",	
						editor : "MultiLineTextEditor",
						category : "Setup",
						priority : 14,
						description : "",
					},						
					itemRenderer : {
						type : "function",
						editor : "RenderFunctionEditor",
						category : "Skin",
						priority : 99,
						description : "itemRenderer of ListItem will be rendered by custom style",						
					},
				},				
				event : {
					onTap : {
						priority : 1,
						description : "",
					},
					onCommand1 : {
						priority : 11,
						description : "User defined Action",
					},
					onCommand2 : {
						priority : 12,
						description : "User defined Action",
					},
					onCommand3 : {
						priority : 13,
						description : "User defined Action",
					},
					onCommand4 : {
						priority : 14,
						description : "User defined Action",
					},
					onCommand5 : {
						priority : 15,
						description : "User defined Action",
					},
					onCommand6 : {
						priority : 16,
						description : "User defined Action",
					},
					onCommand7 : {
						priority : 17,
						description : "User defined Action",
					},
				},				
				method : {
					getKey1 : {
						value : true,
					},
					getKey2 : {
						value : true,
					},
					getKey3 : {
						value : true,
					},
					getKey4 : {
						value : true,
					},
					getKey5 : {
						value : true,
					},
					data : {
						value : true,
					},
					remove : {
					},
					show : {
						priority : 1,
						description : "",
					},
					hide : {
						priority : 2,
						description : "",
					},
				},
			};
			return d;
		};
		// #endif designing

		return clazz;
	}
});