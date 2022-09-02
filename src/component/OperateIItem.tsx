import {Icon} from '@ant-design/react-native';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {globalStyles, globalStyleVariables} from '../constants/styles';

interface OperateItemProps {
  title?: string;
  icon?: React.ReactNode;
  extra?: React.ReactNode;
}

const OperateItem: React.FC<OperateItemProps> = props => {
  const {title} = props;
  return (
    <View style={styles.operateWrapper}>
      <View style={[styles.operateBody]}>
        {props.icon}
        <Text style={[globalStyles.fontPrimary, styles.operateTitle]}>
          {title}
        </Text>
        <Icon name="right" style={globalStyles.iconRight} />
      </View>
      {props.extra && <View style={styles.operateExtra}>{props.extra}</View>}
    </View>
  );
};
OperateItem.defaultProps = {
  title: '请填写操作名字',
};
export default OperateItem;

const styles = StyleSheet.create({
  SectionGroup: {
    marginTop: globalStyleVariables.MODULE_SPACE,
  },
  operateWrapper: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 15,
  },
  operateBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  operateTitle: {
    flex: 1,
    marginHorizontal: globalStyleVariables.MODULE_SPACE,
  },
  operateExtra: {
    marginTop: globalStyleVariables.MODULE_SPACE,
    paddingLeft: 30,
  },
});
