import React, {useEffect} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useParams, useSPUDispatcher} from '../../helper/hooks';
import {FakeNavigation, PackageDetail, SKUDetail, SPUDetailF} from '../../models';

import SPUDetailView from './SPUDetailView';
import BuyBar from './BuyBar';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers';
import {useNavigation} from '@react-navigation/native';

const SPUDetail: React.FC = () => {
  const {id} = useParams<{id: number}>();
  const token = useSelector((state: RootState) => state.common.token);
  const spu: SPUDetailF = useSelector((state: RootState) => state.spu.currentSPU);
  const currentSKU: PackageDetail | SKUDetail = useSelector((state: RootState) => state.spu.currentSKU);
  const isPackage: boolean = useSelector((state: RootState) => state.spu.currentSKUIsPackage);

  const [spuDispatcher] = useSPUDispatcher();

  useEffect(() => {
    spuDispatcher.viewSPU(id);
  }, [id, spuDispatcher]);

  console.log(spu);

  const {bottom: safeBottom} = useSafeAreaInsets();
  const navigation = useNavigation<FakeNavigation>();

  function handleBuy() {
    if (!token) {
      navigation.navigate('Login', {to: 'Order', params: {id}});
    } else {
      navigation.navigate('Order', {id});
    }
  }

  function handleChangeSKU(sku: SKUDetail | PackageDetail, isPackage: boolean) {
    spuDispatcher.changeSKU(sku, isPackage);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1}}>
        {spu ? <SPUDetailView isPackage={isPackage} currentSelect={currentSKU} spu={spu} onChangeSelect={handleChangeSKU} /> : <Text>loading...</Text>}
      </ScrollView>
      <View style={[{paddingBottom: safeBottom, backgroundColor: '#fff'}]}>
        <BuyBar onBuy={handleBuy} />
      </View>
    </View>
  );
};
export default SPUDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
