<template>
  <el-tag :type="valueType">{{valueLabel}}</el-tag>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  props: ["value", "propName"],
  computed: {
    ...mapGetters(['dictMap']),
    options() {
      if (!this.propName) {
        return [];
      }
      return this.dictMap[this.propName] || []
    },
    valueLabel() {
      return this.options.find(it => it.value == this.value)?.label;
    },
    valueType() {
      return this.options.find(it => it.value == this.value)?.listClass;
    }
  },
};
</script>
