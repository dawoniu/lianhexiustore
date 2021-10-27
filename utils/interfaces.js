const domain = "https://www.lianhexiu.com.cn/lhxstoreapi/";
const interfaces = {
	
	// 连锁店登陆
	Login: domain + "login/login",
	//数据统计
	orderCensus:domain+"order/census",
	//授权登陆
	authLogin:domain+"login/authlogin",
	//服务项目列表
	categList:domain+"categ/repair",
	//订单列表
	orderList:domain + "order/orderlist",
	//区域经理通过订单审核
	examineSuccess:domain + 'order/examinesuccess',
	//审核拒绝
	examineFail:domain+"order/examinefail",
	//区域经理同意报价，开始维修
	baojiaAgree:domain+"order/baojiaagree",
	//报价拒绝
	baojiaFail:domain+"order/baojiafail",
	//订单详情
	orderDetail:domain+"order/detail",
	//订单报价清单
	orderBill:domain+"order/bill",
	//订单历史清单
	orderHistory:domain+"order/history",
	
	
	
	
	
	
	
	//区域经理确认完工
	orderFinish: domain + "order/finish",
	//区域经理同意申诉
	shensuAgree: domain + "order/shensuagree",
	//区域经理取消申诉，订单状态回到原处
	shensuCancel: domain + 'order/shensucancel',
	//订单页上传图片
	orderUpload:domain + 'order/upload',
	//订单添加
	orderAdd:domain + 'order/add',
	
	//评价订单
	addEval:domain+"order/addeval",
	//图表
	chart:domain+"census/chart",
	
}
module.exports = interfaces;
