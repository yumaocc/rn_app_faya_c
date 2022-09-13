package com.faya.AliyunVOD;

import android.util.Log;


import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

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
        return MapBuilder.of("create", COMMAND_CREATE, "sendAction", COMMAND_SEND_ACTION);
    }

    // 用于重新映射事件名称  topChange => onChange
    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("onNativeFinish", MapBuilder.of("registrationName", "onRecordFinish"))
                .put("onNativeFinishWithMaxDuration", MapBuilder.of("registrationName", "onRecordFinishWithMaxDuration"))
                .build();
    }

    // 导出方法让js用
    @Override
    public void receiveCommand(@NonNull SMNView root, String commandId, @Nullable ReadableArray args) {
        super.receiveCommand(root, commandId, args);
        int commandIdInt = Integer.parseInt(commandId);
        switch (commandIdInt) {
            case COMMAND_CREATE:
//                int reactNativeViewId = args.getInt(0);
//                root.sendEvent(reactNativeViewId);
                break;
            case COMMAND_SEND_ACTION:
                root.sendAction(args.getMap(0));
                break;
            default: {}
        }
    }
}
