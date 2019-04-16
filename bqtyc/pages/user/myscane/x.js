var app=getApp();
var user, thePage;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon:true,
    scaneList:[],
    pageNumber:1,
    pageSize:10,
    flage:true,
    totalPage:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // /register/browse/detail?token=&pageNumber=1&pageSize=10
    thePage = this;
    user = app.globalData.userInfo;
    thePage.setData({
      fixedTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight
    })
    thePage.getData(thePage.data.pageNumber);
  },
  getData: function (pageNumber){
    if (thePage.data.flage){
      thePage.setData({
        flage:false,
      })
      app.doPost('/register/browse/detail', { token: user.authToken ? user.authToken : '', pageNumber: pageNumber, pageSize: thePage.data.pageSize }, null, function (data) {
        var scaneList = thePage.data.scaneList;
        thePage.setData({
          flage: true,
          totalPage: data.result.datas.totalPage,
          scaneList: scaneList.concat(data.result.datas.list) 
        });
      }, 'get');
    }
    
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 500)
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
    var pageNumber = 1;
    //var scaneList = thePage.data.scaneList;
    thePage.setData({
      pageNumber: 1,
      scaneList:[],
    })
    thePage.getData(pageNumber)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
    if (thePage.data.flage && (thePage.data.totalPage > thePage.data.pageNumber)){
      var pageNumber = thePage.data.pageNumber + 1;
      thePage.setData({
        pageNumber: pageNumber
      })
      thePage.getData(pageNumber)
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})