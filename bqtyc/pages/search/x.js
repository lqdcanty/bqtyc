
var thePage;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: null,
    keyword:null,
    pageNum: 1,
    totalPage:1,
    opendStatus:false,
    lastPage:false,
    showIcon:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    wx.setNavigationBarTitle({
      title: '搜索结果'
    });
    console.log(options);
    this.setData({
      keyword: options.keywords,
      category: options.category,
      type: options.type,
      searchBarTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight 
    });
    this.searchFun(this.data.keyword)
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
  opendIt:function(){
    this.selectComponent('#id-card').onshow()
  },
  closeIt: function() {
    this.selectComponent('#id-card').onshow()
  },
  searchFun: function (keyword, pageNum){
    var  page=1;
    if (pageNum){
      page = pageNum;
    }
    let that = this;
    if (that.data.lastPage) {
      return;
    }
    app.doPost(
      '/search/work/list/keyword?keyword=' + keyword + "&category=" + that.data.category + "&type=" + that.data.type + "&timestamp=" + (new Date()).valueOf() + "&pageNumber=" + page + "&pageSize=10", null, null, function (result) {
        let showResult = that.data.result;
        let rs = result.result.searchResult;
        let pageNum = rs.currentPage;
        console.log(Math.ceil(result.result.total / 10))
        if (page==1){
          showResult = rs.items
        }else{
          let searchList = rs.items;
            for (var i = 0; i < searchList.length; i++) {
              showResult.push(searchList[i]);
            }
        }
        that.setData({
          result: showResult,
          totalPage: Math.ceil(rs.total/10),
          lastPage: Math.ceil(rs / 10) <= pageNum,
          pageNum: pageNum,
          keyword: keyword
        })
      },"get",function(){
        that.setData({
          nullStatus: true
        })
      })

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
    wx.navigateTo({
      url: "subject/x?keywords=" + event.currentTarget.dataset.word 
    })
  },
  searchSuggest: function () {
    let that = this;
    let type = "w";
    app.doPost("/search/suggest?keyword=" + that.data.keyword + '&type=' + type, null, null, function (rs) {
      that.setData({
        searchTipsList: rs.result.searchResult
      })
    }, "get");
  },

  query:function(){
    let that = this;
    console.log(that.data.keyword)
    if (that.data.keyword != '') {
      wx.navigateTo({
        url: "subject/x?keywords=" + that.data.keyword 
      })
      // that.searchFun(that.data.keyword)
    } else {
      console.log('wd name is null')
    }
  },
  showMore:function(e){
    let _index=e.currentTarget.dataset.index;
    console.log(this.data.result)
    this.data.result.searchList[_index].showLenght = this.data.result.searchList[_index].works.length;
    let newData = this.data.result;
    this.setData({
      result: newData
    })
    console.log(this.data.result)
  },
  addWork:function(){
    wx.navigateTo({
      url: '../work/add/x'
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  doOnload:function(){
    this.setData({
      nullStatus: false
    });
    this.searchFun(this.data.keyword)
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
    this.searchFun(this.data.keyword)
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    var pageNum =parseInt(this.data.pageNum) + 1
    this.searchFun(this.data.keyword,pageNum);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})