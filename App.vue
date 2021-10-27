<script>
	export default {
		globalData: {
			isRequest: 0,
			
			user_info:{
				id: 199,
				name: "摩斯汉堡-江苏区域经理",
				thumb: "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKqkTm19Rdkv9qybFC3qrsCEwibA2SD1YLIscwWMMawGiaaibjgwz8gMqUMn7RSskDDbv3zcVd0MYib0g/132",
				token: "1605764791+199+e7f5d5aa0a25fa56504808d34660da97",
				type: "manager",
				u_count: 16,
			}
		},
		//判断是否需要登录
		isLogin: function(code, msg) {
			uni.showToast({
				title: msg,
				icon: 'none',
				mask: true,
				complete: function() {
					setTimeout(function() {
						if (code < 0) {
							wx.navigateTo({
								url: '/pages/index/index',
							})
						}
					}, 1500)
				}
			})
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	page{
	  color: #000;
	  font-size: 28rpx;
	}
</style>
