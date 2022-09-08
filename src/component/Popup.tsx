import React from 'react';
import {useCallback} from 'react';
import {useEffect} from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StylePropView} from '../models';
import Modal from 'react-native-modal';

interface PopupProps {
  visible: boolean;
  style?: StylePropView;
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
      <View style={[styles.body, {paddingBottom: bottom}, props.style]}>{props.children}</View>
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
