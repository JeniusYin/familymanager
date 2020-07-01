<template>
	<view class="family">
		<view class="family_list">
			<view class="family_item" v-for="item in familyList" :key="item._id" @click="editFamily(item._id)">
				<u-image mode="aspectFit" :src="item.img_src || defaultImgSrc" :border-radius = "10" @click="editFamily(item._id)"></u-image>
				<view class="host_name">
					<text>户主：{{item.host_name}}</text>
					<text>家庭人数：{{item.member_count}}</text>
				</view>
				<view class="phone" @click.stop="">
					联系方式：<text selectable="true">{{item.phone}}</text>
				</view>
				<!-- <view class="demo-tag">
					<view class="demo-tag-owner">{{item.tag1}}</view>
					<view class="demo-tag-owner">{{item.tag2}}</view>
				</view> -->
				<view class="address">
					<text selectable="true">{{item.main_address + item.detail_address}}</text>
				</view>
			</view>
		</view>
		<view class="isOver" v-if="flag">-----我是有底线的-----</view>
		<uni-fab horizontal="right" vertical="bottom" popMenu="false" @fabClick="addFamily"></uni-fab>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageindex: 0,
				defaultImgSrc: "cloud://yinqj-cloud-0m28b.7969-yinqj-cloud-0m28b-1302439194/007TQ42Ely1gfoxl7bz8pj30u00ks0v1.jpg",
				familyList: [],
				flag: false
			}
		},
		methods: {
			async getfamilyList(callBack) {
				// uni.showLoading({
				// 	title: '处理中...'
				// });
				console.log(this.pageindex)
				await this.$db.queryByPage("familys", this.pageindex, 6)
					.then((res) => {
						console.log(res)
						// uni.hideLoading()
						// uni.showModal({
						// 	content: `查询成功，获取数据列表为：${JSON.stringify(res.data)}`,
						// 	showCancel: false
						// })
						this.familyList = [...this.familyList, ...res.data].sort((a, b)=> a.birthday.localeCompare(b.birthday))	
						callBack && callBack() //传入了callBack才调用
					}).catch((err) => {
						// uni.hideLoading()
						// uni.showModal({
						// 	content: `查询失败，错误信息为：${err.message}`,
						// 	showCancel: false
						// })
						console.error(err)
					})
			},
			// 导航到家庭详情页
			addFamily() {
				uni.navigateTo({
					url: '/pages/family-detail/family-detail'
				})
			},
			editFamily(id) {
				uni.navigateTo({
					url: '/pages/family-detail/family-detail?id=' + id
				})
			},
			changeData() {
				this.pageindex = 0
				this.familyList = []
				this.flag = false
				this.getfamilyList();
			}
		},
		onLoad() {
			this.getfamilyList();
		},
		onReachBottom() {
			if (this.familyList.length < this.pageindex * 6) return this.flag = true
			this.pageindex++
			this.getfamilyList()
		},
		onPullDownRefresh() {
			this.pageindex = 0
			this.familyList = []
			this.flag = false
			setTimeout(() => {
				this.getfamilyList(() => {
					uni.stopPullDownRefresh()
				})
			}, 500)
		}
	}
</script>

<style lang="scss">
	.family {
		//background: #eee;

	}

	.family_list {
		padding: 0 20rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.family_item {
			background: #eee;
			width: 350rpx;
			margin: 10rpx 0;
			padding: 20rpx;
			box-sizing: border-box;
			border-radius: 20rpx;

			image {
				width: 70%;
				height: 200rpx;
				display: block;
				margin: auto;
			}

			.host_name {
				display: flex;
				justify-content: space-between;
				color: #b50e03;
				font-size: 24rpx;
				margin: 20rpx 0 5rpx 0;
			}

			.phone {
				line-height: 30rpx;
				font-size: 26rpx;
				padding: 10rpx 0;

				text {
					color: #19be6b;
				}
			}

			.demo-tag {
				display: flex;
				margin-top: 5px;
			}

			.demo-tag-owner {
				border: 1px solid $u-type-primary;
				color: $u-type-primary;
				margin-left: 5px;
				border-radius: 50rpx;
				line-height: 1;
				padding: 4rpx 14rpx;
				display: flex;
				align-items: center;
				font-size: 20rpx;
			}

			.address {
				font-size: 28rpx;
				line-height: 50rpx;
				padding-bottom: 15rpx;
				padding-top: 10rpx;
			}
		}
	}

	.isOver {
		width: 100%;
		height: 50px;
		line-height: 50px;
		text-align: center;
		// background: #fff;
		font-size: 28rpx;
	}
</style>
