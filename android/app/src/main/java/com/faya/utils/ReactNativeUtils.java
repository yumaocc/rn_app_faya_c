package com.faya.utils;

import android.app.Activity;
import android.content.Context;

import com.facebook.react.bridge.ReactContext;

public class ReactNativeUtils {
    public static Activity getActivity(Context context) {
        if (context instanceof Activity) {
            return (Activity)context;
        }
        if (context instanceof ReactContext) {
            return ((ReactContext) context).getCurrentActivity();
        }
        return null;
    }
}
