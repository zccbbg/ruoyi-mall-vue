<template>
  <treeselect
    v-model="value1"
    :options="menuOptions"
    :show-count="true"
    placeholder="选择上级菜单"
  />
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {mapGetters} from "vuex";

export default {
  name: "ProdCategory",
  components: {Treeselect},
  props: ['value', 'root'],
  computed: {
    ...mapGetters(['productCategories']),
    value1: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('input', v);
      }
    },
    menuOptions() {
      if (!this.productCategories || this.productCategories.length === 0) {
        return [];
      }
      const map = {}
      this.productCategories.forEach(it => {
        let list = map[it.parentId]
        if (!list) {
          list = [];
          map[it.parentId] = list;
        }
        list.push({id: it.id, label: it.name, parentId: it.parentId});
      })
      const stack = [...map['0']];
      while (stack.length > 0) {
        const p = stack.shift();
        if (!map[p.id]) {
          continue
        }
        p.children = map[p.id];
        stack.push(...map[p.id])
      }
      if (this.root) {
        return [{id: 0, label: '根节点', children: map['0']}];
      }
      return map['0'];
    }
  },
  created() {
    this.$store.dispatch('loadProductCategories')
  }
}
</script>

<style scoped>

</style>
