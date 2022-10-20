import {Dispatch} from 'redux';
import {SearchForm} from '../../fst/models';
import {PackageDetail, SKUDetail, SPUDetailF} from '../../models';
import {Actions} from './actions';

export interface SPUDispatcher {
  viewSPU(id: number): void;
  closeViewSPU(): void;
  changeCurrentSPU(spu: SPUDetailF): void;
  changeSKU(sku: PackageDetail | SKUDetail, isPackage: boolean): void;
  loadSearchSPUForWork(name: string, replace?: boolean): void;
  loadShowCaseSPU(search: SearchForm, replace?: boolean): void;
  initOtherUserShowcase(userId: number): void;
  destroyOtherUserShowcase(userId: number): void;
  loadOtherUserShowcase(userId: number, search: SearchForm, replace?: boolean): void;
}

export const getSPUDispatcher = (dispatch: Dispatch): SPUDispatcher => ({
  viewSPU: (id: number) => dispatch(Actions.viewSPU(id)),
  closeViewSPU: () => dispatch(Actions.closeViewSPU()),
  changeSKU: (sku: PackageDetail | SKUDetail, isPackage: boolean) => dispatch(Actions.setCurrentSKU(sku, isPackage)),
  changeCurrentSPU: (spu: SPUDetailF) => dispatch(Actions.setCurrentSPU(spu)),
  loadSearchSPUForWork: (name: string, replace?: boolean) => dispatch(Actions.loadSearchSPUForWork(name, replace)),
  loadShowCaseSPU: (search: SearchForm, replace?: boolean) => dispatch(Actions.loadShowCaseSPU(search, replace)),
  initOtherUserShowcase: (userId: number) => dispatch(Actions.initOtherUserShowcase(userId)),
  destroyOtherUserShowcase: (userId: number) => dispatch(Actions.destroyOtherUserShowcase(userId)),
  loadOtherUserShowcase: (userId: number, search: SearchForm, replace?: boolean) => dispatch(Actions.loadOtherUserShowcase(userId, search, replace)),
});
