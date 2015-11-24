package com.nestpia.nest.plugins;

import android.content.Intent;

/**
 * Created by john on 4/24/15.
 */
public class browseropen extends AbstractPlugin {

	@Override
	public void execute(String[] data) {
		final Intent i = new Intent(getContext(), WebViewActivity.class);
		i.putExtra("URL", data[0]);
		// i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		startActivityForResult(i, WebViewActivity.REQUEST_BROWSER_OPEN);
	}

	@Override
	public boolean onActivityResult(int requestCode, int resultCode, Intent intent) {
		if (requestCode == WebViewActivity.REQUEST_BROWSER_OPEN) {
			if (intent != null) {
				String data = intent.getStringExtra("data");
				android.util.Log.i("browseropen::onActivityResult", data);
				callbackWithObject(0, data);
			}
			return false;
		}
		return true;
	}

}
