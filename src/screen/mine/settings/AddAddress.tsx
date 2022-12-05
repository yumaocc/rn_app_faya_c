import React, {useCallback, useEffect} from 'react';
import {View, StyleSheet, ScrollView, TextInput, TextInputProps} from 'react-native';
import {Button, Cascader, NavigationBar, Switch} from '../../../component';
import FormItem from '../../../component/Form/FormItem';
import * as api from '../../../apis';
import MyStatusBar from '../../../component/MyStatusBar';
import {useSearch} from '../../../fst/hooks';
import {AreaF, FakeNavigation, UserExpressAddress} from '../../../models';
import {globalStyleVariables} from '../../../constants/styles';
import {useCommonDispatcher, useParams} from '../../../helper/hooks';
import {BoolEnum} from '../../../fst/models';
import {useNavigation} from '@react-navigation/native';

const AddAddress: React.FC = () => {
  const [areaList, setAreaList] = React.useState<AreaF[]>([]);
  const [isEdit, setIsEdit] = React.useState(false);
  const {address} = useParams<{address: UserExpressAddress}>();
  const [form, setFormField, setFormFields] = useSearch<UserExpressAddress>();
  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation<FakeNavigation>();

  useEffect(() => {
    if (address) {
      setIsEdit(true);
    }
  }, [address]);

  useEffect(() => {
    if (address && areaList.length) {
      const {province, city, area, hasDefault} = address;
      const foundProvince = areaList.find(item => item.name === province);
      if (!foundProvince) {
        return;
      }
      const foundCity = foundProvince.children?.find(item => item.name === city);
      if (!foundCity) {
        return;
      }
      const foundArea = foundCity.children?.find(item => item.name === area);
      if (!foundArea) {
        return;
      }
      setFormFields({
        ...address,
        _areaIDs: [foundProvince.id, foundCity.id, foundArea.id],
        _hasDefault: hasDefault === BoolEnum.TRUE,
      });
    }
  }, [address, areaList, setFormFields]);

  const requestAreaList = useCallback(async () => {
    try {
      const res = await api.common.getArea();
      setAreaList(res);
    } catch (error) {
      commonDispatcher.error(error);
    }
  }, [commonDispatcher]);

  useEffect(() => {
    async function fn() {
      requestAreaList();
    }
    fn();
  }, [requestAreaList]);

  async function onSubmit() {
    try {
      const newForm: UserExpressAddress = {
        ...form,
        hasDefault: form._hasDefault ? BoolEnum.TRUE : BoolEnum.FALSE,
      };
      delete newForm._areaIDs;
      delete newForm._hasDefault;
      console.log(newForm);
      const success = await api.user.addNewAddress(newForm);
      // console.log(res);
      if (!success) {
        throw new Error('添加地址失败');
      }
      commonDispatcher.success('添加地址成功');
      navigation.canGoBack() && navigation.goBack();
    } catch (error) {
      commonDispatcher.error(error);
    }
  }
  function areaChange(ids: number[]) {
    const [provinceId, cityId, areaId] = ids;
    const province = areaList.find(item => item.id === provinceId);
    const city = province?.children.find(item => item.id === cityId);
    const area = city?.children.find(item => item.id === areaId);
    setFormFields({
      _areaIDs: ids,
      province: province?.name,
      city: city?.name,
      area: area?.name,
      streetId: areaId,
    });
  }
  return (
    <View style={styles.container}>
      <NavigationBar title={isEdit ? '编辑收货地址' : '添加收货地址'} />
      <MyStatusBar />
      <ScrollView style={{flex: 1}}>
        <View style={{paddingHorizontal: globalStyleVariables.MODULE_SPACE_BIGGER}}>
          <FormItem label="收件人姓名" {...formItemProps}>
            <TextInput value={form.name} onChangeText={val => setFormField('name', val)} placeholder="请输入收件人姓名" {...formItemInputProps} style={styles.formItemInput} />
          </FormItem>
          <FormItem label="联系电话" {...formItemProps}>
            <TextInput
              value={form.contactPhone}
              onChangeText={val => setFormField('contactPhone', val)}
              placeholder="请输入联系电话"
              {...formItemInputProps}
              style={styles.formItemInput}
            />
          </FormItem>
          <FormItem label="所在地区" {...formItemProps}>
            <Cascader value={form._areaIDs} onChange={areaChange} placeholder="选择所在地区" valueKey="id" labelKey="name" options={areaList} />
          </FormItem>
          <FormItem label="详细地址" {...formItemProps}>
            <TextInput
              value={form.detailAddress}
              onChangeText={val => setFormField('detailAddress', val)}
              placeholder="请输入详细地址"
              {...formItemInputProps}
              style={styles.formItemInput}
            />
          </FormItem>
          {/* 编辑是不允许修改是否默认地址 */}
          {!isEdit && (
            <FormItem label="设为默认地址" {...formItemProps}>
              <Switch checked={form._hasDefault} onChange={val => setFormField('_hasDefault', val)} />
            </FormItem>
          )}
          <Button type="primary" style={{marginTop: 20}} onPress={onSubmit} title={isEdit ? '保存收货地址' : '确定添加'} />
        </View>
      </ScrollView>
    </View>
  );
};

export default AddAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formItemInput: {
    fontSize: 15,
    padding: 0,
    paddingTop: 0,
    paddingBottom: 0,
    // paddingRight: globalStyleVariables.MODULE_SPACE,
    textAlign: 'right',
    width: '100%',
  },
});

const formItemProps = {
  hiddenBorderBottom: true,
  hiddenBorderTop: true,
  styles: {
    container: {
      paddingVertical: 12,
    },
    children: {
      height: 20,
    },
  },
};

const formItemInputProps: TextInputProps = {
  placeholderTextColor: globalStyleVariables.TEXT_COLOR_TERTIARY,
  clearButtonMode: 'while-editing',
};
