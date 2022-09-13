package com.faya.AliyunVOD;

import android.util.Log;
import android.view.SurfaceView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class SMNView extends SurfaceView {
    private ThemedReactContext themedReactContext;

    public SMNView(ThemedReactContext context) {
        super(context);
        themedReactContext = context;
    }

    private WritableMap mockEvent() {
        WritableMap event = Arguments.createMap();
        event.putString("path", "123333123");
        event.putDouble("duration", 123.4f);
        return event;
    }

    public void sendEvent() {
        ReactContext context = (ReactContext) getContext();
        context
                .getJSModule(RCTEventEmitter.class)
                .receiveEvent(getId(), "onNativeFinish", mockEvent());
    }

    public  void sendAction(ReadableMap action) {

        String type = action.getString("type");
        Log.e("SMNView", "get action from js, argument: " + action.toString() + ", type = " + type);
        sendEvent();
    }
}
