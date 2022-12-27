import React, {useEffect, useMemo, useRef} from 'react';
import {View, Text, StyleSheet, SectionList, TouchableHighlight} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import * as api from '../../apis';
import {useCommonDispatcher} from '../../helper/hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LocationCity} from '../../models';
import {groupLocation, LocationSection} from './util';
import IndexBar from './IndexBar';
// import IndexedSectionList from '../IndexedSectionList';

interface SelectLocationModalProps {
  visible: boolean;
  onClose: () => void;
}

const SelectLocationModal: React.FC<SelectLocationModalProps> = props => {
  const [cities, setCities] = React.useState<LocationCity[]>([]);
  const [hotCities, setHotCities] = React.useState<LocationCity[]>([]);
  const sectionListRef = useRef<SectionList>();

  const groupedCities = useMemo(() => {
    return groupLocation(cities);
  }, [cities]);

  const [commonDispatcher] = useCommonDispatcher();

  const {top} = useSafeAreaInsets();

  function closeSelectCity() {
    props.onClose();
  }

  function selectCity(city: LocationCity) {
    commonDispatcher.setConfig({
      locationId: city.id,
      locationName: city.name,
    });
    closeSelectCity();
  }

  useEffect(() => {
    api.common.getAllCityV2().then(res => {
      // console.log('res', res);
      setCities(res.all);
      setHotCities(res.hot);
    });
  }, []);

  function handleSelectIndex(section: LocationSection, index: number) {
    // console.log('scroll to', section.title, index);
    sectionListRef.current &&
      sectionListRef.current.scrollToLocation({
        itemIndex: 1, // 0会导致偏移不准
        sectionIndex: index,
      });
  }

  function renderSection({section}: {section: LocationSection}) {
    return (
      <View style={[styles.section]}>
        <Text style={globalStyles.fontPrimary}>{section.title}</Text>
      </View>
    );
  }

  function renderCity({item}: {item: LocationCity}) {
    return (
      <TouchableHighlight underlayColor="#eee" onPress={() => selectCity(item)}>
        <View style={[styles.cityItem]}>
          <Text>{item.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  function renderListHeader() {
    return (
      <View style={{backgroundColor: '#fff'}}>
        <View>
          <Text>热门城市</Text>
        </View>
        <View style={[{height: 100, backgroundColor: '#6cf'}]} />
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
        <View>
          <Text>导航栏，可关闭</Text>
        </View>
        {/* <IndexedSectionList
          sections={groupedCities}
          renderSectionHeader={renderSection}
          renderItem={renderCity}
          ListHeaderComponent={renderListHeader}
          onSelectIndex={handleSelectIndex}
          style={{flex: 1}}
        /> */}
        <SectionList
          showsVerticalScrollIndicator={false}
          style={[{flex: 1}]}
          ref={sectionListRef}
          renderItem={renderCity}
          sections={groupedCities}
          renderSectionHeader={renderSection}
          ListHeaderComponent={renderListHeader}
          onScrollToIndexFailed={info => {
            console.log('scroll error', info);
          }}
        />
        <IndexBar onSelectIndex={handleSelectIndex} style={styles.indexBar} sections={groupedCities} />
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
    // height: '90%',
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
});
