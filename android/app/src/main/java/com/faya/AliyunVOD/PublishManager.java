package com.faya.AliyunVOD;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.alibaba.sdk.android.vod.upload.VODUploadCallback;
import com.alibaba.sdk.android.vod.upload.VODUploadClient;
import com.alibaba.sdk.android.vod.upload.VODUploadClientImpl;
import com.alibaba.sdk.android.vod.upload.model.UploadFileInfo;
import com.alibaba.sdk.android.vod.upload.model.VodInfo;
import com.alibaba.sdk.android.vod.upload.model.VodUploadResult;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.faya.utils.VideoUtils;

import java.io.File;
import java.util.HashMap;

public class PublishManager extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;
    private static final String TAG = "SMNPublishManager";
    public static final String MODULE_NAME = "SMNPublishManager";
    private boolean hasUnfinishedWork = false;
    private boolean hasOnProgress = false;
//    private VODSVideoUploadClient uploader;

    public PublishManager(ReactApplicationContext context) {
        super(context);
//        VODSVideoUploadClient client = new VODSVideoUploadClientImpl(context);
//        client.init();
//        this.uploader = client;
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void addListener(String eventName) {
        Log.e(TAG, "addListener: eventname = " + eventName);
        if("progress".equals(eventName)) {
            hasOnProgress = true;
        }
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        hasOnProgress = false;
    }

    private void uploadFile(ReadableMap option, Promise promise) {
        if (hasUnfinishedWork) {
            promise.reject("有上传任务，请等待上一个任务完成", "error");
            return;
        }
        this.hasUnfinishedWork = true;
        String videoPath = option.getString("path");
        String uploadAuth = option.getString("uploadAuth");
        String uploadAddress = option.getString("uploadAddress");

        if (videoPath == null || uploadAddress == null || uploadAuth == null) {
            promise.reject("参数错误", "error");
            return;
        }
        VODUploadClient uploader = new VODUploadClientImpl(reactContext.getApplicationContext());

        VODUploadCallback callback = new VODUploadCallback() {
            @Override
            public void onUploadSucceed(UploadFileInfo info, VodUploadResult result) {
                super.onUploadSucceed(info, result);
                promise.resolve(Arguments.createMap());
                hasUnfinishedWork = false;
            }

            @Override
            public void onUploadFailed(UploadFileInfo info, String code, String message) {
                super.onUploadFailed(info, code, message);
                promise.reject(code, message);
                hasUnfinishedWork = false;
            }

            @Override
            public void onUploadProgress(UploadFileInfo info, long uploadedSize, long totalSize) {
                super.onUploadProgress(info, uploadedSize, totalSize);
                if (hasOnProgress) {
                    WritableMap event = Arguments.createMap();
                    event.putDouble("uploaded", uploadedSize);
                    event.putDouble("total", totalSize);
                    sendEvent(reactContext, "progress", event);
                }
            }

            @Override
            public void onUploadStarted(UploadFileInfo uploadFileInfo) {
                super.onUploadStarted(uploadFileInfo);
                uploader.setUploadAuthAndAddress(uploadFileInfo, uploadAuth, uploadAddress);
            }
        };
        uploader.init(callback);

        VodInfo info = new VodInfo();
        uploader.addFile(videoPath, info);
        uploader.start();
    }

    @ReactMethod
    public void uploadVideo(ReadableMap option, Promise promise) {
        uploadFile(option, promise);
    }

    @ReactMethod
    public void uploadPhoto(ReadableMap option, Promise promise) {
        uploadFile(option, promise);
    }

    @ReactMethod
    public void getVideoCover(ReadableMap option, Promise promise) {
        String videoPath = option.getString("path");
        if (videoPath == null) {
            promise.reject("error", "参数错误");
            return;
        }
        String coverPath = VideoUtils.getVideoCover(reactContext, videoPath);
        if (coverPath == null) {
            promise.reject("error", "生成封面失败");
            return;
        }
        promise.resolve(coverPath);
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
