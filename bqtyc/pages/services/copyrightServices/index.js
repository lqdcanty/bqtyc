// pages/services/copyrightServices/index.js
//获取应用的实例
var thePage;
var start_clientX;
var refreshStatus = false;
var end_clientX;
var start_clientY;
var end_clientY;
var common_bcode;
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showIcon: false,
    pageNumber: 1,
    pageSize: 10,
    lastPage: false,
    dynamics: [],
    tabIndex: 0,
    loadAll: false,
    searchValue: "",
    word: '软件著作权',
    page: 1,
    scrollTop: 0,
    keyword: '',
    bimg: null,
    bcode: null,
    btitle: null,
    bname: null,
    introduce: null,
    copyrightServices: [],
    softwareList: [],
    duration: 1000,
    interval: 5000,
    autoplay: true,
    vertical: true,
    finallycode:'software',
    ifShare:'N',
    swiperMessage: [
      { name: '网**刚刚申请了120件软件著作权登记' },
      { name: '网** 刚刚申请了120件软件著作权登记2' },
      { name: '网** 刚刚申请了120件软件著作权登记3' },
    ],
    tabs: [{
      index: 0,
      name: '热门动态',
    }, {
      index: 1,
      name: '软著版权',
    }, {
      index: 2,
      name: '版权纠纷',
    }, {
      index: 3,
      name: '游戏版权',
    }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("获取的options", options.bcode)
    common_bcode = options.bcode
    thePage = this;
    if (options.share_query) {
      thePage.setData({
        ifShare: 'Y'
      })
    }else{
      thePage.setData({
        ifShare: 'N'
      })
    }
    if (options.bcode =='software'){
      thePage.setData({
        word: '软件著作权'
      })
    } else if (options.bcode =='gamecoderegister'){
      thePage.setData({
        word: '游戏 版号'
      })
    }else{

    }
    thePage.setData({
      finallycode:common_bcode
    })
    app.doCssPost("index", "index", "servicesload", new Object(), function (status, res) {
      function sortNumber(a, b) {
        return a.sort - b.sort
      }
      app.globalData.bqservices = res.data.result.sort(sortNumber);
      thePage.setData({ copyrightServices: res.data.result.sort(sortNumber) });// sort
    });
    app.doCssPost("index", "customer", "query", {}, function (status, res) {
      if (status) {
        thePage.setData({
          softwareList: res.data.result.customer
        })
        console.log("获取的客户信息的res", res)
      } else {
        console.log('网络连接失败')
      }
    });
    app.doCssPost("index", "software", "message", {}, function (status, res) {
      console.log(res.data)
      if (status) {
        thePage.setData({
          //softwareList:res.data.result.customer
          swiperMessage: res.data.sorfwares
        })
      } else {
        console.log('网络连接失败')
      }
    });
    this.getNewDatas()
  },
  onPageScroll: function (e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  // 显示TOP-BAR
  showTopbar: function (e) {
    this.setData({
      translateY: ''
    });

  },
  // 隐藏Topbar
  hideTopbar: function (e) {
    let h = app.globalData.statusBarHeight + app.globalData.titleBarHeight - 75
    this.setData({
      translateY: 'position:fixed;top:' + h + 'px;left:0;right:0'
    });

  },
  touchstart: function (e) {
    start_clientX = e.changedTouches[0].clientX;
    start_clientY = e.changedTouches[0].clientY;
  },
  // 滑动结束
  touchend: function (e) {
    end_clientX = e.changedTouches[0].clientX;
    end_clientY = e.changedTouches[0].clientY;
    var offsetX = end_clientX - start_clientX;
    var offsetY = end_clientY - start_clientY;
    // if (offsetX > 64) {
    //   thePage.showNavigate(offsetX);
    // }
    // else if (offsetX < -64) {
    //   thePage.showUserbar(offsetX);
    // }

    if (offsetY < -100) {
      thePage.hideTopbar();
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
  reload() {
    this.onPullDownRefresh()
  },
  switchNavigate: function (e) {
    console.log(e.currentTarget)
    if (this.data.tabIndex == -1) {
      return;
    }
    let index = e.currentTarget.dataset.current;
    let word = e.currentTarget.dataset.name;
    this.setData({
      tabIndex: index,
      word: word,
      page: 1,
    });
    this.getNewDatas()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('上拉刷新')
    thePage = this
    refreshStatus = true;
    app.doCssPost("index", "copyright", "news", { word: thePage.data.word, page: 1 }, function (status, res) {
      if (status) {
        thePage.copyrightNewsFn(res)
      } else {
        console.log('网络连接失败')
      }
    });
    // thePage.setData({
    //   loadAll: true
    // });
    wx.stopPullDownRefresh();
  },
  copyrightNewsFn: function (rs) {
    var dynamics = rs.data.data;
    if (!dynamics || dynamics.length < 1) {
      thePage.setData({
        loadAll: true
      });
      return;
    }
    dynamics.forEach(function (k1, k2) {
      k1.cover = k1.cover.indexOf('.baidu-img.cn/timg') != -1 ? '' : k1.cover
      if (k1.avatar != '') {
        let _url = 'https://p.banquanbaike.com.cn/http?link=' + encodeURIComponent(k1.avatar)
        k1.avatar = k1.cover.indexOf('p.banquanbaike.com.cn') != -1 ? encodeURIComponent(k1.avatar) : _url
      }
      if (k1.plateform == '版权百科' || k1.plateform == '版权家') {
        k1.type = "原创"
      }
      k1.images.forEach(function (j1, j2) {
        k1.images[j2] = encodeURIComponent(j1)
      })
    })
    let c = thePage.data.dynamics.concat(dynamics)
    thePage.setData({
      dynamics: c,
      loading: false
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onReachBottom: function () {
    console.log('下拉加载')
    thePage = this
    refreshStatus = true;
    thePage.data.page = thePage.data.page + 1
    app.doCssPost("index", "copyright", "news", { word: thePage.data.word, page: thePage.data.page }, function (status, res) {
      if (status) {
        thePage.copyrightNewsFn(res)
      } else {
        console.log('网络连接失败')
      }
    });
    wx.stopPullDownRefresh();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    if(common_bcode == 'software') {
      return {
        title: "最快速的软件著作权登记",
        desc: '软著办理',
        path: '/pages/services/copyrightServices/index?bcode=software&share_query=software'
      }
    }else if(common_bcode == 'gamecoderegister') {
      return {
        title: "游戏出版【版号】办理",
        desc:'游戏版号',
        path: '/pages/services/copyrightServices/index?bcode=gamecoderegister&share_query=gamecoderegister'
      }
    }else{
      return {
        title: "软件版权服务",
        desc: ''
      }
    }
  },
  getNewDatas: function (page) {
    thePage = this
    let _page = page ? page : 1;
    thePage.setData({
      page: _page
    })
    app.doCssPost("index", "copyright", "news", { word: thePage.data.word, page: _page }, function (status, res) {
      if (status) {
        thePage.copyrightNewsFn(res)
      } else {
        console.log('网络连接失败')
      }
    });
  },
  inputBind: function (e) {
    thePage.setData({
      searchValue: e.detail.value,
    });
  },
  query: function () {
    if (thePage.data.searchValue != '') {
      thePage.setData({
        keyword: thePage.data.searchValue,
      });
      if (common_bcode =='software'){
        wx.navigateTo({
          url: '../ruanzhuserach/result/x?keyword=' + thePage.data.keyword
        })
      } else if (common_bcode =='gamecoderegister'){
        wx.navigateTo({
          url: '../gamecodeserach/result/x?keyword=' + thePage.data.keyword
        })
      }else{

      }
    }
  },
  opendIt: function () {
    this.selectComponent('#id-card').onshow()
  },
  closeIt: function () {
    this.selectComponent('#id-card').onshow()
  },
  doOnload: function () {
    this.setData({
      nullStatus: false
    });
    this.getData();
  },
  gameNumber: function (event) {
    console.log(event.currentTarget.dataset)
    console.log('获取的参数', thePage.data.copyrightServices)
    thePage.data.copyrightServices.forEach((item, index) => {
      if (item.name == event.currentTarget.dataset.game) {
        wx.navigateTo({ url: '../copyrightbusiness/servicecontent/x?bcode=' + item.code + "&bview=" + item.bimg + "&btitle=" + item.title + "&bname=" + item.name + "&introduce=" + item.introduce, })
      }
    })
    // wx.navigateTo({
    //   url: '../../copyrightbusiness/x?bcode=' + thePage.data.bcode + '&bname=' + thePage.data.bname + '&btitle=' + thePage.data.btitle + "&introduce=" + thePage.data.introduce,
    // })
  },
  softNumber: function (event) {
    thePage.data.copyrightServices.forEach((item, index) => {
      if (item.name == event.currentTarget.dataset.number) {
        wx.navigateTo({ url: '../copyrightbusiness/servicecontent/x?bcode=' + item.code + "&bview=" + item.bimg + "&btitle=" + item.title + "&bname=" + item.name + "&introduce=" + item.introduce, })
      }
    })
  },
  watchThisSpace: function (event) {
    wx.navigateTo({ url: '../../welcome/x' })
  },
  callhome:function(){
    if (thePage.data.ifShare == 'Y'){
      wx.navigateTo({
        url: '../../index/x?bottombar_position=services'
      })
      return;
    }
    wx.navigateBack({
      delta: 1,
      fail(e) {
        console.log(e)
        wx.navigateTo({
          url: '../../index/x?bottombar_position=services'
        })
      }
    })
  },
})