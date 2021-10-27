<template>
	<view>
		<view class='main'>
			<view class='pic'>
				<image src='/static/images/logo.jpg' mode='widthFix'></image>
			</view>
			<view class='line'></view>
			<view class='title1'>申请获取以下权限</view>
			<view class='title2'>获得你的公开信息（昵称、头像等）</view>
			<view class="sub">
				<button open-type="getUserInfo" class='login' type='primary' @getuserinfo="getUserInfoFun">授权绑定</button>
				<button @tap="nologin">暂不授权</button>
			</view>
		</view>
	</view>
</template>

<script>
	import interfaces from '../../utils/interfaces.js';
	import app from "../../App.vue";
	var handleLogin = require("../../utils/handleLogin.js");

	export default {
		data() {
			return {

			}
		},
		methods: {
			getUserInfoFun() {
				handleLogin.reg();
			},

			nologin() {
				wx.switchTab({
					url: '/pages/index/index',
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}

	.main {
		padding: 0 20px;
	}

	.pic {
		text-align: center;
		padding-top: 20px;
	}

	.pic image {
		width: 150px;
	}

	.line {
		border-bottom: 1px #ccc solid;
		padding-top: 30px;
	}

	.title1 {
		padding-top: 30px;
		font-size: 18px;
	}

	.title2 {
		padding-top: 20px;
		font-size: 14px;
	}

	button[type=primary] {
		font-size: 16px;
		background-color: #03b3ff;
	}

	button[type=primary]:hover {
		background-color: #03b3ff;
	}

	button[type=primary]::after {
		border: none;
	}

	.sub {
		display: flex;
		justify-content: space-evenly;
		margin-top: 30px;
	}

	.sub button {
		width: 48%;
	}
</style>
