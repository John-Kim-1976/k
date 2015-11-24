package com.nestpia.nest.plugins;

import java.util.ArrayList;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.nestpia.nest.ActivityResultListener;

import android.content.Context;
import android.content.Intent;
import android.webkit.WebView;

/**
 * Created by John on 1/7/2015.
 */
public abstract class AbstractPlugin {
	Context								context;
	WebView								view;
	String								fKey;
	ArrayList<ActivityResultListener>	activityResultListenerList;

	public WebView getWebView() {
		return this.view;
	}

	public Context getContext() {
		return this.context;
	}

	public String getKey() {
		return fKey;
	}

	// --

	public void init() {
	}

	public abstract void execute(String[] data);

	// --

	protected void startActivity(Intent intent) {
		getContext().startActivity(intent);
	}

	protected void startActivityForResult() {
		activityResultListenerList.add(new ActivityResultListener() {
			@Override
			public void onActivityResult(int requestCode, int resultCode, Intent intent) {
				boolean continue_ = AbstractPlugin.this.onActivityResult(requestCode, resultCode, intent);
				if (!continue_) {
					activityResultListenerList.remove(this);
				}
			}
		});
	}

	protected void startActivityForResult(Intent intent, int requestCode) {
		startActivityForResult();

		((android.app.Activity) getContext()).startActivityForResult(intent, WebViewActivity.REQUEST_BROWSER_OPEN);
	}

	/**
	 * 
	 * @param requestCode
	 * @param resultCode
	 * @param intent
	 * @return continue monitor the next ActivityResult
	 */
	public abstract boolean onActivityResult(int requestCode, int resultCode, Intent intent);

	// --

	private String escapeJavaScript(String s) {
		// org.apache.commons.lang3.StringEscapeUtils.escapeEcmaScript
		// return org.apache.commons.lang.StringEscapeUtils.escapeJavaScript(s);
		if (s != null) {
			StringBuilder ret = new StringBuilder();
			for (int i = 0; i < s.length(); i++) {
				char c = s.charAt(i);
				if (c == '\\') {
					ret.append("\\\\");
				} else if (c == '"') {
					ret.append("\\\"");
				} else if (c >= 0x20 && c <= 0x7E) {
					// if it is a printable ASCII character (other than \ and
					// "), append directly
					ret.append(c);
				} else {
					// if it is not printable standard ASCII, append as a
					// unicode escape sequence
					ret.append(String.format("\\u%04X", (int) c));
				}
			}
			return ret.toString();
		}
		return null;
	}

	protected void callbackWithMessage(final int err, final String message) {
		view.post(new Runnable() {
			@Override
			public void run() {
				String d = escapeJavaScript(message);
				view.loadUrl(String.format("javascript:__xlibCallback(\"%s\", %d, \"%s\")", fKey, err, d));
			}
		});
	}

	protected void callbackWithObject(final int err, final Object data) {
		view.post(new Runnable() {
			@Override
			public void run() {
				String d = null;
				if (null != data) {
					if (data instanceof String) {
						d = (String) data;
					} else {
						Gson g = new GsonBuilder().create();
						d = g.toJson(data);
					}
				}
				view.loadUrl(String.format("javascript:__xlibCallback(\"%s\", %d, %s)", fKey, err, d != null ? d : "undefined"));
			}
		});
	}
}
