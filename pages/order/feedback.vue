<template>
	<view>

		<!--审核拒绝或拒绝报价-->
		<form @submit="formSubmit">
			<view class='main'>
				<view class='title' v-if='type==2'>拒绝理由</view>
				<view class="radio" v-if='type==2'>
					<radio-group class="radio-group" name='cancel_type'>
						<radio class="radio" color="#257AFA" value="取消维修" checked="true">
							<text>取消维修</text>
						</radio>
						<radio class="radio" color="#257AFA" value="修改报价">
							<text>修改报价</text>
						</radio>
					</radio-group>
				</view>
				<textarea name='content' placeholder="请输入拒绝的理由,最多200个字" auto-focus maxlength='200' />
				</view>
		<view class='submit'>
		  <button formType="submit">提交</button>
		</view>
		</form>

	</view>
</template>

<script>
	import interfaces from '../../utils/interfaces.js';
	import app from "../../App.vue";
	export default {
		data() {
			return {
				id:0,
				user_info:'',
				token:'',
				type:'',
				storetype:''
			}
		},
		onLoad(options) {

			this.id = options.id;
			this.type=options.type;
			
		},
		onShow() {
			this.user_info = app.globalData.user_info;
			if (this.user_info) {
				this.token = app.globalData.user_info.token;
				this.storetype = app.globalData.user_info.type;
			} else {
				wx.reLaunch({
					url: '/pages/index/index',
				})
			}
		},
		methods: {
			
			//表单提交事件
			formSubmit(e) {
				var data = e.detail.value;
		
				if (data.content == '') {
					wx.showToast({
						title: '请输入拒绝的理由',
						icon: "none"
					});
					return;
				}
		
				var url='';
				var cancel_type='';
				if(this.type==1){
					url = interfaces.examineFail;
				}else{
					url = interfaces.baojiaFail;
					cancel_type=data.cancel_type;
				}
		
				this.request({
					url: url,
					data: {
						content: data.content,
						id: this.id,
						type: this.storetype,
						cancel_type:cancel_type
					},
					header: {
						token:this.token
					},
					method: 'POST',
					success: res => {
						if (res.code == 200) {
							wx.showToast({
								title: res.data,
								icon: 'none'
							})
							setTimeout(function () {
								wx.reLaunch({
									url: 'index?status=10,11',
								})
							}, 1500);
						} else {
							app.isLogin(res.code, res.data);
						}
					}
				});
			},
		}
	}
</script>

<style>
	/* pages/order/feedback.wxss */
	page{
	  background-color: #f7f7f7;
	  font-size: 12px;
	}
	.main{
	  padding: 10px;
	  background-color: #fff;
	}
	.radio{
	  padding: 10px 0;
	}
	.radio-group{
	  display: flex;
	  justify-content: space-around;
	}
	.title{
	  color: #333333;
	  font-weight: bold;
	  text-align: center;
	  font-size: 16px;
	}
	textarea{
	  border: 1px #e4e4e4 solid;
	  width: calc(100% - 18px);
	  padding: 8px;
	  line-height: 20px;
	  height: 100px;
	  margin-top: 10px;
	}
	.submit{
	  background-color: #fff;
	  border-top: 1px #e5e5e5 solid;
	  padding: 10px 20px;
	  position: fixed;
	  bottom: 0;
	  width: calc(100% - 42px);
	}
	button{
	  background-color: #257AFA;
	  color: #fff;
	  font-size: 16px;
	}
</style>
