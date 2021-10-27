<template>
    <view class="container">
        <f2 :init="initChart" />
    </view>
</template>

<script>
	import f2 from '@/components/i-uni-f2/f2.vue';
	import interfaces from '../../utils/interfaces.js';
	import app from "../../App.vue";
	export default {
	        components: {
	            f2
	        },
			data() {
				return {
					user_info: '',
					type: '',
					token: ''
				}
			},
			onLoad() {
				this.user_info = app.globalData.user_info;
				if (this.user_info) {
					this.token = app.globalData.user_info.token;
					this.type= app.globalData.user_info.type;
					
				} else {
					wx.reLaunch({
						url: '/pages/index/index',
					})
				}
			},
	        methods: {
	            initChart(F2, config) {
	                // // 实例化chart
	                // const chart = new F2.Chart(config)
	                // // 这里按照F2的调用方式正常使用即可，支持所有图表，以下是DEMO
	                // const data = [
	                //     { genre: 'Sports', sold: 275 },
	                //     { genre: 'Strategy', sold: 115 },
	                //     { genre: 'Action', sold: 120 },
	                //     { genre: 'Shooter', sold: 350 },
	                //     { genre: 'Other', sold: 150 }
	                // ]
	                // chart.source(data);
	                // chart.interval()
	                //     .position('genre*sold')
	                //     .color('genre')
	                // // 渲染，然后返回chart
	                // chart.render()
	                // return chart
					
				
					
					uni.request({
						url: interfaces.chart,
						header: {
							token: app.globalData.user_info.token
						},
						data:{
							type:app.globalData.user_info.type
						},
						method: 'POST',
						success: res => {
							console.log(res);
							if (res.data.code == 200) {
								
								const map = res.data.map;
								const data = res.data.master;	
								const chart = new F2.Chart(config);
								chart.source(data, {
								  percent: {
								    formatter: function formatter(val) {
								      return val * 100 + '%';
								    }
								  }
								});
								chart.legend({
								  position: 'right',
								  itemFormatter: function itemFormatter(val) {
								    return val + '  ' + map[val];
								  }
								});
								chart.tooltip(false);
								chart.coord('polar', {
								  transposed: true,
								  radius: 0.85
								});
								chart.axis(false);
								chart.interval()
								  .position('a*percent')
								  .color('name')
								  .adjust('stack')
								  .style({
								    lineWidth: 1,
								    stroke: '#fff',
								    lineJoin: 'round',
								    lineCap: 'round'
								  })
								  .animate({
								    appear: {
								      duration: 1200,
								      easing: 'bounceOut'
								    }
								  });
								
								chart.render();
								return chart;
								
								
							} else {
								app.isLogin(res.code, res.msg);
							}
						}
					});
					
					
					
					
					
	            }
	        }
	    }
</script>
<style scoped>
    .container {
        width: 100vw;
        height: 800rpx;
    }
</style>
