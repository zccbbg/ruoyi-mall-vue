<template>
  <el-select v-model="value1" clearable>
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item[valueProp1]"
    >
    </el-option>
  </el-select>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  props: ["size", "value", "propName", 'valueProp'],
  computed: {
    ...mapGetters(['dictMap']),
    valueProp1() {
      return this.valueProp || 'value';
    },
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
