import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {NavigationBar, OperateItem} from '../../component';
import MyStatusBar from '../../component/MyStatusBar';
import {PRIVACY_POLICY_URL, USER_AGREEMENT_URL} from '../../constants';
import {globalStyles} from '../../constants/styles';
import {FakeNavigation} from '../../models';
import pkg from '../../../package.json';

const About: React.FC = () => {
  const navigation = useNavigation<FakeNavigation>();
  return (
    <View style={styles.container}>
      <MyStatusBar />
      <NavigationBar />
      <View style={[globalStyles.containerCenter, {marginTop: 50}]}>
        <Image source={require('../../assets/logo-h.png')} style={{width: 128, height: 40}} />
        <Text style={[globalStyles.fontPrimary, {fontSize: 15, marginTop: 10}]}>v{pkg.version}</Text>
      </View>

      <View style={{marginTop: 37}}>
        <OperateItem label="用户协议" showArrow onPress={() => navigation.navigate('Browser', {url: USER_AGREEMENT_URL})} />
        <OperateItem label="隐私政策" showArrow onPress={() => navigation.navigate('Browser', {url: PRIVACY_POLICY_URL})} />
      </View>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
