import React from 'react';
import {View, Text, StyleSheet, StatusBar, ScrollView} from 'react-native';
import {Button, NavigationBar, OperateItem} from '../../../component';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import pkg from '../../../../package.json';
import {useUserDispatcher} from '../../../helper/hooks';

const Settings: React.FC = () => {
  const [userDispatcher] = useUserDispatcher();

  return (
    <View style={styles.container}>
      <NavigationBar title="设置" />
      <StatusBar barStyle="dark-content" />
      <ScrollView style={{flex: 1}}>
        <OperateItem label="账号与安全" showArrow />
        <OperateItem label="隐私设置" showArrow />
        <OperateItem label="联系客服" showArrow />
        <OperateItem label="帮助与反馈" showArrow />
        <OperateItem label="鼓励一下" showArrow />
        <OperateItem label="关于发芽" showArrow>
          <Text style={globalStyles.fontPrimary}>v{pkg.version}</Text>
        </OperateItem>

        <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
          <Button title="退出账户" style={{height: 50, backgroundColor: '#0000001A'}} onPress={userDispatcher.logout} />
        </View>
      </ScrollView>
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