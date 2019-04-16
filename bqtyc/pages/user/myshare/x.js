const app = getApp()
var thePage;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    myshare: null,
    showIcon: true
  },
  gotoBalance() {
    wx.navigateTo({
      url: 'balance/x'
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的版权词条分享'
    });
    thePage = this;
    setTimeout(function () {
      thePage.setData({
        myshare: {
          count_share: "3",
          count_open: "10万+",
          devote: 135.4,
        },
        searchBarTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight
      });
    }, 200);
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