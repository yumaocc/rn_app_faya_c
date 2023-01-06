import React, {memo} from 'react';
import {View, StyleSheet, ImageProps, Image, NativeSyntheticEvent, ImageLoadEventData} from 'react-native';

export interface MyImageProps extends ImageProps {
  // remoteUrl?: string;
  isRemote?: boolean;
}

const MyImage: React.FC<MyImageProps> = props => {
  const {style, defaultSource, onLoad, ...rest} = props;
  const [loadSuccess, setLoadSuccess] = React.useState(false);

  function handleLoad(e: NativeSyntheticEvent<ImageLoadEventData>) {
    onLoad && onLoad(e);
    if (props.source && typeof props.source === 'object' && 'uri' in props.source) {
      if (!props.source.uri && props.isRemote) {
        setLoadSuccess(false);
        return;
      }
    }
    setLoadSuccess(true);
  }
  return (
    <View style={[styles.container, style]}>
      <Image style={[styles.image, {opacity: loadSuccess ? 1 : 0}]} {...rest} onLoad={handleLoad} />
      {!loadSuccess && <Image style={[styles.image, styles.placeholder]} source={defaultSource} resizeMode="cover" />}
    </View>
  );
};

MyImage.defaultProps = {
  isRemote: true,
};

export default memo(MyImage);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    zIndex: 2,
    position: 'absolute',
  },
});
