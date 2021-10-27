<template>
	<view>
		<form @submit="formSubmit">
			<view class="box">
				<view class="item">
					<view class="item_l">联系人</view>
					<view class="item_r"><input placeholder="请填写联系人" name='linkman'></input></view>
				</view>
				<view class="item">
					<view class="item_l">联系电话</view>
					<view class="item_r"><input type="number" name='mobile' placeholder="请输入联系电话"></input></view>
				</view>
				<view class="item">
					<view class="item_l">服务地址</view>
					<view class="item_z">
						<input name='positionAddress' disabled="true" placeholder="点击获取" :value="positionAddress"></input>
						<input hidden="true" name='latitude' :value="latitude"></input>
						<input hidden="true" name='longitude' :value="longitude"></input>
					</view>
					<view class="item_getadr" @tap="open_map">获取地址</view>
				</view>
				<view class="item">
					<view class="item_l">详细地址</view>
					<view class="item_r"><input placeholder="门牌号：如5号楼6单元602" name="address"></input></view>
				</view>
				<view class="item_switch">
					<view class="item_l">是否默认</view>
					<view>
						<switch name='dft' color="#0081ff"/>
					</view>
				</view>
			</view>
			<view class='foot'>
				<button formType="submit">保存</button>
			</view>
		</form>
	</view>
</template>

<script>
	import interfaces from '../../utils/interfaces.js';
	var common = require('../../utils/common.js');
	import app from "../../App.vue";
	var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
	var qqmapsdk;
	export default {
		data() {
			return {
				user_info: '',
				token: '',
				positionAddress: '',
				latitude: '',
				longitude: ''
			}
		},
		onShow() {
			this.user_info = app.globalData.user_info;
			if (this.user_info) {
				this.token = app.globalData.user_info.token;
			} else {
				wx.reLaunch({
					url: '/pages/index/index',
				})
			}
		},

		methods: {

			//表单提交事件
			formSubmit: function(e) {
				var _this = this;
				var data = e.detail.value;

				if (data.linkman == '') {
					wx.showToast({
						title: '请输入联系人',
						icon: "none",
					});
					return;
				}

				if (!common.checkMobile(data.mobile)) {
					wx.showToast({
						title: '手机号码格式有误',
						icon: "none",
					});
					return;
				}

				if (data.positionAddress == '') {
					wx.showToast({
						title: '请获取服务地址',
						icon: "none",
					});
					return;
				}

				if (data.address == '') {
					wx.showToast({
						title: '请输入详细地址',
						icon: "none",
					});
					return;
				}

				data.dft = e.detail.value.dft ? 1 : 0;

				// 实例化API核心类
				qqmapsdk = new QQMapWX({
					key: 'WCYBZ-EWVC4-CC3U2-DZGZI-UWGK2-E2BMM'
				});

				qqmapsdk.reverseGeocoder({
					location: {
						latitude: data.latitude,
						longitude: data.longitude
					},
					success: addressRes => {
						data.positionCity = addressRes.result.address_component.city;
						console.log(data);
						this.request({
							url: interfaces.addressAdd,
							data: data,
							header: {
								token: _this.token
							},
							method: 'POST',
							success: res => {
								console.log(res);
								if (res.code == 200) {
									wx.showToast({
										title: res.msg,
										icon: 'success'
									})
									setTimeout(function() {
										//返回地址列表
										wx.navigateBack({
											delta: 1
										})
									}, 1500);
								} else {
									app.isLogin(res.code, res.msg);
								}
							}
						});
					}
				})
			},

			open_map() {
				wx.chooseLocation({
					success: e => {
						console.log(e);
						this.positionAddress = e.address;
						this.latitude = e.latitude;
						this.longitude = e.longitude;
					},
					fail: err => {
						//console.log(err);
						if (err.errMsg === "chooseLocation:fail auth deny") {
							wx.showModal({
								title: '提示',
								content: '只有授权成功才能使用此功能，是否手动开启授权？',
								success: (res) => {
									if (res.confirm) {
										wx.openSetting({
											success(settingdata) {
												//console.log(settingdata)
												if (settingdata.authSetting['scope.userLocation']) {
													wx.showToast({
														title: '授权成功',
														icon: 'none',
														mask: true,
													})
												} else {
													wx.showToast({
														title: '授权失败',
														icon: 'none',
														mask: true,
													})
												}
											}
										})
									}
								}
							})
						}
					}
				});
			},
		}
	}
</script>

<style>
	/* pages/customer/address/add.wxss */
	.box {
		padding: 10px 0;
		margin-bottom: 70px;
	}

	.item {
		display: flex;
		flex-direction: row;
		border-bottom: 1px #e8e8e8 solid;
		background-color: #fff;
		padding: 0 10px;
		height: 40px;
		line-height: 40px;
	}

	.item_switch {
		display: flex;
		flex-direction: row;
		border-bottom: 1px #e8e8e8 solid;
		background-color: #fff;
		padding: 0 10px;
		height: 40px;
		line-height: 40px;
		justify-content: space-between;
	}

	.item_l {
		width: 65px;
	}

	.item_z {
		width: calc(100% - 130px);
	}

	.item_z input {
		line-height: 40px;
		height: 40px;
		width: 100%;
	}

	.item_r {
		width: calc(100% - 65px);
	}

	.item_r input {
		line-height: 40px;
		height: 40px;
	}

	.item_getadr {
		width: 60px;
		border: 1px #0081ff solid;
		height: 22px;
		margin-top: 7px;
		line-height: 22px;
		color: #0081ff;
		text-align: center;
	}

	.item_switch switch {
		zoom: 0.8;
	}

	.item_l {
		width: 65px;
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
