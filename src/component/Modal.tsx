import {Button} from '@ant-design/react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Icon from './Icon';
import {
  View,
  StyleSheet,
  Modal as RNModal,
  TouchableWithoutFeedback,
  BackHandler,
  useWindowDimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {globalStyles, globalStyleVariables} from '../constants/styles';
import {StylePropView} from '../models';

export type ModalStyles = {
  [key in keyof typeof styles]: ViewStyle | TextStyle;
};
interface ModalProps {
  title?: string;
  visible: boolean;
  maskStyle?: StylePropView;
  children?: React.ReactNode;
  footer?: React.ReactNode | boolean;
  showCancel?: boolean; // only if footer is true
  okText?: string;
  cancelText?: string;
  styles?: Partial<ModalStyles>;
  style?: StylePropView;
  onOk?: () => Promise<void> | void;
  onCancel?: () => Promise<void> | void;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = props => {
  const {onClose, onOk, onCancel} = props;
  const [okLoading, setOkLoading] = useState(false);
  const windowSize = useWindowDimensions();

  function handleClickMask() {
    handleClose();
  }

  const handleClose = useCallback(() => {
    onClose && onClose();
  }, [onClose]);

  async function handleOk() {
    if (onOk) {
      setOkLoading(true);
      try {
        await onOk();
        setOkLoading(false);
        handleClose();
      } catch (error) {
        setOkLoading(false);
      }
    } else {
      handleClose();
    }
  }
  async function handleCancel() {
    if (onCancel) {
      await onCancel();
    }
    handleClose();
  }

  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleClose();
      return true;
    });
    return () => handler.remove();
  }, [handleClose]);

  function renderDefaultFooter() {
    return (
      <View style={[styles.defaultFooterWrapper, props.styles.defaultFooterWrapper]}>
        {props.showCancel && (
          <Button style={[styles.footerButton, {marginRight: globalStyleVariables.MODULE_SPACE}]} onPress={handleCancel}>
            {props.cancelText}
          </Button>
        )}
        <Button loading={okLoading} style={[styles.footerButton]} type="primary" onPress={handleOk}>
          {props.okText}
        </Button>
      </View>
    );
  }

  return (
    <RNModal visible={props.visible} transparent animationType="fade">
      <View style={[styles.container, props.styles.container]}>
        <TouchableWithoutFeedback onPress={handleClickMask}>
          <View style={[styles.mask, props.maskStyle]} />
        </TouchableWithoutFeedback>
        <View style={[styles.body, {width: windowSize.width - 80}, props.styles.body, props.style]}>
          <View style={[styles.header]}>
            <View style={[styles.title]}>
              <Text style={[globalStyles.fontPrimary, styles.titleText]}>{props.title}</Text>
            </View>
            <View style={styles.close}>
              <TouchableOpacity onPress={handleClose} activeOpacity={0.5}>
                <Icon name="all_popclose36" size={18} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView style={{maxHeight: windowSize.height - 114}} alwaysBounceVertical={false}>
            <View style={[styles.content, props.styles.content]}>{props.children}</View>
          </ScrollView>
          {!props.footer ? null : <View style={styles.footer}>{props.footer === true ? renderDefaultFooter() : props.footer}</View>}
        </View>
      </View>
    </RNModal>
  );
};
Modal.defaultProps = {
  title: '',
  showCancel: false,
  footer: true,
  okText: '确定',
  cancelText: '取消',
  styles: {},
  style: {},
};
export default Modal;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mask: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000080',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    height: 48,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18,
  },
  close: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    maxHeight: '80%',
    // paddingHorizontal: 20,
  },
  content: {
    // paddingVertical: 10,
  },
  footer: {
    paddingBottom: 10,
  },
  footerButton: {
    flex: 1,
  },
  defaultFooterWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
});
