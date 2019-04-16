const app = getApp()
var thePage;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    devote: null,
    showIcon: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    console.log(app.globalData)
    thePage.getData();
    app.pageRouteLog("share", "share", 'share', 'share', this.url)
  },

  getData:function(){
    thePage = this;
    app.doPost(
      '/bql/api/my/count?token=' + app.globalData.userInfo.authToken, null, null, function (data) {
        if (data.resultCode == '200') {
          thePage.setData({
            devote: {
              amount: data.result.recentPower,
              amount_total: data.result.totalPower,
              amount_exchanged: data.result.exchange,
              recently: data.result.recently,
              level: data.result.grade,
            },
          });
        }    
      }, 'get');
      setTimeout(function(){
        wx.stopPullDownRefresh();
      },500)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    thePage.getData()
  }
})