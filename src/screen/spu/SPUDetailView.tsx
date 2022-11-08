import {Carousel} from '@ant-design/react-native';
import {PaginationProps} from '@ant-design/react-native/lib/carousel';
import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {globalStyles, globalStyleVariables} from '../../constants/styles';
import {LocationNavigateInfo, PackageDetail, SKUBuyNotice, SKUDetail, SKUSaleState, SKUShowInfo, SPUDetailF} from '../../models';
import Icon from '../../component/Icon';
// import {useLog, useWhyDidYouUpdate} from '../../fst/hooks';
import {convertSKUBuyNotice} from '../../helper/order';
import {callPhone} from '../../helper/system';
import CustomTouchable from '../../component/CustomTouchable';
import RichText from '../../component/RichText';
// import {useLog} from '../../fst/hooks';

interface SPUDetailViewProps {
  spu: SPUDetailF;
  currentSelect: SKUDetail | PackageDetail;
  isPackage: boolean;
  onNavigation?: (locationInfo: LocationNavigateInfo) => void; // 导航
  onChangeSelect: (sku: SKUDetail | PackageDetail, isPackage: boolean) => void;
  onShootVideo?: (spu: SPUDetailF) => void;
}

const SPUDetailView: React.FC<SPUDetailViewProps> = props => {
  const {spu, currentSelect, isPackage} = props;
  const [buyNotice, setBuyNotice] = useState<SKUBuyNotice>(null);

  // 用来统一要显示的内容
  const skuShowInfo: SKUShowInfo = useMemo(() => {
    if (!currentSelect) {
      return null;
    }
    if (isPackage) {
      const pkg = currentSelect as PackageDetail;
      return {
        id: 'pkg_' + pkg?.packageId,
        saleAmount: pkg?.saleAmount,
        skuName: pkg?.packageName,
        stockAmount: pkg?.stockAmount,
        originPrice: pkg?.packageOriginPrice,
        originPriceYuan: pkg?.packageOriginPriceYuan,
        salePrice: pkg?.packageSalePrice,
        salePriceYuan: pkg?.packageSalePriceYuan,
        videoCommission: pkg?.videoCommission,
        videoCommissionYuan: pkg.videoCommissionYuan,
      };
    } else {
      const sku = currentSelect as SKUDetail;
      return {
        id: 'sku_' + sku?.id,
        saleAmount: sku?.saleAmount,
        skuName: sku?.skuName,
        stockAmount: sku?.skuStockAmount,
        originPrice: sku?.originPrice,
        originPriceYuan: sku?.originPriceYuan,
        salePrice: sku?.salePrice,
        salePriceYuan: sku?.salePriceYuan,
        videoCommission: sku?.videoCommission,
        videoCommissionYuan: sku.videoCommissionYuan,
      };
    }
  }, [currentSelect, isPackage]);

  const currentSKU = useMemo(() => {
    if (currentSelect && !isPackage) {
      return currentSelect as SKUDetail;
    }
    return null;
  }, [currentSelect, isPackage]);
  const currentPkg = useMemo(() => {
    if (currentSelect && isPackage) {
      return currentSelect as PackageDetail;
    }
    return null;
  }, [currentSelect, isPackage]);

  // useLog('currentSKU', currentSKU);
  // useLog('currentPkg', currentPkg);
  // useLog('spu', spu);
  // useWhyDidYouUpdate('SPUDetailView', {...props, skuShowInfo});
  useEffect(() => {
    const notices = spu?.spuPurchaseNoticeVOS;
    if (!notices) {
      return;
    }
    const cleaned = convertSKUBuyNotice(notices);
    setBuyNotice(cleaned);
  }, [spu]);

  // const flatSKUList = useMemo(() => {
  //   const skuList = spu?.skuList?.map({})
  // }, []);

  // console.log(currentSelect);

  function handleClick(select: SKUDetail | PackageDetail, isPackage = false) {
    props.onChangeSelect(select, isPackage);
  }

  function handleNavigation(locationInfo: LocationNavigateInfo) {
    props.onNavigation && props.onNavigation(locationInfo);
  }

  function handleShootVideo() {
    props.onShootVideo && props.onShootVideo(spu);
  }

  function renderIndicator({current, count}: PaginationProps): React.ReactNode {
    return (
      <View style={styles.indicator}>
        <Text style={{color: '#fff', fontSize: 16}}>
          {current + 1} / {count}
        </Text>
      </View>
    );
  }

  function renderSKUNode(skuName: string, isActive: boolean, disabled: boolean, key: string) {
    return (
      <View style={[styles.skuItem, isActive && styles.skuItemActive, disabled && styles.skuItemDisabled]} key={key}>
        <Text style={[styles.skuText, isActive && styles.skuTextActive, disabled && styles.skuTextDisabled]}>{skuName}</Text>
      </View>
    );
  }

  function renderSKU(sku: SKUDetail) {
    const isActive = (currentSelect as SKUDetail)?.id === sku.id;
    const disabled = sku?.saleStatus !== SKUSaleState.ON_SALE;
    const key = 'sku_' + sku.id;
    if (!disabled) {
      return (
        <TouchableOpacity activeOpacity={0.8} key={key} onPress={() => handleClick(sku)}>
          {renderSKUNode(sku.skuName, isActive, disabled, key)}
        </TouchableOpacity>
      );
    } else {
      return renderSKUNode(sku.skuName, isActive, disabled, key);
    }
  }
  function renderPackage(pkg: PackageDetail) {
    const isActive = (currentSelect as PackageDetail)?.packageId === pkg.packageId;
    const disabled = pkg?.saleStatus !== SKUSaleState.ON_SALE;
    const key = 'pkg_' + pkg.packageId;
    if (!disabled) {
      return (
        <TouchableOpacity activeOpacity={0.8} key={key} onPress={() => handleClick(pkg, true)}>
          {renderSKUNode(pkg.packageName, isActive, disabled, key)}
        </TouchableOpacity>
      );
    } else {
      return renderSKUNode(pkg.packageName, isActive, disabled, key);
    }
  }

  function renderTips(text: string, index: number) {
    return (
      <View key={index}>
        <Text style={[globalStyles.fontPrimary, {fontSize: 15, lineHeight: 24}]}>·{text}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Image style={styles.maskUp} source={require('../../assets/mask-up.png')} resizeMode="stretch" /> */}
      {/* banner */}
      <View style={styles.banners}>
        <Carousel autoplay infinite style={styles.swiperWrapper} pagination={renderIndicator}>
          {spu?.banners?.map((banner, i) => (
            <Image key={i} source={{uri: banner}} style={styles.banner} />
          ))}
        </Carousel>
        <View style={{height: 27, width: 1}} />
        <View style={[styles.bannerBottom]}>
          <View style={[globalStyles.containerRow, {backgroundColor: '#f92', height: 27, paddingLeft: 10}]}>
            <View style={{paddingHorizontal: 20}}>
              <Text style={{color: '#fff'}}>库存: {skuShowInfo?.stockAmount}</Text>
            </View>
            <View style={[globalStyles.lineVertical, {height: 10, backgroundColor: '#ffffff80'}]} />
            <View style={{paddingHorizontal: 20}}>
              <Text style={{color: '#fff'}}>还剩: {spu?.theRemainingNumberOfDays || '-'}天</Text>
            </View>
          </View>
          <View style={styles.priceTag}>
            <Image source={require('../../assets/left-round.png')} style={{width: 35, height: 45}} />
            <View style={[globalStyles.containerRow, {backgroundColor: globalStyleVariables.COLOR_PRIMARY, height: 45, paddingRight: 15}]}>
              <Text>
                <Text style={[{color: '#fff', fontSize: 15}]}>¥</Text>
                <Text style={[{color: '#fff', fontSize: 25}]}>{skuShowInfo?.salePriceYuan}</Text>
                <Text style={[globalStyles.fontTertiary, {textDecorationLine: 'line-through', color: '#ffffff80'}]}>¥{skuShowInfo?.originPriceYuan}</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 标题栏 */}
      <View style={{padding: globalStyleVariables.MODULE_SPACE_BIGGER, backgroundColor: '#fff'}}>
        <View style={[globalStyles.containerLR]}>
          <View style={[globalStyles.containerRow]}>
            <Icon name="shangpin_shanghu24" size={12} color={globalStyleVariables.TEXT_COLOR_PRIMARY} />
            <Text style={[globalStyles.fontPrimary, {paddingLeft: 5, fontSize: 12}]}>{spu?.bizName}</Text>
          </View>
          <View style={[globalStyles.containerRow]}>
            <Text style={[globalStyles.fontTertiary]}>收藏{spu?.collectAmount}</Text>
            <Text style={{marginHorizontal: globalStyleVariables.MODULE_SPACE_SMALLER, color: globalStyleVariables.TEXT_COLOR_TERTIARY}}>·</Text>
            <Text style={[globalStyles.fontTertiary]}>已售{skuShowInfo?.saleAmount}</Text>
          </View>
        </View>
        <View style={[globalStyles.containerRow, {marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}]}>
          <View style={[globalStyles.tagWrapper, {backgroundColor: '#4AB87D33', height: 24}]}>
            <Icon name="shangpin_suixintui24" size={12} color="#4AB87D" />
            <Text style={[globalStyles.tag, {color: '#4AB87D', marginLeft: 2}]}>平台保障·随心退</Text>
          </View>
          <View style={[globalStyles.tagWrapper, {backgroundColor: '#FF593433', marginLeft: globalStyleVariables.MODULE_SPACE_SMALLER, height: 24}]}>
            <Text style={[globalStyles.tag, {color: '#FF5934'}]}>限时抢购</Text>
          </View>
        </View>
        <Text style={[globalStyles.fontStrong, {marginTop: globalStyleVariables.MODULE_SPACE_SMALLER, fontSize: 18}]}>{spu?.name}</Text>

        {skuShowInfo?.videoCommission && (
          <TouchableOpacity activeOpacity={0.8} onPress={handleShootVideo}>
            <View style={[styles.video, globalStyles.containerRow]}>
              <View style={{flex: 1}}>
                <Text style={[globalStyles.fontPrimary, {color: '#9A66DB', fontSize: 12}]}>为此商品拍摄视频，每单额外得{skuShowInfo?.videoCommissionYuan}芽</Text>
              </View>
              <View style={[globalStyles.lineVertical, {height: 10, backgroundColor: '#0000001A', marginHorizontal: 10}]} />
              <View style={globalStyles.containerRow}>
                <Icon name="all_uptupian64" size={18} color="#9A66DB" />
                <Text style={[globalStyles.fontPrimary, {color: '#9A66DB', fontSize: 12, marginLeft: 5}]}>立即拍</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* 选择套餐 */}
      <View
        style={[
          {
            marginTop: globalStyleVariables.MODULE_SPACE,
            backgroundColor: '#fff',
            paddingTop: globalStyleVariables.MODULE_SPACE_BIGGER,
            paddingHorizontal: globalStyleVariables.MODULE_SPACE_BIGGER,
            paddingBottom: 5,
          },
        ]}>
        <Text style={styles.moduleTitle}>套餐规格</Text>
        <View style={[{flexDirection: 'row', flexWrap: 'wrap', marginTop: globalStyleVariables.MODULE_SPACE}]}>
          {spu?.skuList?.map(sku => {
            return renderSKU(sku);
          })}

          {spu?.packageDetailsList?.map(packageDetail => {
            return renderPackage(packageDetail);
          })}
        </View>
      </View>

      {/* 商品详情 */}
      <View
        style={[
          {
            marginTop: globalStyleVariables.MODULE_SPACE,
            backgroundColor: '#fff',
            paddingHorizontal: globalStyleVariables.MODULE_SPACE_BIGGER,
            paddingBottom: globalStyleVariables.MODULE_SPACE_BIGGER,
          },
        ]}>
        {spu?.subName && (
          <View style={{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}}>
            <Text style={[globalStyles.fontPrimary, {fontSize: 15, lineHeight: 22}]}>{spu?.subName}</Text>
          </View>
        )}

        {/* 套餐内容 */}
        {currentSKU?.contentList?.length ? (
          <View style={styles.buyNoticeItem}>
            <Text style={styles.moduleSubTitle}>套餐内容</Text>
            <View style={{marginTop: 5}}>
              {currentSKU.contentList.map((skuContent, index) => {
                return (
                  <View style={[globalStyles.containerLR]} key={index}>
                    <Text style={[globalStyles.fontPrimary, {fontSize: 15, lineHeight: 24}]}>·{skuContent.name}</Text>
                    <View style={[globalStyles.containerRow]}>
                      <Text style={[globalStyles.fontPrimary, {fontSize: 15, lineHeight: 24}]}>¥{skuContent.price}</Text>
                      <View style={[globalStyles.lineVertical, {height: 6, marginHorizontal: 10}]} />
                      <Text style={[globalStyles.fontTertiary, {fontSize: 15, lineHeight: 24}]}>x{skuContent.nums}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}
        {currentPkg?.list?.length ? (
          <View style={styles.buyNoticeItem}>
            <Text style={styles.moduleSubTitle}>套餐内容</Text>
            <View style={{marginTop: 5}}>
              {currentPkg.list.map((pkgContent, index) => {
                return (
                  <View style={[globalStyles.containerLR]} key={index}>
                    <Text style={[globalStyles.fontPrimary, {fontSize: 15, lineHeight: 24}]}>·{pkgContent.skuName}</Text>
                    <View style={[globalStyles.containerRow]}>
                      <Text style={[globalStyles.fontPrimary, {fontSize: 15, lineHeight: 24}]}>¥{pkgContent.salePriceYuan}</Text>
                      <View style={[globalStyles.lineVertical, {height: 6, marginHorizontal: 10}]} />
                      <Text style={[globalStyles.fontTertiary, {fontSize: 15, lineHeight: 24}]}>x{pkgContent.quantityWithPkg}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        {spu?.spuHtml && <RichText content={spu.spuHtml} style={{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}} />}

        {!!buyNotice?.USE_RULE?.length && (
          <View style={styles.buyNoticeItem}>
            <Text style={styles.moduleSubTitle}>使用规则</Text>
            <View style={{marginTop: 5}}>{buyNotice?.USE_RULE.map(renderTips)}</View>
          </View>
        )}

        {!!buyNotice?.BOOKING?.length && (
          <View style={styles.buyNoticeItem}>
            <Text style={styles.moduleSubTitle}>预约须知</Text>
            <View style={{marginTop: 5}}>{buyNotice?.BOOKING.map(renderTips)}</View>
          </View>
        )}

        {!!buyNotice?.SALE_TIME?.length && (
          <View style={styles.buyNoticeItem}>
            <Text style={styles.moduleSubTitle}>营业时间</Text>
            <View style={{marginTop: 5}}>{buyNotice?.SALE_TIME.map(renderTips)}</View>
          </View>
        )}

        {!!buyNotice?.POLICY?.length && (
          <View style={styles.buyNoticeItem}>
            <Text style={styles.moduleSubTitle}>取消政策</Text>
            <View style={{marginTop: 5}}>{buyNotice?.POLICY.map(renderTips)}</View>
          </View>
        )}

        {!!buyNotice?.TIPS?.length && (
          <View style={styles.buyNoticeItem}>
            <Text style={styles.moduleSubTitle}>温馨提示</Text>
            <View style={{marginTop: 5}}>{buyNotice?.TIPS.map(renderTips)}</View>
          </View>
        )}
      </View>

      {/* 可用门店 */}
      <View style={[{marginTop: globalStyleVariables.MODULE_SPACE, backgroundColor: '#fff', padding: globalStyleVariables.MODULE_SPACE_BIGGER}]}>
        <View style={[globalStyles.containerLR, {height: 24}]}>
          <Text style={[styles.moduleTitle]}>可用门店{spu?.shopList?.length ? `（${spu?.shopList.length}）` : ''}</Text>
          {spu?.shopList?.length > 1 && <Icon name="all_arrowR36" size={18} color={globalStyleVariables.TEXT_COLOR_SECONDARY} />}
        </View>
        <View style={[globalStyles.lineHorizontal, {marginTop: globalStyleVariables.MODULE_SPACE_SMALLER}]} />
        {/* 所有店铺 */}
        <View style={{marginTop: globalStyleVariables.MODULE_SPACE_BIGGER}}>
          {spu?.shopList?.map((shop, index) => {
            const showNavigation = shop.latitude && shop.longitude;
            return (
              <View key={index}>
                {index !== 0 && <View style={[globalStyles.lineHorizontal, {height: StyleSheet.hairlineWidth, marginVertical: globalStyleVariables.MODULE_SPACE_BIGGER}]} />}
                <Text style={[globalStyles.fontStrong]}>{shop.shopName}</Text>
                <View style={[globalStyles.containerLR]}>
                  <View style={[{flex: 1}]}>
                    <Text style={[globalStyles.fontTertiary]}>{shop.addressDetail}</Text>
                    {shop?.distanceFromMe && (
                      <View style={[globalStyles.tagWrapper, {backgroundColor: '#49A0FF1A'}]}>
                        <Text style={[globalStyles.tag, {color: '#49A0FF'}]}>{shop.distanceFromMe}</Text>
                      </View>
                    )}
                  </View>
                  <View style={[globalStyles.containerRow, {marginLeft: globalStyleVariables.MODULE_SPACE}]}>
                    {showNavigation && (
                      <CustomTouchable
                        onPress={() =>
                          handleNavigation({
                            latitude: shop.latitude,
                            longitude: shop.longitude,
                            name: shop.shopName,
                            address: shop.addressDetail,
                          })
                        }>
                        <View style={styles.shopAction}>
                          <Icon name="shangpin_dianpu_daohang" size={16} color="#49a0ff" />
                        </View>
                      </CustomTouchable>
                    )}

                    {shop.contactPhone && (
                      <CustomTouchable onPress={() => callPhone(shop.contactPhone)}>
                        <View style={[styles.shopAction, {marginLeft: globalStyleVariables.MODULE_SPACE}]}>
                          <Icon name="shangpin_dianpu_dianhua" size={16} color="#48db94" />
                        </View>
                      </CustomTouchable>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

SPUDetailView.defaultProps = {};
export default SPUDetailView;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  // maskUp: {
  //   position: 'absolute',
  //   top: 0,
  //   width: '100%',
  //   height: 20,
  //   zIndex: 2,
  // },
  banners: {
    // height: 281,
    position: 'relative',
  },
  swiperWrapper: {
    height: 281,
    width: '100%',
  },
  moduleTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  moduleSubTitle: {
    fontSize: 18,
    lineHeight: 24,
    color: globalStyleVariables.TEXT_COLOR_SECONDARY,
    fontWeight: '500',
  },
  indicator: {
    position: 'absolute',
    left: globalStyleVariables.MODULE_SPACE,
    bottom: 15,
    backgroundColor: '#00000033',
    padding: 5,
    borderRadius: 5,
  },
  banner: {
    height: '100%',
    width: '100%',
  },
  bannerBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  priceTag: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
  },
  video: {
    backgroundColor: '#9A66DB33',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
    borderRadius: 3,
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
  skuItemDisabled: {
    backgroundColor: '#f2f2f2',
    borderColor: '#f2f2f2',
  },
  skuText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
  skuTextActive: {
    color: globalStyleVariables.COLOR_PRIMARY,
  },
  skuTextDisabled: {
    color: globalStyleVariables.TEXT_COLOR_TERTIARY,
  },
  shopAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0000000D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyNoticeItem: {
    marginTop: globalStyleVariables.MODULE_SPACE,
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
    padding: globalStyleVariables.MODULE_SPACE,
  },
});
