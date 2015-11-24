/**
 * 
 */
package com.nestpia.nest.plugins;

import java.util.HashMap;
import java.util.Map.Entry;
import java.util.Set;

import com.facebook.AccessToken;
import com.facebook.FacebookRequestError;
import com.facebook.GraphRequest;
import com.facebook.GraphResponse;
import com.facebook.HttpMethod;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import android.content.Intent;
import android.os.Bundle;

/**
 * @author john
 *
 */
public class facebookgraphrequest extends FacebookPlugin {

	@SuppressWarnings("unchecked")
	@Override
	public void execute(String[] data) {
		String graphPath = data[0];
		HashMap<String, String> m = new HashMap<String, String>();
		if (data.length > 1 && data[1] != null) {
			Gson g = new GsonBuilder().create();
			m = g.fromJson(data[1], m.getClass());
		}

		Bundle p = new Bundle();
		if (m != null) {
			Set<Entry<String, String>> entries = m.entrySet();
			for (Entry<String, String> e : entries) {
				p.putString(e.getKey(), e.getValue());
			}
		}

		new GraphRequest(AccessToken.getCurrentAccessToken(), graphPath, p, HttpMethod.GET, new GraphRequest.Callback() {
			@Override
			public void onCompleted(GraphResponse response) {
				FacebookRequestError error = response.getError();
				if (error != null && error.getErrorCode() > 0) {
					callbackWithMessage(error.getErrorCode(), error.getErrorMessage());
				} else {
					callbackWithObject(0, response.getRawResponse());
				}
			}
		}).executeAsync();
	}

	@Override
	public boolean onActivityResult(int requestCode, int resultCode, Intent intent) {
		return false;
	}
}
