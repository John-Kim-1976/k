NEST.define("com.nxstinc.nest.component", {
	Application : function() {
		var clazz = function(id) {
			this.debug = false;
			this.context = undefined;
		};
		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.ContainerComponent");
		clazz.prototype.paint = function() {
			var html = $(document);
			var body = html.find("body");
			var ctx = this.context = new NEST.c.com.nxstinc.nest.component.Context();
			ctx.selector = body;
			ctx.component = this;
			NEST.inherited(this).paint.call(this, ctx);
			var me = this;
			window.addEventListener("orientationchange", function() {
				switch(window.orientation)
			    {
			      case -90:
			      case 90:
			        console.log("landscape");
			    	for(var i=0; i<me.count(); i++) {
			    		var form = me.get(i);
			    		form.trigger("onLandscape");
			    	}
			        break;
			      default:
			    	console.log("portrait");
			      	for(var i=0; i<me.count(); i++) {
			    		var form = me.get(i);
			    		form.trigger("onPortrait");
			    	}
			        break;
			    }
			});
		};
		clazz.prototype.run = function() {
			this.paint();
		};
		clazz.prototype.update = function() {
			NEST.inherited(this).paint.call(this, this.context);
		};
		return clazz;
	},
	Form : function() {
		var clazz = function(id) {
			this.id = id;
			this.__params = {};
			this.__created = false;
			this.__attrs = 0; // home, login attributes
			this.__type = NEST.ComponentType.Form;
			this.__zIndex = -1;
			this.style = {};
			this.padding = {};
			this.margin = {};
			this.styleClass = undefined;
			this.size = {
				position: "absolute",
				top: "0px",
				bottom: "0px",
				left: "0px",
				right: "0px",
			};
			this.onTop = false;
			this.params = {};
		};
		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.ContainerComponent");
		var pContext = undefined;
		// var created = false;
		clazz.prototype.paint = function(context) {
			pContext = context;
			this.show();
		};
		clazz.prototype.back = function() {
			if (!this.__created || pContext === undefined)
				return;
			console.log("onBack(" + this.id);
			this.trigger("onBack", arguments);
		};
		clazz.prototype.resume = function() {
			if (!this.__created || pContext === undefined)
				return;
			var element = pContext.selector.find("#" + this.id);
			console.log("onResume(" + this.id);
			this.trigger("onResume", arguments);
		};
		clazz.prototype.destroy = function() {
			if (!this.__created || pContext === undefined)
				return;
			var element = pContext.selector.find("#" + this.id);
			console.log("onDestroy(" + this.id);
			this.trigger("onDestroy", arguments);
			var f = function(o) {
				if (o && o.__children) {
					for(var i=0; i<o.__children.length; i++) {
						try {
							var c = o.__children[i];
							f(c);
							if (c && c.destroy)
								c.destroy();
						} catch(E) {}
					}
				}
			};
			f(this);
			element.remove();
		};
		clazz.prototype.show = function() {
			if (!this.__created) {
				this.__created = true;
				var ss = "";
				ss += "<article id='" + this.id + "'";
				if (this.styleClass)
					ss += " class=\""+this.styleClass+"\"";
				ss += " style='";
				if (!__designing) {
					if (this.onTop) {
						ss += this.toStyle(this.size);
						ss += this.toStyle({
							"z-index" : 9999
						});
					} else {
						ss += this.toStyle({
							position: "absolute",
							top: 0,
							bottom: 0,
							left: 0,
							right: 0,
						});
						if (this.__zIndex > 0)
							ss += this.toStyle({
								"z-index" : this.__zIndex
							});
					}
				} else {
					ss += this.toStyle({
						position: "absolute",
						top: 0,
						bottom: 0,
						left: 0,
						right: 0,
					});
				}
				ss += "'>";
				ss += "<form onsubmit='return false;'>";
				ss += "<section id='" + this.id + "_container' data-role='section'";
				ss += " style='";
				//if (!__designing) {
					ss += this.toStyle({
						position: "absolute",
						top: 0,
						bottom: 0,
						left: 0,
						right: 0,
					});
				//}
				ss += "'>";
				ss += "<div data-role='container'";
				ss += " style='";
				ss += "-webkit-box-sizing: border-box;";
				ss += "-moz-box-sizing: border-box;";
				ss += "box-sizing: border-box;";
				ss += "overflow: hidden;";
				//if (!__designing)
				ss += "position: absolute;"; //??? gallaxy s3
				ss += "width: 100%;";
				ss += "height: 100%;";
				ss += this.toStyle(this.style);
				ss += this.toStyle(this.padding);
				ss += this.toStyle(this.margin);
				ss += "'>";
				ss += "</div>";
				ss += "</section>";
				ss += "</form>";
				ss += "</article>";
				var pElement = pContext.selector;
				var article = $(pElement).prepend(ss);
				var me = this;
				var container = article.find("#" + this.id + " [data-role=container]");
				var ctx = new NEST.c.com.nxstinc.nest.component.Context();
				ctx.parent = pContext;
				ctx.selector = container;
				ctx.component = this;
				NEST.inherited(this).paint.call(this, ctx);
				article.ready(function(ev) {
					me.trigger("onInit");
					if (me.prevForm !== undefined) {
						console.log("onBackground(" + (me.prevForm && me.prevForm.id) ? me.prevForm.id : "");
						me.prevForm.trigger("onBackground");
					}
					if (!__designing)
					if (localStorage) {
						if (localStorage["__NEST." + me.id] === undefined) {
							localStorage["__NEST." + me.id] = 1;
							console.log("onFirstTime(" + me.id);
							me.trigger("onFirstTime");
						} else {
							localStorage["__NEST." + me.id] = parseInt(localStorage["__NEST." + me.id]) + 1;
						}
					} else {
						var rk = "__NEST." + me.id;
						var rv = document.cookie.replace(eval("/(?:(?:^|.*;\s*)"+rk+"\s*\=\s*([^;]*).*$)|^.*$/"), "$1");
						if (rv === "") {
							document.cookie = rk + "=" + 1;
							console.log("onFirstTime(" + me.id);
							me.trigger("onFirstTime");
						} else {
							document.cookie = rk + "=" + (parseInt(rv)+1);
						}
					}
					setTimeout(function() {
						// focus controls for Go Button
		                var inputs = container.find("input, select, textarea, a, button");
		                var tabindex = 0;
		                $.each(inputs, function() {
		                	$(this).attr("tabindex", ++tabindex);
		                });
					}, 500);
				});
			} else {
				var element = pContext.selector;
				var article = $(element).append(ss);
				element.css("display", "");
			}
		};
		clazz.prototype.nextFocus = function(me, selector) {
			selector.blur();
            var tabIndex = 1 + parseInt(selector.attr("tabindex"));
            var nextFocus = $("#"+this.id).find("[tabindex="+tabIndex+"]");
            if (nextFocus && nextFocus.length === 1 && nextFocus.is(":visible")) {
               nextFocus.focus();
            } else  {
            	tabIndex = 1;
            	nextFocus = $("#"+this.id).find("[tabindex="+tabIndex+"]");
            	if (nextFocus)
            		nextFocus.focus();
            }
		};
		clazz.prototype.reset = function() {
			if (localStorage) {
				localStorage["__NEST." + this.id] = undefined;
			} else {
				document.cookie = "__NEST." + this.id + "=";
			}
		};
		clazz.prototype.redraw = function() {
			var element = pContext.selector.find("#" + this.id);
			element.remove();
			this.__created = false;
			this.show();
		};
		clazz.prototype.scrollTop = function() {
			var element = pContext.selector.find("#" + this.id);
			element.scrollTop();
		};
		clazz.prototype.clearAll = function() {
			var element = pContext.selector.find("#" + this.id);
			$(ele).find(":input").each(function() {
				switch(this.type) {
					case "checkbox":
					case "radio":
						this.checked = false;
						break;
					default:
					$(this).val("");
					break;
				}
			});
		};
		// #ifdef designing
		// #endif designing
		return clazz;
	},
	Link : function() {
		var clazz = function(id) {
			this.id = id;
			this.target = undefined;
			this.backStep = 1;
			this.params = {};
			this.precondition = function(me) {return true;};
			this.redirectLogin = false;
			this.redirectLoginText = undefined;
			this.checkOffLine = false;
		};
		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.NonVisualComponent");
		clazz.prototype.paint = function(context) {
		};
		clazz.prototype.move = function(target) {
			this.show(target);
		};
		clazz.prototype.validateSession = function(target, fOk) {
			if (this.redirectLogin) {
				if (window.__session === undefined) {
					var text = this.redirectLoginText;
					if (text === undefined || text === "") {
						if (window.__L && __L.REQUIRED_LOGIN)
							text = __L.REQUIRED_LOGIN;
					}
					if (text && text !== "") {
						var me = this;
						alertify.confirm(text).set({
							pinnable: false,
							closable: false,
							//modal: false,
							transition: "zoom",
							labels: {ok: "Yes", cancel: "No"},
							onok: function(e) { me.gotoLogin(target, fOk); },
						});
					} else {
						this.gotoLogin(target, fOk);
					}
					return false;
				}
			}
			return true;
		};
		clazz.prototype.gotoLogin = function(target, fOk) {
			if (__Nav.fLogin) {
				var me = this;
				var thisForm = this.form;
				var fLogin = __Nav.fLogin(thisForm, {caller: thisForm.id, form: thisForm, params : this.params});
				//if (target)
				fLogin.bind("onBack", function(a) {
					if (a && a.length > 0 && a[0].silent)
						return;
					if (window.__session !== undefined && fOk)
						setTimeout(fOk, 200);
				});
				if (fLogin.onTop !== true)
					__Nav.show(fLogin);
				else
					app.update();
			}
		};
		clazz.prototype.validateOffLine = function() {
			var b = true;
			if (this.checkOffLine && navigator.onLine !== undefined) {
				b = navigator.onLine;
				if (!b) {
					alertify.error("Current network status : offline");
				}
			}
			return b;
		};
		clazz.prototype.show = function(argv, target) {
			if (!this.validateOffLine()) return;
			var _target = target ? target : this.target;
			if (_target !== undefined) {
				var thisForm = this.form;
				var fTarget = eval("__ns." + _target);
				if (fTarget && (typeof fTarget.create === "function")) {
					if (this.precondition(this) !== true) {
						this.trigger("onPreconditionError");
						return;
					}
					var me = this;
					if (!this.validateSession(_target, function() {
						me.show(argv, target);
					}))
						return;
					var newForm = fTarget.create(thisForm, {caller: thisForm.id, form: thisForm, params : this.params});
					if (newForm.onTop !== true)
						__Nav.show(newForm);
					else
						app.update();
				}
			}
		};
		clazz.prototype.swap = function(argv, target) {
			if (!this.validateOffLine()) return;
			var _target = target || this.target;
			//console.log(target);
			if (_target !== undefined) {
				var thisForm = this.form;
				var fTarget = eval("__ns." + _target);
				if (fTarget && (typeof fTarget.create === "function")) {
					if (this.precondition(this) !== true) {
						this.trigger("onPreconditionError");
						return;
					}
					var me = this;
					if (!this.validateSession(_target, function() {
						me.show(argv, target);
					}))
						return;
					var p = {caller: thisForm.id, form: thisForm, params : this.toData(this.params)};
					__Nav.swap(fTarget.create(thisForm, p));
				}
			}
		};
		clazz.prototype.home = function() {
			__Nav.home();
		};
		clazz.prototype.login = function() {
			if (!this.validateOffLine()) return;
			if (window.__session === undefined) {
				this.gotoLogin();
			}
		};
		clazz.prototype.back = function() {
			if (this.form) {
				if (this.form.onTop) {
					if (this.form.prevForm) {
						this.form.prevForm.__params = {caller: this.form.id, form: this.form, params : this.toData(this.params)}
					}
					this.form.destroy();
				} else {
					if (this.form.prevForm) {
						this.form.prevForm.__params = {caller: this.form.id, form: this.form, params : this.toData(this.params)}
					}
					__Nav.back(this.backStep);
				}
			}
		};
		clazz.prototype.backWithRefresh = function() {
			this.back();
			__Nav.current().trigger("onRequestRefresh");
		};
		clazz.prototype.restart = function() {
			location.reload();
		};
		clazz.prototype.toData = function(data) {
			var d = {};
			if (data)
			$.each(data, function(k, v) {
				if ((typeof v === "string") && (v.indexOf("__ns.") === 0))
					v = eval(v);
				d[k] = v;
			});
			return d;
		};
		// #ifdef designing
		// #endif designing
		return clazz;
	},
	Header : function() {
		var clazz = function(id) {
			this.id = id;
			this.text = undefined;
			this.size = {
				"width" : "100%",
				"height" : "46px",
			};
			this.style = {};
			this.padding = {};
			this.margin = {};
			this.styleClass = "header";
			this.dataStore = undefined;
			this.dataText = undefined;
		};
		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.ContainerComponent");
		clazz.prototype.paint = function(context) {
			var ss = "";
			ss += "<header id='" + this.id + "' data-role='header'";
			if (this.styleClass)
				ss += " class=\""+this.styleClass+"\"";
			ss += " style=\"";
			ss += this.toStyle(this.size);
			ss += this.toStyle(this.style);
			ss += this.toStyle(this.padding);
			ss += this.toStyle(this.margin);
			ss += this.toStyle({
				"position" : "absolute",
				"z-index": "1",
				"top" : "0",
				"padding" : "4px",
				"-webkit-box-sizing" : "border-box",
				"-moz-box-sizing" : "border-box",
				"box-sizing" : "border-box",
			});
			ss += "\"";
			ss += ">";
			//if (this.text && this.text !== "") {
				ss += "<div style='z-index: -1; position: absolute; left: 0; right: 0; top: 0; bottom: 0;'>";
				ss += "<div style='width: 100%; height: 100%; display: table;'>";
				ss += "<div data-role='label' style='display: table-cell; text-align: center; vertical-align: middle;font-weight:bold;white-space:nowrap;'>";
			if (this.text && this.text !== "") {
				ss += this.toSafeStr(this.text);
			}
				ss += "</div>";
				ss += "</div>";
				ss += "</div>";
			//}
			ss += "</header>";
			var formId = this.form.id;
			var me = this;
			var element = $(ss);
			$("#"+ formId +" > form").prepend(element);
			me.on(element, "tap", function(ev) {
				me.trigger("onTap");
			});
			if (this.size != undefined && this.size.height != undefined) {
				var section = $("#" + formId).find("section[data-role=section]");
				section.css("top", this.size.height);
			}
			var ctx = new NEST.c.com.nxstinc.nest.component.Context();
			ctx.parent = context;
			ctx.selector = element;
			ctx.component = this;
			NEST.inherited(this).paint.call(this, ctx);
			if (undefined !== me.dataStore) {
				me.dataStore.bind("onTake", function(p) {
					var table = p.content;
					if (table && table.length > 0) {
						var row = table[0];
						if (row.hasOwnProperty(me.dataText)) {
							element.find("[data-role='label']").text(me.toSafeStr(row[me.dataText]));
						}
					}
				});
			}
		};
		// #ifdef designing
		// #endif designing
		return clazz;
	},
	Footer : function() {
		var clazz = function(id) {
			this.id = id;
			this.size = {
				"width" : "100%",
				"height" : "44px",
			};
			this.style = {
				"position" : "absolute",
				"z-index": "1",
				"bottom" : "0 !important",
				//"padding" : "8px",
				"-webkit-box-sizing" : "border-box",
				"-moz-box-sizing" : "border-box",
				"box-sizing" : "border-box",
			};
			this.align = undefined;
			this.styleClass = "footer";
		};
		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.ContainerComponent");
		clazz.prototype.paint = function(context) {
			var ss = "";
			ss += "<footer id='" + this.id + "' data-role='footer'";
			if (this.styleClass)
				ss += " class=\""+this.styleClass+"\"";
			ss += " style=\"";
			$.each(this.size, function(k, v) {
				ss += k + ":" + v + ";";
			});
			this.style = $.extend({}, this.style, {
				"position" : "absolute",
				"z-index": "1",
				"bottom" : "0 !important",
				"-webkit-box-sizing" : "border-box",
				"-moz-box-sizing" : "border-box",
				"box-sizing" : "border-box",
			});
			$.each(this.style, function(k, v) {
				//if (__designing && k === "position")
				//	return;
				ss += k + ":" + v + ";";
			});
			if (this.align) {
				var style1 = {
					"display" : ["-webkit-box", "-webkit-flex", "-ms-flex", "flex"],
					"-webkit-flex-direction" : "row",
					"-ms-flex-direction" : "row",
					"flex-direction" : "row",
				};
				ss += this.toStyle(style1);
				ss += "-webkit-justify-content:" + this.align + ";";
				ss += "-ms-justify-content:" + this.align + ";";
				ss += "justify-content:" + this.align + ";";
				ss += "-webkit-box-pack:" + this.align + ";";
			}
			ss += "\"";
			ss += ">";
			ss += "</footer>";
			var formId = this.form.id;
			var me = this;
			var element = $(ss);
			$("#"+ formId +" > form").append(element);
			me.on(element, "tap", function(ev) {
				me.trigger("onTap");
			});
			if (this.size != undefined && this.size.height != undefined){
				var section = $("#" + formId).find("section[data-role=section]");
				section.css("bottom", this.size.height);
			}
			var ctx = new NEST.c.com.nxstinc.nest.component.Context();
			ctx.parent = context;
			ctx.selector = element;
			ctx.component = this;
			NEST.inherited(this).paint.call(this, ctx);
		};
		// #ifdef designing
		// #endif designing
		return clazz;
	},
	Logic : function() {
		var clazz = function(id) {
			this.id = id;
			this.__params = {};
			this.__type = NEST.ComponentType.Logic;
			this.__children = [];
		};
		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.NonVisualComponent");
		clazz.prototype.paint = function(context) {
			var me = this;
			if (me.__created)
				return;
			me.__created = true;
			// #ifdef designing
			if (__designing) {
				var ss = "";
				ss += "<article id='" + this.id + "'";
				ss += " style='";
				ss += "'>";
				ss += "<form onsubmit='return false;'>";
				ss += "<section id='" + this.id + "_container' data-role='section'";
				ss += " style='";
				ss += "'>";
				ss += "<div data-role='container'";
				ss += " style='";
				ss += "-webkit-box-sizing: border-box;";
				ss += "-moz-box-sizing: border-box;";
				ss += "box-sizing: border-box;";
				ss += "overflow: hidden;";
				ss += "width: 100%;";
				ss += "height: 100%;";
				ss += "min-height: 320px;";
				ss += "'>";
				ss += "</div>";
				ss += "</section>";
				ss += "</form>";
				ss += "</article>";
				$(context.selector).append(ss);
			}
			// #endif designing
			for (var i = 0; i < this.__children.length; i++) {
				var c = this.__children[i];
				c.__index = i;
				c.paint(context);
			}
			me.trigger("onInit");
			if (!__designing)
				if (localStorage) {
					if (localStorage["__NEST." + me.id] === undefined) {
						localStorage["__NEST." + me.id] = 1;
						console.log("onFirstTime(" + me.id);
						me.trigger("onFirstTime");
					} else {
						localStorage["__NEST." + me.id] = parseInt(localStorage["__NEST." + me.id]) + 1;
					}
				} else {
					var rk = "__NEST." + me.id;
					var rv = document.cookie.replace(eval("/(?:(?:^|.*;\s*)"+rk+"\s*\=\s*([^;]*).*$)|^.*$/"), "$1");
					if (rv === "") {
						document.cookie = rk + "=" + 1;
						console.log("onFirstTime(" + me.id);
						me.trigger("onFirstTime");
					} else {
						document.cookie = rk + "=" + (parseInt(rv)+1);
					}
				}
		};
		clazz.prototype.add = function(child) {
			this.__children.push(child);
			child.parent = this;
		};
		clazz.prototype.count = function() {
			return this.__children.length;
		};
		clazz.prototype.get = function(index) {
			return this.__children[index];
		};
		clazz.prototype.removeAt = function(index) {
			this.__children.removeAt(index);
		};
		clazz.prototype.remove = function(id) {
			for ( var i = 0; i < this.__children.length; i++) {
				var c = this.__children[i];
				if (c.id == id) {
					this.__children.removeAt(i);
					break;
				}
			}
		};
		clazz.prototype.clear = function(id) {
			this.__children = [];
		};
		// #ifdef designing
		// #endif designing
		return clazz;
	},
});