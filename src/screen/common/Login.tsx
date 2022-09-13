import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {InputItem, Button} from '@ant-design/react-native';
import {useSelector} from 'react-redux';
import {useCommonDispatcher, useParams, useUserDispatcher} from '../../helper/hooks';
import {RootState} from '../../redux/reducers';
import {LoginState} from '../../fst/models';
import * as api from '../../apis';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {useNavigation} from '@react-navigation/native';
import {FakeNavigation, RootStackParamList} from '../../models';

const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState(''); // 验证码
  const [loginState, setLoginState] = useState<LoginState>(LoginState.None);
  const [verifyCodeSend, setVerifyCodeSend] = useState(false);
  const [resendAfter, setResendAfter] = useState(0);
  const suggestPhone = useSelector((state: RootState) => state.user.phone);

  const [userDispatcher] = useUserDispatcher();
  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation<FakeNavigation>();
  const params = useParams<{to?: keyof RootStackParamList; params?: any}>();

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

  function redirect() {
    // console.log(navigation);
    console.log(params);
    if (!params.to) {
      navigation.popToTop();
    } else {
      navigation.replace(params.to, params.params);
    }
  }
  function handleLogin() {
    redirect();
    if (!phone) {
      return commonDispatcher.error('请输入手机号');
    }
    if (!code) {
      return commonDispatcher.error('请输入验证码');
    }
    login();
  }

  async function login() {
    setLoginState(LoginState.Loading);
    try {
      const res = await api.user.userLogin(phone, code);
      if (res) {
        setLoginState(LoginState.Success);
        userDispatcher.setUserInfo(res);
      }
    } catch (error) {
      commonDispatcher.error(error);
      setLoginState(LoginState.Error);
    }
  }

  function skipLogin() {
    navigation.canGoBack() && navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>登录/注册</Text>
      <View style={styles.form}>
        <View style={styles.formItem}>
          <InputItem clear last value={phone} labelNumber={2} type="text" onChange={setPhone} placeholder="请输入手机号">
            <Text style={styles.phoneLabel}>+86</Text>
          </InputItem>
        </View>
        <Text style={styles.formExplain}>未注册的手机号验证通过后将自动注册</Text>
        <View style={[styles.formItem, styles.formItemCode]}>
          <InputItem
            clear
            last
            value={code}
            labelNumber={2}
            type="number"
            onChange={setCode}
            extra={
              verifyCodeSend ? (
                <Text style={styles.phoneLabel}>重新发送({resendAfter})</Text>
              ) : (
                <Text style={styles.getCode} onPress={handleSendCode}>
                  获取验证码
                </Text>
              )
            }
            placeholder="请输入验证码"
          />
        </View>
        <Button style={styles.login} type="primary" onPress={handleLogin} loading={loginState === LoginState.Loading}>
          登录
        </Button>
        <View style={[globalStyles.containerCenter, {marginTop: globalStyleVariables.MODULE_SPACE}]}>
          <TouchableOpacity activeOpacity={0.7} onPress={skipLogin}>
            <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.TEXT_COLOR_TERTIARY}]}>暂不登录</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 94,
    backgroundColor: '#fff',
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
});
