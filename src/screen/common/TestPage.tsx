import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, ViewStyle} from 'react-native';
import {NavigationBar} from '../../component';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {icons} from '../../component/Icon/icons';
import Icon, {IconName} from '../../component/Icon';
import {Button} from '@ant-design/react-native';
import {Button as MyButton} from '../../component';

const TestPage: React.FC = () => {
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

  return (
    <View style={styles.container}>
      <NavigationBar title="测试" />
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
      <View style={{padding: 20}}>
        <Button type="primary" onPress={() => {}} activeStyle={check} style={{width: 80, height: 30}}>
          按钮
        </Button>
        {/* <Button type="primary" onPress={() => {}} style={{height: 20}}>
          按钮
        </Button> */}
        <View style={{marginTop: 20}} />
        <MyButton onPress={() => {}} title="按钮" />
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', padding: 30}}>
          {Object.keys(icons).map((item, index) => {
            return (
              <View key={index}>
                <Text>{item}</Text>
                <Icon name={item as IconName} size={24} color={currentColor} />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default TestPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    height: 200,
  },
});

const check: ViewStyle = {
  backgroundColor: '#6cf',
  borderColor: '#6cf',
};
