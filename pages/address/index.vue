<template>
	<view>
		<!--地址管理-->
		<view class="box">
			<view class="item" v-for='(item,index) in data' :key="index">
				<view class="item_l">
					<view>{{item.positionAddress}} {{item.address}}</view>
					<view>{{item.linkman}} {{item.mobile}}</view>
				</view>
				<view class="item_r" @tap="editAdr(item.id)">编辑</view>
			</view>
		</view>
		<view class='foot'>
			<button @tap='addAdr'>+添加地址</button>
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
				user_info: '',
				token: ''
			}
		},
		onShow() {
			this.user_info = app.globalData.user_info;
			if (this.user_info) {
				this.token = app.globalData.user_info.token;
				this.request({
					url: interfaces.adrList,
					header: {
						token: this.token
					},
					method: 'POST',
					success: res => {
						//console.log(res);
						if (res.code == 200) {
							this.data = res.data;
						} else {
							app.isLogin(res.code, res.msg);
						}
					}
				});
			} else {
				wx.reLaunch({
					url: '/pages/index/index',
				})
			}
		},

		methods: {
			//点击添加地址事件,跳转到添加地址页面
			addAdr() {
				wx.navigateTo({
					url: 'add',
				})
			},

			//点击修改地址事件,跳转到修改地址页面
			editAdr(id) {
				wx.navigateTo({
					url: 'edit?id=' + id,
				})
			},
		}
	}
</script>

<style>
	.box {
		padding: 10px 0;
		margin-bottom: 70px;
	}

	.item {
		display: flex;
		flex-direction: row;
		border-bottom: 1px #e8e8e8 solid;
		justify-content: space-between;
		background-color: #fff;
		position: relative;
		padding: 10px 10px;
	}

	.item_l {
		line-height: 20px;
		width: 80%;
	}

	.item_r {
		position: absolute;
		top: calc(50% - 10px);
		right: 10px;
		color: #03b3ff;
	}

	.foot {
		position: fixed;
		bottom: 0;
		background-color: #fff;
		height: 60px;
		width: 100%;
	}

	button {
		margin: 10px;
		font-size: 16px;
		color: #fff;
		background-color: #03b3ff;
	}
</style>
