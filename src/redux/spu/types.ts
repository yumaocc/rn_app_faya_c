export enum ActionType {
  RESET = 'SPU/RESET',
  VIEW_SPU = 'SPU/VIEW_SPU',
  CLOSE_VIEW_SPU = 'SPU/CLOSE_VIEW_SPU',
  SET_CURRENT_SPU = 'SPU/SET_CURRENT_SPU',
  SET_CURRENT_SKU = 'SPU/SET_CURRENT_SKU',
  LOAD_SEARCH_SPU_FOR_WORK = 'SPU/LOAD_SPU_FOR_WORK', // 发布作品时的spu列表
  LOAD_SEARCH_SPU_FOR_WORK_SUCCESS = 'SPU/LOAD_SPU_FOR_WORK_SUCCESS',
  LOAD_SEARCH_SPU_FOR_WORK_FAIL = 'SPU/LOAD_SPU_FOR_WORK_FAIL',
  LOAD_SHOW_CASE_SPU = 'SPU/LOAD_SHOW_CASE_SPU', // 橱窗spu列表
  LOAD_SHOW_CASE_SPU_SUCCESS = 'SPU/LOAD_SHOW_CASE_SPU_SUCCESS',
  LOAD_SHOW_CASE_SPU_FAIL = 'SPU/LOAD_SHOW_CASE_SPU_FAIL',
}
