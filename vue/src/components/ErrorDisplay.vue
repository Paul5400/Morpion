<script>
export default {
  name: 'ErrorDisplay',
  props: {
    errors: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<template>
  <div v-if="errors.length" class="errors">
    <ul>
      <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
    </ul>
  </div>
</template>

<style scoped>
.errors {
  color: red;
  border: 1px solid red;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
