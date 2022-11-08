import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationBar, OperateItem, Switch} from '../../../component';
import MyStatusBar from '../../../component/MyStatusBar';
import {getItem, setItem} from '../../../helper/cache/helper';

const PrivacySetting: React.FC = () => {
  const [checked, setChecked] = React.useState(false);
  useEffect(() => {
    getItem('personalizedPush').then(c => {
      setChecked(c === 'true');
    });
  }, []);
  useEffect(() => {
    setItem('personalizedPush', checked ? 'true' : 'false');
  }, [checked]);
  return (
    <View style={styles.container}>
      <MyStatusBar />
      <SafeAreaView style={{flex: 1}} edges={['bottom']}>
        <NavigationBar title="隐私设置" />

        <OperateItem label="开启个性化推送">
          <Switch checked={checked} onChange={setChecked} />
        </OperateItem>
      </SafeAreaView>
    </View>
  );
};

export default PrivacySetting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
