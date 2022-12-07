import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl, TouchableHighlight, TouchableOpacity} from 'react-native';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
// import {SearchParam} from '../../../fst/models';
import {FakeNavigation, LoadListState, UserExpressAddress} from '../../../models';
import * as api from '../../../apis';
import {useCommonDispatcher} from '../../../helper/hooks';
import Loading from '../../../component/Loading';
import MyStatusBar from '../../../component/MyStatusBar';
import {NavigationBar} from '../../../component';
import Icon from '../../../component/Icon';
import {BoolEnum} from '../../../fst/models';
import {Modal} from '@ant-design/react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useIsFocused, useNavigation} from '@react-navigation/native';

const ManageAddress: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [initLoading, setInitLoading] = useState(true); // 是否显示初始化加载
  const [addressList, setAddressList] = useState<LoadListState<UserExpressAddress>>({list: [], status: 'none', index: 0});
  const [currentAddress, setCurrentAddress] = useState<UserExpressAddress>(); // 当前在操作的收货地址
  const [showAction, setShowAction] = useState(false); // 是否显示操作弹窗

  const [commonDispatcher] = useCommonDispatcher();
  const navigation = useNavigation<FakeNavigation>();
  const isFocused = useIsFocused();

  const loadAddressList = useCallback(
    async (replace = false) => {
      if (addressList.status !== 'noMore' || replace) {
        const index = replace ? 1 : addressList.index + 1;
        const pageSize = 100;
        try {
          const res = await api.user.getAddressList({pageIndex: index, pageSize});
          const newAddress: LoadListState<UserExpressAddress> = {
            list: replace ? res : [...addressList.list, ...res],
            status: res.length < pageSize ? 'noMore' : 'none',
            index,
          };
          setInitLoading(false);
          setAddressList(newAddress);
        } catch (error) {
          commonDispatcher.error(error);
        }
      }
    },
    [addressList.index, addressList.list, addressList.status, commonDispatcher],
  );

  useEffect(() => {
    if (!initLoading) {
      return;
    }
    loadAddressList(true);
  }, [initLoading, loadAddressList]);

  useEffect(() => {
    if (isFocused) {
      setInitLoading(true);
    }
  }, [isFocused]);

  async function handleRefresh() {
    setRefreshing(true);
    await loadAddressList(true);
    setRefreshing(false);
  }

  function handleAction(address: UserExpressAddress) {
    setCurrentAddress(address);
    setShowAction(true);
  }

  function closeActionModal() {
    setShowAction(false);
    return false;
  }

  async function setToDefault() {
    if (currentAddress) {
      try {
        const success = await api.user.editAddress({id: currentAddress.id, hasDefault: BoolEnum.TRUE});
        if (!success) {
          throw new Error('服务器繁忙，请稍后再试');
        }
        await loadAddressList(true);
        setShowAction(false);
        commonDispatcher.success('已设置为默认地址');
      } catch (error) {
        commonDispatcher.error(error);
      }
    }
  }
  function editAddress() {
    closeActionModal();
    navigation.navigate('AddAddress', {address: currentAddress});
  }

  async function deleteAddress() {
    closeActionModal();
    Modal.alert('提示', '确定删除该地址吗？', [
      {
        text: '取消',
        style: {
          color: globalStyleVariables.TEXT_COLOR_TERTIARY,
        },
      },
      {
        text: '确定删除',
        style: {
          color: globalStyleVariables.COLOR_WARNING_RED,
        },
        onPress: async () => {
          try {
            const success = await api.user.deleteAddress(currentAddress.id);
            if (!success) {
              throw new Error('服务器繁忙，请稍后再试');
            }
            commonDispatcher.success('已删除');
            loadAddressList(true);
            return Promise.resolve();
          } catch (error) {
            return Promise.resolve();
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <MyStatusBar />
      <NavigationBar
        title="管理收货地址"
        headerRight={
          <TouchableOpacity onPress={() => navigation.navigate('AddAddress')} style={{paddingRight: 15}}>
            <Text style={[{color: globalStyleVariables.COLOR_PRIMARY}]}>新增</Text>
          </TouchableOpacity>
        }
      />
      {initLoading ? (
        <Loading style={{marginTop: 120}} />
      ) : (
        <>
          <ScrollView
            style={{flex: 1}}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                title="下拉刷新"
                colors={[globalStyleVariables.COLOR_PRIMARY]}
                titleColor={globalStyleVariables.COLOR_PRIMARY}
                tintColor={globalStyleVariables.COLOR_PRIMARY}
              />
            }>
            <View>
              {addressList.list.map(address => {
                return (
                  <TouchableHighlight key={address.id} underlayColor="#999" onPress={() => handleAction(address)}>
                    <View style={[globalStyles.containerLR, {padding: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff'}]}>
                      <View>
                        <View style={[globalStyles.containerRow]}>
                          {address.hasDefault === BoolEnum.TRUE && (
                            <View style={[globalStyles.tagWrapper, {padding: 2, backgroundColor: globalStyleVariables.COLOR_PRIMARY, marginRight: 7}]}>
                              <Text style={[globalStyles.tag, {color: '#fff'}]}>默认</Text>
                            </View>
                          )}
                          <Text style={[globalStyles.fontPrimary, {fontSize: 12}]}>
                            {address.province}
                            {address.city}
                            {address.area}
                          </Text>
                        </View>
                        <View style={[{marginVertical: globalStyleVariables.MODULE_SPACE_SMALLER}]}>
                          <Text style={[globalStyles.fontPrimary, {fontSize: 18}]}>{address.detailAddress}</Text>
                        </View>
                        <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}]}>
                          <View style={globalStyles.containerRow}>
                            <Text style={[globalStyles.fontPrimary, {fontSize: 12}]}>{address.name}</Text>
                            <Text style={[globalStyles.fontPrimary, {fontSize: 12, marginLeft: 10}]}>{address.contactPhone}</Text>
                          </View>
                        </View>
                      </View>
                      <Icon name="nav_more" size={15} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                    </View>
                  </TouchableHighlight>
                );
              })}
            </View>
          </ScrollView>
        </>
      )}
      {/* 操作弹窗 */}
      <Modal popup maskClosable={true} visible={showAction} animationType="slide-up" onClose={closeActionModal} onRequestClose={closeActionModal} style={styles.round}>
        <SafeAreaView edges={['bottom']}>
          {currentAddress?.hasDefault === BoolEnum.FALSE && (
            <TouchableHighlight underlayColor="#999" onPress={setToDefault}>
              <View style={[globalStyles.containerCenter, {height: 50, backgroundColor: '#fff'}]}>
                <Text style={{color: globalStyleVariables.TEXT_COLOR_PRIMARY, fontSize: 15}}>设为默认地址</Text>
              </View>
            </TouchableHighlight>
          )}
          <TouchableHighlight underlayColor="#999" onPress={editAddress}>
            <View style={[globalStyles.containerCenter, {height: 50, backgroundColor: '#fff'}]}>
              <Text style={{color: globalStyleVariables.TEXT_COLOR_PRIMARY, fontSize: 15}}>编辑</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor="#999" onPress={deleteAddress}>
            <View style={[globalStyles.containerCenter, {height: 50, backgroundColor: '#fff'}]}>
              <Text style={{color: globalStyleVariables.COLOR_WARNING_RED, fontSize: 15}}>删除</Text>
            </View>
          </TouchableHighlight>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default ManageAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  round: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    paddingTop: 15,
  },
});
