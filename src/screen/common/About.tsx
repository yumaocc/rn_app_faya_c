import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
// import {useSelector} from 'react-redux';
import {NavigationBar, OperateItem} from '../../component';
import MyStatusBar from '../../component/MyStatusBar';
import {PRIVACY_POLICY_URL, USER_AGREEMENT_URL} from '../../constants';
// import {feedbackUrl} from '../../constants/links';
import {globalStyles} from '../../constants/styles';
import {useVersionInfo} from '../../helper/hooks/system';
import {FakeNavigation} from '../../models';
// import {RootState} from '../../redux/reducers';
// import pkg from '../../../package.json';

const About: React.FC = () => {
  const navigation = useNavigation<FakeNavigation>();
  const version = useVersionInfo();
  // const token = useSelector((state: RootState) => state.common.config.token);
  return (
    <View style={styles.container}>
      <MyStatusBar />
      <NavigationBar />
      <View style={[globalStyles.containerCenter, {marginTop: 50}]}>
        <Image source={require('../../assets/logo-h.png')} style={{width: 128, height: 40}} />
        <Text style={[globalStyles.fontPrimary, {fontSize: 15, marginTop: 10}]}>{version.versionText}</Text>
        <Text style={[globalStyles.fontPrimary, {fontSize: 15, marginTop: 10}]}>bundle: {version.bundle || ''}</Text>
      </View>

      <View style={{marginTop: 37}}>
        <OperateItem label="用户协议" showArrow onPress={() => navigation.navigate('Browser', {url: USER_AGREEMENT_URL})} />
        <OperateItem label="隐私政策" showArrow onPress={() => navigation.navigate('Browser', {url: PRIVACY_POLICY_URL})} />
        {/* <OperateItem label="意见反馈" showArrow onPress={() => Linking.openURL(feedbackUrl(token))} /> */}
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
