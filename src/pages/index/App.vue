<template>
  <div class="container">
    <div class="background" id="background"></div>
    <div class="main">
      <div class="title">
        <span
          >{{ domain
          }}<span
            :class="{
              link: true,
              'link--error': registerError,
            }"
            v-if="displayLink"
            ><span class="split">/</span>{{ displayLink }}</span
          >
        </span>
      </div>
      <div
        :class="{
          input: true,
          'input--invalid': isInvalid,
        }"
      >
        <input v-model="url" @keydown="handleUrlChange" />
        <div class="input-bg"></div>
        <div
          class="progress"
          :style="{
            width: `${progress}%`,
          }"
        ></div>
        <div class="copy-tip" v-if="showCopyTip">
          <div class="copy-tip__text">链接已复制至剪贴板</div>
        </div>
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

<script lang="ts">
import axios, { AxiosResponse } from 'axios';
import lottie from 'lottie-web';
import * as clipboard from 'clipboard-polyfill';
import waveAnimData from '../../anim/wave.json';
import GithubIcon from '../../icons/github.vue';
import config from '../../../nestlink.config';
import { defineComponent } from '@vue/runtime-core';

const GITHUB_URL = 'https://github.com/pwp-app/nestlink';
const URL_TESTER =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/;

interface IndexData {
  url: string;
  shortId: string;
  domain: string;
  displayLink: string;
  isInvalid: boolean;
  registerError: boolean;
  urlChangeTimeout: number | null;
  showCopyTip: boolean;
  showCopyTipTimeout: number | null;
  progress: number;
  // consts
  GITHUB_URL: string;
}

interface APIResponse {
  success: boolean;
  data: string;
}

const sleep = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

export default defineComponent({
  components: {
    GithubIcon,
  },
  data(): IndexData {
    return {
      url: '',
      shortId: '',
      displayLink: '',
      domain: config.domain,
      isInvalid: false,
      urlChangeTimeout: null,
      registerError: false,
      showCopyTip: false,
      progress: 0,
      showCopyTipTimeout: null,
      // constants
      GITHUB_URL,
    };
  },
  mounted() {
    this.loadAnimation();
  },
  watch: {
    registerError(newValue) {
      if (newValue) {
        this.modifyDisplayLink('ERROR');
      }
    },
    shortId(newValue) {
      if (newValue) {
        this.modifyDisplayLink(newValue);
      }
    },
  },
  methods: {
    loadAnimation() {
      // the dom element that will contain the animation
      const el = document.querySelector('#background');
      if (!el) {
        setTimeout(() => {
          this.loadAnimation();
        }, 100);
        return;
      }
      lottie.loadAnimation({
        container: el,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: waveAnimData,
        rendererSettings: {
          preserveAspectRatio: 'none',
        },
      });
    },
    handleUrlChange(e: Event) {
      if (this.urlChangeTimeout) {
        clearTimeout(this.urlChangeTimeout);
      }
      const target = e.target as HTMLInputElement;
      this.urlChangeTimeout = window.setTimeout(() => {
        this.registerUrl(target.value || '');
      }, 750);
      this.showCopyTip = false;
      if (this.showCopyTipTimeout) {
        clearTimeout(this.showCopyTipTimeout);
      }
    },
    async deleteDisplayLink() {
      while (this.displayLink.length) {
        const str = this.displayLink.substr(0, this.displayLink.length - 1);
        this.displayLink = str;
        // eslint-disable-next-line no-await-in-loop
        await sleep(15);
      }
    },
    async showDisplayLink(url: string) {
      const chars = url.split('');
      while (chars.length) {
        const char = chars.shift();
        this.displayLink += char;
        // eslint-disable-next-line no-await-in-loop
        await sleep(15);
      }
    },
    async modifyDisplayLink(url: string) {
      if (this.displayLink) {
        await this.deleteDisplayLink();
      }
      await sleep(100);
      await this.showDisplayLink(url);
    },
    async modifyProgress(progress: number) {
      this.progress = progress;
      if (progress === 100) {
        setTimeout(() => {
          this.progress = 0;
        }, 1000);
      }
    },
    async registerUrl(url: string) {
      if (!url) {
        this.isInvalid = false;
        return;
      }
      if (!URL_TESTER.test(url)) {
        this.isInvalid = true;
        return;
      } else {
        this.isInvalid = false;
      }
      // send register request
      this.registerError = false;
      let res: AxiosResponse | undefined;
      try {
        res = await axios.post('/register', {
          url,
        });
        this.modifyProgress(100);
      } catch (err) {
        this.registerError = true;
        this.modifyProgress(100);
        return;
      }
      if (!res) {
        this.registerError = true;
        return;
      }
      const resData: APIResponse = res.data;
      this.shortId = resData.data;
      await clipboard.writeText(`${window.location.protocol}/${this.domain}/${this.shortId}`);
      this.showCopyTipTimeout = window.setTimeout(() => {
        this.showCopyTip = true;
      }, 100);
    },
  },
});
</script>

<style lang="less">
html,
body,
#app {
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  background-color: #1e1e1e;
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
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
  .background {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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
    box-sizing: border-box;
    .title {
      font-size: 68px;
      font-weight: 600;
      color: #fafafa;
      margin-bottom: 48px;
      letter-spacing: 0.1rem;
      .link {
        .split {
          margin: 0 0.75rem;
        }
      }
      .link--error {
        color: #f56c6c;
      }
    }
    .input {
      width: 100%;
      flex: 1;
      position: relative;
      input {
        width: 100%;
        line-height: 68px;
        font-size: 32px;
        border-radius: 16px;
        padding: 8px 24px;
        box-sizing: border-box;
        font-family: Consolas;
        color: #2e2e2e;
        background: transparent;
        letter-spacing: 0.125rem;
        box-shadow: 0px 2px 32px rgba(255, 255, 255, 0.125);
        z-index: 10;
      }
      input::selection {
        color: #fafafa;
        background: #2e2e2e;
        border-radius: 4px;
      }
      &-bg {
        background: #fafafa;
        position: absolute;
        width: 100%;
        height: 84px;
        border-radius: 16px;
        top: 0;
        left: 0;
        z-index: -5;
        pointer-events: none;
      }
      .progress {
        background: #eaeaea;
        position: absolute;
        width: 0;
        height: 84px;
        left: 0;
        top: 0;
        position: absolute;
        border-radius: 16px;
        z-index: -1;
        pointer-events: none;
        transition: width 100ms ease;
      }
      .copy-tip {
        margin-top: 32px;
        color: #3e3e3e;
        letter-spacing: 0.05rem;
        font-size: 15px;
      }
    }
    .input--invalid {
      input {
        color: #f56c6c;
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
            fill: #2f2f2f;
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

@media screen and (max-width: 767px) {
  .container {
    .background {
      width: 300vw;
      transform: translateX(-175vw);
    }
    .main {
      padding: 108px 28px;
      .title {
        font-size: 30px;
        margin-bottom: 32px;
        .link {
          .split {
            margin: 0 0.5rem;
          }
        }
      }
      .input {
        input {
          font-size: 17px;
          line-height: 40px;
          padding: 8px 18px;
          box-shadow: 0px 2px 24px rgba(255, 255, 255, 0.125);
          letter-spacing: 0.05rem;
        }
        &-bg {
          height: 56px;
        }
        .progress {
          height: 56px;
        }
      }
    }
  }
}

@media screen and (max-width: 320) {
  .container {
    .main {
      padding: 92px 24px;
    }
  }
}
</style>
