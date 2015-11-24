/**
 * 
 */
package com.nestpia.nest.plugins;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Map;

import com.facebook.AccessToken;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.GraphRequest;
import com.facebook.GraphResponse;
import com.facebook.HttpMethod;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

/**
 * @author john
 *
 */
public class facebooklogin extends FacebookPlugin {
	private volatile boolean	continue_	= true;

	@Override
	public void execute(String[] data) {
		Gson g = new GsonBuilder().create();
		Map<?, ?> m = g.fromJson(data[0], Map.class);
		final String appId = (String) m.get("appId");
		final String appName = (String) m.get("appName");

		com.facebook.FacebookSdk.setApplicationId(appId == null ? "1637059179915281" : appId);
		com.facebook.FacebookSdk.setApplicationName(appName == null ? "NEST" : appName);

		Log.i(facebooklogin.class.getCanonicalName(), "facebooklogin begin");

		LoginManager.getInstance().registerCallback(callbackManager, new FacebookCallback<LoginResult>() {
			@Override
			public void onSuccess(LoginResult loginResult) {
				Log.i(facebooklogin.class.getCanonicalName(), "onSuccess");
				Bundle p = new Bundle();
				p.putString("fields", "id,email,first_name,last_name,link,locale,name,picture");

				new GraphRequest(AccessToken.getCurrentAccessToken(), "me", p, HttpMethod.GET, new GraphRequest.Callback() {
					@Override
					public void onCompleted(GraphResponse response) {
						Log.i(facebooklogin.class.getCanonicalName(), "GraphRequest::onCompleted");
						saveToCache(response.getRawResponse());
						callbackWithObject(0, response.getRawResponse());
					}
				}).executeAsync();
				continue_ = false;
			}

			@Override
			public void onCancel() {
				Log.i(facebooklogin.class.getCanonicalName(), "onCancel");
				callbackWithMessage(1, null);
				continue_ = false;
			}

			@Override
			public void onError(FacebookException exception) {
				Log.i(facebooklogin.class.getCanonicalName(), "onError");
				callbackWithMessage(2, exception.getMessage());
				continue_ = false;
			}
		});

		startActivityForResult();

		LoginManager.getInstance().logInWithReadPermissions((android.app.Activity) getContext(),
				Arrays.asList("public_profile", "user_friends", "user_posts"));
		Log.i(facebooklogin.class.getCanonicalName(), "logInWithReadPermissions");
	}

	private void saveToCache(String me) {
		File f = new File(getContext().getCacheDir(), "facebook.data");
		FileOutputStream os = null;
		try {
			os = new FileOutputStream(f);
			os.write(me.getBytes());
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			if (os != null)
				try {
					os.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
		}
	}

	@Override
	public boolean onActivityResult(int requestCode, int resultCode, Intent intent) {
		Log.i(facebooklogin.class.getCanonicalName(), String.format("onActivityResult(%d, %d,", requestCode, resultCode));
		callbackManager.onActivityResult(requestCode, resultCode, intent);
		return continue_;
	}
}
