/**
 * 
 */
package com.nestpia.nest;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Bundle;
import android.webkit.WebView;

/**
 * @author john
 *
 */
@SuppressLint("NewApi")
public class GcmAdapter {

	public GcmAdapter(Context context, String senderID, WebView webView) {
	}

	public void onCreate(Bundle savedInstanceState) {
	}

	public boolean checkPlayServices() {
		return true;
	}

	public void onPageLoadFinished() {
	}
}
