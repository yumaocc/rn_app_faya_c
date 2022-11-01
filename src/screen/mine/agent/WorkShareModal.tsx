import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';
import {Popup} from '../../../component';
import Icon from '../../../component/Icon';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useCommonDispatcher} from '../../../helper/hooks';
import {saveImageToGallery} from '../../../helper/system';
import Clipboard from '@react-native-clipboard/clipboard';

interface WorkShareModalProps {
  poster: string;
  link: string;
  visible: boolean;
  onClose: () => void;
}

const WorkShareModal: React.FC<WorkShareModalProps> = props => {
  const {poster, link, visible} = props;

  const [commonDispatcher] = useCommonDispatcher();

  function handleCloseShare() {
    props.onClose();
  }
  async function handleSavePoster() {
    try {
      await saveImageToGallery(poster);
      commonDispatcher.info('保存成功');
      props.onClose();
    } catch (error) {
      console.log(error);
      commonDispatcher.error(error);
    }
  }

  function handlePreviewPoster() {}

  function handleCopyLink() {
    Clipboard.setString(link);
    commonDispatcher.info('复制成功');
    props.onClose();
  }

  return (
    <Popup visible={visible} onClose={handleCloseShare} round={10} useNativeDrive={false} style={{backgroundColor: '#f4f4f4'}}>
      <View style={styles.posterModal}>
        <View>
          <View style={globalStyles.containerCenter}>
            <Text>分享海报</Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={{position: 'absolute', right: 0, top: 0}} onPress={handleCloseShare}>
            <Icon name="all_popclose36" size={18} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
          </TouchableOpacity>
        </View>
        <View style={[globalStyles.containerCenter, {marginTop: 20}]}>
          <View style={{width: 205, height: 360, backgroundColor: '#f4f4f4'}}>
            {poster && (
              <TouchableWithoutFeedback onPress={handlePreviewPoster}>
                <Image source={{uri: poster}} style={{width: '100%', height: '100%'}} resizeMode="contain" />
              </TouchableWithoutFeedback>
            )}
          </View>

          <View style={[globalStyles.containerRow, {marginTop: 20}]}>
            <View style={[{marginRight: 40}, globalStyles.containerCenter]}>
              <TouchableOpacity activeOpacity={0.8} onPress={handleSavePoster}>
                <View style={[styles.posterButton, {backgroundColor: '#FF6A6A'}]}>
                  <Icon name="zuopin_pop_xiazai" size={24} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text style={[globalStyles.fontPrimary, {fontSize: 11, marginTop: 7}]}>保存到相册</Text>
            </View>
            <View style={[globalStyles.containerCenter]}>
              <TouchableOpacity activeOpacity={0.8} onPress={handleCopyLink}>
                <View style={[styles.posterButton, {backgroundColor: '#8990CD'}]}>
                  <Icon name="zuopin_pop_link" size={24} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text style={[globalStyles.fontPrimary, {fontSize: 11, marginTop: 7}]}>复制链接</Text>
            </View>
          </View>
        </View>
      </View>
    </Popup>
  );
};

export default WorkShareModal;

const styles = StyleSheet.create({
  posterModal: {
    // alignItems: 'center',
    backgroundColor: '#f4f4f4',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  posterButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
