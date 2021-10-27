<template>
  <canvas type="2d" :id="id" class="f2-canvas" :width="width" :height="height" @touchStart="touchStart" @touchMove="touchMove" @touchEnd="touchEnd" />
</template>

<script>
/* 做好事不留名
 * bug修复
 * 2020/08/27
 *  */	
	
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
      id: ''
    }
  },
  created() {
    this.id = 'f2-canvas-' + ++f2Id
  },
  mounted() {
    // const myCtx = uni.createCanvasContext(this.id);
    // const context = F2Context(myCtx)
    const query = uni.createSelectorQuery().in(this);
    query
      .select('#' + this.id)
      .fields({
              node: true,
              size: true
      })
      .exec(res => {
        // 获取画布实际宽高
        const {node, width, height } = res[0]
		const context = node.getContext('2d');
        const pixelRatio = uni.getSystemInfoSync().pixelRatio
        node.width = width * pixelRatio;
        node.height = height * pixelRatio;
        this.$nextTick(() => {
			console.log(4);
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
