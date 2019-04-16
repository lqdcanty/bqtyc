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
    pageSize:10,
    opendStatus: false,
    lastPage: false,
    worksList:null,
    keyword:'',
    flage:false,
    statusBarHeight:0,
    titleBarHeight:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    // wx.setNavigationBarTitle({
    //   title: '搜索结果'
    // });
    thePage.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      titleBarHeight: app.globalData.titleBarHeight
    })
    this.setData({
      keyword: options.keyword,
    });
    //this.searchFun(this.data.keyword)
    thePage.getData();
  },
//  pageNumber: thePage.data.pageNumber, pageSize: thePage.data.pageSize, keyword: ''
  getData:function(param){
    if (this.data.flage) {
      return;
    }
    //http://192.168.3.13/dci-pcweb/software/plist
    app.doPost('https://www.ry365.com.cn/software/plist', { pageNumber: thePage.data.pageNumber, pageSize: thePage.data.pageSize, keyword: thePage.data.keyword }, null, function (data) {
      console.log(data.result.list)
      var  worksList;
      if (thePage.data.worksList==null){
        worksList =data.result.list;
      }else{
        worksList = thePage.data.worksList.concat(data.result.list)
      }
      if (thePage.data.pageNumber == data.result.totalPage || thePage.data.pageNumber > data.result.totalPage){
        thePage.setData({
          worksList: worksList,
          totalPage: data.result.totalPage,
          flage: true
        });
      }else{
        thePage.setData({
          worksList: worksList,
          totalPage: data.result.totalPage,
          flage: false
        });
      }

    }, 'get', function () {
      thePage.setData({
        nullStatus: true
      })
    });
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
    this.setData({
      searchValue: e.detail.value,
    });
  },

  query: function () {
    let that = this;
    if (that.data.searchValue != '') {
      that.setData({
        keyword: that.data.searchValue,
        pageNumber:1,
        flage: false,
        worksList:[]
      });
      thePage.getData();
    } else {
      console.log('wd name is null')
    }
  },
  addWork: function () {
    wx.navigateTo({
      url: '../work/add/x'
    })
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
   // this.searchFun(this.data.keyword)
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
   // pageNumber: thePage.data.pageNumber, pageSize: thePage.data.pageSize, keyword: thePage.data.keyword
    if (thePage.data.pageNumber < thePage.data.totalPage){
      var pageNumber = parseInt(thePage.data.pageNumber) + 1
      thePage.setData({
        pageNumber: pageNumber,
      })
      console.log(pageNumber, "pageNumber")
      thePage.getData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  
})