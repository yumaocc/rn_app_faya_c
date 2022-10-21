import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, BackHandler, TextInput} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {globalStyles, globalStyleVariables} from '../constants/styles';
import {StylePropView} from '../models';
import Icon from './Icon';

interface NavigationSearchBarProps {
  leftIcon?: React.ReactNode;
  searchBar?: React.ReactNode;
  showSearchText?: boolean;
  headerRight?: React.ReactNode;
  autoFocus?: boolean;
  safeTop?: boolean;
  style?: StylePropView;
  color?: string;
  canBack?: boolean; // 安卓是否响应默认的返回按钮
  onSearch?: (text: string) => void; // 发起搜索
  onInput?: (text: string) => void; // 搜索关键字改变时触发
  onBack?: () => void; // 返回按钮的点击事件，如果指定，会覆盖默认的返回事件
}

// 延伸返回按钮的点击区域
const hitSlop = {
  left: 15,
  right: 15,
  top: 15,
  bottom: 15,
};

const NavigationSearchBar: React.FC<NavigationSearchBarProps> = props => {
  const {leftIcon, searchBar, showSearchText} = props;

  const [value, setValue] = useState('');
  // const [keyword, setKeyword] = useState('');

  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const inputRef = useRef<TextInput>();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (props.canBack) {
        navigation.canGoBack() && navigation.goBack();
        return true;
      } else {
        return false;
      }
    });
    return () => backHandler.remove();
  }, [navigation, props.canBack]);

  function handleSearch() {
    inputRef.current?.blur();
    props.onSearch && props.onSearch(value);
  }

  function handleInput(val: string) {
    setValue(val);
    props.onInput && props.onInput(val);
  }
  function handleBack() {
    if (props.canBack) {
      if (props.onBack) {
        props.onBack();
      } else {
        navigation.canGoBack() && navigation.goBack();
      }
    }
  }

  function renderSearchBar() {
    if (searchBar) {
      return searchBar;
    } else {
      return (
        <View style={{paddingVertical: 15}}>
          <View style={[styles.searchBar]}>
            <Icon name="all_input_search36" size={18} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
            <TextInput
              autoFocus={props.autoFocus}
              ref={inputRef}
              clearButtonMode="while-editing"
              value={value}
              onChangeText={handleInput}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              style={styles.input}
              placeholder="搜索"
            />
          </View>
        </View>
      );
    }
  }

  return (
    <View style={[props.style, {paddingTop: top}]}>
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleBack}>
          {leftIcon ? leftIcon : <Icon name="nav_back48" width={11} height={24} color={props.color} />}
        </TouchableOpacity>
        <View style={{flex: 1}}>{renderSearchBar()}</View>
        {showSearchText ? (
          <TouchableOpacity activeOpacity={0.5} onPress={handleSearch} hitSlop={hitSlop}>
            <Text style={[globalStyles.fontPrimary, {fontSize: 18, fontWeight: '600'}]}>搜索</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default NavigationSearchBar;
NavigationSearchBar.defaultProps = {
  style: {},
  color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  showSearchText: true,
  safeTop: true,
  canBack: true,
  autoFocus: true,
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    height: 35,
    backgroundColor: '#0000000D',
    marginHorizontal: globalStyleVariables.MODULE_SPACE,
    flexDirection: 'row',
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
    borderRadius: 35,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginLeft: globalStyleVariables.MODULE_SPACE,
    padding: 0,
    margin: 0,
  },
});
