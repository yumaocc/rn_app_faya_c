import {DeepNavigationParam} from '../../models/common';

export function getSPUNavigateParam(spuId: number): DeepNavigationParam {
  return {
    name: 'SPUDetail',
    params: {id: spuId},
    key: 'SPUDetail-' + spuId,
  };
}
