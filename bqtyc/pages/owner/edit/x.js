// pages/copyright/related/add/x.js
const app = getApp()
var thePage;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags: ["香港", "犯罪", "悬疑", "反转", "警匪", "剧情", "2018", "动作"],
    categories: ["影视", "文字", "艺术", "动漫", "音乐", "软件"],
    types: [
      ["电影"],
      ["文学"],
      ["雕刻"],
      ["漫画"],
      ["词曲"],
      ["游戏"],
    ],
    showIcon: true,
    category: 0,
    type: 0,
    files: [],
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  bindCategoryChange(e) {
    console.log("bindCategoryChange", e);
  },
  bindTypeChange(e) {
    console.log("bindTypeChange", e);
  },
  onActionCancel() {
    this.setData({
      actionsOpened: false
    });
  },
  handleAction(e) {
    console.log("handleAction", e);
    const index = e.detail.index;
    if (index == 1) {
      wx.navigateTo({
        url: '../../../components/uploader/c',
      })
    }
    else if (index == 0) {
      wx.navigateTo({
        url: '../../../components/pasteurl/c',
      })
    }
    this.setData({
      actionsOpened: false
    });
  },
  deleteTag(e) {
    console.log("deleteTag", e);
    this.setData({
      theTagDeleting: e.currentTarget.dataset.index,
      actionsOpened: true,
      actions: [
        {
          name: '确定',
          icon: 'right',
        },
      ],
    });
  },
  onCancel() {
    this.setData({
      actionsOpened: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let action = options.a;
    if( !action ) action = 0;//表示新增
    wx.setNavigationBarTitle({
      title: action == 0 ? '新增版权作品词条' :"修改版权作品词条",
    });
    if (action) {
      let work_id = options.work_id;//这里从全局的测试数据中取数据


    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})