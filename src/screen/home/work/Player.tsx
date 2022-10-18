import React, {useState} from 'react';
import {View, Text} from 'react-native';
import Video, {OnLoadData, OnProgressData} from 'react-native-video';
import {globalStyles} from '../../../constants/styles';
import {StylePropView} from '../../../models';

interface PlayerProps {
  style?: StylePropView;
  paused?: boolean;
  poster?: string;
  videoUri: string;
  muted?: boolean;
  repeat?: boolean;
  onProgress?: (data: OnProgressData) => void;
  onEnd?: () => void;
}

const Player: React.FC<PlayerProps> = props => {
  const {paused, muted, repeat, poster, videoUri, onEnd, onProgress} = props;

  const [resizeMode, setResizeMode] = useState<'none' | 'cover'>('cover');
  const [error, setError] = useState<string>(null);

  function handleOnLoad(e: OnLoadData) {
    const {naturalSize} = e;
    if (naturalSize.orientation === 'landscape') {
      // 横屏视频不缩放，竖屏视频cover
      setResizeMode('none');
    }
  }

  function handleOnEnd() {
    onEnd && onEnd();
  }

  function handleError() {
    setError('呀，视频加载失败～');
  }

  function handleProgress(e: OnProgressData) {
    onProgress && onProgress(e);
  }

  return (
    <>
      {!error ? (
        <Video
          style={[props.style]}
          disableFocus={true}
          onLoad={handleOnLoad}
          onError={handleError}
          onEnd={handleOnEnd}
          onProgress={handleProgress}
          source={{uri: videoUri}}
          paused={paused}
          repeat={repeat}
          muted={muted}
          resizeMode={resizeMode}
          poster={poster}
        />
      ) : (
        <View style={[globalStyles.containerCenter, props.style]}>
          <View style={[globalStyles.containerCenter, {backgroundColor: '#f4f4f4', width: '100%', height: 180}]}>
            <Text style={{fontSize: 18}}>{error}</Text>
          </View>
        </View>
      )}
    </>
  );
};

export default Player;

Player.defaultProps = {
  muted: false,
  repeat: true,
  style: {},
};

// const styles = StyleSheet.create({});
