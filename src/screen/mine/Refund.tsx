import React, {useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {Button, InputNumber, NavigationBar} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCommonDispatcher, useOrderDetail, useParams} from '../../helper/hooks';
import {useSearch} from '../../fst/hooks';
import {OrderRefundForm} from '../../models';
import {launchImageLibrary} from 'react-native-image-picker';
import {getFileNameByPath} from '../../helper/system';
import * as api from '../../apis';
import {navigateBack} from '../../router/Router';
import {moneyToYuan} from '../../fst/helper';
import Icon from '../../component/Icon';
import KFModal from '../common/KFModal';
import MyStatusBar from '../../component/MyStatusBar';

const Refund: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const [orderDetail] = useOrderDetail(id);
  const [showPreview, setShowPreview] = React.useState(false);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  const [uploading, setUploading] = React.useState(false);
  const [showKF, setShowKF] = React.useState(false);
  const [form, setFormField] = useSearch<OrderRefundForm>({
    fileList: [],
    _fileList: [],
    quantity: 1,
    orderBigId: id,
    reason: '',
  });
  const totalRefundMoney = useMemo(() => {
    if (orderDetail && form.quantity) {
      let total = 0;
      for (let i = 0; i < form.quantity; i++) {
        const price = orderDetail.list[i]?.onePackageMoney || 0;
        total += price;
      }
      return total;
    }
  }, [form.quantity, orderDetail]);

  const [commonDispatcher] = useCommonDispatcher();

  async function selectPhoto() {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 3 - form._fileList.length,
        quality: 0.5,
      });
      if (result?.assets?.length) {
        const files = result.assets.map(asset => {
          // console.log(asset.fileSize);
          return {
            url: asset.uri,
            fileName: getFileNameByPath(asset.uri),
          };
        });
        setFormField('_fileList', [...form._fileList, ...files]);
      }
    } catch (error) {
      console.log(error);
    }
  }
  function handlePreview(index: number) {
    setPreviewIndex(index);
    setShowPreview(true);
  }

  async function handleSubmit() {
    const {_fileList, fileList} = form;
    setUploading(true);
    try {
      let success = false;
      if (!fileList.length) {
        const fileList = [];
        for (let i = 0; i < _fileList.length; i++) {
          const {url, fileName} = _fileList[i];
          const res = await api.common.uploadToOSS(url, fileName);
          fileList.push(res);
        }
        setFormField('fileList', fileList);
        success = await api.order.orderRefund({...form, fileList: fileList});
      } else {
        success = await api.order.orderRefund(form);
      }
      if (success) {
        commonDispatcher.info('退款申请已提交');
      } else {
        commonDispatcher.error('退款申请失败');
      }
      setUploading(false);
      navigateBack();
    } catch (error) {
      setUploading(false);
      commonDispatcher.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <MyStatusBar />
      <NavigationBar
        title="退款"
        headerRight={
          <View style={{paddingRight: globalStyleVariables.MODULE_SPACE}}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setShowKF(true)}>
              <Icon name="nav_kefu" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        }
      />
      <SafeAreaView style={{flex: 1, backgroundColor: '#f4f4f4'}} edges={['bottom']}>
        <ScrollView style={{flex: 1}} keyboardDismissMode="on-drag">
          <View style={styles.block}>
            <Text style={[globalStyles.fontPrimary, {fontSize: 18}]}>{orderDetail?.spuName}</Text>
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE}]} />
            <View style={globalStyles.containerLR}>
              <Text style={[globalStyles.fontPrimary]}>请选择退款订单数量</Text>
              <InputNumber min={1} max={orderDetail?.numberOfProducts} value={form.quantity} onChange={val => setFormField('quantity', val)} />
            </View>
          </View>
          <View style={styles.block}>
            <View>
              <Text style={globalStyles.fontPrimary}>退款金额</Text>
            </View>
            <View style={globalStyles.moduleMarginTop}>
              <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>¥{moneyToYuan(totalRefundMoney)}</Text>
            </View>
          </View>
          <View style={styles.block}>
            <View>
              <Text style={globalStyles.fontPrimary}>退款原因</Text>
            </View>
            <View style={styles.comment}>
              <TextInput
                value={form.reason}
                onChangeText={val => setFormField('reason', val)}
                multiline={true}
                placeholder="补充描述，有助于后期更好地处理售后问题"
                style={styles.commentInput}
              />
              <View style={styles.files}>
                {form._fileList.map((file, i) => {
                  return (
                    <View style={[globalStyles.containerCenter, styles.photoContainer]} key={i}>
                      <TouchableOpacity activeOpacity={0.6} onPress={() => handlePreview(i)}>
                        <Image source={{uri: file.url}} style={styles.photo} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.remove}
                        onPress={() =>
                          setFormField(
                            '_fileList',
                            form._fileList.filter((_, index) => index !== i),
                          )
                        }>
                        <Icon name="all_tupian_delete48" size={24} color={globalStyleVariables.COLOR_WARNING_RED} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
                {form._fileList.length < 3 && (
                  <TouchableOpacity activeOpacity={0.6} onPress={selectPhoto}>
                    <View style={[globalStyles.containerCenter, styles.camera]}>
                      <Icon name="all_uptupian64" size={32} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
                      <Text style={[globalStyles.fontTertiary, {marginTop: 5}]}>上传凭证</Text>
                      <Text style={globalStyles.fontTertiary}>（最多3张）</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
          <Button disabled={uploading} type="primary" title="提交" style={{height: 40}} onPress={handleSubmit} />
        </View>
      </SafeAreaView>

      {showPreview && (
        <Modal visible={true} transparent={true} animationType="fade" onRequestClose={() => setShowPreview(false)}>
          <ImageViewer imageUrls={form._fileList} index={previewIndex} enableSwipeDown={true} onSwipeDown={() => setShowPreview(false)} />
        </Modal>
      )}
      <KFModal visible={showKF} onClose={() => setShowKF(false)} />
    </View>
  );
};

export default Refund;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  block: {
    marginTop: globalStyleVariables.MODULE_SPACE,
    backgroundColor: '#fff',
    padding: globalStyleVariables.MODULE_SPACE,
  },
  comment: {
    marginTop: globalStyleVariables.MODULE_SPACE,
    backgroundColor: '#f4f4f4',
    borderRadius: 7,
    padding: globalStyleVariables.MODULE_SPACE,
  },
  commentInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  files: {
    marginTop: globalStyleVariables.MODULE_SPACE,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  camera: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 7,
    borderColor: globalStyleVariables.TEXT_COLOR_TERTIARY,
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 7,
    marginRight: globalStyleVariables.MODULE_SPACE,
    marginBottom: globalStyleVariables.MODULE_SPACE,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 7,
  },
  remove: {
    width: 24,
    height: 24,
    position: 'absolute',
    top: -12,
    right: -12,
    zIndex: 2,
  },
  uploadIconContainer: {
    width: 30,
    height: 30,
  },
});
