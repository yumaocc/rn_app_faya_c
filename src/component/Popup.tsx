import React from 'react';
import {useCallback} from 'react';
import {useEffect} from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StylePropView} from '../models';
import Modal from 'react-native-modal';

interface PopupProps {
  visible: boolean;
  maskStyle?: StylePropView;
  children?: React.ReactNode;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = props => {
  const {onClose} = props;
  const {bottom} = useSafeAreaInsets();

  const handleClose = useCallback(() => {
    onClose && onClose();
  }, [onClose]);

  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleClose();
      return true;
    });
    return () => handler.remove();
  }, [handleClose]);

  return (
    <Modal isVisible={props.visible} style={styles.container} onBackdropPress={handleClose} onBackButtonPress={handleClose} useNativeDriver={true}>
      <View style={styles.body}>
        {React.Children.map(props.children, child => {
          const typedChild = child as React.ReactElement;
          const childStyle = typedChild?.props?.style || {};
          const mergedStyle = {
            ...childStyle,
            paddingBottom: bottom,
          };
          return React.cloneElement(child as React.ReactElement, {
            style: mergedStyle,
          });
        })}
      </View>
    </Modal>
  );
};
// Popup.defaultProps = {
// };
export default Popup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-end',
  },
  body: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopColor: '#e5e5e5',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
