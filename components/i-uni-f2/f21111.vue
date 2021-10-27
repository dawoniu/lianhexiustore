<template>
  <canvas :id="id" class="f2-canvas" :width="width" :height="height" @touchStart="touchStart" @touchMove="touchMove" @touchEnd="touchEnd" />
</template>

<script>
import F2 from '@/js_sdk/i-uni-f2/f2.min.js'
// TODO: 因为官方只对微信和支付宝做了兼容处理，如果是其他小程序，使用微信小程序方案
// #ifdef MP-WEIXIN || MP-QQ || MP-BAIDU || MP-TOUTIAO
import { wx as F2Context } from '@/js_sdk/i-uni-f2/f2-context.min.js'
// #endif
// #ifdef MP-ALIPAY
import { my as F2Context } from '@/js_sdk/i-uni-f2/f2-context.min.js'
// #endif 


let f2Id = 0

function wrapEvent(e) {
  if (!e) return
  if (!e.preventDefault) {
    e.preventDefault = function() {}
  }
  return e
}

export default {
  props: {
    init: Function
  },
  data() {
    return {
      id: '',
      width: 0,
      height: 0,
    }
  },
  created() {
    this.id = 'f2-canvas-' + ++f2Id
  },
  mounted() {
    const myCtx = uni.createCanvasContext(this.id)
    const context = F2Context(myCtx)
    const query = uni.createSelectorQuery()
    query
      .select('#' + this.id)
      .boundingClientRect()
      .exec(res => {
        // 获取画布实际宽高
        const { width, height } = res[0]
        const pixelRatio = uni.getSystemInfoSync().pixelRatio
        this.width = width * pixelRatio
        this.height = height * pixelRatio
        this.$nextTick(() => {
          const chart = this.$props.init(F2, { context, width, height, pixelRatio })
          if (chart) {
            this.chart = chart
            this.canvasEl = chart.get('el')
          }
        })
      })
  },
  methods: {
    touchStart(e) {
      const canvasEl = this.canvasEl
      if (!canvasEl) {
        return
      }
      canvasEl.dispatchEvent('touchstart', wrapEvent(e))
    },
    touchMove(e) {
      const canvasEl = this.canvasEl
      if (!canvasEl) {
        return
      }
      canvasEl.dispatchEvent('touchmove', wrapEvent(e))
    },
    touchEnd(e) {
      const canvasEl = this.canvasEl
      if (!canvasEl) {
        return
      }
      canvasEl.dispatchEvent('touchend', wrapEvent(e))
    }
  }
}
</script>

<style scoped>
.f2-canvas {
  width: 100%;
  height: 100%;
}
</style>
