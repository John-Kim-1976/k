package com.nestpia.nest.plugins;

import android.content.Intent;

/**
 * Created by john on 4/2/15.
 */
public class sendobject extends AbstractPlugin {

	public void execute(String[] data) {
		if (data != null && data.length > 0) {
			// http://developer.android.com/training/sharing/send.html
			Intent sendIntent = new Intent();
			sendIntent.setAction(Intent.ACTION_SEND);
			sendIntent.putExtra(Intent.EXTRA_TEXT, data[0]);
			sendIntent.setType("text/plain");
			sendIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_MULTIPLE_TASK);
			// context.startActivity(Intent.createChooser(sendIntent, "Share"));
			startActivity(sendIntent);
		}

		callbackWithMessage(0, null);
	}

	@Override
	public boolean onActivityResult(int requestCode, int resultCode, Intent intent) {
		return false;
	}
}
