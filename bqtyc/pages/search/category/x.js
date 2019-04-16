// pages/search/x.js
var thePage;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    category: "文字文学",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    app.pageRouteLog("category", "category", 'category', 'category', this.url)
    this.setData({
      category: options.category ? options.category : "",
      type: options.type,
      title: options.category + options.type,
      searchBarTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight
    });
    this.searchFun()
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

  searchFun: function (){
    let that = this;
    let url = "/search/work/type/home?category=" + that.data.category + '&type=' + that.data.type;
    app.doPost(
      url, null, null, function (result) {
        let data=result.result.item;
        that.setData({
          authorTotal: data.authorTotal,
          citiaoTotal: data.citiaoTotal,
          workTotal: data.workTotal,
          hotWorks: data.hotWorks,
          lastWorks: data.lastWorks
        })
        wx.stopPullDownRefresh();
      }, "get", function () {
        that.setData({
          nullStatus: true
        })
      })
  },
  inputBind: function (e) {
    this.setData({
      searchKeyWord: e.detail.value,
    });
    if (e.detail.value != '') {
      this.searchSuggest()
    } else {
      this.setData({
        searchTipsList: []
      });
    }
  },
  inputFocus: function (e) {
    this.setData({
      searchTipsList: []
    });
    if (e.detail.value != '') {
      this.searchSuggest()
    }
  },
  //搜索失去焦点
  inputBlur: function (e) {
    let that = this;
    setTimeout(function () {
      that.setData({
        searchTipsList: []
      });
      console.log('1111111')
    }, 500)
  },
  tipSearch: function (event) {
    this.setData({
      searchTipsList: [],
      searchKeyWord: event.currentTarget.dataset.word,
    });
    wx.navigateTo({
      url: "../subject/x?keywords=" + event.currentTarget.dataset.word
    })
  },
  query: function () {
    let that = this;
    console.log(that.data.keyword)
    if (that.data.keyword != '') {
      wx.navigateTo({
        url: "../subject/x?keywords=" + that.data.searchKeyWord
      })
      // that.searchFun(that.data.keyword)
    } else {
      console.log('wd name is null')
    }
  },
  searchSuggest: function () {
    let that = this;
    let type = "w";
    app.doPost("/search/suggest?keyword=" + that.data.searchKeyWord + '&type=' + type, null, null, function (rs) {
      that.setData({
        searchTipsList: rs.result.searchResult
      })
    }, "get");
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
    this.searchFun()
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
    app.pageShareLog("category", "category", 'category', 'category', this.url)
  }
})