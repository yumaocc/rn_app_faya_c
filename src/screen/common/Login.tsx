import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import {Button} from '@ant-design/react-native';
import {useSelector} from 'react-redux';
import {useCommonDispatcher, useUserDispatcher} from '../../helper/hooks';
import {RootState} from '../../redux/reducers';
import {LoginState} from '../../fst/models';
import * as api from '../../apis';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useNavigation} from '@react-navigation/native';
import {FakeNavigation} from '../../models';
import {PRIVACY_POLICY_URL, USER_AGREEMENT_URL} from '../../constants';
import {cache} from '../../helper/cache';
import MyStatusBar from '../../component/MyStatusBar';
import Radio from '../../component/Form/Radio';
import {NavigationBar, Popup} from '../../component';
import Icon from '../../component/Icon';

const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState(''); // 验证码
  const [agree, setAgree] = useState(false); // 是否同意用户协议
  const [showAgreeTip, setShowAgreeTip] = useState(false); // 是否显示同意用户协议提示
  const [loginState, setLoginState] = useState<LoginState>(LoginState.None);
  const [verifyCodeSend, setVerifyCodeSend] = useState(false);
  const [resendAfter, setResendAfter] = useState(0);
  const suggestPhone = useSelector((state: RootState) => state.common.config.phone);
  const shareUserId = useSelector((state: RootState) => state.common.config.shareUserId);
  const touristsSnowId = useSelector((state: RootState) => state.common.config.touristId);
  const loginParams = useSelector((state: RootState) => state.user.login);

  const [userDispatcher] = useUserDispatcher();
  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation<FakeNavigation>();

  function closeAgreeTip() {
    setShowAgreeTip(false);
  }

  useEffect(() => {
    if (suggestPhone) {
      setPhone(suggestPhone);
    }
  }, [suggestPhone]);

  useEffect(() => {
    if (resendAfter <= 0) {
      setResendAfter(0);
      setVerifyCodeSend(false);
      return;
    }
    const timer = setInterval(() => {
      setResendAfter(resendAfter => resendAfter - 1);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [resendAfter]);

  async function handleSendCode() {
    if (!phone) {
      return commonDispatcher.error('请输入手机号');
    }
    try {
      const res = await api.user.sendVerifyCode(phone);
      if (res) {
        commonDispatcher.info('验证码已发送，请注意查收!');
        setVerifyCodeSend(true);
        setResendAfter(60);
      }
    } catch (error) {
      commonDispatcher.error(error);
    }
  }

  // function redirect() {
  //   // console.log(navigation);
  //   console.log(params);
  //   if (!params.to) {
  //     navigation.popToTop();
  //   } else {
  //     navigation.replace(params.to, params.params);
  //   }
  // }
  function confirmAgreeInTip() {
    closeAgreeTip();
    setAgree(true);
    login();
  }

  function checkForm() {
    if (!phone) {
      return commonDispatcher.error('请输入手机号');
    }
    if (!code) {
      return commonDispatcher.error('请输入验证码');
    }
    if (!agree) {
      setShowAgreeTip(true);
      return;
    }
    login();
  }

  async function login() {
    setLoginState(LoginState.Loading);
    try {
      const res = await api.user.userLogin({
        telephone: phone,
        code,
        shareUserId: shareUserId,
        touristsSnowId,
      });
      cache.user.setPhone(phone);
      if (res) {
        setLoginState(LoginState.Success);
        userDispatcher.loginSuccess(res?.token);
      }
    } catch (error) {
      commonDispatcher.error(error);
      setLoginState(LoginState.Error);
    }
  }

  function replaceToHome() {
    navigation.replace('Home');
  }

  function back() {
    navigation.canGoBack() ? navigation.goBack() : replaceToHome();
  }

  function skipLogin() {
    userDispatcher.clearLoginInfo();
    if (loginParams) {
      const {skipBehavior, to} = loginParams;
      switch (skipBehavior) {
        case 'back':
          back();
          break;
        case 'replace':
          const toRoute = to || 'Tab';
          navigation.replace(toRoute);
          break;
        default:
          replaceToHome();
          break;
      }
    } else {
      back();
    }
  }

  function openUserProtocol() {
    closeAgreeTip();
    loadUrl(USER_AGREEMENT_URL + '?_r=' + Math.random());
  }
  function openPrivacyPolicy() {
    closeAgreeTip();
    loadUrl(PRIVACY_POLICY_URL + '?_r=' + Math.random());
  }

  function loadUrl(url: string) {
    navigation.navigate('Browser', {url});
  }

  return (
    <View style={styles.container}>
      <MyStatusBar />
      <NavigationBar title="" leftIcon={<Icon name="nav_close48" size={24} color="#999" />} canBack onBack={skipLogin} />
      <ScrollView keyboardDismissMode="on-drag">
        <View style={styles.bodyContainer}>
          <Text style={styles.title}>登录/注册</Text>
          <View style={styles.form}>
            <View style={[globalStyles.containerRow, styles.formItem, {paddingHorizontal: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
              <Text style={[styles.phoneLabel, {marginRight: 10}]}>+86</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="请输入手机号"
                keyboardType="numeric"
                placeholderTextColor={globalStyleVariables.TEXT_COLOR_TERTIARY}
                clearButtonMode="while-editing"
                style={styles.inputItem}
              />
            </View>
            <Text style={styles.formExplain}>未注册的手机号验证通过后将自动注册</Text>
            <View style={[styles.formItem, styles.formItemCode, globalStyles.containerRow, {paddingHorizontal: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="请输入验证码"
                keyboardType="numeric"
                maxLength={4}
                placeholderTextColor={globalStyleVariables.TEXT_COLOR_TERTIARY}
                clearButtonMode="while-editing"
                style={styles.inputItem}
              />
              <View style={{marginLeft: 10}}>
                {verifyCodeSend ? (
                  <Text style={styles.phoneLabel}>重新发送({resendAfter})</Text>
                ) : (
                  <Text style={styles.getCode} onPress={handleSendCode}>
                    获取验证码
                  </Text>
                )}
              </View>
            </View>
            <View>
              <Radio checked={agree} onChange={setAgree} style={{marginTop: globalStyleVariables.MODULE_SPACE}}>
                <Text style={[globalStyles.fontTertiary, globalStyles.moduleMarginTop]}>
                  <Text>已阅读并同意</Text>
                  <Text onPress={openUserProtocol} style={[globalStyles.fontTertiary, {color: globalStyleVariables.COLOR_LINK}]}>
                    用户协议
                  </Text>
                  <Text>和</Text>
                  <Text onPress={openPrivacyPolicy} style={[globalStyles.fontTertiary, {color: globalStyleVariables.COLOR_LINK}]}>
                    隐私政策
                  </Text>
                </Text>
              </Radio>
            </View>
            <Button style={styles.login} type="primary" onPress={checkForm} loading={loginState === LoginState.Loading}>
              登录
            </Button>
            <View style={[globalStyles.containerCenter, {marginTop: globalStyleVariables.MODULE_SPACE}]}>
              <TouchableOpacity activeOpacity={0.7} onPress={skipLogin}>
                <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.TEXT_COLOR_TERTIARY}]}>暂不登录</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {showAgreeTip && (
        <Popup visible={true} onClose={closeAgreeTip} round={globalStyleVariables.RADIUS_MODAL}>
          <View style={{padding: globalStyleVariables.MODULE_SPACE_BIGGER}}>
            <Text style={{fontSize: 18, color: globalStyleVariables.TEXT_COLOR_PRIMARY}}>用户协议及隐私保护</Text>
            <View style={{marginTop: 20}}>
              <Text style={[globalStyles.fontPrimary, globalStyles.moduleMarginTop]}>
                <Text>我已阅读并同意</Text>
                <Text onPress={openUserProtocol} style={[{color: globalStyleVariables.COLOR_LINK, fontSize: 15}]}>
                  用户协议
                </Text>
                <Text>和</Text>
                <Text onPress={openPrivacyPolicy} style={[{color: globalStyleVariables.COLOR_LINK, fontSize: 15}]}>
                  隐私政策
                </Text>
              </Text>
            </View>
            <View style={[{paddingHorizontal: 15, marginTop: 62}, globalStyles.containerRow]}>
              <Button style={{flex: 1, backgroundColor: '#0000001A'}} onPress={closeAgreeTip}>
                不同意
              </Button>
              <Button style={{flex: 1, marginLeft: 15}} type="primary" onPress={confirmAgreeInTip}>
                同意并登录
              </Button>
            </View>
          </View>
        </Popup>
      )}
    </View>
  );
};
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bodyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    marginTop: 66,
    width: '100%',
    paddingHorizontal: 20,
  },
  formItem: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    height: 50,
  },
  formItemCode: {
    marginTop: 30,
  },
  formExplain: {
    marginTop: 10,
    color: '#999',
    fontSize: 12,
  },
  getCode: {
    color: '#546DAD',
    fontSize: 15,
  },
  phoneLabel: {
    fontSize: 15,
    color: '#999',
  },
  login: {
    width: '100%',
    marginTop: 40,
  },
  inputItem: {
    fontSize: 15,
    padding: 0,
    paddingTop: 0,
    paddingBottom: 0,
    flex: 1,
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
});
