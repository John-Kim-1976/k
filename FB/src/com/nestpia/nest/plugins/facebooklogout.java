/**
 * 
 */
package com.nestpia.nest.plugins;

import java.io.File;

import com.facebook.login.LoginManager;

import android.content.Intent;

/**
 * @author john
 *
 */
public class facebooklogout extends FacebookPlugin {

	@Override
	public void execute(String[] data) {
		LoginManager.getInstance().logOut();
		File f = new File(getContext().getCacheDir(), "facebook.data");
		f.delete();
		callbackWithMessage(0, null);
	}

	@Override
	public boolean onActivityResult(int requestCode, int resultCode, Intent intent) {
		return false;
	}
}
