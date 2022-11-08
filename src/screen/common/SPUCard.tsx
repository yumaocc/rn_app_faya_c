import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '../../component/Icon';
import {globalStyleVariables, globalStyles} from '../../constants/styles';
import {SPUF} from '../../models';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';

interface SPUCardProps {
  spu: SPUF;
  onSelect?: (spu: SPUF) => void;
}

const SPUCard: React.FC<SPUCardProps> = props => {
  const {spu, onSelect} = props;
  const {commissionRangeLeftMoneyYuan, commissionRangeRightMoneyYuan, salePrice, originPrice} = spu;
  let commission = '';
  if (commissionRangeLeftMoneyYuan && commissionRangeRightMoneyYuan) {
    if (commissionRangeLeftMoneyYuan === commissionRangeRightMoneyYuan) {
      commission = commissionRangeLeftMoneyYuan;
    } else {
      commission = `${commissionRangeLeftMoneyYuan}-${commissionRangeRightMoneyYuan}`;
    }
  }
  let discount = null;
  if (originPrice && salePrice) {
    const res = Math.round((salePrice / originPrice) * 10);
    discount = Math.max(1, res);
  }
  if (discount && discount > 5) {
    discount = null;
  }

  function handleSelectSpu() {
    onSelect && onSelect(spu);
  }

  return (
    <View>
      <TouchableOpacity activeOpacity={0.8} onPress={handleSelectSpu}>
        <View style={styles.spuItem}>
          <View style={styles.spuCoverContainer}>
            <FastImage source={{uri: spu.poster}} defaultSource={require('../../assets/sku_def_1_1.png')} style={styles.spuCover} />
          </View>
          <View style={{paddingLeft: globalStyleVariables.MODULE_SPACE, flex: 1}}>
            <View style={globalStyles.containerRow}>
              <Icon name="shangpin_shanghu24" size={15} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
              <Text style={[globalStyles.fontPrimary, {marginLeft: globalStyleVariables.MODULE_SPACE_SMALLER, fontSize: 12}]}>{spu?.bizName}</Text>
            </View>
            {spu.tags?.length ? (
              <View style={[globalStyles.halfModuleMarginTop]}>
                {spu.tags?.map((tag, i) => (
                  <Text key={i} style={[globalStyles.fontTertiary, {marginRight: globalStyleVariables.MODULE_SPACE}]}>
                    {tag}
                  </Text>
                ))}
              </View>
            ) : null}

            <Text style={[globalStyles.fontStrong, {marginTop: 10}]}>{spu.spuName}</Text>
            <View style={[globalStyles.halfModuleMarginTop, globalStyles.containerLR, {alignItems: 'flex-end'}]}>
              <View style={[globalStyles.containerRow, globalStyles.halfModuleMarginTop, {alignItems: 'flex-end'}]}>
                <View style={[globalStyles.containerRow]}>
                  <View style={[globalStyles.containerRow, {alignItems: 'flex-end'}]}>
                    <Text style={[{color: globalStyleVariables.COLOR_PRIMARY, fontSize: 12}]}>¥</Text>
                    <Text style={{color: globalStyleVariables.COLOR_PRIMARY, fontSize: 18, lineHeight: 18, bottom: -2}}>{spu.salePriceYuan}</Text>
                    <Text style={[globalStyles.fontTertiary, {marginLeft: globalStyleVariables.MODULE_SPACE / 2, textDecorationLine: 'line-through'}]}>¥{spu.originPriceYuan}</Text>
                  </View>
                </View>
                {discount && (
                  <View style={[globalStyles.discountTagWrapper, globalStyles.moduleMarginLeft]}>
                    <Text style={[globalStyles.discountTag]}>{discount}折</Text>
                  </View>
                )}
              </View>
              {commission && (
                <View style={globalStyles.containerRow}>
                  <MaterialIcon name="spa" size={14} color={globalStyleVariables.COLOR_BUD} />
                  <Text style={{color: globalStyleVariables.COLOR_BUD}}>{commission}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SPUCard;

const styles = StyleSheet.create({
  spuItem: {
    marginBottom: globalStyleVariables.MODULE_SPACE,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: globalStyleVariables.MODULE_SPACE_BIGGER,
  },
  spuCoverContainer: {
    width: 60,
    height: 60,
  },
  spuCover: {
    borderRadius: 5,
    width: '100%',
    height: '100%',
  },
  spuName: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
});
