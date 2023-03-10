import React, {useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TextInput, TextInputProps, TouchableOpacity, Image, Modal} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from '../../../component/Icon';
import {Button, NavigationBar} from '../../../component';
import FormItem from '../../../component/Form/FormItem';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {useSearch} from '../../../fst/hooks';
import {useCommonDispatcher, useRNSelectPhoto, useWallet} from '../../../helper/hooks';
import {UserCertificationForm} from '../../../models';
import * as api from '../../../apis';
import {compressImageUntil, getFileNameByPath} from '../../../helper/system';
import {useNavigation} from '@react-navigation/native';
// import Radio from '../../../component/Form/Radio';

const Certification: React.FC = () => {
  const [form, setFormField, setFormFields] = useSearch<UserCertificationForm>();
  // const [agree, setAgree] = React.useState(false);
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
      _idCardBack: idCardBackOss ? {uri: idCardBackOss} : null,
      _idCardFront: idCardFrontOss ? {uri: idCardFrontOss} : null,
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
      quality: 0.5, // ??????????????????1M????????????????????????
    });
    const file = res[0];
    if (!file) {
      return;
    }
    let newFile = file;
    // ???????????????????????????????????????????????????????????????????????????
    if (front) {
      setFormField('_idCardFront', newFile);
    } else {
      setFormField('_idCardBack', newFile);
    }
    // ????????????????????????????????????????????????
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
      return '?????????????????????';
    }
    if (!form.cardNo) {
      return '????????????????????????';
    }
    if (!form.cardNo) {
      return '?????????????????????';
    }
    if (!form.mobileNo) {
      return '?????????????????????????????????';
    }
    if (!form.code) {
      return '??????????????????';
    }
    if (!form._idCardFront) {
      return '???????????????????????????';
    }
    if (!form._idCardBack) {
      return '???????????????????????????';
    }
    return '';
  }

  async function sendCode() {
    try {
      if (sendRest || loading) {
        // ???????????????
        return;
      }
      if (!form.mobileNo) {
        throw new Error('?????????????????????????????????');
      }
      await api.user.sendMainVerifyCode(form.mobileNo, 9); // 9: ?????????????????????
      setSendRest(60);
      commonDispatcher.info('??????????????????');
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
      commonDispatcher.success('??????????????????????????????');
      updateWallet(); // ??????????????????
      navigation.canGoBack() && navigation.goBack();
    } catch (error) {
      setLoading(false);
      commonDispatcher.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <NavigationBar title="????????????" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <ScrollView style={{flex: 1}} keyboardDismissMode="on-drag">
          <View style={{padding: globalStyleVariables.MODULE_SPACE_BIGGER}}>
            <Text style={[globalStyles.fontTertiary]}>??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</Text>
            {rejectReason && (
              <View style={{marginTop: globalStyleVariables.MODULE_SPACE}}>
                <Text style={[globalStyles.fontTertiary, {color: globalStyleVariables.COLOR_WARNING_RED}]}>{rejectReason}</Text>
              </View>
            )}
            <FormItem label="????????????" {...formItemProps}>
              <TextInput value={form.name} onChangeText={val => setFormField('name', val)} placeholder="???????????????????????????" {...formItemInputProps} style={styles.formItemInput} />
            </FormItem>
            <FormItem label="????????????" {...formItemProps}>
              <TextInput value={form.idNo} onChangeText={val => setFormField('idNo', val)} placeholder="?????????????????????" {...formItemInputProps} style={styles.formItemInput} />
            </FormItem>
            <View style={[globalStyles.lineHorizontal]} />
            <FormItem label="????????????" {...formItemProps}>
              <TextInput value={form.cardNo} onChangeText={val => setFormField('cardNo', val)} placeholder="?????????????????????" {...formItemInputProps} style={styles.formItemInput} />
            </FormItem>
            <FormItem label="?????????????????????" {...formItemProps}>
              <TextInput
                value={form.mobileNo}
                onChangeText={val => setFormField('mobileNo', val)}
                placeholder="??????????????????????????????"
                {...formItemInputProps}
                style={styles.formItemInput}
              />
            </FormItem>
            <FormItem label="?????????" {...formItemProps}>
              <View style={[{flex: 1}, globalStyles.containerRow]}>
                <TextInput
                  value={form.code}
                  onChangeText={val => setFormField('code', val)}
                  keyboardType="number-pad"
                  placeholder="??????????????????"
                  {...formItemInputProps}
                  style={styles.formItemInput}
                />
                <View style={[globalStyles.lineVertical, {height: 10, backgroundColor: '#0000001A', marginHorizontal: globalStyleVariables.MODULE_SPACE}]} />
                {sendRest === 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      sendCode();
                    }}>
                    <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_LINK}]}>???????????????</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={[globalStyles.fontPrimary, {color: globalStyleVariables.COLOR_LINK, opacity: 0.5}]}>??????????????????{sendRest}s???</Text>
                )}
              </View>
            </FormItem>
            <View style={[globalStyles.lineHorizontal, {marginBottom: globalStyleVariables.MODULE_SPACE}]} />
            <FormItem label="??????????????????" {...formItemProps} vertical>
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
                      <Icon name="all_tupian_delete48" size={24} color={globalStyleVariables.COLOR_WARNING_RED} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity activeOpacity={0.8} onPress={() => selectIDCard(true)}>
                    <Image source={require('../../../assets/id_card_front.png')} style={styles.idCard} />
                  </TouchableOpacity>
                )}
              </View>
            </FormItem>
            <FormItem label="??????????????????" {...formItemProps} vertical>
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
                      <Icon name="all_tupian_delete48" size={24} color={globalStyleVariables.COLOR_WARNING_RED} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity activeOpacity={0.8} onPress={() => selectIDCard(false)}>
                    <Image source={require('../../../assets/id_card_back.png')} style={styles.idCard} />
                  </TouchableOpacity>
                )}
              </View>
            </FormItem>

            {/* ?????? */}
            {/* <Radio checked={agree} onChange={setAgree} style={{marginTop: globalStyleVariables.MODULE_SPACE}}>
              ????????????????????????????????????????????????
            </Radio> */}
            <View style={{marginTop: 20}}>
              <Button cash loading={loading} disabled={loading} title="??????" style={styles.submit} onPress={submit} />
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
    textAlign: 'right',
    width: '100%',
    flex: 1,
    height: 20,
  },
  idCard: {
    width: 210,
    height: 128,
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
    borderRadius: 24,
    backgroundColor: '#fff',
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
