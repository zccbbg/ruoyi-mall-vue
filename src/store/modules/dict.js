import {allByTypes} from "@/api/system/dict/data";
import {dict_types} from "@/config/business";
import {listPmsProductCategory} from "@/api/pms/productCategory";
import {allBrand} from "@/api/pms/brand";

const dict = {
  state: {
    dictMap: {},
    productCategories: [],
    brandList: []
  },

  mutations: {
    SET_DICT_MAP: (state, map) => {
      state.dictMap = map
    },
    SET_PRODUCT_CATEGORIES: (state, value) => {
      state.productCategories = value
    },
    SET_BRAND_LIST: (state, value) => {
      state.brandList = value
    },
  },
  actions: {
    loadDictionaries({ commit, state }, force = false) {
      if (!force && Object.keys(state.dictMap).length > 0) {
        return Promise.resolve();
      }
      return allByTypes(dict_types).then(res => {
        const rows = res.data
        rows.sort((a, b) => a.dictSort - b.dictSort);
        const map = {}
        rows.forEach(it => {
          let list = map[it.dictType];
          if (!list) {
            list = [];
            map[it.dictType] = list;
          }
          list.push({...it, label: it.dictLabel, value: it.dictValue.match(/^\d+$/) ? +it.dictValue : it.dictValue })
        })
        commit('SET_DICT_MAP', map)
      })
    },
    loadProductCategories({ commit, state }, force = false) {
      if (!force && state.productCategories.length > 0) {
        return Promise.resolve();
      }
      return listPmsProductCategory({}).then(res => {
        commit('SET_PRODUCT_CATEGORIES', res);
      })
    },
    loadBrandList({ commit, state }, force = false) {
      if (!force && state.brandList.length > 0) {
        return Promise.resolve();
      }
      return allBrand({}).then(res => {
        commit('SET_BRAND_LIST', res);
      })
    },
  }
}

export default dict
