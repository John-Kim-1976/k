/**
 * 
 */
package com.nestpia.nest.plugins;

import java.util.ArrayList;
import java.util.Arrays;

import com.nestpia.nest.ActivityResultListener;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.webkit.WebView;

/**
 * @author john
 *
 */
@SuppressLint({ "DefaultLocale", "NewApi" })
public class PluginAdapter extends ArrayList<ActivityResultListener> {
	/** */
	private static final long	serialVersionUID	= 2241614314909146117L;
	private Context				context;
	private WebView				view;

	public void invoke(String... a) {
		try {
			if (a != null && a.length > 0) {
				Class<?> clazz = Class.forName("com.nestpia.nest.plugins." + a[0].toLowerCase().replace(".", ""));
				com.nestpia.nest.plugins.AbstractPlugin plugin = (com.nestpia.nest.plugins.AbstractPlugin) clazz.newInstance();
				plugin.context = context;
				plugin.view = view;
				plugin.fKey = a[1];
				plugin.activityResultListenerList = this;

				String[] extra = Arrays.copyOfRange(a, 2, a.length);
				plugin.init();
				plugin.execute(extra);
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	public Context getContext() {
		return context;
	}

	public void setContext(Context context) {
		this.context = context;
	}

	public WebView getView() {
		return view;
	}

	public void setView(WebView view) {
		this.view = view;
	}

	public void onActivityResult(int requestCode, int resultCode, Intent intent) {
		for (int i = size() - 1; i >= 0; i--) {
			// Log.i("Main::onActivityResult Listener",
			// String.format("index: %d", i));
			ActivityResultListener listener = get(i);
			listener.onActivityResult(requestCode, resultCode, intent);
		}
	}
}
