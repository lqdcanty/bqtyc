// pages/copyright/status/x.js
const app = getApp();
var thePage;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listArr: [],
    dynamics:[],
    listArrNo:false,
    work:null,
    powerType:'',
    showIcon: true,
    pageNumber:1,
    copyright_story:null,
    navTitle: "版权动态",
    showIcon: true,
    loading:true,
    fixedTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight + 5,
  },
  linkClick:function(res){
    var url = res.currentTarget.dataset.url, urlDec='';
    wx.navigateTo({
      url: "/components/webview/c?type=转发&title=" + thePage.data.workName + "(" + thePage.data.work.category+")"+"&url=" + app.urlDecode(url)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    thePage.setData({
      workName: options.name,
      workSeqNo:options.workSeqNo 
    })
 
    app.doPost('/work/details', { workSeqNo: options.workSeqNo }, null, function (data) {
      thePage.setData({
        work: data.result.workModel,
        powerType: data.result.powerType
      });
      thePage.getNews()
    }, 'get');  
  },
  getNews: function (page) {
    let _page = page ? page : 0;
    this.setData({
      newsPage: _page
    })
    let work=this.data.work;
    app.doCssPost("index", "copyright", "news", { work_seq_no: this.data.workSeqNo, word: work.name + ' ' + '版权' + ' ' + work.type, page: _page }, function (status, res) {
      thePage.copyrightNewsFn(res)
    });
  },
  copyrightNewsFn: function (rs) {
    var dynamics = rs.data.data;
    if (!dynamics || dynamics.length<1){
       thePage.setData({
         loadAll: true
      });
      return;
    } 
      dynamics.forEach(function (k1, k2) {
        k1.cover = k1.cover.indexOf('.baidu-img.cn/timg') != -1 ? '' : k1.cover
        let _url = 'https://p.banquanbaike.com.cn/http?link=' + encodeURIComponent(k1.avatar)
        k1.avatar = k1.cover.indexOf('p.banquanbaike.com.cn') != -1 ? encodeURIComponent(k1.avatar) : _url
        k1.images.forEach(function (j1, j2) {
          k1.images[j2] = encodeURIComponent(j1)
        })
      })
    let c = thePage.data.dynamics.concat(dynamics)
    thePage.setData({
      dynamics: c,
      loading: false
    });
    console.log(thePage.data.dynamics)
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
    thePage.getNews()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    thePage.setData({
      loading: true
    });
    let pageNow = thePage.data.newsPage + 1;
    thePage.getNews(pageNow)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
