/**
 * ListView
 *
 * @author John Kim <john@nxstinc.com>
 */
NEST.define("com.nxstinc.nest.component.list", {
	ListView : function() {
		var clazz = function(id) {
			this.id = id;
			this.size = {
				"width" : "100%",
			};
			this.floating = undefined;
			this.style = {};
			this.padding = {};
			this.margin = {};
			this.align = undefined;
			this.itemSize = {};
			this.itemStyle = {};
			this.itemPadding = {};
			this.itemMargin = {};
			this.itemFloating = undefined;
			this.itemDisplay = undefined;
			this.itemRenderer = undefined;
			this.fullSelection = true;
			this.selectionColor = undefined;
			this.selected = -1;
			this.dataStore = undefined;
			this.dataKey1 = undefined;
			this.dataKey2 = undefined;
			this.dataKey3 = undefined;
			this.dataKey4 = undefined;
			this.dataKey5 = undefined;
			this.dataText = undefined;
			this.dataTitle = undefined;
			this.dataIcon = undefined;
			this.dataImage = undefined;
			this.dataCount = undefined;
			this.dataDescription = undefined;
			this.dataName = undefined;
			this.dataEmail = undefined;
			this.dataDate = undefined;
			this.placeHolder = undefined;
			this.styleClass = undefined;
		};
		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.ListViewComponent");
		clazz.prototype.paint = function(context) {
			var ss = "";
			ss += "<ul id='" + this.id + "'";
			if (this.styleClass)
				ss += " class=\""+this.styleClass+"\"";
			ss += " style=\"";
			ss += this.toStyle(this.size);
			if (__designing)
			ss += this.toStyle({"min-height": "20px"});
			ss += this.toStyle({
				"list-style-type": "none",
				"padding-left": "0",
				"margin": "0",
			});
			ss += this.toStyle(this.style);
			ss += this.toStyle(this.padding);
			if (this.floating)
				ss += "float: "+this.floating + ";";
			if (this.align)
				ss += "text-align: "+this.align + ";";
			ss += "\"";
			ss += ">";
			ss += "</ul>";
			var parent = context.selector;
			var me = this;
			var element = $(ss);
			$(parent).append(element);
			this.__element = element;
			var ctx = new NEST.c.com.nxstinc.nest.component.Context();
			ctx.parent = context;
			ctx.selector = element;
			ctx.component = this;
			NEST.inherited(this).paint.call(this, ctx);
			if (undefined !== this.dataStore) {
				this.dataStore.bind("onTake", function(p) {
					var table = p.content;
					//console.log(table);
					var existCount = me.count();
					if (me.__children.length === 0 && table.length === 0 && me.placeHolder) {
						var $ph = $("<li data-role=\"placeholder\" style=\""+me.toStyle({
							width : "100%",
							"line-height" : "50px",
							"text-align" : "center",
						})+"\"></li>");
						element.append($ph);
						$ph.html(me.placeHolder);
					} else {
						element.find("[data-role='placeholder']").remove();
					}
					for(var i=0; i<table.length; i++) {
						var row = table[i];
						var li = NEST.create("com.nxstinc.nest.component.list.ListItem", me.id + "_item");
						me.add(li);
						li.form = me.form;
						li.__data = row;
						li.__index = existCount + i;
						li.__dynamic = true;
						li.selectionColor = me.selectionColor;
						li.padding = me.itemPadding;
						li.margin = me.itemMargin;
						li.style = me.itemStyle;
						li.size = me.itemSize;
						li.floating = me.itemFloating;
						li.display = me.itemDisplay;
						li.fullSelection = me.fullSelection;
						if (me.itemRenderer)
						li.itemRenderer = me.itemRenderer;
						if (row.hasOwnProperty(me.dataKey1))
							li.key1 = row[me.dataKey1];
						if (row.hasOwnProperty(me.dataKey2))
							li.key2 = row[me.dataKey2];
						if (row.hasOwnProperty(me.dataKey3))
							li.key3 = row[me.dataKey3];
						if (row.hasOwnProperty(me.dataKey4))
							li.key4 = row[me.dataKey4];
						if (row.hasOwnProperty(me.dataKey5))
							li.key5 = row[me.dataKey5];
						if (row.hasOwnProperty(me.dataTitle))
							li.title = row[me.dataTitle];
						if (row.hasOwnProperty(me.dataIcon))
							li.icon = row[me.dataIcon];
						if (row.hasOwnProperty(me.dataImage))
							li.image = row[me.dataImage];
						if (row.hasOwnProperty(me.dataText))
							li.text = row[me.dataText];
						if (row.hasOwnProperty(me.dataCount))
							li.count = row[me.dataCount];
						if (row.hasOwnProperty(me.dataDate))
							li.date = row[me.dataDate];
						if (row.hasOwnProperty(me.dataDescription))
							li.description = row[me.dataDescription];
						if (row.hasOwnProperty(me.dataName))
							li.name = row[me.dataName];
						if (row.hasOwnProperty(me.dataEmail))
							li.email = row[me.dataEmail];
						li.paint(ctx);
					}
					if (me.selected > -1) {
						var sel = me.get(me.selected);
						if (sel && sel.select)
							sel.select(true);
					}
					me.trigger("onItemsCreated");
				});
			}
		};
		clazz.prototype.selectionChanged = function(selectedItem) {
			for(var i=0; i<this.count(); i++) {
				var item = this.get(i);
				if (selectedItem != item) {
					item.select(false);
				}
			}
		};
		clazz.prototype.unselectAll = function() {
			for(var i=0; i<this.count(); i++) {
				var item = this.get(i);
				item.select(false);
			}
		};
		clazz.prototype.Key1 = function() {
			return this.__key1;
		};
		clazz.prototype.Key2 = function() {
			return this.__key2;
		};
		clazz.prototype.Key3 = function() {
			return this.__key3;
		};
		clazz.prototype.Key4 = function() {
			return this.__key4;
		};
		clazz.prototype.Key5 = function() {
			return this.__key5;
		};
		clazz.prototype.getKey1 = function() {
			return this.__key1;
		};
		clazz.prototype.getKey2 = function() {
			return this.__key2;
		};
		clazz.prototype.getKey3 = function() {
			return this.__key3;
		};
		clazz.prototype.getKey4 = function() {
			return this.__key4;
		};
		clazz.prototype.getKey5 = function() {
			return this.__key5;
		};
		clazz.prototype.data = function() {
			if (this.selected > -1) {
				var item = this.get(this.selected);
				if (item)
					return item.data();
			}
			return {};
		};
		clazz.prototype.removeItem = function() {
			var n = this.selected;
			if (n > -1) {
				var item = this.get(n);
				this.removeAt(n);
				item.remove();
			}
			this.selected = -1;
		};
		clazz.prototype.clearDynamicItems = function() {
			var sz = this.count();
			for(var i=sz-1; i>=0; i--) {
				var item = this.get(i);
				if (item.__dynamic === true) {
					this.removeAt(i);
					//this.__element.find(":nth-child("+i+")").remove();
				}
			}
			this.selected = -1;
		};
		clazz.prototype.clear = function() {
			if (this.__element && this.__element.html) {
				this.__element.html("");
			}
			this.selected = -1;
			this.__children = [];
		};
		clazz.prototype.hide = function() {
			if (this.__element && this.__element.html) {
				this.__element.hide();
			}
		};
		clazz.prototype.scroll = function() {
			$("#"+this.form.id+"").scrollTo("#"+this.id+"");
		};
		clazz.__canDropItem = function(child) {
			var clazz = child.__nclass;
			return "com.nxstinc.nest.component.list.ListItem" === clazz;
		};
		// #ifdef designing
		// #endif designing
		return clazz;
	}
});