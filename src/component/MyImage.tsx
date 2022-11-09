import React from 'react';
import {View, StyleSheet, ImageProps, Image, NativeSyntheticEvent, ImageLoadEventData} from 'react-native';

export interface MyImageProps extends ImageProps {}

const MyImage: React.FC<MyImageProps> = props => {
  const {style, defaultSource, onLoad, ...rest} = props;
  const [loadSuccess, setLoadSuccess] = React.useState(false);

  function handleLoad(e: NativeSyntheticEvent<ImageLoadEventData>) {
    onLoad && onLoad(e);
    setLoadSuccess(true);
  }
  return (
    <View style={[styles.container, style]}>
      <Image style={styles.image} {...rest} onLoad={handleLoad} />
      {!loadSuccess && <Image style={[styles.image, styles.placeholder]} source={defaultSource} />}
    </View>
  );
};

export default MyImage;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  placeholder: {
    zIndex: 2,
  },
});
