<template>
  <el-select v-model="value1" placeholder="选择品牌" ref="brandSelect" @change="handleBrandChange" clearable>
    <el-option v-for="it in options" :key="it.id" :value="it.id" :label="it.name">{{it.name}}</el-option>
  </el-select>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "BrandSelect",
  props: ['value'],
  computed: {
    ...mapGetters(['brandList']),
    value1: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v);
      }
    },
    options() {
      return this.brandList
    }
  },
  methods:{
    handleBrandChange (id) {
      if (id) {
        let brand=this.brandList.find(item=>{
          return item.id==id
        })
        this.$emit('change', brand.name);
      } else {
        this.$emit('change', null);
      }
    },
  },
  created() {
    this.$store.dispatch('mall/loadBrandList')
  }
}
</script>

<style scoped>

</style>
