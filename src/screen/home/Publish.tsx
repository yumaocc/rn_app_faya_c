import React, {useMemo, useState} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, NavigationBar, Popup, Switch} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {FakeNavigation, WorkType, WorkVisibleAuth} from '../../models';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {WorkVisibleAuthOptions} from '../../constants';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers';
import {useNavigation} from '@react-navigation/native';

const Publish: React.FC = () => {
  const workType = WorkType.Video;
  const spu = useSelector((state: RootState) => state.work.bindSPU);
  const videoInfo = useSelector((state: RootState) => state.work.videoInfo);
  const [visibleAuthType, setVisibleAuthType] = useState(WorkVisibleAuth.Public);
  const [showChangeVisibleAuthPopup, setShowChangeVisibleAuthPopup] = useState(false);
  const [showSettingPopup, setShowSettingPopup] = useState(false);
  const [allowDownload, setAllowDownload] = useState(true);
  const [allowForward, setAllowForward] = useState(true);
  const [autoSave, setAutoSave] = useState(false);

  const navigation = useNavigation<FakeNavigation>();

  const currentVisibleAuthType = useMemo(() => {
    return WorkVisibleAuthOptions.find(item => item.value === visibleAuthType);
  }, [visibleAuthType]);

  function handlePublish() {
    console.log('准备发布');
  }
  return (
    <>
      <SafeAreaView edges={['bottom']} style={{flex: 1}}>
        <NavigationBar title="发布" />
        <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="handled">
          <View>
            {workType === WorkType.Video && (
              <View style={styles.videoContainer}>
                <TextInput multiline={true} style={styles.videoInput} placeholder="写标题并使用合适的话题，能让更多人看到~" />
                <Image style={styles.videoCover} source={{uri: videoInfo?.coverPath ? 'file://' + videoInfo.coverPath : 'https://fakeimg.pl/100?text=loading'}} />
              </View>
            )}
          </View>
          <View style={[{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER, paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
            <View style={globalStyles.lineHorizontal} />
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('SelectSPU')}>
              <View style={styles.formItem}>
                <View style={[globalStyles.containerRow]}>
                  <MaterialIcon name="shopping-cart" size={24} color={globalStyleVariables.COLOR_PRIMARY} />
                  <Text style={[globalStyles.fontPrimary, {marginHorizontal: globalStyleVariables.MODULE_SPACE}]}>添加商品</Text>
                  {!spu && (
                    <View style={[globalStyles.tagWrapper, {backgroundColor: '#0000000D'}]}>
                      <Text style={[globalStyles.tag, {color: globalStyleVariables.TEXT_COLOR_PRIMARY}]}>添加与视频相关的商品链接</Text>
                    </View>
                  )}
                </View>
                <View style={globalStyles.containerRow}>
                  {!!spu && <Text>{spu?.spuName}</Text>}
                  <MaterialIcon name="arrow-forward-ios" size={24} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
                </View>
              </View>
            </TouchableOpacity>
            <View style={globalStyles.lineHorizontal} />
            <TouchableOpacity activeOpacity={0.8} onPress={() => setShowChangeVisibleAuthPopup(true)}>
              <View style={styles.formItem}>
                <View style={globalStyles.containerRow}>
                  <MaterialIcon name="lock" size={24} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
                  <Text style={[globalStyles.fontPrimary, {marginHorizontal: globalStyleVariables.MODULE_SPACE}]}>{currentVisibleAuthType?.label}</Text>
                </View>
                <MaterialIcon name="arrow-forward-ios" size={24} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setShowSettingPopup(true)}>
              <View style={styles.formItem}>
                <View style={globalStyles.containerRow}>
                  <MaterialIcon name="settings" size={24} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
                  <Text style={[globalStyles.fontPrimary, {marginHorizontal: globalStyleVariables.MODULE_SPACE}]}>更多设置</Text>
                </View>
                <MaterialIcon name="arrow-forward-ios" size={24} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE, paddingBottom: globalStyleVariables.MODULE_SPACE}}>
          <Button title="发布" style={{height: 40}} onPress={handlePublish} />
        </View>
      </SafeAreaView>
      {/* 选择可见范围 */}
      <Popup
        visible={showChangeVisibleAuthPopup}
        onClose={() => setShowChangeVisibleAuthPopup(false)}
        style={[{borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingTop: 10}]}>
        <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE}}>
          {WorkVisibleAuthOptions.map((auth, index) => {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                key={auth.value}
                onPress={() => {
                  setVisibleAuthType(auth.value);
                  setShowChangeVisibleAuthPopup(false);
                }}>
                <View style={[styles.formItem, {borderColor: globalStyleVariables.BORDER_COLOR, borderTopWidth: index === 0 ? 0 : StyleSheet.hairlineWidth}]}>
                  <Text style={globalStyles.fontPrimary}>{auth.label}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </Popup>
      {/* 更多设置 */}
      <Popup visible={showSettingPopup} onClose={() => setShowSettingPopup(false)} style={[{borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingTop: 10}]}>
        <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE}}>
          <View style={[styles.formItem]}>
            <Text style={globalStyles.fontPrimary}>发布后保存到相册</Text>
            <Switch checked={autoSave} onChange={setAutoSave} />
          </View>
          <View style={[styles.formItem]}>
            <Text style={globalStyles.fontPrimary}>允许其他人转发</Text>
            <Switch checked={allowForward} onChange={setAllowForward} />
          </View>
          <View style={[styles.formItem]}>
            <Text style={globalStyles.fontPrimary}>允许其他人下载</Text>
            <Switch checked={allowDownload} onChange={setAllowDownload} />
          </View>
          {/*  */}
          <View />
        </View>
      </Popup>
    </>
  );
};
export default Publish;

const styles = StyleSheet.create({
  videoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: globalStyleVariables.MODULE_SPACE,
  },
  videoInput: {
    textAlignVertical: 'top',
    flex: 1,
    // backgroundColor: '#ccc',
    height: 140,
    marginRight: globalStyleVariables.MODULE_SPACE,
  },
  videoCover: {
    width: 100,
    height: 140,
    position: 'relative',
    borderRadius: 5,
  },
  formItem: {
    // marginBottom: globalStyleVariables.MODULE_SPACE,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: '#6cf',
  },
});
