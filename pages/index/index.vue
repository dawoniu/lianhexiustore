<template>
	<view>
		<!--选择是总账号还是区域经理-->
		<view class="logo"><image src="/static/images/logo.jpg" mode="widthFix"></image></view>
		<view class="but" @tap="login('store')"><button>总账号</button></view>
		<view class="or">OR</view>
		<view class="but" @tap="login('manager')"><button>区域经理</button></view>
	</view>
</template>

<script>
	import interfaces from '../../utils/interfaces.js';
	import app from "../../App.vue";
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			//跳转登陆界面
			login(type) {
				wx.navigateTo({
				  url: 'login?type='+type,
				})
			}
		}
	}
</script>

<style>
	page{
	  background: url("https://www.lianhexiu.com.cn/static/api/images/master/master_bg.jpg") no-repeat bottom;
	  background-size: 100% auto;
	}
	.logo{
	  width: 100px;
	  margin: 0 auto;
	  padding-top: 50px;
	  padding-bottom: 20px;
	}
	.logo image{
	  width: 100%;
	}
	.or{
	  text-align: center;
	}
	.but{
	  padding: 10px 0;
	}
	button{
	  background-color: #159be4;
	  color: #fff;
	  width: 70%;
	  border-radius: 10px;
	}
</style>
