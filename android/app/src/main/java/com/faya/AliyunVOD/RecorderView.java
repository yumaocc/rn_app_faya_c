package com.faya.AliyunVOD;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.aliyun.svideosdk.AlivcSdkCore;
import com.aliyun.svideosdk.common.AlivcSdkConfig;
import com.aliyun.svideosdk.license.ILicenseNativeInitCallback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import java.util.Map;

public class RecorderView extends SimpleViewManager<SMNView> {
    public static final String ComponentName = "SMNRecordView";
    ReactApplicationContext mCallerContext;
    public final int COMMAND_CREATE = 1;
    public final int COMMAND_SEND_ACTION = 2;

    public RecorderView(ReactApplicationContext context) {
        mCallerContext = context;
        // AlivcSdkCore.registerAsync(context, new AlivcSdkConfig(), new
        // ILicenseNativeInitCallback() {
        // @Override
        // public void onError(int i, String s) {
        // Log.e("register SDK error", "code = " + i + ", string = " + s);
        // }
        //
        // @Override
        // public void onSuccess(String s, long l, long l1, long l2) {
        // Log.e("register SDK success", "s:" + s + ", l = " + l + ", l1 = " + l1 + ",
        // l2 = " + l2);
        // }
        // });
        boolean result = AlivcSdkCore.register(context);
        Log.e("register SDK result", "success = " + result);
    }

    @NonNull
    @Override
    protected SMNView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        return new SMNView(themedReactContext);
    }

    @Override
    public String getName() {
        return ComponentName;
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of("sendAction", COMMAND_SEND_ACTION);
    }

    // 用于重新映射事件名称 topChange => onChange
    /*
     * onNativeRecorderReady => onRecorderReady;
     * onNativeRecorderError => onRecorderError;
     * onNativePreviewStart => onPreviewStart;
     * onNativePreviewStop => onPreviewStop;
     * onNativeRecordStart => onRecordStart;
     * onNativeRecordProgress => onRecordProgress;
     * onNativeRecordStop => onRecordStop;
     * onNativeRecordFinish => onRecordFinish;
     * onNativeRecordFinishWithMaxDuration => onRecordFinishWithMaxDuration;
     * onNativeRecorderStateChange => onRecorderStateChange;
     */
    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("onNativeRecorderReady", MapBuilder.of("registrationName", "onRecorderReady"))
                .put("onNativeRecorderError", MapBuilder.of("registrationName", "onRecorderError"))
                .put("onNativePreviewStart", MapBuilder.of("registrationName", "onPreviewStart"))
                .put("onNativePreviewStop", MapBuilder.of("registrationName", "onPreviewStop"))
                .put("onNativeRecordStart", MapBuilder.of("registrationName", "onRecordStart"))
                .put("onNativeRecordProgress", MapBuilder.of("registrationName", "onRecordProgress"))
                .put("onNativeRecordStop", MapBuilder.of("registrationName", "onRecordStop"))
                .put("onNativeRecordFinish", MapBuilder.of("registrationName", "onRecordFinish"))
                .put("onNativeRecordFinishWithMaxDuration",
                        MapBuilder.of("registrationName", "onRecordFinishWithMaxDuration"))
                .put("onNativeRecorderStateChange", MapBuilder.of("registrationName", "onRecorderStateChange"))
                .build();
    }

    // 导出方法让js用
    @Override
    public void receiveCommand(@NonNull SMNView root, String commandId, @Nullable ReadableArray args) {
        Log.e("receive command", String.valueOf(args));
        super.receiveCommand(root, commandId, args);
        int commandIdInt = Integer.parseInt(commandId);
        switch (commandIdInt) {
            case COMMAND_CREATE:
                // int reactNativeViewId = args.getInt(0);
                // root.sendEvent(reactNativeViewId);
                break;
            case COMMAND_SEND_ACTION:
                root.sendAction(args.getMap(0));
                break;
            default:
                break;
        }
    }
}
