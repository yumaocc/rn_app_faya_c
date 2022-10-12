import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Button} from '../../component';
import {globalStyleVariables} from '../../constants/styles';
import {PackageDetail, SKUDetail, SKUSaleState, SPUDetailF} from '../../models';

interface BuyBarProps {
  collected?: boolean;
  inShopWindow?: boolean; // 是否加入橱窗
  hasCommission?: boolean;
  isSoldOut?: boolean;
  spu?: SPUDetailF;
  sku?: SKUDetail | PackageDetail;
  onCollect?: () => void;
  onAddToShopWindow?: () => void;
  onBuy?: () => void;
  onShare?: () => void;
}

const BuyBar: React.FC<BuyBarProps> = props => {
  const {collected, inShopWindow, onBuy, sku, onShare, onAddToShopWindow, onCollect} = props;
  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <TouchableOpacity activeOpacity={0.8} onPress={onCollect}>
          <View style={styles.action}>
            {collected ? (
              <>
                <Icon name="star" size={24} color={globalStyleVariables.COLOR_WARNING_YELLOW} />
                <Text style={styles.actionText}>已收藏</Text>
              </>
            ) : (
              <>
                <Icon name="star-border" size={24} />
                <Text style={styles.actionText}>收藏</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={onAddToShopWindow}>
          <View style={styles.action}>
            {inShopWindow ? (
              <>
                <Icon name="storefront" size={24} />
                <Text style={styles.actionText}>已加入</Text>
              </>
            ) : (
              <>
                <Icon name="storefront" size={24} />
                <Text style={styles.actionText}>加入橱窗</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.buttons}>
        {!!sku?.userCommission && (
          <Button
            title={`分享得${sku?.userCommissionYuan}`}
            onPress={onShare}
            style={[styles.button, {backgroundColor: globalStyleVariables.COLOR_BUD, borderColor: globalStyleVariables.COLOR_BUD, marginRight: globalStyleVariables.MODULE_SPACE}]}
          />
        )}
        <Button disabled={sku?.saleStatus !== SKUSaleState.ON_SALE} title="立即购买" style={[styles.button]} containerStyle={{flex: 1}} onPress={onBuy} />
      </View>
    </View>
  );
};
BuyBar.defaultProps = {
  collected: false,
  inShopWindow: false,
  hasCommission: false,
  isSoldOut: false,
  onAddToShopWindow: () => {},
  onBuy: () => {},
  onCollect: () => {},
  onShare: () => {},
};
export default BuyBar;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: globalStyleVariables.MODULE_SPACE,
  },
  actions: {
    flexDirection: 'row',
  },
  action: {
    alignItems: 'center',
    width: 50,
    height: 44,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: globalStyleVariables.MODULE_SPACE,
  },
  button: {
    paddingHorizontal: globalStyleVariables.MODULE_SPACE_BIGGER,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
  },
});
