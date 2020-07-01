const BASE_URL = 'https://yinqjqqcloud-49f1c5.service.tcloudbase.com'
export const myRequest = (options) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url:BASE_URL + options.url,
			method:options.method || 'GET',
			data: options.data || {},
			success: (res) => {
				console.log(res)
				if(res.data.status !== 0){
					return uni.showToast({
						title:"获取数据失败！"
					})
				}
				resolve(res.data)
			},
			fail: err => {
				uni.showToast({
					title:"请求接口失败！"
				});
				reject(err)
			}
		})
	})
}