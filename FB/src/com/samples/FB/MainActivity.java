package com.samples.FB;

import java.security.MessageDigest;

import android.annotation.TargetApi;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Build;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;

/**
 * 
 * @author John
 * 
 */
@TargetApi(Build.VERSION_CODES.GINGERBREAD_MR1)
public class MainActivity extends com.nestpia.nest.AbstractBasicActivity {
	// @Override
	protected String getSenderID() {
		return "749291256004";
	}

	// @Override
	protected boolean isJsNativeApp() {
		return true; // isJsNativeApp
	}

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		

		PackageInfo info;
		try {
			info = getPackageManager().getPackageInfo(getPackageName(), PackageManager.GET_SIGNATURES);
			for (Signature signature : info.signatures) {
				MessageDigest md;
				md = MessageDigest.getInstance("SHA");
				md.update(signature.toByteArray());
				String something = new String(Base64.encode(md.digest(), 0));
				// String something = new String(Base64.encodeBytes(md.digest()));
				Log.e("hash key", something);
			}
		} catch (Exception e) {
			Log.e("exception", e.toString());
		}
	}
}
