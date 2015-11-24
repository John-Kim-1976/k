/**
 * 
 */
package com.nestpia.nest.plugins;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;

/**
 * 
 * @author john
 *
 */
public abstract class FacebookPlugin extends AbstractPlugin {
	static CallbackManager	callbackManager;

	static String			access_token	= null;
	static long				expires_in		= 0;
	static long				access_time		= 0;
	String					me				= null;

	@Override
	public void init() {
		if (!FacebookSdk.isInitialized()) {
			FacebookSdk.sdkInitialize(getContext());
		}
		if (callbackManager == null) {
			callbackManager = CallbackManager.Factory.create();
		}

		loadSession();
	}

	private void loadSession() {
		FileInputStream in = null;
		BufferedReader rdr = null;
		try {
			File f = new File(getContext().getCacheDir(), "facebook.data");
			if (f.exists()) {
				StringBuilder s = new StringBuilder();
				in = new FileInputStream(f);
				rdr = new BufferedReader(new InputStreamReader(in));
				String l = null;
				while ((l = rdr.readLine()) != null) {
					s.append(l).append("\n");
				}
				me = s.toString();
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			if (in != null)
				try {
					rdr.close();
					in.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
		}
	}
}
