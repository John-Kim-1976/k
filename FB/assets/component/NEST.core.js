/**
 * @author John Kim <john@nxstinc.com>
 * @see https://developer.mozilla.org/en-US/docs/Rhino/Scripting_Java
 */

'use strict';

var NEST = {
	/**
	 * NEST environments
	 */
	env : {
		v : 1.1, // NEST Version
		app : {
			name : "NEST",
			id : "com.nxstinc.nest.sample.App",
			version : "1.0.0",
			host : "http://localhost:8080/APPNAME/DSP",
			dir : "./",
			docdir : "./",
			tmpdir : "./",
		},
		os : {
			name : "",
			version : 0,
			vender : "",
		},
		browser : {
			type : 0,
			name : "",
			version : "",
		},
		device : {
			model : undefined,
			type : undefined,
			vendor : undefined,
		},
		language : "en",
		osScriptEnabled : 0,
	},

	/**
	 * Component registry
	 */
	c : {},
	
	xlib : {
		callback : function(func) {
			var min = 0, max = 9999999;
			var fk = "f" + Math.floor(Math.random() * (max - min)) + min;
			NEST.xlib[fk] = function(err, data) {
				func(err, data);
				delete NEST.xlib[fk];
			};
			return "NEST.xlib." + fk;
		},
	},

	/**
	 * Component definition constants and methods
	 */
	
	ComponentType : {
		Visual : (1<<1),
		NonVisual : (1<<2),
		Container : (1<<1) | (1<<3),
		ListView : (1<<1) | (1<<4),
		ListItem : (1<<1) | (1<<5),
		Data : (1<<2) | (1<<6),
		Form : (1<<1) | (1<<3) | (1<<15),
		Logic : (1<<2) | (1<<14),
	},

	define : function(namespace, clazz) {
		try {
			var n = eval("NEST.c." + namespace);
			if (n === undefined)
				throw undefined;
			return $.extend(true, n, clazz);
		} catch (E) {
			var t = namespace.split('.');
			var ns = "";
			for ( var i = 0; i < t.length; i++) {
				ns += "." + t[i];
				var expr = "";
				expr += "if (NEST.c" + ns + " === undefined)";
				expr += "  NEST.c" + ns + " = {};";
				// console.log("define namespace : " + ns);
				eval(expr);
			}
			var n = eval("NEST.c." + namespace);
			return $.extend(true, n, clazz);
		}
	},

	inherits : function(_super) {
		var p = undefined;
		if ((typeof _super) === "string") {
			p = (new (eval("new NEST.c." + _super)));
			p.__nsuper = _super;
			// console.log(_super);
		} else {
			console.warn("Editor disabled.");
			p = new _super();
		}

		return p;
	},

	inherited : function(THIS) {
		if (THIS.__proto__ && THIS.__proto__.__proto__)
		return THIS.__proto__.__proto__;		
		return (new (eval("new NEST.c." + THIS.__nsuper)));
	},

	create : function(C, id, params) {
		var clazz = undefined;
		if ((typeof C) === "string")
			clazz = eval("new NEST.c." + C + "();");
		else
			clazz = new C();

		if (clazz === undefined) {
			console.log(C.toString() + " not found");
			throw C.toString() + " not found";
		}

		var o = new clazz(id, params);
		o.__nclass = C;
		return o;
	},

	/**
	 * NEST init method
	 */
	init : function() {
		NEST.env.language = function() {
			if (typeof navigator === 'object') {
				if (navigator.language)
					return navigator.language;
				else if (navigator.browserLanguage)
					return navigator.browserLanguage;
				else if (navigator.systemLanguage)
					return navigator.systemLanguage;
				else if (navigator.userLanguage)
					return navigator.userLanguage;
			}
			return "en";
		}();

		var p = new UAParser();
		NEST.env.os = p.getOS();
		NEST.env.browser = p.getBrowser();
		NEST.env.device = p.getDevice();
		NEST.env.engine = p.getEngine();

		// console.log("----- NEST.init done -----");
	},
	
	loadJs : function(scriptId, src, onLoad) {
		var head = document.getElementsByTagName("head");
		var script = null;
		if ((script = document.getElementById(scriptId)) === null) {
			script = document.createElement("script");
			script.src = src;
			script.id = scriptId;
			script.onreadystatechange = script.onload = onLoad;
			$(script).attr("data-ref", "1");
			head[0].appendChild(script);
		} else {
			var sc = $(script);
			sc.attr("data-ref", 1 + parseInt(sc.attr("data-ref")));
			setTimeout(onLoad, 100);
		}
	},
	
	removeJs : function(scriptId) {
		var script = null;
		if ((script = document.getElementById(scriptId)) !== null) {
			var sc = $(script);
			var ref = parseInt(sc.attr("data-ref"));
			if (ref > 1) {
				sc.attr("data-ref", ref -1);
			} else {
				sc.remove();
			}
		}
	},

	loadStylesheet : function(styleId, href, onLoad) {
		var head = document.getElementsByTagName("head");
		var link = null;
		if ((link = document.getElementById(styleId)) === null) {
			link = document.createElement("link");
			link.rel = "stylesheet";
			link.media = "screen";
			link.type = "text/css";
			link.href = href;
			link.id = styleId;
			link.onreadystatechange = link.onload = onLoad;
			$(link).attr("data-ref", "1");
			head[0].appendChild(link);	
		} else {
			var sc = $(link);
			sc.attr("data-ref", 1 + parseInt(sc.attr("data-ref")));
			setTimeout(onLoad, 100);
		}
	},
	
	loadStylesheetInline : function(styleId, cssString, onLoad) {
		var head = document.getElementsByTagName("head");
		var link = null;
		if ((link = document.getElementById(styleId)) === null) {
			link = document.createElement("style");
			link.type = "text/css";
			if (link.styleSheet) {
				link.styleSheet.cssText = cssString;
			} else {
				link.appendChild(document.createTextNode(cssString));
			}
			link.id = styleId;
			link.onreadystatechange = link.onload = onLoad;
			$(link).attr("data-ref", "1");
			head[0].appendChild(link);	
		} else {
			var sc = $(link);
			sc.attr("data-ref", 1 + parseInt(sc.attr("data-ref")));
			setTimeout(onLoad, 100);
		}
	},
	
	removeStylesheet : function(styleId, href, onLoad) {
		var script = null;
		if ((script = document.getElementById(styleId)) !== null) {
			var sc = $(script);
			var ref = parseInt(sc.attr("data-ref"));
			if (ref > 1) {
				sc.attr("data-ref", ref -1);
			} else {
				sc.remove();
			}
		}
	},
};

NEST.init();

// -----

NEST.define("com.nxstinc.nest.component", {
	Context : function() {
		return {
			selector : undefined,
			component : undefined,
			parent : undefined,
		};
	},

	Component : function() {
		var clazz = function(id) {
			this.__nsuper = undefined;
			this.__nclass = undefined;
			this.id = id;
			this.version = 1.0;
			this.parent = undefined;
			this.form = undefined;
			this.__error = undefined;
		};
		
		var events = {};
		clazz.prototype.bind = function(name, handler) {
			if (events[name] === undefined) {
				events[name] = [];
			}
			events[name].push(handler);
		};
		
		clazz.prototype.unbind = function(name, handler) {
			var a = events[name];
			if (a !== undefined) {	
				var i = a.indexOf(handler);
				console.log("unbind : " + i);
				console.log(handler);
				if (i > 0)				
					a.removeAt(i);
			}
		};
		
		clazz.prototype.on = function(element, name, callback, stopPropagation) {
			if (__designing)
				return;
			// console.log("element.on : " + name);
			if ("tap" === name) {
				element.on("vclick", function(ev) {
					var _c = callback ? callback(ev) : true;
					if (stopPropagation || _c == false) {
						if (ev && ev.stopImmediatePropagation)
							ev.stopImmediatePropagation();
						return false;
					}
				});
			} else if ("doubletap" === name) {
				if (element.doubleTap)
				element.doubleTap(function(ev) {
					var _c = callback ? callback(ev) : true;
					if (stopPropagation || _c == false) {
						if (ev && ev.stopImmediatePropagation)
							ev.stopImmediatePropagation();
						return false;
					}
				});
			} else {
				element.on(name, function(ev) {
					var _c = callback ? callback(ev) : true;
					if (stopPropagation || _c == false) {
						if (ev && ev.stopImmediatePropagation)
							ev.stopImmediatePropagation();
						return false;
					}
				});
			}
		};

		clazz.prototype.trigger = function(name, param) {
			if (events[name] !== undefined) {
				var handlers = events[name];
				var sz = handlers.length;
				for ( var i = 0; i < sz; i++) {
					var h = handlers[i];
					h(param, this);
				}
			}
		};
		
		clazz.prototype.triggerCount = function(name) {
			if (events[name] !== undefined) {
				var handlers = events[name];
				return handlers.length;
			}
			return 0;
		};
		
		clazz.prototype.screenHeight = function() {
			return window.innerHeight
				|| document.documentElement.clientHeight
				|| document.body.clientHeight;
		};
		
		clazz.prototype.toStyle = function(style) {
			var ss = "";
			if (style && (typeof style === "object"))
				$.each(style, function(k, v) {
					if (Array.isArray(v))
						for (var i in v)
							ss += k + ":" + v[i] + ";";
					else
						ss += k + ":" + v + ";";
				});
			return ss;
		};
		
		clazz.prototype.toSafeStr = function(text) {
			return $("<div/>").text(text).html();
		};
		
		clazz.prototype.getGlobalMethod = function(name) {			
			return "__ns." + this.form.id + "." + this.id + "." + name;
		};
		
		clazz.prototype.scriptPath = function() {
		    var scriptPath = "";
		    var pathParts = [];
		    try {
		    	throw new Error();
		    } catch(e) {
		      var stackLines = e.stack.split('\n');
		      var callerIndex = 0;
		      for(var i in stackLines){
		        if(!stackLines[i].match(/http[s]?:\/\//) && !stackLines[i].match(/file:\/\//)) continue;
		        callerIndex = Number(i) + 2;
		        break;
		      }
		      pathParts = stackLines[callerIndex].match(/((http[s]?:\/\/.+\/)([^\/]+\.js)):/);
		      if (pathParts == null)
		    	  pathParts = stackLines[callerIndex].match(/((file?:\/\/.+\/)([^\/]+\.js)):/);
		    }
		    
		    return {
		    	fullPath : function() {
		    		return pathParts[1];
		    	},
				path : function() {
					return pathParts[2];
				},
				name : function() {
					return pathParts[3];
				},
		    };
		};

		// #ifdef designing
		clazz.prototype.valueChanged = function(key, value) {
		};
		// #endif designing

		return clazz;
	},

	VisualComponent : function() {
		var clazz = function(id) {
			this.id = id;
			this.__type = NEST.ComponentType.Visual;
		};

		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.Component");

		clazz.prototype.paint = function(context) {
			console.log("VisualComponent ---> paint : " + this.id);
		};

		return clazz;
	},

	ContainerComponent : function() {
		var clazz = function(id) {
			this.id = id;
			this.maxComponentsLimit = 1000;
			this.__type = NEST.ComponentType.Container;
			this.__children = [];
		};

		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.VisualComponent");

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

		clazz.prototype.paint = function(context) {
			for ( var i = 0; i < this.__children.length; i++) {
				var c = this.__children[i];
				c.paint(context);
			}
		};

		return clazz;
	},

	ListViewComponent : function() {
		var clazz = function(id) {
			this.id = id;
			this.maxComponentsLimit = 1000;
			this.__type = NEST.ComponentType.ListView;
			this.__children = [];
		};

		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.VisualComponent");

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
				var c = __children[i];
				if (c.id == id) {
					this.__children.removeAt(i);
					break;
				}
			}
		};

		clazz.prototype.clear = function(id) {
			this.__children = [];
		};

		clazz.prototype.paint = function(context) {
			for ( var i = 0; i < this.__children.length; i++) {
				var c = this.__children[i];
				c.__index = i;
				c.itemTemplate = this.itemTemplate;
				c.paint(context);
			}
		};
		
		clazz.__canDropItem = function(child) {
			var clazz = child.__nclass;
			return "com.nxstinc.nest.component.ListItemComponent" === clazz;
		};

		return clazz;
	},

	ListItemComponent : function() {
		var clazz = function(id) {
			this.id = id;
			this.__type = NEST.ComponentType.ListItem;
		};

		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.VisualComponent");

		clazz.prototype.paint = function() {
			console.log("ListItemComponent ---> paint : " + this.id);
		};

		return clazz;
	},

	NonVisualComponent : function() {
		var clazz = function(id) {
			this.id = id;
			this.__type = NEST.ComponentType.NonVisual;
		};

		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.Component");

		clazz.prototype.paint = function() {
			console.log("NonVisualComponent ---> paint : " + this.id);
		};

		return clazz;
	},

	DataStoreComponent : function() {
		var clazz = function(id) {
			this.id = id;
			this.__type = NEST.ComponentType.Data;
			this.__dataColumns = [];
		};

		clazz.prototype = NEST.inherits("com.nxstinc.nest.component.NonVisualComponent");

		clazz.prototype.paint = function(context) {
			console.log("DataStoreComponent ---> paint : " + this.id);
		};

		return clazz;
	},
});

var __gCallback = function(data) {
    console.log("__gCallback :: default");
};

var __xlibCallback = function(key, err, data) {
    var f = eval(key);
    if (typeof f === "function") {
    	f.call(this, err, data);    	
    } else {
        console.log("warn] __xlibCallback ( " + key + ", " + err + ", " + data);    	
    }
};

