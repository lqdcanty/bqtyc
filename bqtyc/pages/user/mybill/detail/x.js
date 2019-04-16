const app = getApp()
var thePage;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mybill: null,
    showIcon: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '版权力获取明细'
    });
    thePage = this;
    setTimeout(function () {
      thePage.setData({
        mybill: {
          count_success: 1,
          count_audit: 3,
          count_reject: 1,
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