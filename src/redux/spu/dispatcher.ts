import {Dispatch} from 'redux';
import {PackageDetail, SKUDetail} from '../../models';
import {Actions} from './actions';

export interface SPUDispatcher {
  viewSPU(id: number): void;
  closeViewSPU(): void;
  changeSKU(sku: PackageDetail | SKUDetail, isPackage: boolean): void;
}

export const getSPUDispatcher = (dispatch: Dispatch): SPUDispatcher => ({
  viewSPU: (id: number) => dispatch(Actions.viewSPU(id)),
  closeViewSPU: () => dispatch(Actions.closeViewSPU()),
  changeSKU: (sku: PackageDetail | SKUDetail, isPackage: boolean) => dispatch(Actions.setCurrentSKU(sku, isPackage)),
});
