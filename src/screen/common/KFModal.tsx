import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useCommonDispatcher} from '../../helper/hooks';
import * as api from '../../apis';
// import {Modal} from '../../component';
import {Modal} from '@ant-design/react-native';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {saveImageToGallery} from '../../helper/system';
import {Button} from '../../component';
import Icon from '../../component/Icon';
interface KFModalProps {
  visible: boolean;
  onClose: () => void;
}

const KFModal: React.FC<KFModalProps> = props => {
  const {visible, onClose} = props;
  const [url, setUrl] = useState('');
  const [commonDispatcher] = useCommonDispatcher();

  function handleClose() {
    onClose();
    return true;
  }

  async function handleSavePoster() {
    if (url) {
      try {
        await saveImageToGallery(url);
        commonDispatcher.info('保存成功');
      } catch (error) {
        commonDispatcher.error(error);
      }
    }
  }

  useEffect(() => {
    api.common.getKFUrl().then(setUrl).catch(commonDispatcher.error);
  }, [commonDispatcher]);

  if (!visible) {
    return null;
  }
  return (
    <Modal
      styles={{body: {paddingHorizontal: 0, paddingBottom: 0}, innerContainer: {paddingTop: 0, borderRadius: globalStyleVariables.RADIUS_MODAL}}}
      visible={visible}
      onClose={handleClose}
      animationType="fade"
      onRequestClose={handleClose}
      transparent
      maskClosable={true}>
      <View style={[styles.header]}>
        <View style={styles.close}>
          <TouchableOpacity onPress={handleClose} activeOpacity={0.5}>
            <Icon name="all_popclose36" size={18} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={[globalStyles.containerCenter, styles.imgContainer]}>{url && <Image source={{uri: url}} resizeMode="contain" style={styles.img} />}</View>
      <View style={[globalStyles.containerRow, {padding: 15}]}>
        <Button onPress={handleClose} title="关闭" style={{flex: 1}} />
        <Button type="primary" style={{flex: 1, marginLeft: 15}} onPress={handleSavePoster} title="保存相册" />
      </View>
    </Modal>
  );
};

export default KFModal;

const styles = StyleSheet.create({
  imgContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  img: {
    width: 270,
    height: 335,
  },
  header: {
    height: 48,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  close: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
