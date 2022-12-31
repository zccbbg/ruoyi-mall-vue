import {listPmsProductCategory} from "@/api/pms/productCategory";
import {allBrand} from "@/api/pms/brand";

const state = {
  productCategories: [],
  brandList: []
}
const mutations = {
  SET_PRODUCT_CATEGORIES: (state, value) => {
      state.productCategories = value
    },
  SET_BRAND_LIST: (state, value) => {
    state.brandList = value
  },
}
const actions = {
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
export default {
  namespaced: true,
  state,
  mutations,
  actions
}