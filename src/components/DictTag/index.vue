<template>
  <el-tag :type="valueType">{{valueLabel}}</el-tag>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  props: ["value", "propName", 'options'],
  computed: {
    ...mapGetters(['dictMap']),
    options1() {
      if (this.options) {
        return this.options;
      }
      if (!this.propName) {
        return [];
      }
      return this.dictMap[this.propName] || []
    },
    valueLabel() {
      return this.options1.find(it => it.value === this.value || it.value == this.value)?.label;
    },
    valueType() {
      return this.options1.find(it => it.value === this.value || it.value == this.value)?.listClass;
    }
  },
};
</script>
