import React, {useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Button, NavigationBar} from '../../../component';
import * as api from '../../../apis';
import {useCommonDispatcher, useIsLoggedIn, useParams, useUserDispatcher} from '../../../helper/hooks';
import {globalStyles} from '../../../constants/styles';
import {useNavigation} from '@react-navigation/native';
import {FakeNavigation} from '../../../models';
import MyStatusBar from '../../../component/MyStatusBar';

const Invite: React.FC = () => {
  const [inviteCode, setInviteCode] = React.useState<number>(null);
  const {userId} = useParams<{userId: string}>();
  const [commonDispatcher] = useCommonDispatcher();
  const [userDispatcher] = useUserDispatcher();
  const success = useMemo(() => inviteCode === 1, [inviteCode]); // 1升级成功
  const fail = useMemo(() => inviteCode === 3, [inviteCode]); // 3已经是达人
  const navigation = useNavigation<FakeNavigation>();
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (!isLoggedIn) {
      userDispatcher.login({
        back: true,
      });
      return;
    }
    // console.log('即将绑定：', userId);
    api.user
      .agentRegister(userId)
      .then(res => {
        setInviteCode(res);
        userDispatcher.getMyDetail();
      })
      .catch(commonDispatcher.error);
  }, [commonDispatcher.error, userId, isLoggedIn, userDispatcher]);

  function onOk() {
    navigation.canGoBack() && navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <MyStatusBar />
      <NavigationBar title="" />
      {success && (
        <View style={globalStyles.containerCenter}>
          <Image source={require('../../../assets/tyro.png')} style={styles.titleBg} resizeMode="contain" />
        </View>
      )}

      <View style={[globalStyles.containerCenter, {marginTop: 113}]}>
        <Image source={require('../../../assets/img_daren_sign_ring_xinshou.png')} style={styles.star} />
      </View>
      {fail && (
        <View style={globalStyles.containerCenter}>
          <Text style={[globalStyles.fontPrimary, {fontSize: 18}]}>您已经是达人了</Text>
        </View>
      )}
      {success && (
        <View style={globalStyles.containerCenter}>
          <Text style={[globalStyles.fontPrimary, {fontSize: 18}]}>恭喜您升级为</Text>
          <Text style={[globalStyles.fontPrimary, {fontSize: 40}]}>新手达人</Text>
        </View>
      )}

      {inviteCode && (
        <View style={[globalStyles.containerCenter, {marginTop: 20}]}>
          <Button title="确定" type="primary" style={styles.button} activeStyle={{borderColor: '#666', backgroundColor: '#666'}} onPress={onOk} />
        </View>
      )}
    </View>
  );
};

export default Invite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleBg: {
    position: 'absolute',
    width: 244,
    height: 100,
    top: 54,
  },
  star: {
    width: 94,
    height: 64,
  },
  button: {
    backgroundColor: '#000',
    borderColor: '#000',
    paddingLeft: 30,
    paddingRight: 30,
  },
});
