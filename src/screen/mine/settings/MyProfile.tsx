import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, StatusBar, Image, TouchableOpacity, Text, TextInput, Platform, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import {NavigationBar, OperateItem, Popup} from '../../../component';
import Icon from '../../../component/Icon';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useCommonDispatcher, useKeyboardHeight, useUserDispatcher} from '../../../helper/hooks';
import {ModifyProfileForm} from '../../../models';
import {RootState} from '../../../redux/reducers';
import * as api from '../../../apis';
import {useForceUpdate} from '../../../fst/hooks';
import {launchImageLibrary} from 'react-native-image-picker';
import {getFileNameByPath} from '../../../helper/system';

const MyProfile: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.user.myDetail);
  const [showInput, setShowInput] = React.useState(false);
  const [inputKey, setInputKey] = React.useState('');
  const [inputValue, setInputValue] = React.useState('');
  const [newAvatar, setNewAvatar] = React.useState('');

  const inputRef = useRef<TextInput>(null);
  const keyboardHeight = useKeyboardHeight();
  const [signal, update] = useForceUpdate();
  const [userDispatcher] = useUserDispatcher();
  const [commonDispatcher] = useCommonDispatcher();

  useEffect(() => {
    userDispatcher.getMyDetail();
  }, [signal, userDispatcher]);

  function closeInput() {
    setShowInput(false);
  }

  async function chooseAvatar() {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.5,
      });
      if (result.assets?.length) {
        const asset = result.assets[0];
        const file = {
          url: asset.uri,
          fileName: getFileNameByPath(asset.uri),
        };
        uploadAvatar(file);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function uploadAvatar(file: {url: string; fileName: string}) {
    setNewAvatar(file.url);
    try {
      const res = await api.common.uploadToOSS(file.url, file.fileName);
      let params: ModifyProfileForm = {
        nickName: userInfo?.nickName,
        say: userInfo?.say,
        backgroudPic: userInfo?.backgroudPic,
        avatar: res,
      };
      await doModify(params);
    } catch (error) {
      commonDispatcher.error(error);
    }
    setNewAvatar('');
  }

  function modifyNickName() {
    setShowInput(true);
    setInputKey('nickName');
    setInputValue(userInfo?.nickName || '');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }

  function modifySay() {
    setShowInput(true);
    setInputKey('say');
    setInputValue(userInfo?.say || '');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }
  async function doModify(form: ModifyProfileForm) {
    await api.user.modifyProfile(form);
    commonDispatcher.success('修改成功');
    closeInput();
    update();
  }
  async function confirmModify() {
    if (!inputValue) {
      return;
    }
    let params: ModifyProfileForm = {
      avatar: userInfo?.avatar,
      nickName: userInfo?.nickName,
      say: userInfo?.say,
      backgroudPic: userInfo?.backgroudPic,
      [inputKey]: inputValue,
    };
    try {
      await doModify(params);
    } catch (error) {
      commonDispatcher.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationBar title="个人资料" />

      <View>
        <View style={globalStyles.containerCenter}>
          {newAvatar ? (
            <View style={styles.avatarContainer}>
              <Image style={[styles.avatar]} source={{uri: newAvatar}} />
              <View style={[styles.avatar, {position: 'absolute', backgroundColor: '#0000001a'}, globalStyles.containerCenter]}>
                <ActivityIndicator />
              </View>
            </View>
          ) : (
            <View style={styles.avatarContainer}>
              {!!userInfo.avatar && <Image style={[styles.avatar]} source={{uri: userInfo.avatar}} />}
              {!userInfo.avatar && <Image style={[styles.avatar]} source={require('../../../assets/avatar_def.png')} />}
              <TouchableOpacity activeOpacity={0.8} onPress={chooseAvatar} style={styles.editContainer}>
                <Image source={require('../../../assets/icon-bianji.png')} style={styles.edit} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <OperateItem label="昵称" showArrow onPress={modifyNickName}>
          <Text>{userInfo?.nickName}</Text>
        </OperateItem>
        <OperateItem label="简介" showArrow onPress={modifySay}>
          <Text>{userInfo?.say || '未填写'}</Text>
        </OperateItem>
      </View>
      {/* 修改资料弹窗 */}
      {showInput && (
        <Popup visible={true} onClose={closeInput}>
          <View style={{paddingBottom: Platform.OS === 'ios' ? keyboardHeight : 0}}>
            <View style={[globalStyles.containerRow, {paddingVertical: 7, paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
              <TouchableOpacity activeOpacity={0.8} onPress={closeInput}>
                <Icon name="all_popclose36" size={18} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
              </TouchableOpacity>
              <Text style={[globalStyles.fontStrong, {flex: 1, textAlign: 'center'}]}>修改资料</Text>
              <TouchableOpacity activeOpacity={0.8} onPress={confirmModify}>
                <Text style={globalStyles.fontPrimary}>完成</Text>
              </TouchableOpacity>
            </View>
            <View style={{padding: 10}}>
              <TextInput
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="请输入"
                returnKeyType="done"
                ref={inputRef}
                style={styles.input}
                onSubmitEditing={confirmModify}
              />
            </View>
          </View>
        </Popup>
      )}
    </View>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f4f4f4',
  },
  editContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  edit: {
    width: 30,
    height: 30,
  },
  input: {
    margin: 0,
    padding: 0,
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
    paddingVertical: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
  },
});
