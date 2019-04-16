const app = getApp()
var thePage;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    citiaoDetails : [],
    citiaoCode : "",
    showIcon: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    const citiaoCode = options.citiaoCode;
    thePage.data.citiaoCode = citiaoCode;
    thePage.setData({
      searchBarTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight
    });
    var params = { "code": citiaoCode};
    app.doPost("/citiao/query/detail", params, "", function (rs) {
      var datas = rs.result.datas;
      thePage.data.citiaoDetails = datas;
      let actions = [];
      datas.attachs.forEach(function (p1, p2) {
        let _index = p2 + 1;
        if (p1.fileType == 0) {
          actions.push({
            name: "[" + _index + "]" + '链接 ' + p1.smallFileName
          })
        }
        if (p1.fileType == 1) {
          actions.push({
            name: "[" + _index + "]" + '图片 ' + p1.smallFileName
          })
        }
        if (p1.fileType == 2) {
          actions.push({
            name: "[" + _index + "]" + '其他附件 ' + p1.smallFileName
          })
        }

      })
      thePage.setData({
        citiaoDetails: datas,
        actions: actions
      });
    }, "get");
    
  },
  handleOpen() {
    this.setData({
      actionsOpened: true
    });
  },
  handleCancel() {
    this.setData({
      actionsOpened: false
    });
  },
  handleAction: ({ detail }) => {
    console.log(detail);
    let _index = detail.index;
    console.log(thePage.data.citiaoDetails);
    let item = thePage.data.citiaoDetails.attachs[_index]
    if (item.fileType == 0) {
      wx.navigateTo({
        url: '../../../../components/webview/c?url=' + app.urlDecode(item.url) + '&title=' + item.fileName
      })
    } else if (item.fileType == 1) {
      wx.previewImage({
        current: item.url, // 当前显示图片的http链接
        urls: [item.url] // 需要预览的图片http链接列表
      })
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
    var citiaoCode = thePage.data.citiaoCode;
    var params = { "code": citiaoCode };
    app.doPost("/citiao/query/detail", params, "", function (rs) {
      var datas = rs.result.datas;
      thePage.data.citiaoDetails = datas;
      thePage.setData({
        citiaoDetails: datas
      });
    }, "get");
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
  clickUrl: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: "../../../../components/webview/c?url=" + encodeURIComponent(url)
    });
  },
})