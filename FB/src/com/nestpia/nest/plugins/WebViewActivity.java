package com.nestpia.nest.plugins;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.Window;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.net.Uri;

/**
 * Created by john on 4/24/15.
 */
@SuppressLint({ "NewApi", "SetJavaScriptEnabled", "SdCardPath" })
@SuppressWarnings("deprecation")
public class WebViewActivity extends android.app.Activity {
	final static int REQUEST_BROWSER_OPEN = 2001;

	protected WebView webView;
	private String initURL;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		super.requestWindowFeature(Window.FEATURE_NO_TITLE);

		initURL = getIntent().getStringExtra("URL");

		android.webkit.CookieManager.getInstance().setAcceptCookie(true);
		webView = new WebView(this);
		setContentView(webView);

		WebSettings wset = webView.getSettings();
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT)
			wset.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.SINGLE_COLUMN);

		wset.setJavaScriptEnabled(true);
		wset.setAllowFileAccess(true);
		wset.setLoadsImagesAutomatically(true);
		wset.setGeolocationEnabled(true);
		wset.setJavaScriptCanOpenWindowsAutomatically(true);
		wset.setPluginState(WebSettings.PluginState.ON);

		wset.setAppCacheEnabled(true);
		wset.setDatabaseEnabled(true);
		wset.setDomStorageEnabled(true);
		if (Build.VERSION.SDK_INT < Build.VERSION_CODES.KITKAT) {
			webView.getSettings().setDatabasePath(
					"/data/data/" + webView.getContext().getPackageName()
							+ "/databases/");
		}
		wset.setGeolocationDatabasePath(webView.getContext().getFilesDir()
				.getPath());

		webView.setHorizontalScrollBarEnabled(true);
		webView.setVerticalScrollBarEnabled(true);
		webView.setScrollbarFadingEnabled(true);
		webView.setScrollBarStyle(WebView.SCROLLBARS_OUTSIDE_OVERLAY);

		webView.setWebViewClient(new WebViewClientImpl());
		webView.setWebChromeClient(new WebChromeClientImpl());
		webView.addJavascriptInterface(new WebAppInterface(), "__Android");

		webView.loadUrl(initURL);
	}

	private class WebViewClientImpl extends WebViewClient {
		@Override
		public void onReceivedError(WebView view, int errorCode,
				String description, String failingUrl) {
			super.onReceivedError(view, errorCode, description, failingUrl);
		}

		@Override
		public boolean shouldOverrideUrlLoading(WebView view, String url) {
			Log.i("shouldOverrideUrlLoading(", url);
			return super.shouldOverrideUrlLoading(view, url);
		}

		@Override
		public void onPageFinished(WebView view, String url) {
			if (url.contains("facebook.com") && url.contains("dialog/oauth")
					&& (url.contains("&refsrc") || url.contains("&domain"))) {
				Uri uri = Uri.parse(url);
				String callbackUrl = uri.getQueryParameter("refsrc");
				if (callbackUrl == null)
					callbackUrl = initURL;
				view.loadUrl(callbackUrl); // callback URL
			}

			super.onPageFinished(view, url);
		}
	}

	private class WebChromeClientImpl extends WebChromeClient {
		public void onProgressChanged(WebView view, int progress) {
			WebViewActivity.this.setProgress(progress * 1000);
		}
	}

	private class WebAppInterface {
		@JavascriptInterface
		public void closeView() {
			finish();
		}

		@JavascriptInterface
		public void closeViewWithData(String type, String data) {
			Log.i("closeViewWithData", type + " -> " + data);

			Intent i = new Intent();
			i.putExtra("type", type);
			i.putExtra("data", data);
			setResult(1, i);
			finish();
		}
	}

	@Override
	public void onBackPressed() {
		if (webView != null) {
			if (webView.canGoBack()) {
				Log.i("onBackPressed(", "canGoBack");
				webView.goBack();
			} else {
				super.onBackPressed();
			}
		} else {
			super.onBackPressed();
		}
	}

}
