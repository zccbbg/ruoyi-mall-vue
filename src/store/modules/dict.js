import {allByTypes} from "@/api/system/dict/data";
import {dict_types} from "@/config/business";


const dict = {
  state: {
    dictMap: {},
  },

  mutations: {
    SET_DICT_MAP: (state, map) => {
      state.dictMap = map
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
  }
}

export default dict
