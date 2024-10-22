<template>
  <footer class="footer">
    <p>© {{ currentYear }} My Word List App</p>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.footer {
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
}
</style>
