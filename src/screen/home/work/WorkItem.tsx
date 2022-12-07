import React, {memo, useMemo} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions} from 'react-native';
import Icon from '../../../component/Icon';
import MyImage from '../../../component/MyImage';
import {globalStyleVariables, globalStyles} from '../../../constants/styles';
import {getPrettyNumber} from '../../../fst/helper/data';
import {BoolEnum} from '../../../fst/models';
import {WorkF, WorkType} from '../../../models';

export interface WorkItemProps {
  work: WorkF;
  index: number;
  onSelect?: (work: WorkF, index: number) => void;
}

const WorkItem: React.FC<WorkItemProps> = props => {
  const {work, index, onSelect} = props;

  const {width} = useWindowDimensions();
  const coverHeight = useMemo(() => {
    return ((width - 30) / 2 / 3) * 4;
  }, [width]);

  function handleClick() {
    onSelect && onSelect(work, index);
  }

  return (
    <View style={styles.item}>
      <TouchableOpacity activeOpacity={0.9} onPress={handleClick}>
        <View style={{width: '100%', position: 'relative'}}>
          <MyImage source={{uri: work?.coverImage}} defaultSource={require('../../../assets/sku_def_180w.png')} style={[styles.cover, {height: coverHeight}]} resizeMode="cover" />
          {work.type === WorkType.Video && (
            <View style={[styles.playIcon]}>
              <Image source={require('../../../assets/zuopin_tag_video.png')} style={styles.palyIconImage} />
            </View>
          )}
        </View>
      </TouchableOpacity>
      <View style={[{padding: globalStyleVariables.MODULE_SPACE}]}>
        <Text style={[globalStyles.fontStrong, {fontSize: 15}]} numberOfLines={2}>
          {work.content || '暂无描述'}
        </Text>
        <View style={[globalStyles.containerLR, {marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}]}>
          <View style={[globalStyles.containerRow, {flex: 1, marginRight: 5}]}>
            {work?.userAvatar ? (
              <Image source={{uri: work.userAvatar}} style={styles.avatar} />
            ) : (
              <Image source={require('../../../assets/avatar_def.png')} style={styles.avatar} />
            )}
            <Text style={[globalStyles.fontPrimary, {marginLeft: 3, flex: 1}]} numberOfLines={1}>
              {work.userName}
            </Text>
          </View>
          <View style={globalStyles.containerRow}>
            {work.liked === BoolEnum.TRUE ? (
              <Icon name="home_zuopin_zan_sel20" size={15} color={globalStyleVariables.COLOR_LIKE_RED} />
            ) : (
              <Icon name="home_zuopin_zan_nor20" size={15} color={globalStyleVariables.TEXT_COLOR_TERTIARY} />
            )}
            <Text style={[globalStyles.fontPrimary, {marginLeft: 3}]}>{getPrettyNumber(work.numberOfLikes)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(WorkItem);

const styles = StyleSheet.create({
  item: {
    width: '100%',
    marginTop: 10,
  },
  cover: {
    width: '100%',
    height: 220,
    borderRadius: 8,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  playIcon: {
    position: 'absolute',
    right: globalStyleVariables.MODULE_SPACE,
    top: globalStyleVariables.MODULE_SPACE,
  },
  palyIconImage: {
    width: 24,
    height: 24,
  },
});
