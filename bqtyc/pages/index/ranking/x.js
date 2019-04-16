const app = getApp()
var start_clientX;
var end_clientX;
var obj = wx.getSystemInfoSync();
var workHeight = obj.windowHeight;
var workWidth = obj.windowWidth;

var thePage;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    workHeight: workHeight,
    pageNum: 1,
    totalPage: 1,
    lastPage: false,
    showIcon:true,
    flage:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    let type = options.type ? options.type:"";//这里从全局的测试数据中取数据
    let chartType = options.chartType;
    wx.setNavigationBarTitle({
      title: options.name ? options.name:"版权百科"
    });
    app.pageRouteLog("ranking", "ranking", 'ranking', 'ranking', this.url)
    thePage.setData({
      chartType: chartType,
      pageName: options.name,
      type: type,
      pageTitle: options.name ? options.name : "版权百科"
    })
    thePage.searchFun()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    }
  },
  searchFun: function (pageNum) {
    var page = 1;

    if (pageNum) {
      page = pageNum;
    }
    let that = this;
    if (that.data.lastPage) {
      return;
    }
    app.doPost(
      '/search/chart?chartType=' + that.data.chartType + "&type=" + that.data.type + "&pageNumber=" + page, null, null, function (result) {
        let nowPage = result.result.pageNumber;
        let showResult = that.data.ranking_data;
        if (page == 1) {
          showResult = result.result.list
        } else {
          let works = result.result.list;
          for (var i = 0; i < works.length; i++) {
            showResult.push(works[i]);
          }
        }
        that.setData({
          dashboard: result.result.dashboard,
          dashboardWitdh: (100 / result.result.dashboard.length).toFixed(2)+'%',
          ranking_data: showResult,
          totalPage: result.result.totalPage,
          lastPage: result.result.totalPage <= page,
          pageNum: nowPage
        })
        console.log((100 / result.result.dashboard.length).toFixed(2)+'%',)
        if (result.result.totalPage <= page){
          that.setData({
            flage: true
          })
        } 
        wx.stopPullDownRefresh();
      }, "get")

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
    this.searchFun();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var pageNum = parseInt(this.data.pageNum) + 1;
 
    this.searchFun(pageNum);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    app.pageShareLog("ranking", "ranking", 'ranking', 'ranking', this.url)
    return {
      title: '版权百科——' + this.data.pageName ? this.data.pageName:"榜单",
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})