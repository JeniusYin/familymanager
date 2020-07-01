var db = {
	add(col, record) {
		return new Promise((resolve, reject) => {
			const db = wx.cloud.database()
			db.collection(col).add({
				data: record,
				success: res => {
					console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id);
					resolve(res)
				},
				fail: err => {
					wx.showToast({
						icon: 'none',
						title: '新增记录失败'
					});
					console.error('[数据库] [新增记录] 失败：', err);
				}
			})
		})
	},
	queryAll(col) {	
		return new Promise((resolve, reject) => {
			wx.cloud.callFunction({
			  // 云函数名称
			  name: 'queryAll',
			  // 传给云函数的参数
			  data: {
			    collection: col
			  },
			})
			.then(res => {
			  resolve(res.result)
			})
			.catch(console.error)
		})
	},
	queryByPage(col, pageIndex, pageSize) {
		return new Promise((resolve, reject) => {
			const db = wx.cloud.database();
			db.collection(col)
				.skip(pageIndex * pageSize) // 跳过结果集中的前 * 条，从第 *+1 条开始返回
				.limit(pageSize) // 限制返回数量为 10 条
				.get({
					success: res => {
						console.log('[数据库] [查询记录] 成功: ', res);
						resolve(res)
					},
					fail: err => {
						wx.showToast({
							icon: 'none',
							title: '查询记录失败'
						});
						console.error('[数据库] [查询记录] 失败：', err);
					}
				})
		})
	},
	queryByID(col, id) {
		return new Promise((resolve, reject) => {
			const db = wx.cloud.database();
			db.collection(col)
				.where({
					_id: id
				})
				.get({
					success: res => {
						console.log('[数据库] [查询记录] 成功: ', res);
						resolve(res)
					},
					fail: err => {
						wx.showToast({
							icon: 'none',
							title: '查询记录失败'
						});
						console.error('[数据库] [查询记录] 失败：', err);
					}
				})
		})
	},
	queryMembersByFamilyID(col, id) {
		return new Promise((resolve, reject) => {
			const db = wx.cloud.database();
			db.collection(col)
				.where({
					familyId: id
				})
				.get({
					success: res => {
						console.log('[数据库] [查询记录] 成功: ', res);
						resolve(res)
					},
					fail: err => {
						wx.showToast({
							icon: 'none',
							title: '查询记录失败'
						});
						console.error('[数据库] [查询记录] 失败：', err);
					}
				})
		})
	},
	update(col, record) {
		return new Promise((resolve, reject) => {
			const db = wx.cloud.database();
			db.collection(col).doc(record.id)
				.set({
					data: record,
					success: res => {
						console.log('[数据库] [更新记录] 成功: ', res);
						resolve(res)
					},
					fail: err => {
						icon: 'none',
						console.error('[数据库] [更新记录] 失败：', err);
					}
				});
		})
	},

	remove(col, id) {
		return new Promise((resolve, reject) => {
			const db = wx.cloud.database();
			db.collection(col)
				.doc(id)
				.remove({
					success: res => {
						console.log('[数据库] [删除记录] 成功: ', res);
						resolve(res)
					},
					fail: err => {
						wx.showToast({
							icon: 'none',
							title: '删除失败'
						});
						console.error('[数据库] [删除记录] 失败：', err);
					}
				});
		})
	}
}

export default db
