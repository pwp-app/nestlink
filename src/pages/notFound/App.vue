<template>
  <div class="container">
    <div class="main">
      <div class="text">
        <span>404 not found.</span>
      </div>
      <div class="footer">
        <span>Powered by NestLink. {{ siteName }}.</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import config from '../../../nestlink.config';

export default defineComponent({
  data() {
    return {
      siteName: config.domain,
    };
  },
});
</script>

<style lang="less">
html,
body,
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  background-color: #1e1e1e;
}

span {
  font-family: Consolas, -apple-system, BlinkMacSystemFont, Microsoft YaHei, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .main {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 10;
    padding: 248px 128px;
    box-sizing: border-box;
    max-width: 1600px;
    margin: 0 auto;
    position: relative;
    display: flex;
    flex-direction: column;
    .text {
      font-size: 58px;
      font-weight: 600;
      color: #fafafa;
      margin-bottom: 48px;
      letter-spacing: 0.1rem;
      user-select: none;
      flex: 1;
    }
    .footer {
      font-size: 13px;
      letter-spacing: 0.0675rem;
      color: #2f2f2f;
      justify-self: flex-end;
      user-select: none;
    }
  }
}
</style>
