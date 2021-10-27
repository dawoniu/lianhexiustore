<template>
	<view>
		<form @submit="formSubmit">
			<view class="logo">
				<image src="/static/images/logo.jpg" mode="widthFix"></image>
			</view>
			<view class="tip">连锁店客户登陆</view>
			<view class="input"><input placeholder="请输入账号" name='account'></input></view>
			<view class="input"><input type="password" placeholder="请输入密码" name='password'></input></view>
			<view class="but"><button formType="submit">登陆</button></view>
		</form>
	</view>
</template>

<script>
	import interfaces from '../../utils/interfaces.js';
	import app from "../../App.vue";
	export default {
		data() {
			return {
				type:'store'
			}
		},
		onLoad(options) {
			this.type = options.type;
		},
		methods: {
			//表单提交事件
			formSubmit(e) {
				var data = e.detail.value;
				data.type = this.type;
				if (data.account == "") {
					wx.showToast({
						title: '请输入账号',
						icon: "none",
					});
					return;
				}
				if (data.password == "") {
					wx.showToast({
						title: '请输入密码',
						icon: "none",
					});
					return;
				}
				this.request({
					url: interfaces.Login,
					data: data,
					method: 'POST',
					success: res => {
						console.log(res);
						if (res.code == 200) {
							wx.showToast({
								title: '登陆成功',
								icon: 'success'
							})
							app.globalData.user_info = res.data;
							setTimeout(function() {
								wx.switchTab({
									url: '../index/home',
								})
							}, 1500);
						} else {
							app.isLogin(res.code, res.msg);
						}
					}
				});
			},
		}
	}
</script>

<style>
	page {
		background: url("https://www.lianhexiu.com.cn/static/api/images/master/master_bg.jpg") no-repeat bottom;
		background-size: 100% auto;
	}

	.logo {
		width: 100px;
		margin: 0 auto;
		padding-top: 50px;
		padding-bottom: 10px;
	}

	.logo image {
		width: 100%;
	}

	.tip {
		text-align: center;
		font-size: 18px;
		padding-bottom: 10px;
	}

	.but {
		padding: 10px 0;
	}

	.input {
		width: 70%;
		margin: 10px auto;
	}

	.input input {
		width: calc(100% - 12px);
		border-radius: 5px;
		border: 1px #cccccc solid;
		padding: 5px;
	}

	button {
		background-color: #159be4;
		color: #fff;
		width: 70%;
		border-radius: 10px;
	}
</style>
