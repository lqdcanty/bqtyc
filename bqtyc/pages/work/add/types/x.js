// pages/work/add/types/x.js
var app = getApp();
var thePage;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types:[],
    origins:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    var category = options.category;
    var params = { "category": category};
    app.doPost("/work/type/query", params, "", thePage.typeCallback, "get");
    this.setData({
      types: this.data.types
    })
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
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

  },
  typeCallback: function(rs){
    var j = 0;
    var types = rs.result.types;
    let storeTypes = new Array(types.length);
    const words = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    for (var i = 0; i < words.length; i++) {
      var item = words[i];
      var result = thePage.isContinuePinyin(item, types);
      if (result == true) {
        storeTypes[j] = {
          key: item,
          list: []
        }
        for (var k = 0; k < types.length; k++) {
          var type = types[k];
          let firstName = type.typePinyin.substring(0, 1);
          if (item == firstName) {
            storeTypes[j].list.push({
              name: type.type,
              key: firstName
            });
          }
        }
        j++;
      }
    }
    this.data.types = storeTypes;
    this.setData({
      types: this.data.types,
    })
  },
  isContinuePinyin: function (word, types) {
    for (var i = 0; i < types.length; i++) {
      var item = types[i];
      let firstName = item.typePinyin.substring(0, 1);
      if (word == firstName) {
        return true;
      }
    }
    return false;
  },
  onTabsItemTap: function (event) {
    var value = event._relatedInfo.anchorTargetText;
    var params = { "type": value };
    app.doPost("/work/query/origin", params, "", thePage.originCallback, "get");
    var pages = getCurrentPages();
    var Page = pages[pages.length - 1];//当前页
    var prevPage = pages[pages.length - 2];//上一个页面
    prevPage.setData({ //设置数据
      type: value,
    })
  },
  originCallback: function(rs){
    if (rs.resultCode=='200'){
      var origins = rs.result.origins;
      for(var i=0;i<origins.length;i++){
        var origin = {
          title: origins[i].name, 
          name: "", 
          remark: origins[i].remark
        }
        thePage.data.origins.push(origin);
      }
      var pages = getCurrentPages();
      var Page = pages[pages.length - 1];//当前页
      var prevPage = pages[pages.length - 2];//上一个页面
      prevPage.setData({ //设置数据
        origins: thePage.data.origins
      })
      wx.navigateBack({ changed: true });
    } else {
      wx.hideToast();
      wx.showModal({
        title: '错误提示',
        content: '原始权利人获取失败',
        showCancel: false,
        success: function (res) { }
      })
    }
  } 
})