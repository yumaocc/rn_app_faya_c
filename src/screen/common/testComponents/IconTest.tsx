import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {globalStyles, globalStyleVariables} from '../../../constants/styles';
import {icons} from '../../../component/Icon/icons';
import Icon, {IconName} from '../../../component/Icon';

const IconTest: React.FC = () => {
  const colors = [
    globalStyleVariables.COLOR_PRIMARY,
    globalStyleVariables.COLOR_CASH,
    globalStyleVariables.COLOR_BUD,
    globalStyleVariables.COLOR_WARNING_RED,
    globalStyleVariables.COLOR_WARNING_YELLOW,
    globalStyleVariables.TEXT_COLOR_PRIMARY,
    globalStyleVariables.TEXT_COLOR_SECONDARY,
    globalStyleVariables.TEXT_COLOR_TERTIARY,
  ];
  const [currentColor, setCurrentColor] = React.useState('#333');
  const [showName, setShowName] = React.useState('');

  return (
    <View style={styles.container}>
      <Text>图标测试：点击颜色切换</Text>
      <View style={[globalStyles.containerRow, {flexWrap: 'wrap'}]}>
        {colors.map((color, index) => {
          return (
            <TouchableOpacity key={index} style={{marginRight: 10, marginBottom: 10}} onPress={() => setCurrentColor(color)}>
              <View style={{backgroundColor: color, width: 40, height: 40}} />
            </TouchableOpacity>
          );
        })}
      </View>

      <View>
        <Text>当前选中: {showName}</Text>
      </View>

      <ScrollView style={{flex: 1}}>
        <View style={[styles.iconWrapper, styles.iconWrap]}>
          {Object.keys(icons).map((item, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => setShowName(item)}>
                <View>
                  <Icon name={item as IconName} size={24} color={currentColor} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default IconTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    height: 200,
  },
  iconWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconWrapper: {
    padding: 30,
  },
});
