package com.faya.utils;

import android.content.Context;
import android.graphics.Bitmap;
import android.media.MediaMetadataRetriever;
import android.util.Log;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class VideoUtils {

    private static String getCoverPath(Context context) {
        return context.getExternalCacheDir() + File.separator + System.currentTimeMillis() + "-cover.png";
    }

    public static String getVideoCover(Context context, String videoPath) {
        MediaMetadataRetriever metadataRetriever = new MediaMetadataRetriever();
        metadataRetriever.setDataSource(videoPath);
        Bitmap bitmap = metadataRetriever.getFrameAtTime(100 * 1000);

        final String imgPath = getCoverPath(context);
        File file = new File(imgPath);

        try {
            OutputStream stream = new FileOutputStream(file);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);
            stream.close();
            return imgPath;
        } catch (Exception e) {
            Log.e("BITMAP ERROR", e.getStackTrace().toString());
        }
        return null;
    }
}
