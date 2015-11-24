package com.nestpia.nest.plugins;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.provider.ContactsContract;
import android.content.res.AssetFileDescriptor;
import android.net.Uri;

import java.io.FileInputStream;

/**
 * Created by John on 1/7/2015.
 */
@SuppressLint("NewApi")
public class contactsvcf extends AbstractPlugin {

	@Override
	public void execute(String[] data) {
		StringBuilder sb = new StringBuilder();
		Cursor cursor = getContext().getContentResolver().query(ContactsContract.CommonDataKinds.Phone.CONTENT_URI, null, null, null, null);
		if (cursor != null) {
			if (cursor.getCount() > 0) {
				cursor.moveToFirst();
				for (int i = 0; i < cursor.getCount(); i++) {
					sb.append(get(getContext(), cursor));
					// Log.d("TAG",
					// "Contact "+(i+1)+"VcF String is"+vCard.get(i));
					cursor.moveToNext();
				}
			}
			cursor.close();
		}

		// System.out.println(sb);
		callbackWithMessage(0, sb.toString());
	}

	String get(Context context, Cursor cursor) {
		// cursor.moveToFirst();
		String lookupKey = cursor.getString(cursor.getColumnIndex(ContactsContract.Contacts.LOOKUP_KEY));
		Uri uri = Uri.withAppendedPath(ContactsContract.Contacts.CONTENT_VCARD_URI, lookupKey);
		AssetFileDescriptor fd = null;
		FileInputStream fis = null;
		try {
			fd = context.getContentResolver().openAssetFileDescriptor(uri, "r");
			fis = fd.createInputStream();
			byte[] buf = new byte[(int) fd.getDeclaredLength()];
			fis.read(buf);
			return new String(buf);
		} catch (Exception e1) {
			e1.printStackTrace();
		} finally {
			try {
				if (fis != null)
					fis.close();
				if (fd != null)
					fd.close();
			} catch (Exception e1) {
			}
		}
		return "";
	}

	@Override
	public boolean onActivityResult(int requestCode, int resultCode, Intent intent) {
		return false;
	}
}
