import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, NavigationBar, Popup, Switch} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {FakeNavigation, SPUDetailF, SPUF, WorkType, WorkVisibleAuth} from '../../models';
import {WorkVisibleAuthOptions} from '../../constants';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers';
import {useNavigation} from '@react-navigation/native';
import {useCommonDispatcher, useWorkDispatcher} from '../../helper/hooks';
import {BoolEnum} from '../../fst/models';
import Icon from '../../component/Icon';
import MyStatusBar from '../../component/MyStatusBar';
import * as api from '../../apis';

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
  const [content, setContent] = useState('');
  const [spuPoster, spuName] = useMemo(() => {
    const poster = (spu as SPUF)?.poster || (spu as SPUDetailF)?.posters[0];
    const name = (spu as SPUF)?.spuName || (spu as SPUDetailF)?.name;
    return [poster, name];
  }, [spu]);

  const navigation = useNavigation<FakeNavigation>();
  const [workDispatcher] = useWorkDispatcher();
  const [commonDispatcher] = useCommonDispatcher();

  useEffect(() => {
    return () => {
      workDispatcher.setWorkSPU(null);
    };
  }, [workDispatcher]);

  const currentVisibleAuthType = useMemo(() => {
    return WorkVisibleAuthOptions.find(item => item.value === visibleAuthType);
  }, [visibleAuthType]);

  function check(): string {
    if (!content) {
      return '?????????????????????';
    }
  }

  async function handlePublish() {
    const res = check();
    if (res) {
      return commonDispatcher.error(res);
    }
    try {
      await api.work.checkWorkPublishContent(content);
    } catch (error) {
      return commonDispatcher.error(error);
    }
    workDispatcher.setPublishConfig({
      content: content,
      hasPrivate: visibleAuthType,
      allowDownload: allowDownload ? BoolEnum.TRUE : BoolEnum.FALSE,
      allowForward: allowForward ? BoolEnum.TRUE : BoolEnum.FALSE,
      autoSaveAfterPublish: autoSave,
      addressName: '',
      publishType: WorkType.Video,
    });
    navigation.navigate('PublishVideo');
  }
  return (
    <>
      <SafeAreaView edges={['bottom']} style={{flex: 1, backgroundColor: '#fff'}}>
        <MyStatusBar />
        <NavigationBar title="??????" style={{backgroundColor: '#fff'}} />
        <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="never">
          <View>
            {workType === WorkType.Video && (
              <View style={styles.videoContainer}>
                <TextInput value={content} onChangeText={setContent} multiline={true} style={styles.videoInput} placeholder="??????????????????..." />
                {!!videoInfo?.coverPath && <Image style={styles.videoCover} source={{uri: 'file://' + videoInfo.coverPath}} />}
                {!videoInfo?.coverPath && <Image style={styles.videoCover} source={require('../../assets/sku_def_180w.png')} />}
              </View>
            )}
          </View>
          <View style={[{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER, paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
            <View style={globalStyles.lineHorizontal} />
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('SelectSPU')}>
              <View style={styles.formItem}>
                <View style={[globalStyles.containerRow]}>
                  <Icon name="fabu_shangping48" size={24} color={globalStyleVariables.COLOR_PRIMARY} style={{marginRight: globalStyleVariables.MODULE_SPACE}} />
                  {!spu && (
                    <View>
                      <Text style={[globalStyles.fontPrimary]}>????????????</Text>
                      <Text style={[globalStyles.fontTertiary, {marginTop: 5}]}>????????????????????????????????????</Text>
                    </View>
                  )}
                </View>
                <View style={[globalStyles.containerRow, {flex: 1}]}>
                  {!!spu && (
                    <View style={[globalStyles.containerRow, styles.showSPUContainer]}>
                      <Image source={{uri: spuPoster}} style={{width: 30, height: 30, borderRadius: 5, marginRight: 5}} />
                      <View style={{flex: 1}}>
                        <Text style={globalStyles.fontPrimary} numberOfLines={1}>
                          {spuName}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
                <Icon name="all_arrowR36" size={24} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
              </View>
            </TouchableOpacity>
            <View style={globalStyles.lineHorizontal} />
            <TouchableOpacity activeOpacity={0.8} onPress={() => setShowChangeVisibleAuthPopup(true)}>
              <View style={styles.formItem}>
                <View style={globalStyles.containerRow}>
                  <Icon
                    name={currentVisibleAuthType.value === WorkVisibleAuth.Public ? 'fabu_quanxian_kai48' : 'fabu_quanxian_guan48'}
                    size={24}
                    color={globalStyleVariables.TEXT_COLOR_TERTIARY}
                  />
                  <Text style={[globalStyles.fontPrimary, {marginHorizontal: globalStyleVariables.MODULE_SPACE}]}>{currentVisibleAuthType?.label}</Text>
                </View>
                <Icon name="all_arrowR36" size={24} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setShowSettingPopup(true)}>
              <View style={styles.formItem}>
                <View style={globalStyles.containerRow}>
                  <Icon name="fabu_shezhi48" size={24} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
                  <Text style={[globalStyles.fontPrimary, {marginHorizontal: globalStyleVariables.MODULE_SPACE}]}>????????????</Text>
                </View>
                <Icon name="all_arrowR36" size={24} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE_BIGGER, paddingBottom: globalStyleVariables.MODULE_SPACE}}>
          <Button type="primary" title="??????" style={{height: 40}} onPress={handlePublish} />
        </View>
      </SafeAreaView>
      {/* ?????????????????? */}
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
      {/* ???????????? */}
      <Popup visible={showSettingPopup} onClose={() => setShowSettingPopup(false)} style={[{borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingTop: 10}]}>
        <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE}}>
          <View style={[styles.formItem]}>
            <Text style={globalStyles.fontPrimary}>????????????????????????</Text>
            <Switch checked={autoSave} onChange={setAutoSave} />
          </View>
          <View style={[styles.formItem]}>
            <Text style={globalStyles.fontPrimary}>?????????????????????</Text>
            <Switch checked={allowForward} onChange={setAllowForward} />
          </View>
          <View style={[styles.formItem]}>
            <Text style={globalStyles.fontPrimary}>?????????????????????</Text>
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
  },
  showSPUContainer: {
    paddingVertical: 5,
    paddingRight: 10,
    paddingLeft: 5,
    width: 200,
    borderRadius: 5,
    backgroundColor: '#0000000D',
  },
});
