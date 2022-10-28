import {Carousel} from '@ant-design/react-native';
import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import CustomTouchable from '../../../component/CustomTouchable';
import {StylePropView, WorkFile} from '../../../models';

interface PhotoPlayerProps {
  style?: StylePropView;
  files?: WorkFile[];
  paused?: boolean;
  onEnd?: () => void;
  onLoad?: () => void;
}

const PhotoPlayer: React.FC<PhotoPlayerProps> = props => {
  const {files, paused, onLoad, onEnd} = props;

  function handleLoad(index: number) {
    if (index === 0) {
      onLoad && onLoad();
    }
  }

  function handleChange(index: number) {
    if (index === files.length - 1) {
      onEnd && onEnd();
    }
  }

  return (
    <View style={props.style}>
      <CustomTouchable>
        <Carousel autoplay={!paused} autoplayInterval={3000} infinite style={styles.full} afterChange={handleChange} dots={false}>
          {files?.map((file, i) => (
            <Image onLoad={() => handleLoad(i)} key={i} source={{uri: file.videoUrl}} style={styles.full} resizeMode="contain" />
          ))}
        </Carousel>
      </CustomTouchable>
    </View>
  );
};

PhotoPlayer.defaultProps = {
  style: {},
  files: [],
};

export default PhotoPlayer;

const styles = StyleSheet.create({
  full: {
    width: '100%',
    height: '100%',
  },
});
