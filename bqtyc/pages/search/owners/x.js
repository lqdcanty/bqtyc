// pages/search/x.js
var demo_search_result = {
};
var thePage;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    pageNumber:1,
    logined: false
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    console.log(options);
    app.pageRouteLog("searchOwners", "searchOwners", 'searchOwners', 'search/owners', this.url)
    this.setData({
      searchBarTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight
    });
    if (options.keywords) {
      this.setData({
        keyword: options.keywords,
        searchBarTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight
      });
      this.searchFun(options.keywords, null)
    }
    else if (options.type) {
      console.log(options.type)
   
      this.setData({
        keyword: options.type,
        category: options.category,
        searchBarTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight
      });
      this.searchFun(null, options.type)
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

  searchFun: function (keyword, type) {
    let that = this;
    let url;
    if (type){
      url = "/obligee/category/list?category=" + that.data.category + '&type=' + type;
      app.doPost(
        url, null, null, function (result) {
          that.setData({
            result: result.result.obligee,
            logined:true
          });
        }, "get", function () {
          that.setData({
            nullStatus: true
          })
        })
    } else if (keyword){
      url = "/obligee/search/keyword?keyword=" + keyword + '&pageSize=10' + "&pageNumber=" + that.data.pageNumber;
      app.doPost(
        url, null, null, function (result) {
          let data = result.result.obligee
          that.setData({
            ownerList: data.obligee,
            logined: true
          });
        }, "get", function () {
          that.setData({
            nullStatus: true
          })
        })
    }
    wx.stopPullDownRefresh();
  },
  inputBind: function (e) {
    this.setData({
      keyword: e.detail.value,
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
    }, 500)
  },
  tipSearch: function (event) {
    this.setData({
      searchTipsList: [],
      keyword: event.currentTarget.dataset.word,
    });
    this.searchFun(event.currentTarget.dataset.word,null)
  },
  searchSuggest: function () {
    let that = this;
    let type = "o";
    app.doPost("/search/suggest?keyword=" + that.data.keyword + '&type=' + type, null, null, function (rs) {
      that.setData({
        searchTipsList: rs.result.searchResult
      })
    }, "get");
  },
  query: function () {
    let that = this;
    if (that.data.keyword != '') {
      that.searchFun(that.data.keyword,null)
    } else {
      console.log('wd name is null')
    }
  },
  showMore: function (e) {
    let _index = e.currentTarget.dataset.index;
    console.log(this.data.result)
    this.data.result.searchList[_index].showLenght = this.data.result.searchList[_index].works.length;
    let newData = this.data.result;
    this.setData({
      result: newData
    })
  },
  onPullDownRefresh: function () {
    this.searchFun(that.data.keyword, null)
  },
  onShareAppMessage: function (res) {
    app.pageShareLog("searchOwners", "searchOwners", 'searchOwners', 'search/owners', this.url)
    return {
      title: (this.data.navTitle + "@" + this.data.searchKeyWord)
    }
  }
})