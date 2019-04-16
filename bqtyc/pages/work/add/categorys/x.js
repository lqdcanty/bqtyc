// pages/work/add/categorys/x.js
var app = getApp()
var thePage;
Page({
  data: {
    categorys: []
  },
  onLoad: function (options) {
    thePage = this;
    app.doPost("/work/type/categorys", null, "", thePage.categoryCallback, "get");
  },

  onReady: function () {
    this.setData({
      categorys: this.data.categorys
    })
  },
  onChange(event) {
    console.log(event.detail, 'click right menu callback data')
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  categoryCallback: function(rs){
    var j = 0;
    var categorys = rs.result.categorys;
    let storecategorys = new Array(categorys.length);
    const words = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    for (var i = 0; i < words.length;i++){
      var item = words[i];
      var result = thePage.isContinuePinyin(item, categorys);
      if (result == true){
        storecategorys[j] = {
          key: item,
          list: []
        }
        for (var k = 0; k < categorys.length; k++) {
          var category = categorys[k];
          let firstName = category.categoryPinyin.substring(0, 1);
          if (item == firstName){
            storecategorys[j].list.push({
              name: category.category,
              key: firstName
            });
          }
        }
        j++;
      }
    }
    
    this.data.categorys = storecategorys;
    this.setData({
      categorys: this.data.categorys,
    })
  }, 
  isContinuePinyin: function (word, categorys){
    for (var i = 0; i < categorys.length;i++){
      var item = categorys[i];
      let firstName = item.categoryPinyin.substring(0, 1);
      if (word == firstName) {
        return true;
      }
    }
    return false;
  },
  onTabsItemTap: function (event){
    var value = event._relatedInfo.anchorTargetText;
    var pages = getCurrentPages();
    var Page = pages[pages.length - 1];//当前页
    var prevPage = pages[pages.length - 2];//上一个页面
    prevPage.setData({ //设置数据
      category: value
    })
    wx.navigateBack({ changed: true });
  }

})