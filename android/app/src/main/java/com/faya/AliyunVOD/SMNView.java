package com.faya.AliyunVOD;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.media.MediaMetadataRetriever;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.util.Log;
import android.view.SurfaceView;

import com.aliyun.svideosdk.common.callback.recorder.OnPictureCallback;
import com.aliyun.svideosdk.common.callback.recorder.OnRecordCallback;
import com.aliyun.svideosdk.common.struct.common.VideoQuality;
import com.aliyun.svideosdk.common.struct.encoder.VideoCodecs;
import com.aliyun.svideosdk.common.struct.recorder.CameraType;
import com.aliyun.svideosdk.common.struct.recorder.MediaInfo;
import com.aliyun.svideosdk.recorder.AliyunIRecorder;
import com.aliyun.svideosdk.recorder.impl.AliyunRecorderCreator;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.faya.utils.PermissionUtils;
import com.faya.utils.ReactNativeUtils;
import com.faya.utils.ThrottleTask;
import com.faya.utils.TimerUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class SMNView extends SurfaceView {
    private static final String TAG = "SMNView"; // 用于日志
    private ThemedReactContext themedReactContext;

    private AliyunIRecorder recorder = null;
    private String outputPath = "";
    private boolean isRecording = false;
    private boolean isMaxDuration = false;
    private boolean canRun = true;
    private long totalDuration = 0; // 录制总时长
    private String coverPath = null;
    public static final int PERMISSION_REQUEST_CODE = 1000;

    String[] permissions = {
            Manifest.permission.CAMERA,
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
    };

//    public boolean checkPermission() {
//        return PermissionUtils.checkPermissionsGroup(themedReactContext, permissions);
//    }

    public SMNView(ThemedReactContext context) {
        super(context);

        themedReactContext = context;
        initRecorder(context);
    }

    private void takeCoverPhoto() {
        MediaMetadataRetriever metadataRetriever = new MediaMetadataRetriever();
        metadataRetriever.setDataSource(outputPath);
        Bitmap bitmap = metadataRetriever.getFrameAtTime(100 * 1000);

        Log.e(TAG, "onPicture:");
        Context context = getContext().getApplicationContext();
        final String imgPath = getCoverPath(context);
        File file = new File(imgPath);

        try {
            OutputStream stream = new FileOutputStream(file);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);
            stream.close();
            coverPath = imgPath;
        } catch (Exception e) {
            Log.e("BITMAP ERROR", e.getStackTrace().toString());
        }
    }


    public void initRecorder (Context context) {
        if (this.recorder == null) {
            this.recorder = AliyunRecorderCreator.getRecorderInstance(context);
            this.recorder.setDisplayView(this);
            this.recorder.setCamera(CameraType.FRONT);
            final String videoPath = getDir(getContext().getApplicationContext()) + File.separator + System.currentTimeMillis() + "-record.mp4";
            this.outputPath = videoPath;
            this.recorder.setOutputPath(videoPath);

            MediaInfo mediaInfo = new MediaInfo();
            mediaInfo.setFps(30);
            mediaInfo.setGop(30*3); // 3S一个关键帧
            mediaInfo.setVideoCodec(VideoCodecs.H264_HARDWARE); // 硬编码
            mediaInfo.setVideoQuality(VideoQuality.SD);
            mediaInfo.setVideoWidth(720);
            mediaInfo.setVideoHeight(1280); // 9:16
            this.recorder.setMediaInfo(mediaInfo);

            // 基础设置
            this.recorder.setBeautyLevel(50);
            this.recorder.setVideoFlipH(true);
            this.recorder.getClipManager().setMinDuration(1000);
            this.recorder.getClipManager().setMaxDuration(15000);

            // 设置回调
            this.recorder.setOnRecordCallback(new OnRecordCallback() {
                @Override
                public void onClipComplete(boolean b, long l) {
                    isRecording = false;
                    int duration = recorder.getClipManager().getDuration();
                    totalDuration = duration;

                    WritableMap event = Arguments.createMap();
                    event.putDouble("duration", duration / 1000);
                    fireCustomEvent("onNativePreviewStop", event);
                    emitRecorderStateChange();
                }

                @Override
                public void onFinish(String s) {
                    isRecording = false;
                    WritableMap event = Arguments.createMap();
                    takeCoverPhoto(); // 生成封面
                    event.putString("path", s);
                    event.putDouble("duration", recorder.getClipManager().getDuration() / 1000);
                    event.putString("coverPath", coverPath);
                    fireCustomEvent("onNativeRecordFinish", event);
                    emitRecorderStateChange();
                }

                @Override
                public void onProgress(long l) {
                    isRecording = true;

                    long d = l + totalDuration;
                    if (canRun) {
                        canRun = false;
                        WritableMap event = Arguments.createMap();
                        event.putDouble("duration", d / 1000);
                        fireCustomEvent("onNativeRecordProgress", event);
                        emitRecorderStateChange();

                        TimerUtils.runAfter(() -> {
                            canRun = true;
                        }, 1000L);
                    }

                }

                @Override
                public void onMaxDuration() {
                    isRecording = false;
                    isMaxDuration = true;
                    takeCoverPhoto(); // 生成封面
                    WritableMap event = Arguments.createMap();
                    event.putString("path", outputPath);
                    event.putString("coverPath", coverPath);
                    event.putDouble("duration", recorder.getClipManager().getDuration()/1000);
                    Log.e("Max duration", "path: " + outputPath);
                    fireCustomEvent("onNativeRecordFinishWithMaxDuration", event);
                    emitRecorderStateChange();
                }

                @Override
                public void onError(int i) {
                    isRecording = false;
                    Log.e("Record error:::code=", String.valueOf(i));
                    fireError(3, "AliVOD error code: " + i);
                    emitRecorderStateChange();
                }

                @Override
                public void onInitReady() {
//                    setupDisplay();
                    WritableMap event = Arguments.createMap();
                    fireCustomEvent("onNativeRecorderReady", event);
                    emitRecorderStateChange();
                }
            });

        }
    }

    private void fireError(int code, String msg) {
        WritableMap event = Arguments.createMap();
        event.putInt("code", code);
        event.putString("message", msg);
        fireCustomEvent("onNativeRecorderError", event);
    }

    private void fireCustomEvent(String eventName, WritableMap detail) {
        ReactContext context = (ReactContext) getContext();
        context
                .getJSModule(RCTEventEmitter.class)
                .receiveEvent(getId(), eventName, detail);
    }

    private static String getCoverPath(Context context) {
        return context.getExternalCacheDir() + File.separator + System.currentTimeMillis() + "-cover.png";
    }
    private static String getDir(Context context) {
        String dir;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            dir = context.getExternalFilesDir("") + File.separator + "Media";
        } else {
            dir = Environment.getExternalStorageDirectory() + File.separator + "DCIM"
                    + File.separator + "Camera";
        }
        File file = new File(dir);
        if (!file.exists()) {
            //noinspection ResultOfMethodCallIgnored
            file.mkdirs();
        }
        return dir;
    }

    public void emitRecorderStateChange () {
        WritableMap event = Arguments.createMap();
        event.putBoolean("isRecording", this.isRecording);
        fireCustomEvent("onNativeRecorderStateChange", event);
    }

    public void startRecord() {
        boolean hasAuth = PermissionUtils.checkPermissionsGroup(themedReactContext, permissions);
        Log.e("AUTH CHECK", String.valueOf(hasAuth));
        if (!hasAuth) {
            return;
        }
        if (isMaxDuration) {
            return;
        }
        isRecording = true;
        emitRecorderStateChange();
        this.recorder.startRecording();
    }

    public  void sendAction(ReadableMap action) {
        String type = action.getString("type");
        Log.e("SMNView", "前端发来的action, type =  " + type + ",  action = " + action.toString());

        if ("switchCamera".equals(type)) {
            this.recorder.switchCamera();
        } else if ("startPreview".equals(type)) {
            this.recorder.startPreview();
        } else if ("stopPreview".equals(type)) {
            this.recorder.stopPreview();
        } else if ("startRecord".equals(type)) {
//            this.recorder.startRecording();
            this.startRecord();
        } else if ("pauseRecord".equals(type)) {
            this.recorder.stopRecording();
        } else if ("finishRecord".equals(type)) {
            this.recorder.finishRecording();
        }

    }
}
