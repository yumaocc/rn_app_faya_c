import React, {useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar} from 'react-native';
import {NavigationBar, Tabs} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {OtherUserDetail} from '../../models';
import * as api from '../../apis';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers';
import {useCommonDispatcher, useUserDispatcher} from '../../helper/hooks';
import Icon from '../../component/Icon';
// import { goLogin } from '../../router/Router';
const items = [
  {
    title: '作品',
    key: 'work',
  },
  {
    title: '喜欢',
    key: 'like',
  },
];

const User: React.FC = () => {
  const [userInfo, setUserInfo] = React.useState<OtherUserDetail>(null);
  const token = useSelector((state: RootState) => state.common.token);
  const [userDispatcher] = useUserDispatcher();
  const [commonDispatcher] = useCommonDispatcher();

  const showFollow = useMemo(() => userInfo && !userInfo.hasCare, [userInfo]);

  useEffect(() => {
    refreshUser();
  }, []);

  async function refreshUser() {
    api.user.getOtherUserInfo(3).then(setUserInfo).catch(console.log);
  }
  async function followUser() {
    if (!token) {
      userDispatcher.login({
        back: true,
      });
    } else {
      try {
        await api.user.followUser(3);
        await refreshUser();
      } catch (error) {
        commonDispatcher.error(error);
      }
    }
  }

  async function sendMessage() {
    console.log(1);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={{flex: 1}} contentContainerStyle={{position: 'relative'}}>
        <Image source={require('../../assets/mine-bg.png')} style={styles.cover} />
        <View style={{flex: 1}}>
          <NavigationBar title="" color="#fff" />
          <View style={[styles.userActions]}>
            {showFollow && (
              <TouchableOpacity activeOpacity={0.7} onPress={followUser}>
                <View style={[styles.userAction]}>
                  <Text style={[globalStyles.fontPrimary, {color: '#fff'}]}>关注</Text>
                </View>
              </TouchableOpacity>
            )}
            {true && (
              <TouchableOpacity activeOpacity={0.7} onPress={sendMessage}>
                <View style={[styles.userAction]}>
                  <Icon name="wode_sixin30" color="#fff" size={15} />
                  <Text style={[globalStyles.fontPrimary, {color: '#fff', marginLeft: globalStyleVariables.MODULE_SPACE_SMALLER}]}>发私信</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={[styles.container, {paddingTop: 0, marginTop: 20}]}>
            <View style={{borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: '#fff'}}>
              {/* 头像栏 */}
              <View style={[styles.userData]}>
                {!!userInfo?.avatar && <Image style={[styles.avatar]} source={{uri: userInfo.avatar}} />}
                {!userInfo?.avatar && <Image style={[styles.avatar]} source={require('../../assets/avatar_def.png')} />}
                <View style={[globalStyles.containerRow, {justifyContent: 'space-around', flex: 1, height: 62}]}>
                  <View style={{alignItems: 'center', flex: 1}}>
                    <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{userInfo?.nums?.fansNums}</Text>
                    <Text style={[globalStyles.fontPrimary]}>粉丝</Text>
                  </View>
                  <View style={{alignItems: 'center', flex: 1}}>
                    <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{userInfo?.nums?.followNums}</Text>
                    <Text style={[globalStyles.fontPrimary]}>关注</Text>
                  </View>
                  <View style={{alignItems: 'center', flex: 1}}>
                    <Text style={[globalStyles.fontPrimary, {fontSize: 20}]}>{userInfo?.nums?.likeNums}</Text>
                    <Text style={[globalStyles.fontPrimary]}>获赞</Text>
                  </View>
                </View>
              </View>

              {/* 用户基本信息栏 */}
              <View style={[{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER, paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
                <View style={globalStyles.containerRow}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {userInfo?.nickName}
                  </Text>
                </View>
                {/* {!!userInfo?.account && (
                <View style={[globalStyles.containerRow, globalStyles.halfModuleMarginTop]}>
                  <Text style={[globalStyles.fontPrimary]}>发芽号：{userInfo?.account}</Text>
                  <TouchableOpacity activeOpacity={0.8} onPress={handleCopy}>
                    <Icon name="copy" size={18} color="#ccc" style={{marginLeft: 10}} />
                  </TouchableOpacity>
                </View>
              )} */}
                <View style={globalStyles.halfModuleMarginTop}>
                  <Text style={globalStyles.fontSecondary} numberOfLines={1}>
                    {userInfo?.say}
                  </Text>
                </View>
              </View>

              {true && (
                <>
                  {/* 订单入口栏 */}
                  <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE, paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
                    <TouchableOpacity activeOpacity={0.8} style={{flex: 1}}>
                      <View style={[globalStyles.containerRow]}>
                        <View style={[globalStyles.containerCenter, styles.entry]}>
                          <Icon name="wode_dingdan48" color={globalStyleVariables.TEXT_COLOR_PRIMARY} size={24} />
                        </View>
                        <Text>橱窗</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* 作品分类 */}
                  <Tabs tabs={items} showIndicator style={{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}} />
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cover: {
    width: '100%',
    height: 180,
    position: 'absolute',
    top: 0,
  },
  userActions: {
    marginTop: 30,
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  userAction: {
    height: 35,
    borderRadius: 35,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#fff',
    marginLeft: globalStyleVariables.MODULE_SPACE,
    backgroundColor: globalStyleVariables.COLOR_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  userData: {
    height: 83,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: -20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
  entry: {
    width: 60,
    height: 60,
    backgroundColor: '#00000008',
    marginRight: 10,
    borderRadius: 5,
  },
});
