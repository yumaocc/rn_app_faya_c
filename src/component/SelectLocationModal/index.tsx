import React, {useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableHighlight, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import * as api from '../../apis';
import {useCommonDispatcher, useGrid} from '../../helper/hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LocationCity} from '../../models';
// import IndexBar from './IndexBar';
import IndexedSectionList from '../IndexedSectionList';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers';
import {LocationSection} from './util';
import Icon from '../Icon';
import {fuzzyMatch} from '../../fst/helper';
// import {useLog} from '../../fst/hooks';
import Empty from '../Empty';

interface SelectLocationModalProps {
  visible: boolean;
  onClose: () => void;
}

const SelectLocationModal: React.FC<SelectLocationModalProps> = props => {
  const currentLocationName = useSelector((state: RootState) => state.common.config.locationName);
  const currentLocationId = useSelector((state: RootState) => state.common.config.locationId);

  const locationWidth = useGrid({col: 3, space: 10, sideSpace: 10});
  const [cities, setCities] = React.useState<LocationCity[]>([]);
  const [hotCities, setHotCities] = React.useState<LocationCity[]>([]); // 接口返回的热门城市
  const [searchText, setSearchText] = React.useState('');
  // const [searchKeyword, setSearchKeyword] = React.useState(''); // 搜索关键字, 确定搜索时再更新

  const validSearchText = useMemo(() => {
    if (!searchText) {
      return '';
    }
    return searchText.trim();
  }, [searchText]);
  // 筛选后的热门城市，去掉当前城市，防止出现重复
  const showHotLocations = useMemo(() => {
    return hotCities.filter(location => location.id !== currentLocationId);
  }, [currentLocationId, hotCities]);

  // 筛选后的站点列表
  const searchResult = useMemo(() => {
    if (!validSearchText) {
      return [];
    }
    return cities.filter(city => fuzzyMatch(city.name, validSearchText)).filter((_, i) => i < 20);
  }, [validSearchText, cities]);

  // useLog('searchResult', searchResult);
  // useLog('input', searchText);
  // useLog('valid', validSearchText);
  // useLog('searchKeyword', searchKeyword);

  const [showCurrentIndex, setShowCurrentIndex] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState('');

  const [commonDispatcher] = useCommonDispatcher();

  const {top} = useSafeAreaInsets();

  function closeSelectCity() {
    props.onClose();
  }

  function selectLocation(id: number, name: string) {
    commonDispatcher.setConfig({
      locationId: id,
      locationName: name,
    });
    closeSelectCity();
  }

  useEffect(() => {
    let timer: number;
    if (showCurrentIndex) {
      timer = setTimeout(() => {
        setShowCurrentIndex(false);
      }, 1000);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, [currentIndex, showCurrentIndex]);

  // useEffect(() => {
  //   let timer: number;
  //   const text = validSearchText;
  //   timer = setTimeout(() => {
  //     // console.log('执行搜索', text);
  //     setSearchKeyword(text);
  //   }, 300);
  //   return () => {
  //     timer && clearTimeout(timer);
  //   };
  // }, [validSearchText]);

  useEffect(() => {
    api.common.getAllCityV2().then(res => {
      setCities(res.all);
      setHotCities(res.hot);
    });
  }, []);

  function handleSelectIndex(section) {
    setCurrentIndex(section.item);
    setShowCurrentIndex(true);
  }

  function renderSection({section}: {section: LocationSection}) {
    return (
      <View style={[styles.section]}>
        <Text style={globalStyles.fontPrimary}>{section.title}</Text>
      </View>
    );
  }

  function renderCity({item}) {
    // console.log(item);
    return (
      <TouchableHighlight underlayColor="#eee" onPress={() => selectLocation(item.data.id, item.data.name)}>
        <View style={[styles.cityItem]}>
          <Text>{item.data.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  function renderListHeader() {
    return (
      <View style={{backgroundColor: '#fff'}}>
        <View style={styles.section}>
          <Text>当前/热门城市</Text>
        </View>
        <View style={[styles.hotLocationWrap]}>
          <View style={[styles.hotLocationItem, styles.currentLocationWrap, {width: locationWidth}]}>
            <Text numberOfLines={1} style={[globalStyles.fontPrimary, styles.currentLocationText]}>
              {currentLocationName}
            </Text>
          </View>
          {showHotLocations.map(location => {
            return (
              <TouchableOpacity activeOpacity={0.7} key={location.id} onPress={() => selectLocation(location.id, location.name)}>
                <View style={[styles.hotLocationItem, {width: locationWidth}]}>
                  <Text numberOfLines={1} style={[globalStyles.fontPrimary]}>
                    {location.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <ReactNativeModal
      style={styles.citySelectorModal}
      isVisible={props.visible}
      onBackdropPress={closeSelectCity}
      onBackButtonPress={closeSelectCity}
      animationIn="slideInDown"
      animationOut="slideOutUp">
      <View style={[styles.citySelector, {paddingTop: top, flex: 1}]}>
        <View style={[globalStyles.containerLR, {paddingLeft: 15, height: 50}]}>
          <TouchableOpacity activeOpacity={0.7} onPress={closeSelectCity}>
            <Icon name="nav_back48" width={11} height={24} />
          </TouchableOpacity>
          <TextInput value={searchText} onChangeText={setSearchText} placeholder="搜索城市" style={styles.searchInput} returnKeyType="search" clearButtonMode="while-editing" />
        </View>
        {validSearchText ? (
          <ScrollView showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
            {searchResult.map(location => {
              return renderCity({item: {data: location}});
            })}
            {!searchResult?.length && <Empty text="没有找到符合条件的城市/站点" style={{marginTop: 120}} />}
          </ScrollView>
        ) : (
          <IndexedSectionList
            keyboardDismissMode="on-drag"
            onSelectIndex={handleSelectIndex}
            initialNumToRender={30}
            items={cities}
            titleKey="firstLetter"
            uniqueKey="id"
            indexItemHeight={20}
            style={{width: '100%'}}
            renderItem={renderCity}
            indexWrapperStyle={{backgroundColor: 'transparent'}}
            renderSectionHeader={renderSection}
            ListHeaderComponent={renderListHeader}
            showsVerticalScrollIndicator={false}
          />
        )}

        {showCurrentIndex && (
          <View style={[styles.currentIndex, globalStyles.containerCenter]}>
            <Text>{currentIndex}</Text>
          </View>
        )}
      </View>
    </ReactNativeModal>
  );
};

export default SelectLocationModal;

const styles = StyleSheet.create({
  citySelectorModal: {
    margin: 0,
    justifyContent: 'flex-start',
    backgroundColor: '#6cf',
  },
  searchInput: {
    height: 35,
    borderRadius: 35,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 15,
    margin: 0,
    flex: 1,
    marginLeft: 10,
    marginRight: 15,
  },
  citySelector: {
    backgroundColor: '#fff',
    paddingBottom: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flex: 1,
  },
  cityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
  section: {
    backgroundColor: '#f4f4f4',
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  hotLocationWrap: {
    paddingTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 10,
  },
  currentLocationWrap: {
    backgroundColor: '#FF59341A',
    borderColor: globalStyleVariables.COLOR_PRIMARY,
  },
  currentLocationText: {
    color: globalStyleVariables.COLOR_PRIMARY,
  },
  hotLocationItem: {
    height: 30,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 5,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#999',
  },
  cityItem: {
    backgroundColor: '#fff',
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  indexBar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  currentIndex: {
    width: 40,
    height: 40,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    position: 'absolute',
    left: '48%',
    top: '40%',
  },
});
