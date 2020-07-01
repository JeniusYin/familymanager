<template>
	<view class="u-wrap">
		<!-- <view class="u-search-box">
			<view class="u-search-inner">
				<u-icon name="search" color="#909399" :size="28"></u-icon>
				<text class="u-search-text">搜索uView</text>
			</view>
		</view> -->
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in familyList" :key="index" class="u-tab-item" :class="[current==index ? 'u-tab-item-active' : '']"
				 :data-current="index" @tap.stop="swichMenu(index, item._id)">
					<text class="u-line-1">{{item.host_name}}</text>
				</view>
			</scroll-view>
			<scroll-view scroll-y class="right-box">
				<view class="item-container">
					<view class="thumb-box" v-for="(item,index) in memberList" :key="index" @click="memberShow(item._id)">
						<!-- <image class="item-menu-image" :src="item.img_src" mode=""></image> -->
						<u-avatar :src="item.img_src" mode="circle" size="160"></u-avatar>
						<view class="item-menu-name">{{item.name}}</view>
					</view>
					<text v-if="loadComputed && memberList.length === 0" style="text-align: center; padding-top: 30;">还没有添加过家人呢~</text>
				</view>
			</scroll-view>
		</view>
		<u-popup border-radius="10" height="85%" width="80%" v-model="memberpopshow"
			@close="close" @open="open" mode="center" 
		    mask closeable  close-icon-pos="top-right">
			<view class="wrap">
				<image mode="aspectFit" :src="member.img_src" @click="previewImg(member.img_src)"></image>
				<view class="name">
					<text selectable>姓名：{{member.name}}</text>	
				</view>
				<view class="phone">
					手机：<text selectable>{{member.phone}}</text>
				</view>
				<view class="phone">
					生日：<text>{{member.birthType}}    </text><text>{{member.birthday}}</text>
				</view>
				<!-- <view class="demo-tag">
					<view class="demo-tag-owner">{{item.tag1}}</view>
					<view class="demo-tag-owner">{{item.tag2}}</view>
				</view> -->
				<!-- <view class="address">
					<text selectable="true">{{item.main_address + item.detail_address}}</text>
				</view> -->
				<u-button type="primary" @click="editMember(member._id)" class="wrap">修改</u-button>
				<u-button type="warning" @click="removeMember(member._id)" class="wrap">删除</u-button>
			</view>

		</u-popup>
		<uni-fab horizontal="right" vertical="bottom" popMenu="false" @fabClick="addMember"></uni-fab>
	</view>
</template>

<script>
	import classifyData from "@/util/classify.data.js";
	export default {
		data() {
			return {
				familyList: [],
				memberList: [],
				member:{},
				currentFamilyId: '',
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度		
				loadComputed: false,
				memberpopshow: false
			}
		},
		onLoad() {
			this.getAllFamily()
		},

		onShow(){
			if(this.loadComputed) this.getAllFamily(true)
		},
		methods: {
			getAllFamily(onshow) {
				this.$db.queryAll("familys")
				.then((res) =>{
					console.log(res.data)
					this.familyList = res.data.sort((a, b)=> a.birthday.localeCompare(b.birthday))
					if(onshow && !this.jsCommon.isEmpty(this.currentFamilyId)){
						//从其他tabbar切换过来，只刷新左侧家庭信息
					}else{
						if(this.familyList.length < 1) return
						this.currentFamilyId = this.familyList[0]._id
						this.getAllMemberByFamilyId()
					}
				})
			},
			getImg() {
				return Math.floor(Math.random() * 35);
			},
			// 点击左边的栏目切换
			async swichMenu(index, id) {
				console.log(index + " " + this.current+ " "+ id)
				this.currentFamilyId = id;
				if(index == this.current) return ;
				this.current = index;
				// 如果为0，意味着尚未初始化
				if(this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
				this.getAllMemberByFamilyId()
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({size: true},res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if(!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return ;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			},
			getAllMemberByFamilyId(){
				this.$db.queryMembersByFamilyID("members", this.currentFamilyId)
				.then((res) =>{
					console.log(res.data)
					this.memberList = res.data.sort((a, b)=> a.birthday.localeCompare(b.birthday))		
					this.loadComputed = true
				}).catch((err) => {
						console.error(err)
				})
			},
			// 导航到家庭详情页
			addMember() {
				if(this.familyList.length < 0){
					uni.showToast({
					    title: '哎呀，好像还没有家庭呢，要不你先去加一个吧！',
					    duration: 2000
					});
				}
				const currentFamily = this.familyList.filter((family) => {
				  return family._id == this.currentFamilyId;
				});
				console.log(currentFamily[0])
				uni.showModal({
				    title: '提示',
				    content: '你是要添加【' + currentFamily[0].host_name + '】的家人吗？别走错家门哦~',
				    success:  (res) => {
				        if (res.confirm) {
				            console.log('用户点击确定');
							uni.navigateTo({
								url: '/pages/member-detail/member-detail?familyid=' + this.currentFamilyId
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			changeData(familyid){
				this.currentFamilyId = familyid
				this.getAllMemberByFamilyId()
			},
			
			memberShow(id){
				this.$db.queryByID("members", id)
				.then((res) =>{
					this.member = res.data[0]
					console.log(this.member)
					this.memberpopshow = true
				}).catch((err) => {
					console.error(err)
				})
			},
			open() {
				// console.log('open');
			},
			close() {
				// console.log('close');
			},
			previewImg(current) {
				uni.previewImage({
					current: current,
					urls: [current]
				})
			},
			editMember(id) {
				this.memberpopshow = false
				uni.navigateTo({
					url: '/pages/member-detail/member-detail?memberid=' + id
				})
			},
			removeMember(id) {
				uni.showModal({
					content: "真的要删除吗？",
					success: async (res) => {
						if (!res.confirm) return
						uni.showLoading({
							title: '处理中...'
						})
						await this.$db.remove("members", id)
							.then((res) => {
								uni.hideLoading()
								uni.showModal({
									content: "删除成功",
									showCancel: false,
									success: () => {
										this.getAllMemberByFamilyId()
										this.memberpopshow = false
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
		}
	}
</script>

<style lang="scss" scoped>
	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
	}

	// .u-search-box {
	// 	padding: 18rpx 30rpx;
	// }

	// .u-search-inner {
	// 	background-color: rgb(234, 234, 234);
	// 	border-radius: 100rpx;
	// 	display: flex;
	// 	align-items: center;
	// 	padding: 10rpx 16rpx;
	// }

	// .u-search-text {
	// 	font-size: 26rpx;
	// 	color: $u-tips-color;
	// 	margin-left: 10rpx;
	// }

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}
	
	.u-tab-view {
		width: 200rpx;
		height: 100%;
	}

	.u-tab-item {
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}
	
	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}
	
	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid $u-type-primary;
		height: 32rpx;
		left: 0;
		top: 39rpx;
	}

	.u-tab-view {
		height: 100%;
	}
	
	.right-box {
		background-color: #fff;
	}	
	
	// .item-title {
	// 	font-size: 26rpx;
	// 	color: $u-main-color;
	// 	font-weight: bold;
	// }
	
	.item-menu-name {
		font-weight: normal;
		font-size: 26rpx;
		color: $u-main-color;
	}
	
	.item-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		// flex-direction: column;
		margin-bottom: 30rpx;
		padding: 16rpx;
		border-radius: 8rpx;
	}
	
	.thumb-box {
		width: 42%;
		height: 200rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		margin-top: 5rpx;
		padding: 5rpx;
		background-color: #ecf5ff;
	}
	
	.item-menu-image {
		width: 180rpx;
		height: 180rpx;
	}
	
	u-popup {
		
		
		image {
			width: 80%;
			height: 400rpx;
			display: block;
			margin: auto;
			padding-top: 30rpx;
			padding-bottom: 20rpx;
		}
	
		.name {
			width: 100%;
			color: #b50e03;
			font-size: 36rpx;
			padding: 16rpx;
		}
	
		.phone {
			line-height: 30rpx;
			font-size: 32rpx;
			padding: 16rpx;
			
			text {
				margin: 5rpx;
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
		.wrap {
			padding: 2rpx;
			// display: flex;
			// flex-direction: row;
			// flex-wrap: wrap;
		}
	}
</style>
