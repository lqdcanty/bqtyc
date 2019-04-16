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
  onCancel() {
    this.setData({
      actionsOpened: false
    });
  },
  openActions(e) {
    this.setData({
      actionsOpened: true,
      actions: [
        {
          name: '查看当前更正的词条',
          icon: 'browse',
        },
        {
          name: '同意词条收录',
          icon: 'right',
        },
        {
          name: '拒绝词条收录',
          icon: 'delete',
        },
      ],
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '分享版权力详情'
    });
    thePage = this;
    setTimeout(function () {
      thePage.setData({
        myshare: {
          count_success: 1,
          count_audit: 3,
          count_reject: 1,
        },
        searchBarTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight
      });
    }, 200);
  }
})