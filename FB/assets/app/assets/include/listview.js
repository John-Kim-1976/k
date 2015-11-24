

var imageTitleListItemRender = function(me, swipe) {
    var image = me.image;
    var title = me.title;
    var text = me.text;
    var ss = "";
    ss += "<div style='position:relative;display:inline-block;font-size:15px;color:#575B5D; width:100%; height:44px; line-height:44px; text-align:left;'>";
    if (image) {
        ss += "<img src='" + image + "' style='vertical-align: middle;width:24px;height:24px;margin: 0 10px 0 10px'>";
    }
    ss += me.toSafeStr(title);
    if (text && text !== "") {
        ss += "<span style='padding:0;margin:0'>";
        ss += text;
        ss += "</span>";
    }
    
    ss += "<img src='assets/images/arrow-right.png' style='position: absolute; bottom:4px; right:0; width:16px'>";
    
    ss += "</div>";
    return $(ss);
};

var tiledListItemRender = function(me) {
	try {
		//swipe = true;
		var image = me.image;
		var title = me.title;
		var __data = me.__data;
		//console.log(__data);
		
		var wrap = "<div ";
		wrap += "style='";
		wrap += me.toStyle({
				//"background-color" : "#fff",
				position : "relative",
				padding : "4px",
				display: "block",
		});
		wrap += "'";
		wrap += "></div>";	
		var $wrap = $(wrap);
		me.__element.append($wrap);

		var s1 = $("<div style='width:100%;'></div>");
		$wrap.append(s1);
				
		var s2 = $("<div style='margin:0'></div>");
		s1.append(s2);
		
		if (!image)
			image = "assets/system/noimage.png";			
		s2.append("<img src='"+image+"' style='width:56px'>");
		
		var s3 = $("<div style='margin:0;width:56px'></div>");
		s1.append(s3);

		if (title) {
			var st = me.toStyle({
				margin: 0,
				padding: 0,
				"font-size": "15px",
				"color": "#575B5D",
				"white-space": "nowrap",
				"overflow": "hidden",
				"text-overflow": "ellipsis",
				"display": "block",
			});
			s3.append("<span style='"+st+"'>"+me.toSafeStr(title)+"</span>");
		}
		
		return $wrap;		
	} catch(E) {
		console.log(E);
	}
};

var complexListItemRender = function(me, swipe) {
	try {
		//swipe = true;
		var image = me.image;
		var title = me.title;
		var text = me.text;
		var name = me.name;
		var date = me.date;
		var email = me.email;
		var desc = me.description;
		var __data = me.__data;
		//console.log(__data);
		
		var wrap = "<div ";
		wrap += "style='";
		wrap += me.toStyle({
				//"background-color" : "#fff",
				position : "relative",
				width : "100%",
				margin : "5px auto 0 auto",
				display: "block",
				"min-height": "80px",
		});
		wrap += "'";
		wrap += "></div>";	
		var $wrap = $(wrap);
		me.__element.append($wrap);

		var s1 = $("<div style='height:80px; width:100%;'></div>");
		$wrap.append(s1);
		
		var s2 = $("<div style='z-index: 1; position: absolute; width:100%; height:80px; display:flex; display:-webkit-flex; display:-ms-flex; '></div>");
		s1.append(s2);
				
		var s3 = $("<div style='width:56px; height:56px; margin: 12px 6px'></div>");
		s2.append(s3);
		
		if (!image)
			image = "assets/system/noimage.png";			
		s3.append("<img src='"+image+"' style='width:56px;height:56px'>");

		var s4 = $("<div style='position:absolute;left:68px;top:0;right:0;bottom:0'></div>");
		s2.append(s4);

		var s5 = $("<div style='margin:8px 6px 0 0;padding:0;text-align:left;'></div>");
		s4.append(s5);
		
		if (title) {
			var st = me.toStyle({
				margin: 0,
				padding: 0,
				"font-size": "15px",
				"color": "#575B5D",
				"white-space": "nowrap",
				"overflow": "hidden",
				"text-overflow": "ellipsis",
				"display": "block",
			});
			s5.append("<span style='"+st+"'>"+me.toSafeStr(title)+"</span>");
		}
		if (text) {
			var st = me.toStyle({
				margin: 0,
				padding: 0,
				"font-size": "13px",
				"color": "#999",
				"white-space": "pre-wrap",
				"overflow": "hidden",
				"text-overflow": "ellipsis",
				"display": "block",
			});
			s5.append("<span style='"+st+"'>"+me.toSafeStr(text)+"</span>");
		}
		if (date) {
			var ss = "<div style='position: absolute; bottom:8px;'>";
			ss += "<span style='font-size: 12px;color:#999'>"+__toDateFormat(date)+"</span>";
			ss += "</div>";
			s4.append(ss);
		}
		s2.append("<img src='assets/images/arrow-right.png' style='position: absolute; bottom:4px; right:0; width:16px'>");
		
		if (swipe !== false) {
			s2.css("z-index", 1);
			
			var s11 = $("<div style='position: absolute; width:100%; height:80px;'></div>");
			s1.append(s11);
			
			var s12 = $("<button class='listitem_delete' style='float: right; width:80px; height:100%'>Delete</button>");
			s11.append(s12);
		
			me.on(s12, "tap", function(ev) {
				ev.stopPropagation();
				//alert(title);
				me.select(true);
				me.parent.selectionChanged(me);
				me.trigger("onCommand1");
				me.parent.trigger("onCommand1");
			});
			me.on(s2, "tap", function(ev) {
				if (s2.css("left") === "-95px") {
					ev.stopImmediatePropagation();
					return false;
				}
			});
			
			__setupListItemSwipe(me, s2, s11);
		}
						
		if (desc) {	
			var st = me.toStyle({
				//"background-color" : "#fff",
				width : "100%",
				margin : "5px auto 5px auto",
				"white-space": "pre-wrap",
				"word-wrap": "break-word",
				overflow: "hidden",
				"text-overflow": "ellipsis",
				"text-align": "left",
				"font-size": "13px",
				"color": "#999",
				display: "block",
			});
			
			var dsc = $("<div style='"+st+"'></div>");
			dsc.text(desc);
			$wrap.append(dsc);
		}
		
		return $wrap;		
	} catch(E) {
		console.log(E);
	}
};


var imageSlideListItemRender = function(me) {
    var image = me.image;
    var title = me.title;
    var ss = "";
    ss += "<div style='position:relative'>";
    if (image) {
        ss += "<img src='" + image + "' style='max-width:100%;max-height:100%;margin:0 auto'>";
    }
    if (title && title !== "") {
        ss += "<div style='position:absolute;bottom:0;width:100%;height:30px;line-height:30px;overflow:hidden;z-index:2;background-color:rgba(0,0,0,0.5);color:#fff;text-align:center;'>";
        ss += me.toSafeStr(title);
        ss += "</div>";
    }    
    ss += "</div>";
    return $(ss);
};


// ------------------------ support function --------------------------------------------

var __toDateFormat = function(date) {
	try {
		var d = new Date(Date.parse(date));
		d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
		return (d).toDateShortString();
	} catch(E) {}
	return date;
};

var __setupListItemSwipe = function(me, sel, bk) {
	if (bk) bk.hide();
	
	sel.on("swiperight", function(ev) {
		sel.animate({left:'0'}, 350, function() {
			if (bk) bk.hide();
		});
		ev.stopImmediatePropagation();
		return false;
	});
	sel.on("swipeleft", function(ev) {
		sel.animate({left:'-95px'}, 350);  
		if (bk) bk.show();
		ev.stopImmediatePropagation();
		return false;
	});

};

