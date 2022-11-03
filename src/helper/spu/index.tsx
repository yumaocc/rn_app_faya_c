import {DeepNavigationParam} from '../../models/common';

export function getSPUNavigateParam(spuId: number, workMainId?: string): DeepNavigationParam {
  return {
    name: 'SPUDetail',
    params: {id: spuId, workMainId: workMainId ?? ''},
    key: 'SPUDetail-' + spuId,
  };
}
