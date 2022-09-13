package com.faya;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.faya.AliyunVOD.RecorderView;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class VODPackage implements ReactPackage {

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactApplicationContext) {
        return Arrays.<ViewManager>asList(
                new RecorderView(reactApplicationContext)
        );
    }

    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactApplicationContext) {
        return Collections.emptyList();
    }
}
