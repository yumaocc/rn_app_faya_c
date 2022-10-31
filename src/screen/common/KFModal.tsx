import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {useCommonDispatcher} from '../../helper/hooks';
import * as api from '../../apis';
import {Modal} from '../../component';
import {globalStyles} from '../../constants/styles';
import {saveImageToGallery} from '../../helper/system';
interface KFModalProps {
  visible: boolean;
  onClose: () => void;
}

const KFModal: React.FC<KFModalProps> = props => {
  const {visible, onClose} = props;
  const [url, setUrl] = useState('');
  const [commonDispatcher] = useCommonDispatcher();

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
    <Modal title="" visible={visible} onClose={onClose} showCancel okText="保存到相册" cancelText="关闭" onOk={handleSavePoster}>
      <View style={[globalStyles.containerCenter, styles.imgContainer]}>{url && <Image source={{uri: url}} resizeMode="contain" style={styles.img} />}</View>
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
});
