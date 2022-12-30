<template>
  <el-radio-group
    v-model="radioValue"
    @change="change"
    v-bind="$props"
  >
    <el-radio-button
      v-for="dict in dictList"
      :key="dict.value"
      :label="dict.value"
      >{{ dict.label }}</el-radio-button
    >
  </el-radio-group>
</template>

<script>
export default {
  props: ['radioData','size', 'value','showAll'],
  data() {
    return {
      // value:this.value
    }
  },
  computed: {
    radioValue: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('input', v);
      }
    },
    dictList(){
      let list = [...this.radioData];
      if(this.showAll === "all"){ 
        list.splice(0, 0, {label:"全部"})
      }
      return list
    }
  },
  methods: {
    change(val) {
      this.$emit('change', val)
    },
  }
}
</script>
