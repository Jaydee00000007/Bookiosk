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

.glass-card {
  /* 1. Semi-transparent background */
  background: rgba(255, 255, 255, 0.2);
  
  /* 2. Background blur & saturation boost */
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%); /* Safari support */
  
  /* 3. Subtle edge highlight & shadow */
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.bounce-right {
  animation: bounceInRight 0.85s ease-out 0s 1 normal both;
  transform-origin: center;
}

@keyframes bounceInRight {
  0% { opacity: 0; transform: translate3d(132px, 0, 0); }
  60% { opacity: 1; transform: translate3d(-15.4px, 0, 0); }
  75% { transform: translate3d(7.7px, 0, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .bounce-right {
    animation: none !important;
    transition: none !important;
  }
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
