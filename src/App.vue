<template>
  <div class="container">
    <div class="background" id="background"></div>
    <div class="main">
      <div class="title">
        <span>{{ domain }}</span>
      </div>
      <div class="input">
        <input v-model="url" />
        <span></span>
      </div>
      <div class="footer">
        <div class="footer-poweredby">
          <span>
            Powereded by NestLink
            <a :href="GITHUB_URL" target="_blank"><GithubIcon /></a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lottie from 'lottie-web';
import waveAnimData from './anim/wave.json';
import GithubIcon from './icons/github.vue';
import config from '../nestlink.config';

const GITHUB_URL = 'https://github.com/pwp-app/nestlink';

export default {
  components: {
    GithubIcon,
  },
  data() {
    return {
      url: '',
      domain: config.domain,
      // constants
      GITHUB_URL,
    };
  },
  mounted() {
    lottie.loadAnimation({
      container: document.querySelector('#background'), // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: waveAnimData,
      rendererSettings: {
        preserveAspectRatio: 'none',
      },
    });
  },
};
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
}

span {
  font-family: -apple-system, BlinkMacSystemFont, Microsoft YaHei, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

input {
  background: none;
  outline: none;
  border: none;
}

.container {
  .background {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    pointer-events: none;
  }
  .main {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 10;
    padding: 180px 48px;
    box-sizing: border-box;
    max-width: 1280px;
    margin: 0 auto;
    position: relative;
    display: flex;
    flex-direction: column;
    .title {
      font-size: 68px;
      font-weight: 600;
      color: #fafafa;
      margin-bottom: 48px;
      letter-spacing: 0.1rem;
    }
    .input {
      width: 100%;
      flex: 1;
      input {
        width: 100%;
        line-height: 68px;
        font-size: 32px;
        border-radius: 16px;
        padding: 8px 24px;
        box-sizing: border-box;
        font-family: Consolas;
        background: #fafafa;
        letter-spacing: 0.125rem;
        box-shadow: 0px 2px 32px rgba(255, 255, 255, 0.1);
      }
    }
    .footer {
      font-size: 13px;
      letter-spacing: 0.0675rem;
      color: #2f2f2f;
      justify-self: flex-end;
      user-select: none;
      &-poweredby {
        width: 100%;
        display: flex;
        align-items: center;
        span {
          line-height: 22px;
        }
        svg {
          width: 18px;
          height: 18px;
          margin-left: 10px;
          transform: translateY(3px);
          path {
            transition: 50ms ease;
          }
        }
        svg:hover {
          cursor: pointer;
          path {
            fill: #3e3e3e;
          }
        }
      }
    }
  }
}
</style>
