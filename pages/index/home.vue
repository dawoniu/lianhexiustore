<template>
	<view>
		<view class="main">
			<view class="info">
				<view class="img">
					<image :src="thumb" mode="widthFix"></image>
				</view>
				<view class="right">
					<view class="name">{{name}}</view>
					<view class="number">管理门店：{{u_count}}</view>
				</view>
			</view>
			<view class="income">
				<view class="item">
					<view class="num one">
						{{data.month_finish_count}}单
					</view>
					<view class="title">
						本月完成
					</view>
				</view>
				<view class="item">
					<view class="num two">
						{{data.month_order_count}}单
					</view>
					<view class="title">
						本月报修
					</view>
				</view>
				<view class="item">
					<view class="num three">
						{{data.month_work_count}}单
					</view>
					<view class="title">
						维修中
					</view>
				</view>
			</view>
			
			<view class="country">
				<view class="item">
					<view class="num">
						{{data.zwc_count}}单
					</view>
					<view class="title">
						总完成单数
					</view>
				</view>
				<view class="item">
					<view class="num">
						{{data.dsh_count}}单
					</view>
					<view class="title">
						待审核单数
					</view>
				</view>
			</view>
			
			<view class="order">
				<view class="tab">
					<view :class="[tab==1 ? 'item checked' : 'item']" @tap="changeTab(1)">周</view>
					<view :class="[tab==2 ? 'item checked' : 'item']" @tap="changeTab(2)">月</view>
					<view :class="[tab==3 ? 'item checked' : 'item']" @tap="changeTab(3)">年</view>
				</view>
				<view class="box" v-if="tab==1">
					<view class="item" v-for="(item,index) in data.week_categ" :key="index">
						<view class="title">
							{{item.name}}
						</view>
						<view class="speed">
							<progress :percent="item.percent" stroke-width="5" />
						</view>
						<view class="num">
							{{item.count}}单
						</view>
					</view>
				</view>
				<view class="box" v-if="tab==2">
					<view class="item" v-for="(item,index) in data.month_categ" :key="index">
						<view class="title">
							{{item.name}}
						</view>
						<view class="speed">
							<progress :percent="item.percent" stroke-width="5" />
						</view>
						<view class="num">
							{{item.count}}单
						</view>
					</view>
				</view>
				<view class="box" v-if="tab==3">
					<view class="item" v-for="(item,index) in data.year_categ" :key="index">
						<view class="title">
							{{item.name}}
						</view>
						<view class="speed">
							<progress :percent="item.percent" stroke-width="5" />
						</view>
						<view class="num">
							{{item.count}}单
						</view>
					</view>
				</view>	
			</view>
			
			<view class="country">
				<view class="item">
					<view class="num">
						{{data.total_dfk_money}}元
					</view>
					<view class="title">
						总待付款金额
					</view>
				</view>
				<view class="item">
					<view class="num">
						{{data.total_fk_money}}元
					</view>
					<view class="title">
						总付款金额
					</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import interfaces from '../../utils/interfaces.js';
	import app from "../../App.vue";
	export default {
		data() {
			return {
				data: [],
				name: '',
				u_count: 0,
				thumb: '/static/images/default_thumb.png',
				token: '',
				type: '',
				tab:1
			}
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			if (app.globalData.user_info) {
				this.name = app.globalData.user_info.name;
				this.u_count = app.globalData.user_info.u_count;
				//this.thumb = app.globalData.user_info.thumb;
				this.token = app.globalData.user_info.token;
				this.type = app.globalData.user_info.type;
				this.initData();
			} else {
				wx.switchTab({
					url: '/pages/index/index',
				})
			}
		},
		methods: {
			initData() {
				this.request({
					url: interfaces.orderCensus,
					header: {
						token: this.token
					},
					data: {
						type: this.type
					},
					method: 'POST',
					success: res => {
						console.log(res);
						if (res.code == 200) {
							this.data = res.data;
						} else {
							app.isLogin(res.code, res.msg);
						}
					}
				});
			},
			changeTab(tab){
				this.tab=tab;
			},
			//跳转绑定微信界面，用来发送微信消息
			bind() {
				wx.navigateTo({
					url: '/pages/auth/index',
				})
			},
		}
	}
</script>

<style lang="scss">
	.main{
		background-image: linear-gradient(#DFECFF, #F6F6F6);
		padding: 0 15px 20px 15px;
		.info{
			display: flex;
			padding-top: 10px;
			image{
				width: 60px;
				border-radius: 50%;
			}
			.right{
				margin-left: 10px;
				padding: 5px 0;
				line-height: 25px;
				.name{
					font-size: 16px;
				}
				.number{
					color: #676767;
				}
			}
		}
		.income{
			display: flex;
			justify-content: space-between;
			margin-top: 10px;
			.item{
				padding: 10px 0 10px 10px;
				width: calc(100% / 3 - 15px);
				background-color: #fff;
				//border: 1px #B1D0FF solid;
				border-radius: 10px;
				.one{
					color: #43A9FF;
				}
				.two{
					color: #FEA700;
				}
				.three{
					color: #FF5050;
				}
			}
		}
		
		.country{
			display: flex;
			justify-content: space-between;
			margin-top: 10px;
			.item{
				padding: 10px 0 10px 10px;
				width: calc(50% - 15px);
				background-color: #fff;
				color: #00677D;
				border-radius: 10px;
			}
			.title{
				color: #646464;
			}
		}
		
		.order{
			border-radius: 10px;
			background-color: #fff;
			padding: 10px 0;
			margin-top: 15px;
			.tab{
				width: 200px;
				display: flex;
				justify-content: space-between;
				margin: 5px auto;
				.item{
					width: 60px;
					border: 1px #919191 solid;
					color: #6A6A6A;
					height: 20px;
					line-height: 20px;
					border-radius: 10px;
					text-align: center;
				}
				.checked{
					background-color: #4688FF;
					color: #fff;
					border:1px #4688FF solid;
				}
			}
			.box{
				.item{
					color: #6A6A6A;
					margin: 10px 10px;
					line-height: 25px;
					font-size: 12px;
					display: flex;
					.title{
						width: 120px;
					}
					.speed{
						width: calc(100% - 160px);
						padding-top: 10px;
					}
					.num{
						width: 60px;
						text-align: right;
					}
				}
			}
		}
	}
</style>