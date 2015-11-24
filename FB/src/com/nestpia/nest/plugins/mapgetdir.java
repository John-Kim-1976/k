package com.nestpia.nest.plugins;

import android.content.Intent;
import android.net.Uri;

/**
 * Created by john on 4/2/15.
 */
public class mapgetdir extends AbstractPlugin {

	@Override
	public void execute(String[] data) {
		if (data != null && data.length >= 2) {
			String l = String.format("geo:%s,%s", data[0], data[1]);

			Intent intent = new Intent(android.content.Intent.ACTION_VIEW, Uri.parse(l));
			intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_MULTIPLE_TASK);
			startActivity(intent);
		}

		callbackWithMessage(0, null);
	}

	@Override
	public boolean onActivityResult(int requestCode, int resultCode, Intent intent) {
		return false;
	}

}
