/**
 * 
 */
package com.nestpia.nest.plugins;

import com.facebook.AccessToken;

import android.content.Intent;

/**
 * @author john
 *
 */
public class facebookstatus extends FacebookPlugin {

	@Override
	public void execute(String[] data) {
		AccessToken atk = AccessToken.getCurrentAccessToken();
		if (me != null && atk != null && !atk.isExpired())
			callbackWithObject(0, me);
		else
			callbackWithMessage(1, null);
	}

	@Override
	public boolean onActivityResult(int requestCode, int resultCode, Intent intent) {
		return false;
	}
}
