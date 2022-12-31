<template lang="pug">
el-select(v-model="value1")
  el-option(v-for="it in options" :key="it.id" :value="it.id" :label="it.name") {{it.name}}
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
