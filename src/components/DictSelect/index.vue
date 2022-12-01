<template>
  <el-select v-model="value1" clearable>
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  props: ["size", "value", "propName"],
  computed: {
    ...mapGetters(['dictMap']),
    value1: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit("input", v);
      },
    },
    options() {
      if (!this.propName) {
        return [];
      }
      return this.dictMap[this.propName] || []
    }
  },
};
</script>
