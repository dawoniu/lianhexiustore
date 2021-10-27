import app from "../App.vue";
import interfaces from './interfaces.js';

//以下三个方法是wx.login获取到code,使用wx.getUserInfo授权登录，获取到加密过的数据encryptedData，再使用postLogin方法，把code和一些加密数据传到服务器，服务器用code请求code2Session获取到session-key，最后使用session-key、偏移量iv和一些加密数据在服务器进行解密，获取到unionid，保存到数据库
function reg() {
	uni.login({
		success: function(res) {
			if (res.code) {
				getUserInfo(res.code);
			} else {
				uni.showToast({
					title: '微信登录获取code失败',
					icon: 'none',
					duration: 1000,
				})
			}
		},
		fail: function() {
			uni.showToast({
				title: '微信自动登录失败',
				icon: 'none',
				duration: 1000,
			})
		}
	})
}
// 获取用户信息
function getUserInfo(code) {
	uni.getUserInfo({
		withCredentials: true,
		// 获取成功，全局存储用户信息，开发者服务器登录
		success(res) {
			console.log(res);
			// console.log(res);
			// 开发者服务器登录，并解密uninoid
			postLogin(code, res.iv, res.encryptedData)
		},
		// 获取失败，弹窗提示一键登录
		fail() {
			uni.showToast({
				title: '授权登录失败',
				icon: 'none',
				duration: 1000,
			})
		}
	})
}
//解密encryptedData获取unionid等隐私数据
function postLogin(code, iv, encryptedData) {
	uni.request({
		url: interfaces.authLogin,
		method: 'POST',
		header: {
			"content-type": "application/x-www-form-urlencoded"
		},
		data: {
			code: code,
			iv: iv,
			encryptedData: encryptedData,
			id: app.globalData.user_info.id,
			type: app.globalData.user_info.type
		},
		success: function(res) {
			console.log(res);
			if (res.data.code == 200) {
				uni.showToast({
					title: '绑定成功',
					icon: 'none',
					duration: 1000,
				})
				app.globalData.user_info.thumb = res.data.data;
				setTimeout(function() {
					uni.navigateBack({
						delta: 1
					})
				}, 1500);
			} else {
				uni.showToast({
					title: '错误码：'.res.data.code,
					icon: 'none',
					duration: 1000,
				})
			}
		},
	})
}

module.exports = {
	reg: reg
};
