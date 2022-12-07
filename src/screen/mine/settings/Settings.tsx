import React from 'react';
import {View, Text, StyleSheet, ScrollView, Linking} from 'react-native';
import {Button, NavigationBar, OperateItem} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
// import pkg from '../../../../package.json';
import {useUserDispatcher} from '../../../helper/hooks';
import KFModal from '../../common/KFModal';
import {useNavigation} from '@react-navigation/native';
import {FakeNavigation} from '../../../models';
import MyStatusBar from '../../../component/MyStatusBar';
import {userIsAgent} from '../../../helper/user';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/reducers';
import {useVersionInfo} from '../../../helper/hooks/system';

const Settings: React.FC = () => {
  const [showKF, setShowKF] = React.useState(false);
  const user = useSelector((state: RootState) => state.user.myDetail);
  const token = useSelector((state: RootState) => state.common.config.token);
  const isAgent = userIsAgent(user.level);

  const navigation = useNavigation<FakeNavigation>();
  const [userDispatcher] = useUserDispatcher();
  const version = useVersionInfo();

  function handleDeleteAccount() {
    Linking.openURL(`https://m.faya.life/?token=${token}#/user/account/delete`);
  }

  return (
    <View style={styles.container}>
      <NavigationBar title="设置" />
      <MyStatusBar />
      <ScrollView style={{flex: 1}}>
        <OperateItem label="收货地址" showArrow onPress={() => navigation.navigate('ManageAddress')} />
        <View style={{height: 10, backgroundColor: '#f4f4f4'}} />
        <OperateItem label="个人资料" showArrow onPress={() => navigation.navigate('MyProfile')} />
        {isAgent && <OperateItem label="达人主页" showArrow onPress={() => navigation.navigate('Profile')} />}
        {isAgent && <View style={{height: 10, backgroundColor: '#f4f4f4'}} />}

        <OperateItem label="隐私设置" showArrow onPress={() => navigation.navigate('PrivacySetting')} />
        {/* <OperateItem label="隐私设置" showArrow /> */}
        <OperateItem label="联系客服" showArrow onPress={() => setShowKF(true)} />
        {/* <OperateItem label="帮助与反馈" showArrow /> */}
        <OperateItem label="关于发芽" showArrow onPress={() => navigation.navigate('About')}>
          <Text style={globalStyles.fontPrimary}>v{version.version}</Text>
        </OperateItem>
        <OperateItem label="注销账号" showArrow onPress={handleDeleteAccount} />

        <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
          <Button title="退出账户" style={{height: 50, backgroundColor: '#0000001A'}} onPress={userDispatcher.logout} />
        </View>
      </ScrollView>
      <KFModal visible={showKF} onClose={() => setShowKF(false)} />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
