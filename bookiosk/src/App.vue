<template>
  <div class="app-layout">
    <RouterView />
  </div>
</template>

<style>
html, body, #app {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  min-height: 100vh;
}
</style>


<style scoped>
.app-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
