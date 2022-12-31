<template>
  <el-cascader
    v-model="value1"
    :options="menuOptions"
    :props="{ checkStrictly: true }"
    placeholder="选择上级类目"
  />
</template>

<script>
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {mapGetters} from "vuex";

export default {
  name: "ProductCategorySelect",
  props: ['value'],
  computed: {
    ...mapGetters(['productCategories']),
    value1: {
      get() {
        console.log(this.value)
        return this.value;
      },
      set(v) {
        console.log(v)
        this.$emit('input', v);
      }
    },
    menuOptions() {
      if (!this.productCategories || this.productCategories.length === 0) {
        return [];
      }
      this.recurs(this.productCategories)
      return this.productCategories
    }
  },
  methods: {
    recurs(list){
      list.forEach(it => {
        it.label = it.name
        it.value = it.id
        if(it.children){
          this.recurs(it.children)
        }
      })
    }
  },
  created() {
    this.$store.dispatch('mall/loadProductCategories')
  }
}
</script>

<style scoped>

</style>
