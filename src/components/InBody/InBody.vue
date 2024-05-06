<template>
  <div class="pagination-common">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'InBody',
  mounted() {
    const node = this.$mount().$el
    document.body.appendChild(node)
  },
  destroyed() {
    const node = this.$mount().$el
    node.remove()
  }
}
</script>
