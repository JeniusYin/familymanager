<template>
	<view class="wrap">
		<view>
			<!-- <image :src="model.img_src" mode="aspectFit" v-if="model.img_src" class="img"></image> -->
			<u-upload ref="uUpload" :custom-btn="false" :show-upload-list="true" :auto-upload="false" :show-progress="false"
			 :deletable="true" :max-count="1" @on-list-change="onListChange" :file-list="fileList" :max-size="1 * 1024 * 1024"
			 :width="300" image-mode="aspectFit" size-type="['compressed']">
			</u-upload>
		</view>

		<view>
			<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
				<u-form-item label-width="120" :label-position="labelPosition" label="户主姓名" prop="host_name">
					<u-input :border="border" placeholder="请输入姓名" v-model="model.host_name" type="text"></u-input>
				</u-form-item>
				<!-- 			<u-form-item :label-position="labelPosition" label="性别" prop="sex">
				<u-input :border="border" type="select" :select-open="actionSheetShow" v-model="model.sex" placeholder="请选择性别" @click="actionSheetShow = true"></u-input>
			</u-form-item> -->
				<u-form-item :label-position="labelPosition" label="手机号码" prop="phone" label-width="150">
					<u-input :border="border" placeholder="请输入手机号" v-model="model.phone" type="number"></u-input>
				</u-form-item>

				<u-form-item :label-position="labelPosition" label="家人数量" label-width="150">
					<u-number-box :min="1" :max="10" v-model="model.member_count"></u-number-box>
				</u-form-item>
				</u-form-item>

				<u-form-item :label-position="labelPosition" label="出生日期" prop="birthday" label-width="150">
					<u-radio-group v-model="model.birthType" :width="radioCheckWidth" :wrap="false">
						<u-radio shape="circle" v-model="item.checked" v-for="(item, index) in birehTypeList" :key="index" :name="item.name">
							{{ item.name }}
						</u-radio>
					</u-radio-group>
					<u-input :border="border" type="select" :select-open="pickerShow1" v-model="model.birthday" placeholder="生日"
					 @click="pickerShow1 = true"></u-input>
				</u-form-item>

				<u-form-item :label-position="labelPosition" label="家庭地址" prop="main_address" label-width="150">
					<u-input :border="border" type="select" :select-open="pickerShow" v-model="model.main_address" placeholder="所在地区"
					 @click="pickerShow= true"></u-input>
				</u-form-item>

				<u-form-item prop="detail_address" label-width="0">
					<u-input :border="border" placeholder="详细地址:如道路,门牌号,小区,楼牌号,单元室等" v-model="model.detail_address"></u-input>
				</u-form-item>
			</u-form>
		</view>
		<view class="wrap">
			<u-button type="primary" @click="submit" :disabled = "btndisabled">提交</u-button>
		</view>
		<view v-if="model.id" class="wrap">
			<u-button type="warning" @click="remove">删除</u-button>
		</view>
		<u-picker mode="region" v-model="pickerShow" @confirm="regionConfirm" :areaCode="['42','4213','421303']">
		</u-picker>
		<u-picker mode="time" v-model="pickerShow1" @confirm="timeConfirm" default-time="1990-06-15">
		</u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {
					id: '',
					host_name: '',
					phone: '',
					birthType: '农历',
					birthday: '',
					main_address: '',
					detail_address: '',
					member_count: 1,
					// tag1: "",
					// tag2: "",
					img_src: "",
				},
				btndisabled: false,
				radioCheckWidth: 'auto',
				birehTypeList: [{
						name: '农历',
						checked: true,
						disabled: false
					},
					{
						name: '阳历',
						checked: false,
						disabled: false
					}
				],
				fileList: [], //预置上传列表
				lists: [], // 上传组件内部的文件列表
				border: false,
				pickerShow: false,
				pickerShow1: false,
				labelPosition: 'left',
				errorType: ['message'],
				rules: {
					host_name: [{
							required: true,
							message: '请输入姓名',
							trigger: 'blur',
						},
						{
							min: 2,
							max: 5,
							message: '姓名长度在2到5个字符',
							trigger: ['change', 'blur'],
						},
						{
							// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.chinese(value);
							},
							message: '姓名必须为中文',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change', 'blur'],
						},
						// 异步验证，用途：比如用户注册时输入完账号，后端检查账号是否已存在
						// {
						// 	trigger: ['blur'],
						// 	// 异步验证需要通过调用callback()，并且在里面抛出new Error()
						// 	// 抛出的内容为需要提示的信息，和其他方式的message属性的提示一样
						// 	asyncValidator: (rule, value, callback) => {
						// 		this.$u.post('/ebapi/public_api/index').then(res => {
						// 			// 如果验证出错，需要在callback()抛出new Error('错误提示信息')
						// 			if(res.error) {
						// 				callback(new Error('姓名重复'));
						// 			} else {
						// 				// 如果没有错误，也要执行callback()回调
						// 				callback();
						// 			}
						// 		})
						// 	},
						// }
					],
					main_address: [{
						required: true,
						message: '请选择地区',
						trigger: 'change',
					}],
					phone: [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change', 'blur'],
						}
					],
					detail_address: [{
						required: true,
						message: '请填写详细地址',
						trigger: ['change', 'blur'],
					}]
				}
			}
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						// if(!this.model.agreement) return this.$u.toast('请勾选协议');
						console.log('验证通过');
						if (this.lists.length < 1 && this.fileList.length < 1) return this.$u.toast('请提交图片');

						if (this.lists.length > 0) {
							const filePath = this.lists[0].url
							// 上传图片
							const cloudPath = 'family' + (new Date()).getTime().toString() + '.jpg';
							var that = this.model
							wx.cloud.uploadFile({
								cloudPath,
								filePath,
								success: res => {
									console.log('[上传图片] 成功：', res)
									that.img_src = res.fileID
									if (!this.jsCommon.isEmpty(that.id)) {
										this.update()
									} else {
										this.add()
									}
								},
								fail: e => {
									console.error('[上传图片] 失败：', e);
									wx.showToast({
										icon: 'none',
										title: '上传图片失败'
									});
								}
							})
						} else {
							this.update()
						}
					} else {
						console.log('验证失败');
					}
				});
			},
			async add() {
				if(this.btndisabled) return
				this.btndisabled = true
				
				await this.$db.add("familys", this.model)
					.then((res) => {
						console.log(res)

						this.btndisabled = false
						uni.showModal({
							content: `恭喜你成功添加了一条家庭信息，快去殷氏家族群炫耀一下吧！`,
							showCancel: false,
							success: () => {
								this.changeParentData();
								uni.navigateBack()
							}
						})

					}).catch((err) => {
						this.btndisabled = false
						uni.showModal({
							content: `添加失败，错误信息为：${err.message}`,
							showCancel: false
						})
						console.error(err)
					})
			},
			async update() {
				if(this.btndisabled) return
				this.btndisabled = true
				
				this.$db.update("familys", this.model)
					.then((res) => {
						console.log(res)
						this.btndisabled = false
						uni.showModal({
							content: `恭喜你成功更新了一条家庭信息，快去殷氏家族群通知一下吧！`,
							showCancel: false,
							success: () => {
								this.changeParentData();
								uni.navigateBack()
							},
						})

					}).catch((err) => {
						this.btndisabled = false
						uni.showModal({
							content: `更新失败，错误信息为：${err.message}`,
							showCancel: false
						})
						console.error(err)
					})
			},
			remove() {
				uni.showModal({
					content: "真的要删除这个家庭信息吗？",
					success: async (res) => {
						if (!res.confirm) return
						uni.showLoading({
							title: '处理中...'
						})
						await this.$db.remove("familys", this.model.id)
							.then((res) => {
								uni.hideLoading()
								uni.showModal({
									content: "删除成功",
									showCancel: false,
									success: () => {
										this.changeParentData()
										uni.navigateBack()
									}
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
					}
				})
			},
			// 选择地区回调
			regionConfirm(e) {
				this.model.main_address = e.province.label + e.city.label + e.area.label;
			},
			// 选择生日回调
			timeConfirm(e) {
				this.model.birthday = e.year + '-' + e.month + '-' + e.day;
			},
			onListChange(lists) {
				// console.log('onListChange', lists);
				this.lists = lists;
			},
			async getFamilyDetail(id) {
				await this.$db.queryByID("familys", id)
					.then((res) => {
						console.log(res)
						this.model = { ...res.data[0]
						}
						delete this.model._id
						this.model.id = res.data[0]._id
						this.fileList = [{
							url: res.data[0].img_src,
							error: false,
							progress: 100
						}]
					}).catch((err) => {
						// uni.hideLoading()
						uni.showModal({
							content: `加载失败，错误信息为：${err.message}`,
							showCancel: false
						})
						console.error(err)
					})
			},
			changeParentData() {
				var pages = getCurrentPages(); //当前页面栈
				if (pages.length > 1) {
					var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
					console.log(beforePage.$vm)
					beforePage.$vm.changeData(); //触发父页面中的方法
				}
			}
		},
		onLoad(options) {
			console.log("onload...")
			if (options.id) {
				this.getFamilyDetail(options.id)
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
	}
</script>

<style scoped lang="scss">
	.wrap {
		padding-top: 5rpx;
		// display: flex;
		// flex-direction: row;
		// flex-wrap: wrap;
	}
</style>
