<template>
	<view>
		<u-input v-model="value" :type="type" :border="border" />
		<view class="btn-list">
			<button type="primary" @click="add">新增一条数据</button>
			<button type="primary" @click="remove">删除一条数据</button>
			<button type="primary" @click="update">修改数据</button>
			<button type="primary" @click="getById">查询指定数据</button>
			<button type="primary" @click="getByPage(-1)">查询上一页数据</button>
			<button type="primary" @click="getByPage(1)">查询下一页数据</button>
			<button type="primary" @click="upload">上传文件</button>
			<image mode="aspectFit" src="cloud://yinqj-cloud-0m28b.7969-yinqj-cloud-0m28b-1302439194/my-image.jpg"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: '',
				type: 'text',
				border: true,
				pageIndex: 0,
				family: {
					"id": '',
					"host_name": '殷秋杰',
					"phone": '18571712919',
					"address": "湖北省随州市曾都区余家老湾村四组29号",
					"member_count": 3,
					"tag1": "太帅了",
					"tag2": "善良",
					"img_src": "cloud://yinqj-cloud-0m28b.7969-yinqj-cloud-0m28b-1302439194/殷秋杰_.JPG"
				}
			}
		},
		methods: {
			async add() {
				uni.showLoading({
					title: '处理中...'
				})
				await this.$db.add("familys", this.family)
					.then((res) => {
						console.log(res)
						this.family.id = res._id
						uni.hideLoading()
						uni.showModal({
							content: `成功添加一条数据，文档id为：${res._id}`,
							showCancel: false
						})
					})
			},

			async remove() {
				uni.showLoading({
					title: '处理中...'
				})
				await this.$db.remove("familys", this.family.id)
					.then((res) => {
						uni.hideLoading()
						uni.showModal({
							content: "删除",
							showCancel: false
						})
						console.log(res)
					}).catch((err) => {
						uni.hideLoading()
						uni.showModal({
							content: `删除失败，错误信息为：${err.message}`,
							showCancel: false
						})
						console.error(err)
					})
			},
			async update() {
				uni.showLoading({
					title: '处理中...'
				})
				var udata = this.family
				udata.name = '殷秋杰1'
				await this.$db.update("familys", udata)
					.then((res) => {
						uni.hideLoading()
						uni.showModal({
							content: "修改成功",
							showCancel: false
						})
						console.log(res)
					}).catch((err) => {
						uni.hideLoading()
						uni.showModal({
							content: `更新操作执行失败，错误信息为：${err.message}`,
							showCancel: false
						})
						console.error(err)
					})
			},
			async getByPage(val) {
				uni.showLoading({
					title: '处理中...'
				});
				// this.pageIndex += val
				console.log(this.pageIndex)
				await this.$db.queryByPage("familys", this.pageIndex)
					.then((res) => {
						console.log(res)
						uni.hideLoading()
						uni.showModal({
							content: `查询成功，获取数据列表为：${JSON.stringify(res.data)}`,
							showCancel: false
						})
					}).catch((err) => {
						uni.hideLoading()
						uni.showModal({
							content: `查询失败，错误信息为：${err.message}`,
							showCancel: false
						})
						console.error(err)
					})
			},
			async getById() {
				uni.showLoading({
					title: '处理中...'
				});
				await this.$db.queryByID("familys", this.family.id)
					.then((res) => {
						console.log(res)
						uni.hideLoading()
						uni.showModal({
							content: `查询成功，获取数据为：${JSON.stringify(res.data)}`,
							showCancel: false
						})
					}).catch((err) => {
						uni.hideLoading()
						uni.showModal({
							content: `查询失败，错误信息为：${err.message}`,
							showCancel: false
						})
						console.error(err)
					})
			},
			
			upload() {
				new Promise((resolve, reject) => {
					// 选择图片
					wx.chooseImage({
						count: 1,
						sizeType: ['compressed'],
						sourceType: ['album', 'camera'],
						success: function(res) {
							wx.showLoading({
								title: '上传中'
							});

							const filePath = res.tempFilePaths[0];

							// 上传图片
							const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0];
							wx.cloud.uploadFile({
								cloudPath,
								filePath,
								success: res => {
									console.log('[上传文件] 成功：', res);

									// app.globalData.fileID = res.fileID;
									// app.globalData.cloudPath = cloudPath;
									// app.globalData.imagePath = filePath;

									// 								wx.navigateTo({
									// 									url: '../storageConsole/storageConsole'
									// 								});
								},
								fail: e => {
									console.error('[上传文件] 失败：', e);
									wx.showToast({
										icon: 'none',
										title: '上传失败'
									});
								},
								complete: () => {
									wx.hideLoading();
								}
							});
						},
						fail: e => {
							console.error(e);
						}
					})
				})
			}
		}
	}
</script>

<style>
	.btn-list {
		padding: 0px 30px;
	}

	.btn-list button {
		margin-bottom: 20px;
	}

	.upload-preview {
		width: 100%;
	}
</style>
