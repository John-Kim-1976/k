/**
 * Form Navigator
 *  
 * @author John Kim <john@nxstinc.com>
 */
NEST.define("com.nxst.nest.component", {
	Navigator : function() {
		var clazz = function() {			
			this.forms = [];
			this.fLogin = undefined;
			this.tick = 0;
			this.moving = false;
			this.procActTime = this.lastActTime = new Date().getTime();
		};

		var FORM_TYPE_ATTR_HOME		= (1 << 0);
		var FORM_TYPE_ATTR_START	= (1 << 1);
		var FORM_TYPE_ATTR_LOGIN	= (1 << 2);
		var FORM_TYPE_ATTR_LAYER	= (1 << 3);

		clazz.prototype.init = function(start) {
			if (start && start.__type !== NEST.ComponentType.Logic)
			this.forms.push(start);
			start.__zIndex = 0;
		};
				
		clazz.prototype.show1 = function(dest, fDone) {
			var me = this;
			
			if (me.tick > 0 && me.moving && ((new Date()) - me.tick) < 500) {
//				setTimeout(function() {
//					me.show1(dest);
//				}, 600);
				return;
			}

			var current = me.current();
			this.tick = new Date();	
			this.moving = true;
			
			if (current !== dest) {
				dest.__zIndex = current.__zIndex+1;
				app.update();
				this.forms.push(dest);

				if (!current) {
					this.moving = false;
					return;
				}

				$("#"+current.id).hide();	
			}
		};
		
		clazz.prototype.show2 = function(dest, fDone) {
			var me = this;			
			if (dest.onTop === true) {
				app.update();
				return;
			}
			
			if (me.moving && ((new Date()) - me.tick) < 500) {
//				setTimeout(function() {
//					me.show2(dest);
//				}, 600);
				return;
			}
			
			var current = me.current();			
			if (current !== dest) {				
				this.tick = new Date();	
				this.moving = true;
			
				dest.__zIndex = current.__zIndex+2;			
				app.update();
				this.forms.push(dest);					
				me.moving = false;
			}
		};

		clazz.prototype.move = function(dest, fDone) {
			this.show(dest, fDone);
		};
		
		clazz.prototype.show = function(dest, fDone) {
			this.lastActTime = new Date().getTime();
			
			if (dest.__type === NEST.ComponentType.Logic)
				dest.paint();
			else if ((dest.__attrs & FORM_TYPE_ATTR_LAYER) === 0)
				this.show1(dest, fDone);
			else
				this.show2(dest, fDone);
		};
				
		clazz.prototype.swap = function(dest) {
			this.lastActTime = new Date().getTime();
			
			if (this.moving && ((new Date()) - this.tick) < 2000) 
				return;				
			this.tick = new Date();	
			this.moving = true;

			var current = this.current();				
			if ((current.__attrs & FORM_TYPE_ATTR_HOME) > 0) {
				this.moving = false;
				return;
			}

			this.forms.pop();
			current.back();
			current.destroy();
			
			this.moving = false;			
			this.show1(dest, function() { });	
		};		

		clazz.prototype.back = function(step) {
			this.lastActTime = new Date().getTime();
			
			//if (this.moving && ((new Date()) - this.tick) < 300) 
			//	return;				
			//this.tick = new Date();	
			//this.moving = true;
				
			var sz = this.forms.length;
			
			step = (sz - step) > 0 ? step : 1;			
			for (var i = sz-1; i >= 1 && step > 0; i--, step--) {
				var restored = this.prev();
				var current = this.current();
				current.bind("onBack", function(ev) {
					current.destroy();
				});
				current.back(step == 1);
				this.forms.pop();
				current = this.current();
				$("#"+restored.id).show();
				restored.resume();
			}
		};

		clazz.prototype.home = function() {
			this.lastActTime = new Date().getTime();
			
//			if (this.moving && ((new Date()) - this.tick) < 2000) 
//				return;				
//			this.tick = new Date();	
//			this.moving = true;

			var sz = this.forms.length;
			for (var i = sz-1; i > 0; i--) {
				var current = this.current();				
				if ((current.__attrs & FORM_TYPE_ATTR_HOME) > 0 || i == 0)
					break;

				var restored = this.prev();		
				this.forms.pop();
				current.back({silent: true});
				current.destroy();
			}
			$("#"+this.current().id).show();	
			this.current().resume();
			this.moving = false;
		};

		clazz.prototype.login = function() {
			this.lastActTime = new Date().getTime();
			
			if (this.fLogin != undefined) {
				var current = this.current();
				var newForm = this.fLogin(current);
				this.move(newForm);
			}
		};

		clazz.prototype.current = function() {
			var sz = this.forms.length;
			if (sz > 0) {
				return this.forms[sz - 1];
			}
			return undefined;
		};

		clazz.prototype.prev = function() {
			var sz = this.forms.length;
			if (sz > 1) {
				return this.forms[sz - 2];
			}
			return undefined;
		};
		
		clazz.prototype.canBack = function() {
			var sz = this.forms.length;
			return (sz > 1);
		};
		
		return new clazz();
	}(),
});

var __Nav = NEST.c.com.nxst.nest.component.Navigator;

var __show = function(target) {
	//console.log(target);
	if (target === undefined)
		return;
	
	var thisForm = __Nav.current();
	if (thisForm.id !== target) {
		var fTarget = eval("__ns." + target);
		if (fTarget && (typeof fTarget.create === "function")) {
			__Nav.show(fTarget.create(thisForm, {caller: thisForm.id, form: thisForm, params : {} }));
		}
	}
};

var __exit = function() {
	try {
		window.external.notify("exit");
	 } catch (ex) {}
	if (__Android && __Android.exit)
		__Android.exit();
};

var __back = function() {
	if (__Nav.canBack()) {
		__Nav.back(1);
		return true;
	}
	__exit();

	return false;
};
