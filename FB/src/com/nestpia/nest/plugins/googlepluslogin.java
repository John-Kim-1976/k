/**
 * 
 */
package com.nestpia.nest.plugins;

import com.google.android.gms.common.api.GoogleApiClient;

import android.content.Intent;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;

/**
 * @author john
 *
 */
public class googlepluslogin extends AbstractPlugin implements android.widget.AdapterView.OnItemClickListener {

	@Override
	public void execute(String[] data) {
		Log.i(googlepluslogin.class.getName(), "googlepluslogin::execute");

//		GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN).requestEmail().build();
//		// [END configure_signin]
//
//		// [START build_client]
//		// Build a GoogleApiClient with access to the Google Sign-In API and the
//		// options specified by gso.
//		mGoogleApiClient = new GoogleApiClient.Builder(this)
//				.enableAutoManage(this /* FragmentActivity */, this /* OnConnectionFailedListener */).addApi(Auth.GOOGLE_SIGN_IN_API, gso)
//				.build();
	}

	@Override
	public boolean onActivityResult(int requestCode, int resultCode, Intent intent) {
		return false;
	}

	@Override
	public void onItemClick(AdapterView<?> arg0, View arg1, int arg2, long arg3) {
	}

}
