import {Dispatch} from 'redux';
import {PackageDetail, SKUDetail, SPUDetailF} from '../../models';
import {Actions} from './actions';

export interface SPUDispatcher {
  viewSPU(id: number): void;
  closeViewSPU(): void;
  changeCurrentSPU(spu: SPUDetailF): void;
  changeSKU(sku: PackageDetail | SKUDetail, isPackage: boolean): void;
  loadSearchSPUForWork(name: string, replace?: boolean): void;
  loadShowCaseSPU(replace?: boolean): void;
}

export const getSPUDispatcher = (dispatch: Dispatch): SPUDispatcher => ({
  viewSPU: (id: number) => dispatch(Actions.viewSPU(id)),
  closeViewSPU: () => dispatch(Actions.closeViewSPU()),
  changeSKU: (sku: PackageDetail | SKUDetail, isPackage: boolean) => dispatch(Actions.setCurrentSKU(sku, isPackage)),
  changeCurrentSPU: (spu: SPUDetailF) => dispatch(Actions.setCurrentSPU(spu)),
  loadSearchSPUForWork: (name: string, replace?: boolean) => dispatch(Actions.loadSearchSPUForWork(name, replace)),
  loadShowCaseSPU: (replace?: boolean) => dispatch(Actions.loadShowCaseSPU(replace)),
});
