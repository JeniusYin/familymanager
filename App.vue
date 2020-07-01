<script>
	export default {
		onLaunch: function() {
			console.log("wx.cloud.init")
			wx.cloud.init({
			  // env 参数说明：
			  //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
			  //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
			  //   如不填则使用默认环境（第一个创建的环境）
			  //   env: 'yinqj-cloud-0m28b',
			  traceUser: true,
			})
		},
		onShow: function() {

		},
		onHide: function() {

		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
</style>
