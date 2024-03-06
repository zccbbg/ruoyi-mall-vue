<template>
  <el-cascader
    ref="cascaderMallCatergory"
    @change="handleMallCatergoryChange"
    v-model="value1"
    :options="menuOptions"
    v-bind="$props"
    clearable
    placeholder="选择类目"
  />
</template>

<script>
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {mapGetters} from "vuex";

export default {
  name: "ProductCategorySelect",
  props: ['value','props'],
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
      this.recurs(this.productCategories)
      return this.productCategories
    }
  },
  methods: {
    handleMallCatergoryChange (e) {
      if (e.length > 0) {
        let arr = this.$refs['cascaderMallCatergory'].getCheckedNodes()[0].pathLabels
        this.$emit('change', arr);
      } else {
        this.$emit('change', '');
      }
    },
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
