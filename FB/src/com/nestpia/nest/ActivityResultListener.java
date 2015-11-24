package com.nestpia.nest;

import android.content.Intent;

/**
 * Created by john on 4/24/15.
 */
public interface ActivityResultListener {
    void onActivityResult(int requestCode, int resultCode, Intent intent);
}
