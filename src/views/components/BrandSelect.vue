<template>
  <el-select v-model="value1" placeholder="选择品牌">
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
  created() {
    this.$store.dispatch('mall/loadBrandList')
  }
}
</script>

<style scoped>

</style>
