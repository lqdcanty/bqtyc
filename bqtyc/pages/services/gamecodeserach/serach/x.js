var thePage;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: "软著订单",
    showIcon: true,
    fixedTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight + 5,
    result: null,
    keyword: null,
    searchValue: "",
    pageNumber: 1,
    pageSize: 10,
    opendStatus: false,
    lastPage: false,
    worksList: null,
    keyword: '',
    flage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  doOnload: function () {
    this.setData({
      nullStatus: false
    });
    this.getData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  opendIt: function () {
    this.selectComponent('#id-card').onshow()
  },
  closeIt: function () {
    this.selectComponent('#id-card').onshow()
  }, 
  inputBind: function (e) {
    thePage.setData({
      searchValue: e.detail.value,
    });
  },

  query: function () {
    if (thePage.data.searchValue != '') {
      thePage.setData({
        keyword: thePage.data.searchValue,
      });
      wx.navigateTo({
        url: '../result/x?keyword=' + thePage.data.keyword
      })
    } 
  },
  // addWork: function () {
  //   wx.navigateTo({
  //     url: '../work/add/x'
  //   })
  // },
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
    wx.stopPullDownRefresh();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "游戏版号办理查询",
    }
  }
})