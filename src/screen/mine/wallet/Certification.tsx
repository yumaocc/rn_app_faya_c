import React, {useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TextInput, TextInputProps, TouchableOpacity, Image, Modal} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Button, NavigationBar} from '../../../component';
import FormItem from '../../../component/Form/FormItem';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useSearch} from '../../../fst/hooks';
import {useCommonDispatcher, useRNSelectPhoto, useWallet} from '../../../helper/hooks';
import {UserCertificationForm} from '../../../models';
import * as api from '../../../apis';
import {compressImageUntil, getFileNameByPath} from '../../../helper/system';
import {useNavigation} from '@react-navigation/native';

const Certification: React.FC = () => {
  const [form, setFormField, setFormFields] = useSearch<UserCertificationForm>();
  const [agree, setAgree] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  const [sendRest, setSendRest] = React.useState(0);
  const [rejectReason, setRejectReason] = React.useState('');

  const [wallet, updateWallet] = useWallet();

  useEffect(() => {
    if (!wallet) {
      return;
    }
    const detail = wallet?.details;
    const {reason, bankCard, cardholder, bankTelephone, idCard, idCardBack, idCardBackOss, idCardFront, idCardFrontOss} = detail || {};
    setFormFields({
      name: cardholder,
      cardNo: bankCard,
      idCardBack: idCardBack,
      idCardBackOss: idCardBackOss,
      idCardFront: idCardFront,
      idCardFrontOss: idCardFrontOss,
      idNo: idCard,
      mobileNo: bankTelephone,
      _idCardBack: {uri: idCardBackOss},
      _idCardFront: {uri: idCardFrontOss},
    });
    setRejectReason(reason);
  }, [wallet, setFormFields]);

  const previewList = useMemo(() => {
    const list = [];
    if (form?._idCardBack) {
      list.push({url: form._idCardBack.uri});
    }
    if (form?._idCardFront) {
      list.push({url: form._idCardFront.uri});
    }
    return list;
  }, [form._idCardBack, form._idCardFront]);

  const [commonDispatcher] = useCommonDispatcher();
  const [selectPhoto] = useRNSelectPhoto();
  const navigation = useNavigation();

  useEffect(() => {
    let timer = 0;
    if (sendRest > 0) {
      timer = setTimeout(() => {
        setSendRest(sendRest - 1);
      }, 1000);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, [sendRest]);

  async function selectIDCard(front = false) {
    const res = await selectPhoto({
      selectionLimit: 1,
      quality: 0.5, // 图片不能超过1M，所以质量取较低
    });
    const file = res[0];
    if (!file) {
      return;
    }
    let newFile = file;
    // 先用原图展示，防止压缩过程较长，用户误以为没有反应
    if (front) {
      setFormField('_idCardFront', newFile);
    } else {
      setFormField('_idCardBack', newFile);
    }
    // 压缩图片，压缩后的图片会覆盖原图
    const fileLimit = 1 * 1024 * 1024;
    if (file.fileSize > fileLimit) {
      const compressResult = await compressImageUntil({path: file.uri, quality: 80, width: file.width, height: file.height}, fileLimit);
      newFile = {...file, uri: compressResult.uri, fileSize: compressResult.size, fileName: compressResult.name};
    }
    if (front) {
      setFormField('_idCardFront', newFile);
    } else {
      setFormField('_idCardBack', newFile);
    }
  }

  function startPreview(index: number) {
    setPreviewIndex(index);
    setShowPreview(true);
  }
  function check() {
    if (!form.name) {
      return '请输入真实姓名';
    }
    if (!form.cardNo) {
      return '请输入身份证号码';
    }
    if (!form.cardNo) {
      return '请输入银行卡号';
    }
    if (!form.mobileNo) {
      return '请输入银行预留手机号码';
    }
    if (!form.code) {
      return '请输入验证码';
    }
    if (!form._idCardFront) {
      return '请上传身份证国徽面';
    }
    if (!form._idCardBack) {
      return '请上传身份证人像面';
    }
    if (!agree) {
      return '请阅读并同意《用户认证协议》';
    }
    return '';
  }

  async function sendCode() {
    try {
      if (sendRest || loading) {
        // 还在倒计时
        return;
      }
      if (!form.mobileNo) {
        throw new Error('请输入银行预留手机号码');
      }
      await api.user.sendMainVerifyCode(form.mobileNo, 9); // 9: 实名认证验证码
      setSendRest(60);
      commonDispatcher.info('验证码已发送');
    } catch (error) {
      commonDispatcher.error(error);
    }
  }

  async function submit() {
    const res = check();
    if (res) {
      return commonDispatcher.error(res);
    }
    try {
      setLoading(true);
      let formData: UserCertificationForm = {...form};
      if (!form.idCardBack && form._idCardBack) {
        const uri = form._idCardBack.uri;
        const fileName = getFileNameByPath(uri);
        const res = await api.user.uploadCertificationFile(uri, fileName, 3);
        const {ypUrl, ossUrl} = res;
        formData = {...formData, idCardBack: ypUrl, idCardBackOss: ossUrl};
        setFormField('idCardBack', ypUrl);
        setFormField('idCardBackOss', ossUrl);
      }
      if (!form.idCardFront && form._idCardFront) {
        const uri = form._idCardFront.uri;
        const fileName = getFileNameByPath(uri);
        const res = await api.user.uploadCertificationFile(uri, fileName, 2);
        const {ypUrl, ossUrl} = res;
        formData = {...formData, idCardFront: ypUrl, idCardFrontOss: ossUrl};
        setFormField('idCardFront', ypUrl);
        setFormField('idCardFrontOss', ossUrl);
      }
      await api.user.userCertification(formData);
      setLoading(false);
      commonDispatcher.success('提交成功，请等待认证');
      updateWallet(); // 刷新钱包信息
      navigation.canGoBack() && navigation.goBack();
    } catch (error) {
      setLoading(false);
      commonDispatcher.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <NavigationBar title="实名认证" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <ScrollView style={{flex: 1}} keyboardDismissMode="on-drag">
          <View style={{padding: globalStyleVariables.MODULE_SPACE}}>
            <Text style={[globalStyles.fontTertiary]}>首次添加银行卡需要实名认证。认证信息将用于收益提现，与账号唯一绑定。我们会对信息进行严格保密，认证后不可解绑</Text>
            {rejectReason && (
              <View style={{marginTop: globalStyleVariables.MODULE_SPACE}}>
                <Text style={[globalStyles.fontTertiary, {color: globalStyleVariables.COLOR_WARNING_RED}]}>{rejectReason}</Text>
              </View>
            )}
            <FormItem label="真实姓名" {...formItemProps}>
              <TextInput value={form.name} onChangeText={val => setFormField('name', val)} placeholder="请输入您的真实姓名" {...formItemInputProps} style={styles.formItemInput} />
            </FormItem>
            <FormItem label="身份证号" {...formItemProps}>
              <TextInput value={form.idNo} onChangeText={val => setFormField('idNo', val)} placeholder="请输入身份证号" {...formItemInputProps} style={styles.formItemInput} />
            </FormItem>
            <FormItem label="银行卡号" {...formItemProps}>
              <TextInput value={form.cardNo} onChangeText={val => setFormField('cardNo', val)} placeholder="请输入银行卡号" {...formItemInputProps} style={styles.formItemInput} />
            </FormItem>
            <FormItem label="银行预留手机号" {...formItemProps}>
              <TextInput
                value={form.mobileNo}
                onChangeText={val => setFormField('mobileNo', val)}
                placeholder="请输入银行预留手机号"
                {...formItemInputProps}
                style={styles.formItemInput}
              />
            </FormItem>
            <FormItem label="验证码" {...formItemProps}>
              <View style={[{flex: 1}, globalStyles.containerRow]}>
                <TextInput
                  value={form.code}
                  onChangeText={val => setFormField('code', val)}
                  keyboardType="number-pad"
                  placeholder="请输入验证码"
                  {...formItemInputProps}
                  style={styles.formItemInput}
                />
                <View style={[globalStyles.lineVertical, {height: 10, backgroundColor: '#0000001A', marginHorizontal: globalStyleVariables.MODULE_SPACE}]} />
                {sendRest === 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      sendCode();
                    }}>
                    <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_LINK}]}>发送验证码</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_LINK, opacity: 0.5}]}>发送验证码（{sendRest}s）</Text>
                )}
              </View>
            </FormItem>
            <FormItem label="身份证人像面" {...formItemProps} style={{marginTop: 20}}>
              <View style={{paddingRight: globalStyleVariables.MODULE_SPACE}}>
                {form._idCardFront ? (
                  <View style={[styles.idCard]}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => startPreview(0)}>
                      <Image source={{uri: form._idCardFront?.uri}} style={styles.idCard} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.remove}
                      onPress={() => {
                        setFormFields({
                          _idCardFront: null,
                          idCardFront: null,
                          idCardFrontOss: null,
                        });
                      }}>
                      <MaterialIcon name="remove-circle" size={24} color={globalStyleVariables.COLOR_WARNING_RED} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity activeOpacity={0.8} onPress={() => selectIDCard(true)}>
                    <View style={styles.idCard} />
                  </TouchableOpacity>
                )}
              </View>
            </FormItem>
            <FormItem label="身份证国徽面" {...formItemProps} style={{marginTop: 20}}>
              <View style={{paddingRight: globalStyleVariables.MODULE_SPACE}}>
                {form._idCardBack ? (
                  <View style={[styles.idCard]}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => startPreview(previewList.length - 1)}>
                      <Image source={{uri: form._idCardBack?.uri}} style={styles.idCard} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.remove}
                      onPress={() => {
                        setFormFields({
                          _idCardBack: null,
                          idCardBack: null,
                          idCardBackOss: null,
                        });
                      }}>
                      <MaterialIcon name="remove-circle" size={24} color={globalStyleVariables.COLOR_WARNING_RED} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity activeOpacity={0.8} onPress={() => selectIDCard(false)}>
                    <View style={styles.idCard} />
                  </TouchableOpacity>
                )}
              </View>
            </FormItem>

            {/* 协议 */}
            <TouchableOpacity activeOpacity={0.8} onPress={() => setAgree(!agree)} style={{marginTop: 10}}>
              <View style={[globalStyles.containerRow]}>
                {agree ? (
                  <MaterialIcon name="check-circle" size={24} color={globalStyleVariables.COLOR_CASH} />
                ) : (
                  <MaterialIcon name="radio-button-unchecked" size={24} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
                )}
                {/* todo: 协议内容和链接 */}
                <Text style={{marginLeft: globalStyleVariables.MODULE_SPACE}}>已阅读并同意《实名认证服务协议》</Text>
              </View>
            </TouchableOpacity>
            <View style={{marginTop: 20}}>
              <Button loading={loading} disabled={loading} title="提交" style={styles.submit} onPress={submit} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showPreview} transparent={true} animationType="fade" onRequestClose={() => setShowPreview(false)}>
        <ImageViewer imageUrls={previewList} index={previewIndex} enableSwipeDown={true} onSwipeDown={() => setShowPreview(false)} />
      </Modal>
    </View>
  );
};

export default Certification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formChildren: {
    // height: 20,
  },
  formItem: {
    paddingVertical: 7,
  },
  formItemInput: {
    padding: 0,
    fontSize: 15,
    paddingRight: globalStyleVariables.MODULE_SPACE,
    textAlign: 'right',
    width: '100%',
    flex: 1,
    height: 20,
    // backgroundColor: '#6cf',
  },
  idCard: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#d9d9d9',
  },
  submit: {
    height: 50,
    backgroundColor: globalStyleVariables.COLOR_CASH,
    borderColor: globalStyleVariables.COLOR_CASH,
  },
  remove: {
    width: 24,
    height: 24,
    position: 'absolute',
    top: -12,
    right: -12,
    zIndex: 2,
  },
});

const formItemProps = {
  hiddenBorderBottom: true,
  hiddenBorderTop: true,
  styles: {container: styles.formItem, children: styles.formChildren},
};

const formItemInputProps: TextInputProps = {
  placeholderTextColor: globalStyleVariables.TEXT_COLOR_TERTIARY,
  clearButtonMode: 'while-editing',
};
