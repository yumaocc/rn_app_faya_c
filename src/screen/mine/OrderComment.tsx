import React, {useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, Modal, Animated} from 'react-native';
import {useCommonDispatcher, useInfinityRotate, useParams} from '../../helper/hooks';
import {OrderCommentForm, OrderDetailF} from '../../models';
import * as api from '../../apis';
import {Button, NavigationBar, Rate} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useSearch} from '../../fst/hooks';
import {BoolEnum} from '../../fst/models';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import {getFileNameByPath} from '../../helper/system';
import {navigateBack} from '../../router/Router';
import Icon from '../../component/Icon';
import {Icon as AIcon} from '@ant-design/react-native';
import Radio from '../../component/Form/Radio';
// import {copyFileUrl} from '../../helper/system';

const OrderComment: React.FC = () => {
  const params = useParams<{id: string}>();
  const id = useMemo(() => params.id, [params]);
  const [showPreview, setShowPreview] = React.useState(false);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  const [uploading, setUploading] = React.useState(false);

  const [orderDetail, setOrderDetail] = React.useState<OrderDetailF>();
  const [form, setFormField] = useSearch<OrderCommentForm>({
    descriptionMatchesScore: 0,
    businessEnvironmentScore: 0,
    useExperienceScore: 0,
    serviceAttitudeScore: 0,
    content: '',
    orderBigId: id,
    syncToVideo: BoolEnum.TRUE,
    fileList: [],
    _fileList: [],
  });

  const [commonDispatcher] = useCommonDispatcher();
  const rotateDeg = useInfinityRotate();

  useEffect(() => {
    async function f() {
      const res = await api.order.getOrderDetail(id);
      setOrderDetail(res);
    }
    id && f();
  }, [id]);

  async function handleSend() {
    const {_fileList, content, serviceAttitudeScore, businessEnvironmentScore, descriptionMatchesScore, useExperienceScore} = form;
    if (!descriptionMatchesScore) {
      return commonDispatcher.info('请为商品描述相符评分');
    }
    if (!useExperienceScore) {
      return commonDispatcher.info('请为使用体验评分');
    }
    if (!businessEnvironmentScore) {
      return commonDispatcher.info('请为商家环境评分');
    }
    if (!serviceAttitudeScore) {
      return commonDispatcher.info('请为服务态度评分');
    }
    if (!content) {
      return commonDispatcher.info('请填写评论内容');
    }
    setUploading(true);
    try {
      let success = false;
      if (!form.fileList.length) {
        const fileList = [];
        for (let i = 0; i < _fileList.length; i++) {
          const {url, fileName} = _fileList[i];
          const res = await api.common.uploadToOSS(url, fileName);
          fileList.push(res);
        }
        setFormField('fileList', fileList);
        success = await api.order.commentOrder({...form, fileList: fileList});
      } else {
        success = await api.order.commentOrder(form);
      }

      if (success) {
        commonDispatcher.info('发布成功');
      } else {
        commonDispatcher.error('发布失败');
      }
      setUploading(false);
      navigateBack();
    } catch (error) {
      commonDispatcher.error(error);
      setUploading(false);
    }
  }

  function handlePreview(index: number) {
    setPreviewIndex(index);
    setShowPreview(true);
  }

  async function selectPhoto() {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 9 - form._fileList.length,
        quality: 0.5,
      });
      if (result?.assets?.length) {
        const files = result.assets.map(asset => {
          console.log(asset.fileSize);
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

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['bottom']} style={{flex: 1}}>
        <NavigationBar
          title="首页"
          headerRight={
            <View style={{paddingRight: globalStyleVariables.MODULE_SPACE}}>
              <Button title="发布" type="primary" style={{height: 34}} onPress={handleSend} />
            </View>
          }
        />
        <ScrollView style={{backgroundColor: '#fff', flex: 1}} keyboardDismissMode="on-drag">
          <View style={styles.orderContainer}>
            <View style={[{flexDirection: 'row', alignItems: 'flex-start'}]}>
              <Image source={{uri: orderDetail?.spuCoverImage}} defaultSource={require('../../assets/sku_def_1_1.png')} style={styles.orderCover} />
              <View style={{flex: 1, marginLeft: globalStyleVariables.MODULE_SPACE}}>
                <View style={globalStyles.containerRow}>
                  <Icon name="shangpin_shanghu24" size={20} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                  <Text style={[globalStyles.fontStrong]} numberOfLines={1}>
                    {orderDetail?.bizName}
                  </Text>
                </View>
                <Text style={[globalStyles.fontStrong]} numberOfLines={2}>
                  {orderDetail?.spuName}
                </Text>
              </View>
            </View>
            <View style={[globalStyles.lineHorizontal, {marginVertical: globalStyleVariables.MODULE_SPACE}]} />
            <View style={[styles.rateItem, globalStyles.containerRow]}>
              <Text style={{marginRight: 20}}>描述相符</Text>
              <Rate value={form.descriptionMatchesScore} onChange={val => setFormField('descriptionMatchesScore', val)} style={{flex: 1}} />
            </View>
            <View style={[styles.rateItem, globalStyles.containerRow]}>
              <Text style={{marginRight: 20}}>使用体验</Text>
              <Rate value={form.useExperienceScore} onChange={val => setFormField('useExperienceScore', val)} style={{flex: 1}} />
            </View>
            <View style={[styles.rateItem, globalStyles.containerRow]}>
              <Text style={{marginRight: 20}}>商家环境</Text>
              <Rate value={form.businessEnvironmentScore} onChange={val => setFormField('businessEnvironmentScore', val)} style={{flex: 1}} />
            </View>
            <View style={[styles.rateItem, globalStyles.containerRow]}>
              <Text style={{marginRight: 20}}>服务态度</Text>
              <Rate value={form.serviceAttitudeScore} onChange={val => setFormField('serviceAttitudeScore', val)} style={{flex: 1}} />
            </View>
          </View>
          <View style={[styles.orderContainer, {marginTop: globalStyleVariables.MODULE_SPACE}]}>
            <View style={styles.comment}>
              <TextInput
                value={form.content}
                onChangeText={val => setFormField('content', val)}
                multiline={true}
                placeholder="写写你的使用体验吧，可以帮助更多想买的人哦"
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
                {form._fileList.length < 9 && (
                  <TouchableOpacity activeOpacity={0.6} onPress={selectPhoto}>
                    <View style={[globalStyles.containerCenter, styles.camera]}>
                      <Icon name="all_uptupian64" size={24} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {form._fileList.length > 0 && (
              <Radio
                checked={form.syncToVideo === BoolEnum.TRUE}
                fontSize={15}
                onChange={val => setFormField('syncToVideo', val ? BoolEnum.TRUE : BoolEnum.FALSE)}
                style={{marginTop: globalStyleVariables.MODULE_SPACE}}>
                公开，同步到个人作品
              </Radio>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={showPreview} transparent={true} animationType="fade" onRequestClose={() => setShowPreview(false)}>
        <ImageViewer imageUrls={form._fileList} index={previewIndex} enableSwipeDown={true} onSwipeDown={() => setShowPreview(false)} />
      </Modal>

      <Modal visible={uploading} transparent animationType="fade">
        <View style={[globalStyles.containerCenter, {flex: 1, backgroundColor: '#00000033'}]}>
          <View style={[globalStyles.containerCenter, {backgroundColor: '#fff', paddingHorizontal: 30, paddingVertical: 40, borderRadius: 5}]}>
            <Animated.View style={[styles.uploadIconContainer, {transform: [{rotate: rotateDeg.interpolate({inputRange: [0, 1], outputRange: ['0deg', '360deg']})}]}]}>
              <AIcon name="loading-3-quarters" color={globalStyleVariables.TEXT_COLOR_TERTIARY} size={30} />
            </Animated.View>
            <Text style={[globalStyles.fontPrimary, {marginTop: 10}]}>正在发布</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OrderComment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  orderContainer: {
    backgroundColor: '#fff',
    marginTop: globalStyleVariables.MODULE_SPACE,
    padding: globalStyleVariables.MODULE_SPACE,
  },
  orderCover: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: globalStyleVariables.MODULE_SPACE,
  },
  rateItem: {
    height: 40,
  },
  comment: {
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
