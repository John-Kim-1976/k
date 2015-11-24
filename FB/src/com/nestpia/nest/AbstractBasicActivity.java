package com.nestpia.nest;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import android.view.Window;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;
import android.webkit.WebStorage;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.GeolocationPermissions;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;

import com.nestpia.nest.plugins.PluginAdapter;

import android.view.animation.Animation;
import android.view.animation.AnimationUtils;

/**
 * AbstractBasicActivity
 */
@SuppressLint({ "NewApi", "SdCardPath", "SetJavaScriptEnabled", "DefaultLocale" })
@SuppressWarnings({ "deprecation", "unused" })
public abstract class AbstractBasicActivity extends android.app.Activity {
	protected WebView			webView;
	private final String		NEST_APP_URL			= "file:///android_asset/app/index.html";
	// --
	private ValueCallback<Uri>	mUploadMessage;
	private final static int	REQUEST_FILECHOOSER		= 1001;
	private final static int	REQUEST_IMAGE_CAPTURE	= 1002;

	private PluginAdapter		pluginAdapter;
	private GcmAdapter			gcmAdapter;

	// --
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		super.requestWindowFeature(Window.FEATURE_NO_TITLE);

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
		wset.setJavaScriptCanOpenWindowsAutomatically(true);

		wset.setAppCacheEnabled(true);
		wset.setDatabaseEnabled(true);
		wset.setDomStorageEnabled(true);
		if (Build.VERSION.SDK_INT < Build.VERSION_CODES.KITKAT) {
			webView.getSettings().setDatabasePath("/data/data/" + webView.getContext().getPackageName() + "/databases/");
		}
		wset.setGeolocationDatabasePath(webView.getContext().getFilesDir().getPath());

		webView.setHorizontalScrollBarEnabled(true);
		webView.setVerticalScrollBarEnabled(true);
		webView.setScrollbarFadingEnabled(true);
		webView.setScrollBarStyle(WebView.SCROLLBARS_OUTSIDE_OVERLAY);

		webView.setWebViewClient(new WebViewClientImpl());
		webView.setWebChromeClient(new WebChromeClientImpl());
		webView.addJavascriptInterface(new WebAppInterface(), "__Android");

		pluginAdapter = new PluginAdapter();
		pluginAdapter.setContext(this);
		pluginAdapter.setView(webView);

		gcmAdapter = new GcmAdapter(this, getSenderID(), webView);
		gcmAdapter.onCreate(savedInstanceState);

		webView.loadUrl(NEST_APP_URL);

		registerDefaultActivityListenerList();
		setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
	}

	protected abstract String getSenderID();

	@Override
	protected void onResume() {
		super.onResume();
		gcmAdapter.checkPlayServices();
	}

	@Override
	public void onBackPressed() {
		if (isJsNativeApp() && webView != null) {
			if (webView.getUrl().startsWith(NEST_APP_URL)) {
				Log.i("onBackPressed(", "onBackPressed");
				webView.loadUrl("javascript:__back()");
			}
		} else if (webView != null && webView.canGoBack()) {
			webView.goBack();
		} else {
			super.onBackPressed();
		}
	}

	protected abstract boolean isJsNativeApp();

	@Override
	protected void onDestroy() {
		super.onDestroy();
	}

	private class WebViewClientImpl extends WebViewClient {
		@Override
		public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
			Log.e("WebViewClientImpl", description);
			super.onReceivedError(view, errorCode, description, failingUrl);
		}

		@Override
		public boolean shouldOverrideUrlLoading(WebView view, String url) {
			if (isJsNativeApp()) {
				if (url.startsWith("file:///android_asset/"))
					return super.shouldOverrideUrlLoading(view, url);

				Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
				startActivity(intent);
				return true;
			}
			return super.shouldOverrideUrlLoading(view, url);
		}

		@Override
		public void onPageFinished(WebView view, String url) {
			animate(view);
			view.setVisibility(WebView.VISIBLE);

			view.loadUrl("javascript:NEST.xlib.execute = function() { var a = []; for(var i=0; i<arguments.length; i++) if (arguments[i] != undefined) a.push(arguments[i].toString()); else a.push(arguments[i]); __Android.__fExecute(a); };");
			gcmAdapter.onPageLoadFinished();

			onNewIntent(getIntent());

			super.onPageFinished(view, url);
		}
	}

	private void animate(final WebView view) {
		Animation anim = AnimationUtils.loadAnimation(getBaseContext(), android.R.anim.fade_in);
		view.startAnimation(anim);
	}

	private class WebChromeClientImpl extends WebChromeClient {
		public boolean onConsoleMessage(android.webkit.ConsoleMessage m) {
			Log.i("WebChromeClientImpl", m.message());
			return super.onConsoleMessage(m);
		}

		@Override
		public void onExceededDatabaseQuota(String url, String databaseIdentifier, long currentQuota, long estimatedSize,
				long totalUsedQuota, WebStorage.QuotaUpdater quotaUpdater) {
			Log.i("WebChromeClientImpl", "onExceededDatabaseQuota(" + currentQuota);
			quotaUpdater.updateQuota(currentQuota * 10);
			// super.onExceededDatabaseQuota(url, databaseIdentifier,
			// currentQuota, estimatedSize, totalUsedQuota,
			// quotaUpdater);
		}

		public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
			callback.invoke(origin, true, false);
		}

		// Android 3.0+
		public void openFileChooser(ValueCallback<Uri> vc) {
			openFileChooser(vc, "image/*", null);
		}

		// Android 3.0+
		public void openFileChooser(ValueCallback<Uri> vc, String acceptType) {
			openFileChooser(vc, acceptType, null);
		}

		// Android 4.1
		public void openFileChooser(ValueCallback<Uri> vc, final String acceptType, final String capture) {
			__openFileChooser(vc, acceptType, capture);
		}
	}

	public class WebAppInterface {
		WebAppInterface() {
		}

		@JavascriptInterface
		public void exit() {
			finish();
		}

		@JavascriptInterface
		public void startActivity(String url) {
			Log.i("WebAppInterface", "startActivity(" + url);
			Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
			AbstractBasicActivity.this.startActivity(intent);
		}

		@JavascriptInterface
		public void openFileChooser(String o) {
			ValueCallback<Uri> vc = new ValueCallback<Uri>() {
				@Override
				public void onReceiveValue(Uri uri) {
					Log.i("WebAppInterface", "onReceiveValue(" + uri);
					webView.loadUrl("javascript:__gCallback(\"" + getPhotoBase64Decoded(uri) + "\")");
					System.gc();
				}
			};
			__openFileChooser(vc, "image/*", null);
		}

		@JavascriptInterface
		public void lockOrientation(String... a) {
			if (a != null && a.length > 0) {
				String o = a[0].toLowerCase();
				if (o.contains("portrait")) {
					setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
				} else if (o.contains("landscape")) {
					setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
				} else {
					setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
				}
			}
		}

		@JavascriptInterface
		public void __fExecute(String... a) {
			pluginAdapter.invoke(a);
		}
	}

	public Activity getActivity() {
		return this;
	}

	protected void __openFileChooser(ValueCallback<Uri> vc, final String acceptType, final String capture) {
		mUploadMessage = vc;

		if (!acceptType.toLowerCase().startsWith("image/")) {
			Intent i = new Intent(Intent.ACTION_GET_CONTENT);
			i.setType(acceptType);
			startActivityForResult(Intent.createChooser(i, "Choose a File"), REQUEST_FILECHOOSER);
			return;
		}

		AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
		// builder.setTitle("");
		builder.setCancelable(true);
		builder.setItems(new String[] { "Photo Gallery", "Camera" }, new DialogInterface.OnClickListener() {
			public void onClick(DialogInterface dialog, int which) {
				if (which == 0) {
					Intent i = new Intent(Intent.ACTION_GET_CONTENT);
					i.addCategory(Intent.CATEGORY_OPENABLE);
					i.setType(acceptType);
					// startActivityForResult(Intent.createChooser(i,
					// "Choose a File"), REQUEST_FILECHOOSER);
					// Galaxy S4 Bug
					startActivityForResult(i, REQUEST_FILECHOOSER);
				} else if (which == 1) {
					Intent i = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
					startActivityForResult(i, REQUEST_IMAGE_CAPTURE);
				}
			}
		});
		builder.setOnCancelListener(new DialogInterface.OnCancelListener() {
			@Override
			public void onCancel(DialogInterface dialog) {
				mUploadMessage.onReceiveValue(null);
				mUploadMessage = null;
			}
		});
		builder.setInverseBackgroundForced(true);
		builder.show();
	}

	public String getPhotoBase64Decoded(Uri uri) {
		InputStream in = null;
		ByteArrayOutputStream os = null;
		try {
			in = getContentResolver().openInputStream(uri);
			os = new ByteArrayOutputStream();
			int nread = 0;
			byte[] buf = new byte[2048];
			while ((nread = in.read(buf)) > 0) {
				os.write(buf, 0, nread);
			}
			return "data:image/png;base64," + Base64.encodeToString(os.toByteArray(), Base64.NO_WRAP);
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			if (in != null)
				try {
					in.close();
				} catch (Exception ex) {
					ex.printStackTrace();
				}
		}
		return null;
	}

	public Bitmap getResizedBitmap(Bitmap bm, int newHeight, int newWidth) {
		int width = bm.getWidth();
		int height = bm.getHeight();
		float scaleWidth = ((float) newWidth) / width;
		float scaleHeight = ((float) newHeight) / height;
		// CREATE A MATRIX FOR THE MANIPULATION
		Matrix matrix = new Matrix();
		// RESIZE THE BIT MAP
		matrix.postScale(scaleWidth, scaleHeight);

		// "RECREATE" THE NEW BITMAP
		Bitmap resizedBitmap = Bitmap.createBitmap(bm, 0, 0, width, height, matrix, false);
		return resizedBitmap;
	}

	private File getTempPhotoFile() {
		return new File(getCacheDir(), ".photo.png");
	}

	@Override
	protected synchronized void onActivityResult(int requestCode, int resultCode, Intent intent) {
		// Log.d("Main::onActivityResult", String.format("requestCode: %d, resultCode, %d", requestCode, resultCode));
		pluginAdapter.onActivityResult(requestCode, resultCode, intent);
		super.onActivityResult(requestCode, resultCode, intent);
	}

	private void registerDefaultActivityListenerList() {
		pluginAdapter.add(new ActivityResultListener() {
			public void onActivityResult(int requestCode, int resultCode, Intent intent) {
				if (requestCode == REQUEST_FILECHOOSER) {
					if (null == mUploadMessage)
						return;
					Uri result = intent == null || resultCode != RESULT_OK ? null : intent.getData();
					// Log.d("WebChromeClientImpl", "onActivityResult URI(" + result);
					mUploadMessage.onReceiveValue(result);
				} else {
					if (mUploadMessage != null)
						mUploadMessage.onReceiveValue(null);
				}
				mUploadMessage = null;
			}
		});

		pluginAdapter.add(new ActivityResultListener() {
			public void onActivityResult(int requestCode, int resultCode, Intent intent) {
				if (requestCode == REQUEST_IMAGE_CAPTURE) {
					if (resultCode == RESULT_OK) {
						Bundle extras = intent.getExtras();
						Bitmap image = (Bitmap) extras.get("data");
						FileOutputStream os = null;
						File f = getTempPhotoFile();
						try {
							os = new FileOutputStream(f);
							image.compress(Bitmap.CompressFormat.PNG, 60, os);
							os.close();
							os = null;
							Uri result = Uri.fromFile(f);
							// Log.d("WebChromeClientImpl", "onActivityResult REQUEST_IMAGE_CAPTURE URI(" + result);
							mUploadMessage.onReceiveValue(result);
							image = null;
						} catch (Exception ex) {
							mUploadMessage.onReceiveValue(null);
							ex.printStackTrace();
						} finally {
							if (os != null)
								try {
									os.close();
								} catch (Exception ex) {
								}
							// f.delete();
						}
					}
				}
			}
		});
	}

	@Override
	public void onNewIntent(Intent intent) {
		Bundle extras = intent.getExtras();
		Log.i("sendNotification", "onNewIntent1");
		Log.i("onNewIntent1", "extras : " + extras);

		if (extras != null) {
			Log.i("sendNotification", "onNewIntent2");
			String form = extras.getString("form");
			if (form != null) {
				webView.loadUrl("javascript:__show(\"" + form + "\")");
			}
			String url = extras.getString("url");
			if (url != null) {
				Log.i("sendNotification", "onNewIntent3");
				Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
				startActivity(i);
			}
		}
	}

}
