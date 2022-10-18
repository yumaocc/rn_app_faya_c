import {Carousel} from '@ant-design/react-native';
import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {StylePropView, WorkFile} from '../../../models';

interface PhotoPlayerProps {
  style?: StylePropView;
  files?: WorkFile[];
  paused?: boolean;
  onLoad?: () => void;
}

const PhotoPlayer: React.FC<PhotoPlayerProps> = props => {
  const {files, paused, onLoad} = props;

  function handleLoad(index: number) {
    if (index === 0) {
      onLoad && onLoad();
    }
  }

  return (
    <View style={props.style}>
      <Carousel autoplay={!paused} autoplayInterval={3000} infinite style={styles.full}>
        {files?.map((file, i) => (
          <Image onLoad={() => handleLoad(i)} key={i} source={{uri: file.videoUrl}} style={styles.full} resizeMode="cover" />
        ))}
      </Carousel>
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
