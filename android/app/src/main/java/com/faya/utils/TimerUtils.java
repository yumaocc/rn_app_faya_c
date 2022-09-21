package com.faya.utils;

import java.util.Timer;
import java.util.TimerTask;

public class TimerUtils {

    public static void runAfter(Runnable runnable, long delay) {
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                runnable.run();
            }
        }, delay);
    }
}
