package com.faya.WeChat;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbiz.WXLaunchMiniProgram;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

public class WechatUtil extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private static final String TAG = "SMNWechat";
    public static final String MODULE_NAME = "SMNWechat";
    private  static final String APPID = "wx3fbb61265709334d";
    private IWXAPI api;

    public  WechatUtil(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        api = WXAPIFactory.createWXAPI(context, APPID, true);
        api.registerApp(APPID);
        context.registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                api.registerApp(APPID);
            }
        }, new IntentFilter(ConstantsAPI.ACTION_REFRESH_WXAPP));
    }


    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void isWxInstalled(Callback callback) {
        boolean isInstalled = api.isWXAppInstalled();
        callback.invoke(null, isInstalled);
    }

    @ReactMethod
    private void openMiniProgram(ReadableMap option, Promise promise) {
        WXLaunchMiniProgram.Req req = new WXLaunchMiniProgram.Req();
        req.userName = option.getString("userName");
        req.path = option.getString("path");
        req.miniprogramType = option.getInt("type");
        boolean success = api.sendReq(req);
        promise.resolve(success);
    }
}
