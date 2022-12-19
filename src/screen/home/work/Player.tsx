import React, {useState} from 'react';
import {View, Text} from 'react-native';
import Video, {LoadError, OnProgressData} from 'react-native-video';
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
  onLoad?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

const Player: React.FC<PlayerProps> = props => {
  const {paused, muted, repeat, poster, videoUri, onEnd, onProgress} = props;

  // const [resizeMode, setResizeMode] = useState<'none' | 'cover'>('none');
  const [error, setError] = useState<string>(null);

  function handleOnLoad() {
    props.onLoad && props.onLoad();
  }

  function handleOnEnd() {
    onEnd && onEnd();
  }

  function handleError(e: LoadError) {
    setError('呀，视频加载失败～');
    console.log(e);
    props.onError && props.onError();
  }

  function handleProgress(e: OnProgressData) {
    onProgress && onProgress(e);
  }
  function handleSeek() {
    console.log('seek');
  }

  return (
    <>
      {!error ? (
        <Video
          style={[props.style]}
          disableFocus={true}
          onLoad={handleOnLoad}
          onError={handleError}
          onSeek={handleSeek}
          onEnd={handleOnEnd}
          onProgress={handleProgress}
          source={{uri: videoUri}}
          paused={paused}
          repeat={repeat}
          muted={muted}
          ignoreSilentSwitch="ignore"
          resizeMode="none"
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
