<template>
	<view>	
		<view class="tab">
			<picker @change="tabChange" :range="tab.name">
				<view class="picker">
					<view>
						{{tab.name[tab_index]}}
					</view>
					<view>
						<image src="../../static/images/xiala.png" mode="widthFix"></image>
					</view> 
				</view>
			</picker>
		</view>
		<view class="order">
			<view class="box" v-for="(item,index) in list" :key="index" @tap="goDetail(item.id)">
				<view class="main">
					<view class="top">
						<view class="name">
							{{item.server_name}}
						</view>
						<view class="top_right">
							<view v-if="item.status==0">
								等待区域经理审核
							</view>
							<view v-else-if="item.status==1">
								等待指派师傅
							</view>
							<view v-else-if="item.status==2">
								等待师傅接单
							</view>
							<view v-else-if="item.status==3">
								师傅已接单
							</view>
							<view v-else-if="item.status==4">
								等待平台报价
							</view>
							<view v-else-if="item.status==5">
								等待区域经理确认报价
							</view>
							<view v-else-if="item.status==6">
								维修中
							</view>
							<view v-else-if="item.status==7">
								待确认完工
							</view>
							<view v-else-if="item.status==8">
								待付款
							</view>
							<view v-else-if="item.status==9">
								已完结
							</view>
							<view v-else-if="item.status==10">
								审核不通过
							</view>
							<view v-else-if="item.status==11">
								报价不通过
							</view>
							<view class="entry">
								<image src="../../static/images/blue_entry.png" mode="widthFix"></image>
							</view>
						</view>
					</view>
					
					<view class="time">
						<view class="icon">
							<image src="../../static/images/time.png" mode="widthFix"></image>
						</view>
						<view class="content">
							{{item.customer_time}}
						</view>
						<view class="price" v-if="item.total_price>0">
							￥{{item.total_price}}
						</view>
					</view>
					<view class="item">
						<view class="icon">
							<image src="../../static/images/order_people.png" mode="widthFix"></image>
						</view>
						<view class="content">
							{{item.linkman}} | {{item.mobile}}
						</view>
					</view>
					<view class="item">
						<view class="icon">
							<image src="../../static/images/order_position.png" mode="widthFix"></image>
						</view>
						<view class="content">
							{{item.position_address}}
						</view>
					</view>
					
					<view class="master" v-if="item.status>5 && item.status<10">
						<view class="master_top">为您服务的师傅</view>
						<view class="master_main">
							<view class="thumb"><image :src="item.thumb" mode="widthFix"></image></view>
							<view class="right">
								<view class="name">{{item.realname}}</view>
								<view class="star">
									<block v-for="count in item.star" :key="count">
									<image src="../../static/images/order_star.png" mode="widthFix"></image>
									</block>
								</view>
								<view class="skill">擅长：{{item.skill_name}}</view>
							</view>
						</view>
					</view>
				</view>
				
				
				<view class="foot" v-if="item.status==0||item.status==5">
					<view class="while" @tap.stop="noWeixiu(item.id)" v-if="item.status==0">不维修</view>
					<view class="blue" @tap.stop="weixiu(item.id,index)" v-if="item.status==0">同意维修</view>
					<view class="while" @tap.stop="noBaojia(item.id)" v-if="item.status==5">拒绝报价</view>
					<view class="blue" @tap.stop="baojia(item.id,index)" v-if="item.status==5">同意报价</view>
				</view>
				
				
			</view>
		</view>
		
	</view>
</template>

<script>
	import interfaces from '../../utils/interfaces.js';
	var common = require('../../utils/common.js');
	import app from "../../App.vue";

	export default {
		data() {
			return {
				tab:{
					name:["最新订单","待审核","待派单","已接单","已报价","维修中","待确认","待付款","已完成","已取消"],
					value:["new","0","1,2","3,4","5","6","7","8","9","10,11"]
				},
				tab_index:0,
				user_info: '',
				tip: '',
				sum: 0,
				list: [],
				page: 1,
				complete: true,
			}
		},
		onShow() {
			this.user_info = app.globalData.user_info;
			if (this.user_info) {
				this.loadData(1);
			} else {
				wx.reLaunch({
					url: '/pages/index/index',
				})
			}
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom() {
		 	if (!this.complete) {
		 		this.page++;
		 		this.loadData(this.page);
			}
		},
		methods: {
			//拨打师傅电话
			callPhone(n) {
				wx.makePhoneCall({
					phoneNumber: n
				});
			},
			//获取数据
			loadData(page) {
				var status= this.tab.value[this.tab_index];
				this.request({
					url: interfaces.orderList,
					data: {
						type:this.user_info.type,
						page: page,
						status: status
					},
					header: {
						token: this.user_info.token
					},
					method: 'POST',
					success: res => {
						console.log(res);
						if (res.code == 200) {
							
							if (page == 1) {
								this.list = [];
							}

							this.sum=res.sum;

							if (!common.isBlank(res.data)) {
					
								this.list = this.list.concat(res.data);
								this.page = page;

								if (this.list.length >= res.sum) {
									this.complete = true;
									this.tip = '数据已全部加载，暂无其他数据';
								} else {
									this.complete = false;
									this.tip = '上拉加载更多';
								}
								
							} else {
								this.complete = true;
								this.tip = '数据已全部加载，暂无其他数据';
							}
							
						} else {
							app.isLogin(res.code, res.msg);
						}
					}
				})
			},
			//切换菜单栏
			tabChange(e) {
				this.tab_index=e.detail.value;
				this.loadData(1);
			},
			
			//跳转订单详情页
			goDetail(id) {
				wx.navigateTo({
					url: 'detail?id=' + id,
				})
			},
			//区域经理同意订单维修
			weixiu(id,index) {
				var _this = this;
				wx.showModal({
					title: '提示',
					content: '确定通过审核？',
					success: function(res) {
						if (res.confirm) {
							_this.request({
								url: interfaces.examineSuccess,
								header: {
									token: _this.user_info.token
								},
								data: {
									id: id,
									type:_this.user_info.type
								},
								method: 'POST',
								success: res => {
									console.log(res);
									if (res.code == 200) {
										if(_this.tab_index==0){
											_this.list[index].status = 1;
										}else{
											_this.tab_index=2;
											_this.loadData(1);
										}
									} else {
										app.isLogin(res.code, res.msg);
									}
								}
							})
						}
					}
				})
			},
			
			//区域经理不通过订单审核,不维修
			noWeixiu(id) {
				wx.navigateTo({
					url: 'feedback?id=' + id + '&type=1',
				})
			},
			
			//区域经理同意报价，开始维修
			baojia(id,index) {
				var _this = this;
				wx.showModal({
					title: '提示',
					content: '确定开始维修？',
					success: function(res) {
						if (res.confirm) {
							_this.request({
								url: interfaces.baojiaAgree,
								data: {
									id: id,
									type: _this.user_info.type
								},
								header: {
									token: _this.user_info.token
								},
								method: 'POST',
								success: res => {
									if (res.code == 200) {
										if(_this.tab_index==0){
											_this.list[index].status = 6;
										}else{
											_this.tab_index=5;
											_this.loadData(1);
										}
									} else {
										app.isLogin(res.code, res.msg);
									}
								}
							})
						}
					}
				})
			},
			
			//区域经理不通过报价，取消订单
			noBaojia(id) {
				wx.navigateTo({
					url: 'feedback?id=' + id + '&type=2',
				})
			},
			
			//区域经理确认完工
			// finish(id) {
			// 	var _this = this;
			// 	uni.showModal({
			// 		title: '提示',
			// 		content: '确定维修完成了吗？',
			// 		success: function(res) {
			// 			if (res.confirm) {
			// 				_this.request({
			// 					url: interfaces.orderFinish,
			// 					data: {
			// 						id: id,
			// 						type: _this.type
			// 					},
			// 					header: {
			// 						token: _this.token
			// 					},
			// 					method: 'POST',
			// 					success: res => {
			// 						if (res.code == 200) {
			// 							_this.status=8;
			// 							_this.getData(1, 8);
			// 						} else {
			// 							app.isLogin(res.code, res.msg);
			// 						}
			// 					}
			// 				})
			// 			}
			// 		}
			// 	})
			// },
			
			//区域经理同意申诉
			// shensuAgree(id) {
			// 	var _this = this;
			// 	uni.showModal({
			// 		title: '提示',
			// 		content: '确定同意申诉？',
			// 		success: function(res) {
			// 			if (res.confirm) {
			// 				_this.request({
			// 					url: interfaces.shensuAgree,
			// 					data: {
			// 						id: id,
			// 						type: _this.type
			// 					},
			// 					header: {
			// 						token: _this.token
			// 					},
			// 					method: 'POST',
			// 					success: res => {
			// 						if (res.code == 200) {
			// 							_this.status=12;
			// 							_this.getData(1);
			// 						} else {
			// 							app.isLogin(res.code, res.msg);
			// 						}
			// 					}
			// 				})
			// 			}
			// 		}
			// 	})
			// },
			
			// //区域经理取消申诉，订单状态回到原处
			// shensuCancel(id) {
			// 	var _this = this;
			// 	uni.showModal({
			// 		title: '提示',
			// 		content: '确定取消申诉？',
			// 		success: function(res) {
			// 			if (res.confirm) {
			// 				_this.request({
			// 					url: interfaces.shensuCancel,
			// 					data: {
			// 						id: id,
			// 						type: _this.type
			// 					},
			// 					header: {
			// 						token: this.token
			// 					},
			// 					method: 'POST',
			// 					success: res => {
			// 						if (res.code == 200) {
			// 							_this.status="shensu";
			// 							_this.getData(1);
			// 						} else {
			// 							app.isLogin(res.code, res.msg);
			// 						}
			// 					}
			// 				})
			// 			}
			// 		}
			// 	})
			// },
			
		
		}
	}
</script>

<style lang="scss">
	.eval{
		.thumb{
			width: 60px;
			margin: 0 auto;
			image{
				width: 100%;
				border-radius: 50%;
			}
		}
		.name{
			text-align: center;
			padding-top: 5px;
		}
		.star{
			text-align: center;
			padding-top: 5px;
			image{
				width: 20px;
				padding: 0 2px;
			}
		}
		.content{
			padding-top: 10px;
			textarea{
				background-color: #F2F2F2;
				height: 60px;
				line-height: 20px;
				padding: 5px;
				width: auto;
			}
		}
	}
	.sub{
		padding-top: 50px;
		button{
			background-color: #257AFA;
			color: #fff;
			height: 40px;
			line-height: 40px;
			border-radius: 20px;
			width: 150px;
			font-size: 14px;
		}
	}
	.tab{
		background-color: #257AFA;
		line-height: 50px;
		color: #fff;
		padding-left: 15px;
		position: fixed;
		top: 0;
		width: 100%;
		.picker{
			display: flex;
			image{
				width: 18px;
				padding-left: 10px;
				padding-top: 15px;
			}
		}
	}
	.order{
		margin-bottom: 15px;
		margin-top: 65px;
		.box{
			margin: 15px 15px 0 15px;
			box-shadow:0 0 9px 3px #ccc;
			// border-top-left-radius: 10px;
			// border-top-right-radius: 10px;
			border-radius: 10px;
			.title{
				background-color: #FFF5D3;
				color: #B5A15C;
				border-top-left-radius: 10px;
				border-top-right-radius: 10px;
				font-size: 16px;
				line-height: 40px;
				padding-left: 10px;
			}
			.main{
				padding: 10px;
				.top{
					display: flex;
					justify-content: space-between;
					line-height: 20px;
					padding: 10px 0;
					margin-bottom: 10px;
					.name{
						font-size: 16px;
					}
					.top_right{
						display: flex;
						color: #257AFA;
						.entry{
							width: 6px;
							padding-left: 5px;
							image{
								width: 100%;
								padding-top: 4px;
							}
						}
					}
				}
				.time{
					display: flex;
					padding-bottom: 10px;
					.icon{
						width: 20px;
						padding-right: 10px;
						image{
							width: 100%;
						}
					}
					.content{
						color: #676767;
						width: calc(100% - 30px - 65px);
					}
					.price{
						width: 65px;
						color: #FFAE00;
						text-align: right;
					}
				}
				.item{
					display: flex;
					padding-bottom: 10px;
					.icon{
						width: 20px;
						padding-right: 10px;
						image{
							width: 100%;
						}
					}
					.content{
						color: #676767;
					}
				}
				.wait{
					background-color: #257AFA;
					color: #fff;
					position: relative;
					padding: 5px 8px;
					line-height: 25px;
					.wait_top{
						font-size: 12px;
					}
					.wait_time{
						font-size: 18px;
					}
					.wait_tip{
						font-size: 12px;
					}
					.banshou{
						width: 40px;
						position: absolute;
						top: 23px;
						right: 13px;
						image{
							width: 100%;
						}
					}
				}
				.master{
					color: #fff;
					background-color: #257AFA;
					padding: 5px 8px;
					line-height: 20px;
					.master_top{
						padding: 3px 0 8px 0;
					}
					.master_main{
						display: flex;
					}
					.thumb{
						width: 60px;
						padding-right: 8px;
						image{
							width: 100%;
							border-radius: 50%;
						}
					}
					.name{
						font-size: 14px;
					}
					.star image{
						width: 12px;
					}
					.skill{
						font-size: 12px;
					}
				}
				.baojia{
					padding-top: 10px;
					.baojia_top{
						color: #257AFA;
						font-size: 10px;
						padding-bottom: 10px;
					}
					.baojia_main{
						display: flex;
						border-bottom: 1px #ccc solid;
						margin-bottom: 10px;
						.thumb{
							width: 60px;
							padding-right: 8px;
							image{
								width: 100%;
								border-radius: 50%;
							}
						}
						.info{
							width: calc(100% - 118px);
							.name{
								font-size: 14px;
							}
							.star image{
								width: 12px;
							}
							.skill{
								font-size: 12px;
								word-break: break-all;
								display: -webkit-box;
								overflow: hidden;
								text-overflow: ellipsis;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 1;
							}
						}
					}
					.baojia_right{
						width: 50px;
						text-align: center;
						.price{
							color: #FFB420;
							padding-bottom: 5px;
						}
						.but{
							button{
								background-color: #257AFA;
								font-size: 12px;
								padding: 0;
								width: 50px;
								color: #fff;
							}
						}
					}
				}
			}
			.foot{
				height: 50px;
				view{
					float: right;
					height: 30px;
					border-radius: 15px;
					line-height: 30px;
					width: 20%;
					text-align: center;
					margin-right: 8px;
				}
				.while{
					border: 1px #257AFA solid;
					color: #257AFA;
					background-color: #fff;
				}
				.blue{
					border: 1px #257AFA solid;
					background-color: #257AFA;
					color: #fff;
				}
			}
		}
	}
</style>