import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {globalStyles, globalStyleVariables} from '../../constants/styles';

const Discover: React.FC = () => {
  return (
    <>
      <View style={styles.container}>
        {/* <View style={styles.bannerContainer}>
          <Image source={{uri: 'https://fakeimg.pl/198?text=loading'}} style={styles.banner} />
        </View> */}
        {/* <View style={globalStyles.containerForTmp}>
          <View style={styles.searchBar} />
        </View> */}
        {/* 地址 + 搜索 */}
        <SafeAreaView edges={['top']}>
          <View style={[globalStyles.containerLR, {paddingHorizontal: globalStyleVariables.MODULE_SPACE}]}>
            <View style={globalStyles.containerRow}>
              <Icon name="location-on" size={24} color="#333" />
              <Text>成都</Text>
              <Icon name="arrow-drop-down" size={20} color="#333" />
            </View>
            <View style={styles.searchContainer}>
              <Text style={globalStyles.fontSecondary}>火锅</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </>
  );
};
Discover.defaultProps = {
  title: 'Discover',
};
export default Discover;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    marginLeft: globalStyleVariables.MODULE_SPACE,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
  },
});
