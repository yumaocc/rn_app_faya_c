import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useParams} from '../../helper/hooks';

const SPUDetail: React.FC = () => {
  const {id} = useParams<{id: number}>();
  console.log(id);
  return (
    <View style={styles.container}>
      {/* <Text>SPUDetail</Text> */}
      <SafeAreaView edges={['bottom']} style={{flex: 1}} />
    </View>
  );
};
export default SPUDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
