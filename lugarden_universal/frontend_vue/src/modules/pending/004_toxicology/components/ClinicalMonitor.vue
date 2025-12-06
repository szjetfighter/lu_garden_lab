<template>
  <div class="clinical-monitor" @click="emit('dismiss')">
    <!-- 闪烁的警告框 -->
    <div class="warning-box">
      <div class="warning-icon">☣️</div>
      <h2 class="warning-title">CLINICAL TRIAL FAILED</h2>
      <p class="warning-text">临床试验失败</p>
      
      <!-- 副作用说明书 -->
      <div class="side-effects">
        <h3>副作用 / Side Effects:</h3>
        <ul>
          <li>恶心 Nausea</li>
          <li>眩晕 Vertigo</li>
          <li>语言中枢失调 Dysphasia</li>
          <li>认知崩溃 Cognitive Collapse</li>
          <li>诗意过敏 Poetic Anaphylaxis</li>
        </ul>
      </div>

      <!-- 心电图拉平 -->
      <div class="flatline">
        <div class="flatline-trace"></div>
      </div>
      
      <p class="dismiss-hint">点击任意处关闭 / Click anywhere to dismiss</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'dismiss'): void
}>()
</script>

<style scoped>
.clinical-monitor {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(139, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  cursor: pointer;
  animation: flash 0.5s ease-in-out infinite alternate;
}

@keyframes flash {
  from { background: rgba(139, 0, 0, 0.9); }
  to { background: rgba(100, 0, 0, 0.95); }
}

.warning-box {
  background: #0a0a0a;
  border: 3px solid #ff0000;
  padding: 3rem;
  max-width: 500px;
  text-align: center;
  box-shadow: 
    0 0 50px rgba(255, 0, 0, 0.5),
    inset 0 0 30px rgba(255, 0, 0, 0.1);
}

.warning-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.warning-title {
  font-family: 'Courier New', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ff0000;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin: 0 0 0.5rem;
  text-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
}

.warning-text {
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  color: #ff6666;
  margin: 0 0 2rem;
}

.side-effects {
  text-align: left;
  background: rgba(255, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 2rem;
}

.side-effects h3 {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #ff0000;
  margin: 0 0 0.5rem;
}

.side-effects ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.side-effects li {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #ff6666;
  padding: 0.25rem 0;
  border-bottom: 1px dashed rgba(255, 0, 0, 0.3);
}

.side-effects li:last-child {
  border-bottom: none;
}

.flatline {
  height: 60px;
  background: #0a0a0a;
  border: 1px solid #333;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
}

.flatline-trace {
  position: absolute;
  top: 50%;
  left: 0;
  width: 200%;
  height: 2px;
  background: #00ff00;
  animation: flatline-scroll 2s linear infinite;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
}

@keyframes flatline-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.dismiss-hint {
  font-family: 'Courier New', monospace;
  font-size: 0.625rem;
  color: #666;
  margin: 0;
}
</style>
