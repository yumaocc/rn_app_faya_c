import React, {useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '../../component/Icon';
import {Button} from '../../component';
import {globalStyleVariables} from '../../constants/styles';
import {PackageDetail, SKUDetail, SKUSaleState, SPUDetailF} from '../../models';
import {BoolEnum} from '../../fst/models';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers';

interface BuyBarProps {
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
  const {sku, spu, onBuy, onShare, onAddToShopWindow, onCollect} = props;
  const userInfo = useSelector((state: RootState) => state.user.myDetail);
  const hasShowcase = useMemo(() => userInfo?.level > 0, [userInfo]);

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <TouchableOpacity activeOpacity={0.8} onPress={onCollect}>
          <View style={styles.action}>
            {spu?.collected === BoolEnum.TRUE ? (
              <>
                <Icon name="shangpin_shoucang_sel" size={24} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                <Text style={styles.actionText}>已收藏</Text>
              </>
            ) : (
              <>
                <Icon name="shangpin_shoucang_nor" size={24} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                <Text style={styles.actionText}>收藏</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
        {hasShowcase && (
          <TouchableOpacity activeOpacity={0.8} onPress={onAddToShopWindow}>
            <View style={styles.action}>
              {spu?.showcaseJoined === BoolEnum.TRUE ? (
                <>
                  <Icon name="shangpin_addchuchaung_sel" size={24} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                  <Text style={styles.actionText}>已加入</Text>
                </>
              ) : (
                <>
                  <Icon name="shangpin_addchuchaung_nor" size={24} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
                  <Text style={styles.actionText}>加入橱窗</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.buttons}>
        <Button
          cash
          title={`分享${sku?.userCommission ? `得${sku?.userCommissionYuan}` : ''}`}
          onPress={onShare}
          style={[styles.button, {backgroundColor: globalStyleVariables.COLOR_BUD, borderColor: globalStyleVariables.COLOR_BUD, marginRight: globalStyleVariables.MODULE_SPACE}]}
        />
        <Button disabled={sku?.saleStatus !== SKUSaleState.ON_SALE} type="primary" title="立即购买" style={[styles.button, {flex: 1}]} onPress={onBuy} />
      </View>
    </View>
  );
};
BuyBar.defaultProps = {
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
    height: 60,
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
