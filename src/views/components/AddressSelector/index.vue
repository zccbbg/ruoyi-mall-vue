<template>
  <div class="w200">
    <el-cascader
      :props="{ checkStrictly: true }"
      ref="AddressSelector"
      v-model="tempValue"
      :options="menuOptions"
      v-bind="$props"
      clearable
      placeholder="请选择..."
      :size="size"
    />
  </div>
</template>

<script>

import {mapGetters} from "vuex";

export default {
  name: 'AddressSelector',
  // register the component
  props: ['value', 'props', 'size'],
  computed: {
    ...mapGetters(['areaSelect']),
    tempValue: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('input', v);
      }
    },
    menuOptions() {
      if (!this.areaSelect || this.areaSelect.length === 0) {
        return [];
      }
      this.recurs(this.areaSelect)
      return this.areaSelect
    }
  },
  created() {
    this.$store.dispatch('mall/loadAreaSelect')

  },
  methods: {
    recurs(list) {
      list.forEach(it => {
        it.label = it.name
        it.value = it.name
        if (it.children) {
          this.recurs(it.children)
        }
      })
    }
  }
}
</script>
<style>


</style>
