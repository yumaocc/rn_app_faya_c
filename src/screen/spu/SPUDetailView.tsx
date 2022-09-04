import {Carousel, Icon} from '@ant-design/react-native';
import {PaginationProps} from '@ant-design/react-native/lib/carousel';
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {PackageDetail, SKUDetail, SPUDetailF} from '../../models';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface SPUDetailViewProps {
  spu: SPUDetailF;
  currentSelect: SKUDetail | PackageDetail;
  onChangeSelect: (sku: SKUDetail | PackageDetail) => void;
}

const SPUDetailView: React.FC<SPUDetailViewProps> = props => {
  const {spu, currentSelect} = props;

  console.log(currentSelect);

  function renderIndicator({current, count}: PaginationProps): React.ReactNode {
    return (
      <View style={styles.indicator}>
        <Text style={{color: '#fff', fontSize: 16}}>
          {current + 1} / {count}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* banner */}
      <View style={styles.banners}>
        <Carousel autoplay infinite style={styles.swiperWrapper} pagination={renderIndicator}>
          {spu.banners.map((banner, i) => (
            <Image key={i} source={{uri: banner}} style={styles.banner} />
          ))}
        </Carousel>
        <View style={styles.bannerBottom}>
          <View style={[globalStyles.containerRow, {backgroundColor: '#f92', height: 27, paddingLeft: 10}]}>
            <View style={{paddingHorizontal: 20}}>
              <Text style={{color: '#fff'}}>库存: {currentSelect?.saleAmount || 9999}</Text>
            </View>
            <View style={[globalStyles.lineVertical, {height: 10, backgroundColor: '#ffffff80'}]} />
            <View style={{paddingHorizontal: 20}}>
              <Text style={{color: '#fff'}}>还剩: {currentSelect?.saleAmount || '1'}天</Text>
            </View>
          </View>
          <View style={styles.priceTag}>
            <Image source={require('../../assets/left-round.png')} style={{width: 35, height: 45}} />
            <View style={[globalStyles.containerRow, {backgroundColor: globalStyleVariables.COLOR_PRIMARY, height: 45, paddingRight: 15}]}>
              <Text>
                <Text style={[{color: '#fff', fontSize: 15}]}>¥</Text>
                <Text style={[{color: '#fff', fontSize: 25}]}>39.9</Text>
                <Text style={[globalStyles.fontTertiary, {textDecorationLine: 'line-through', color: '#ffffff80'}]}>¥99.9</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 标题栏 */}
      <View style={{padding: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff'}}>
        <View style={[globalStyles.containerLR]}>
          <View style={[globalStyles.containerRow]}>
            <Icon name="shop" size={20} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
            <Text style={[globalStyles.fontPrimary, {paddingLeft: 5}]}>{spu.bizName}</Text>
          </View>
          <View style={[globalStyles.containerRow]}>
            <Text>收藏{spu.collectAmount}</Text>
            <Text style={{marginHorizontal: globalStyleVariables.MODULE_SPACE}}>·</Text>
            <Text>已售999</Text>
          </View>
        </View>
        <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}]}>
          <View style={[globalStyles.tagWrapper, {backgroundColor: '#4AB87D33'}]}>
            <Text style={[globalStyles.tag, {color: '#4AB87D'}]}>平台保障·随心腿</Text>
          </View>
          <View style={[globalStyles.tagWrapper, {backgroundColor: '#FF593433', marginLeft: globalStyleVariables.MODULE_SPACE}]}>
            <Text style={[globalStyles.tag, {color: '#FF5934'}]}>限时抢购</Text>
          </View>
        </View>
        <Text style={[globalStyles.fontStrong, {marginTop: globalStyleVariables.MODULE_SPACE_SMALLER, fontSize: 24}]}>{spu.name}</Text>
      </View>

      {/* 选择套餐 */}
      <View style={[{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff', padding: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
        <Text style={globalStyles.fontStrong}>套餐规格</Text>
        <View style={[{flexDirection: 'row', flexWrap: 'wrap', marginTop: globalStyleVariables.MODULE_SPACE}]}>
          <View style={[styles.skuItem, styles.skuItemActive]}>
            <Text style={[styles.skuText, styles.skuTextActive]}>特价二人餐</Text>
          </View>
          <View style={[styles.skuItem]}>
            <Text style={[styles.skuText]}>{'特价二人餐'.repeat(2)}</Text>
          </View>
          <View style={[styles.skuItem]}>
            <Text style={[styles.skuText]}>{'特价二人餐'.repeat(6)}</Text>
          </View>
        </View>
      </View>

      {/* 可用门店 */}
      <View style={[{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff', padding: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
        <View style={[globalStyles.containerLR, {height: 24}]}>
          <Text style={[globalStyles.fontStrong]}>可用门店{spu?.shopList?.length ? `（${spu.shopList.length}）` : ''}</Text>
          {spu?.shopList?.length > 1 && <MaterialIcon name="arrow-forward-ios" size={18} color={globalStyleVariables.TEXT_COLOR_SECONDARY} />}
        </View>
        <View style={[globalStyles.lineHorizontal, {marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}]} />
        {/* 所有店铺 */}
        <View style={{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}}>
          {spu?.shopList?.map((shop, index) => {
            return (
              <View key={index}>
                {index !== 0 && <View style={[globalStyles.lineHorizontal, {height: StyleSheet.hairlineWidth, marginVertical: globalStyleVariables.MODULE_SPACE_BIGGER}]} />}
                <Text style={[globalStyles.fontStrong]}>{shop.shopName}</Text>
                <View style={[globalStyles.containerLR]}>
                  <View style={[{flex: 1}]}>
                    <Text>{shop.addressDetail}</Text>
                    {shop?.distanceFromMe && (
                      <View style={[globalStyles.tagWrapper, {backgroundColor: '#49A0FF1A'}]}>
                        <Text style={[globalStyles.tag, {color: '#49A0FF'}]}>{shop.distanceFromMe}</Text>
                      </View>
                    )}
                  </View>
                  <View style={[globalStyles.containerRow, {marginLeft: globalStyleVariables.MODULE_SPACE}]}>
                    <TouchableOpacity activeOpacity={0.9}>
                      <View style={styles.shopAction}>
                        <MaterialIcon name="navigation" size={16} color="#49a0ff" />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.9}>
                      <View style={[styles.shopAction, {marginLeft: globalStyleVariables.MODULE_SPACE}]}>
                        <MaterialIcon name="call" size={16} color="#48db94" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* 商品详情 */}
    </View>
  );
};
export default SPUDetailView;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  banners: {
    height: 281,
    position: 'relative',
  },
  swiperWrapper: {
    height: 281,
    width: '100%',
  },
  indicator: {
    position: 'absolute',
    left: globalStyleVariables.MODULE_SPACE,
    bottom: 44,
  },
  banner: {
    height: '100%',
    width: '100%',
  },
  bannerBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#6cf',
  },
  priceTag: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
  },
  skuItem: {
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderColor: '#f2f2f2',
    borderRadius: 5,
    borderWidth: 2,
    marginRight: globalStyleVariables.MODULE_SPACE,
    marginBottom: globalStyleVariables.MODULE_SPACE,
  },
  skuItemActive: {
    backgroundColor: '#ffeeeb',
    borderColor: globalStyleVariables.COLOR_PRIMARY,
  },
  skuText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
  skuTextActive: {
    color: globalStyleVariables.COLOR_PRIMARY,
  },
  shopAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0000000D',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
