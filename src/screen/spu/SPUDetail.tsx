import React, {useEffect} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFetchData} from '../../fst/hooks';
import {useParams} from '../../helper/hooks';
import * as api from '../../apis';
import {PackageDetail, SKUDetail, SPUDetailF} from '../../models';

import SPUDetailView from './SPUDetailView';
import BuyBar from './BuyBar';

const SPUDetail: React.FC = () => {
  const {id} = useParams<{id: number}>();
  const [currentSelect, setCurrentSelect] = React.useState<SKUDetail | PackageDetail>(null);
  const [spu] = useFetchData<SPUDetailF>(api.spu.getSPUDetail, id);
  const {bottom: safeBottom} = useSafeAreaInsets();

  useEffect(() => {
    if (spu?.skuList?.length) {
      setCurrentSelect(spu.skuList[0]);
      return;
    }
    if (spu?.packageDetailsList?.length) {
      setCurrentSelect(spu.packageDetailsList[0]);
      return;
    }
  }, [spu]);

  console.log(spu);
  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1}}>{spu ? <SPUDetailView currentSelect={currentSelect} spu={spu} onChangeSelect={setCurrentSelect} /> : <Text>loading...</Text>}</ScrollView>
      <View style={[{paddingBottom: safeBottom}]}>
        <BuyBar />
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
