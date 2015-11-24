var app = NEST.create("com.nxstinc.nest.component.Application", "app");
//app.debug = true;

var __ns = {
	app : app,
	main : {},
};

var onCreate_main = function(prevForm, __params) {
	if (__ns.main.main !== undefined)
		return __ns.main.main;

	var form = __ns.main.main = NEST.create("com.nxstinc.nest.component.Form", "main");
	app.add(form);
	form.prevForm = prevForm;
	form.__attrs = 3;
	form.__params = __params;
	//console.log(__params);


	var login1 = __ns.main.login1 = NEST.create("com.nxstinc.nest.component.facebook.Login", "login1");
	form.add(login1);
	login1.form = form;
	login1.appName = "NEST";
	login1.appId = "1637059179915281";
	login1.appSecret = "a4b6c9c71543803901dd5e22d2c46373";

	var posts1 = __ns.main.posts1 = NEST.create("com.nxstinc.nest.component.facebook.Posts", "posts1");
	form.add(posts1);
	posts1.form = form;

	var header1 = __ns.main.header1 = NEST.create("com.nxstinc.nest.component.Header", "header1");
	form.add(header1);
	header1.form = form;
	header1.text = "Facebook";

	var button1 = __ns.main.button1 = NEST.create("com.nxstinc.nest.component.Button", "button1");
	header1.add(button1);
	button1.form = form;
	button1.text = "Login";

	var button2 = __ns.main.button2 = NEST.create("com.nxstinc.nest.component.Button", "button2");
	header1.add(button2);
	button2.form = form;
	button2.text = "Logout";
	button2.floating = "right";

	var scrollpanel1 = __ns.main.scrollpanel1 = NEST.create("com.nxstinc.nest.component.layout.ScrollPanel", "scrollpanel1");
	form.add(scrollpanel1);
	scrollpanel1.form = form;
	scrollpanel1.size = {width : "100%", height : "100%"};

	var panel_me = __ns.main.panel_me = NEST.create("com.nxstinc.nest.component.layout.Panel", "panel_me");
	scrollpanel1.add(panel_me);
	panel_me.form = form;
	panel_me.display = "block";

	var line1 = __ns.main.line1 = NEST.create("com.nxstinc.nest.component.basic.Line", "line1");
	panel_me.add(line1);
	line1.form = form;

	var image1 = __ns.main.image1 = NEST.create("com.nxstinc.nest.component.Image", "image1");
	panel_me.add(image1);
	image1.form = form;
	image1.dataImage = "picture";

	var line2 = __ns.main.line2 = NEST.create("com.nxstinc.nest.component.basic.Line", "line2");
	panel_me.add(line2);
	line2.form = form;

	var label1 = __ns.main.label1 = NEST.create("com.nxstinc.nest.component.Label", "label1");
	panel_me.add(label1);
	label1.form = form;
	label1.dataText = "email";

	var line3 = __ns.main.line3 = NEST.create("com.nxstinc.nest.component.basic.Line", "line3");
	panel_me.add(line3);
	line3.form = form;

	var label2 = __ns.main.label2 = NEST.create("com.nxstinc.nest.component.Label", "label2");
	panel_me.add(label2);
	label2.form = form;
	label2.dataText = "name";

	var listview1 = __ns.main.listview1 = NEST.create("com.nxstinc.nest.component.list.ListView", "listview1");
	scrollpanel1.add(listview1);
	listview1.form = form;
	listview1.dataText = "story";
	listview1.dataTitle = "message";
	listview1.dataDate = "created_time";

	// referenced properties
	image1.dataStore = login1;
	label1.dataStore = login1;
	label2.dataStore = login1;
	listview1.dataStore = posts1;
	// events
	form.bind("onInit", function(ev) {
		//login1.validate(arguments);
	});
	login1.bind("onLogin", function(ev) {
		//posts1.take(arguments);
	});
	button1.bind("onTap", function(ev) {
		//login1.login(arguments);
		var fk = NEST.xlib.callback(function(err, data) {
			console.log(err);
			console.log(data);
		});
		NEST.xlib.execute("googleplus.login", fk, undefined);
	});
	button2.bind("onTap", function(ev) {
		//login1.logout(arguments);
	});
	form.bind("onDestroy", function(ev) {
		__ns.main = { create : onCreate_main };
	});

	return form;
}


/* app start */
$(document).ready(function(ev) {
	NEST.env.app.id = "com.samples.FB";
	NEST.env.app.name = "FB";
	NEST.env.app.version = "1.0.0";
	NEST.env.app.date = "2015-11-18T13:21:58Z";
	NEST.env.app.host = "http://localhost";
	NEST.env.app.nativeApp = true;

	__ns.main.create = onCreate_main;

	__Nav.init(onCreate_main());
	// app start
	app.run();

	if (app.debug) console.log(__ns);
});
