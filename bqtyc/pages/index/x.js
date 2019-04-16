//index.jswork/add
const { $Message } = require('../../dist/base/index');

const goto = "";
//获取应用实例
const app = getApp();
var start_clientX;
var refreshStatus = false;
var end_clientX;
var start_clientY;
var end_clientY;
var obj = wx.getSystemInfoSync();
var workHeight = obj.windowHeight;
var workWidth = obj.windowWidth;
//var authIsShow = true;
var thePage;
var _headerHeight = app.globalData.statusBarHeight - app.globalData.titleBarHeight;
Page({
  data: {
    rank_contribute: 'rank_contribuite_people',
    errorNetwork: false,
    showIcon: false,
    bqlStatus: false,
    newsLast: false,
    bottombar_position: 'baike',
    dynamics: [],
    loadAll:false,
    loading: true,
    duration: 1000,
    interval: 5000,
    autoplay: true,
    top_bar_position: -320,
    windowWidth: workWidth,
    headerHeight: _headerHeight,
    display_userbar_tag: "block",
    display_navigate_tag: "block",
    userbarZindex: 0,
    navigateZindex: 0,
    hotWords: "",
    searchTipsList: [],
    tabIndx: 0,
    navTitle: "",
    authIsShow: true,
    userInfo: null,
    rankNumber: 0,
    scoreCount: "0",
    editCount: "0",
    auditCount: "0",
    shareCount: "0",
    sysTitle: "",
    searchOption: "searchCopyright",
    searchTips: "请输入版权的关键词，例如权利的游戏",
    tabIndx: 0,
    myTotal: 0,
    firstbanner:[],
    hotCopyrights:[],
    hotTotal:'',
    pageNumber:1,
    pageSize:6,
    tabs: [{
      indx: 0,
      name: "首页",
    }, {
      indx: 1,
      name: "版权",
    }, {
      indx: 2,
      name: "版权人",
    }, {
      indx: 3,
      name: "榜单",
    }, {
      indx: 4,
      name: "版权力",
    },
    ],
    copyrightServices: [],
    rankings: [
      {
        name: "综合排行榜",
        data: [
          {
            cols: [
              {
                name: "热搜版权",
                icon: "http://fdfs.banquanjia.com.cn/group2/M02/0A/4A/CgoKDFw-rFiAf_-OAAAFst1aqks571.png",
                url: "ranking/x?chartType=1&name=热搜版权"
              },
              {
                name: "推荐版权",
                icon: "http://fdfs.banquanjia.com.cn/group2/M01/0A/4A/CgoKDFw-rFaARPN_AAALZ-xtyNI877.png",
                url: "ranking/x?chartType=2&name=推荐版权"
              },
              {
                name: "最新收录",
                icon: "http://fdfs.banquanjia.com.cn/group2/M01/0A/7B/CgoKC1w-rHmAQPUdAAAL6yR5jQU577.png",
                url: "ranking/x?chartType=3&name=最新收录"
              }
            ]
          },
          {
            cols: [
              {
                name: "侵权举报",
                icon: "http://fdfs.banquanjia.com.cn/group2/M00/0B/84/CgoKDVxAJCqAMrueAAALMsxdn4c189.png",
                url: "ranking/x?type=电影&chartType=4&name=侵权举报"
              },
              {
                name: "登记排行榜",
                icon: "http://fdfs.banquanjia.com.cn/group2/M00/0B/B9/CgoKC1xAJE-ABpftAAAIgVEAznM556.png",
                url: "ranking/x?type=电影&chartType=5&name=登记排行榜"
              },
            ]
          },
        ]

      },
      {
        name: "影视相关榜单",
        indx: 0,
        data: [
          {
            cols: [
              {
                name: "上映电影票房",
                icon: "http://fdfs.banquanjia.com.cn/group2/M00/0A/7B/CgoKC1w-rHeACYKyAAAGXwaLRiQ620.png",
                url: "ranking/x?type=电影&chartType=6&name=上映电影票房"
              },
              {
                name: "2018年票房榜",
                icon: "http://fdfs.banquanjia.com.cn/group2/M00/0A/4A/CgoKDFw-rFSASH2yAAAKHRlsfNA713.png",
                url: "ranking/x?type=电影&chartType=7&name=2018年票房榜"
              },
              {
                name: "5年票房榜",
                icon: "http://fdfs.banquanjia.com.cn/group2/M00/0A/46/CgoKDVw-rFWAX_KCAAAITJ_mXPg099.png",
                url: "ranking/x?type=电影&chartType=8&name=5年票房榜"
              },
            ]
          },
          {
            cols: [
              {
                name: "18年国产票房",
                icon: "http://fdfs.banquanjia.com.cn/group2/M02/0A/46/CgoKDVw-rFSAdhMOAAAFhCNPx6g893.png",
                url: "ranking/x?type=电影&chartType=9&name=18年国产票房"
              },
              {
                name: "18年引进票房",
                icon: "http://fdfs.banquanjia.com.cn/group2/M01/0A/7B/CgoKC1w-rHaAYwiDAAAG8gaSezw687.png",
                url: "ranking/x?type=电影&chartType=10&name=18年引进票房"
              },
              {
                name: "备案摄制电影",
                icon: "http://fdfs.banquanjia.com.cn/group2/M00/0A/4A/CgoKDFw-rFWABo1qAAAK8cfNUFQ828.png",
                url: "ranking/x?type=电影&chartType=15&name=备案摄制电影"
              },
            ]
          },
          {
            cols: [
              {
                name: "备案摄制电视",
                icon: "http://fdfs.banquanjia.com.cn/group2/M00/0A/46/CgoKDVw-rFaAfNXLAAALOaXPJHc267.png",
                url: "ranking/x?type=电视剧&chartType=16&name=备案摄制电视"
              },
              {
                name: "已发行电视",
                icon: "http://fdfs.banquanjia.com.cn/group2/M01/0A/7B/CgoKC1w-rHiAJOBNAAAGYtYZ2DE361.png",
                url: "ranking/x?type=电视剧&chartType=17&name=已发行电视"
              },
            ]
          }
        ]
      },
      {
        name: "文字相关",
        data: [
          {
            cols: [
              {
                name: "最新出版图书",
                icon: "http://fdfs.banquanjia.com.cn/group2/M02/0A/4A/CgoKDFw-rFeADd5iAAAKaCmZx2E388.png",
                url: "ranking/x?type=小说&chartType=18&name=最新出版图书"
              },
              {
                name: "最新出版小说",
                icon: "http://fdfs.banquanjia.com.cn/group2/M02/0A/46/CgoKDVw-rFeAcEfnAAAHyRgiKq0899.png",
                url: "ranking/x?type=小说&chartType=19&name=最新出版小说"
              },
              {
                name: "翻印最多图书",
                icon: "http://fdfs.banquanjia.com.cn/group2/M02/0A/7B/CgoKC1w-rHuAatp_AAAHW6lv-cY413.png",
                url: "ranking/x?type=小说&chartType=20&name=翻印最多图书"
              },
            ]
          },
        ]
      }
    ],
    userDashboard: {
      character: {
        sharer: "disabled",
        editor: "disabled",
        auditor: "disabled",
      }
    },//用户登录后的用户dashboard数据
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  handleRankContributeChange({ detail }) {
    let data = app.globalData.the_copyriht_power;
    if (detail.key == "rank_contribuite_org") {
      data = null;
    }
    this.setData({
      rank_contribute: detail.key,
      the_copyriht_power: data,
    });
  },
  handleBottomBarChange({ detail }) {
    var op = detail.key;
    if (op == 'mine'){
      thePage.login(thePage);
    }
    this.setData({
      bottombar_position: detail.key,
      navTitle: detail.key == "services"?'版权服务':""
    });
  },
  loadError: function () {
    this.setData({
      errorNetwork: true
    })
  },
  reload() {
    this.onPullDownRefresh()
  },
  stopPageScroll() {
    return
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  optendIt: function () {
    this.selectComponent('#i-grid').onshow()
  },
  handleClick: function () {
    wx.navigateTo({
      url: "../user/x"
    });
  },
  onLoad: function (options) {
    thePage = this;
    console.log(app)
    wx.getSetting({
      success: setRes => {
        var t = setRes.authSetting['scope.userInfo'];
        if (t == 'undefined ' || t == null) {
          thePage.setData({
            authIsShow: false
          });
        } else {
          thePage.login(thePage)
        }
      }
    });

    if (options.bottombar_position){
      thePage.setData({
        bottombar_position: options.bottombar_position
      });
    }else{
      thePage.setData({
        bottombar_position:'baike'
      });
    }

    if (options.shareId) {
      wx.navigateTo({
        url: '../shareWeb/x?url=' + options.url + '&title=' + options.title + "&type=" + options.type
      })
    }
    // 获取首页轮播图的接口
    app.doCssPost("index", "xcx", "bannerload", new Object(), function (status, res) {
      thePage.setData({
        firstbanner: res.data.result.customer
      })
    });

    app.doCssPost("index", "index", "servicesload", new Object(), function (status, res) {
      function sortNumber(a, b) {
        return a.sort - b.sort
      }
      app.globalData.bqservices = res.data.result.sort(sortNumber);
      thePage.setData({ copyrightServices: res.data.result.sort(sortNumber) });// sort
    });
    app.pageRouteLog("index", "index", 'index', 'index', this.route, app)
    var the_dynamics = app.globalData.the_dynamics;
    var the_search_rank = app.globalData.the_search_rank;
    var the_copyriht_power = app.globalData.the_copyriht_power;
    var copyriht_power = app.globalData.copyriht_power;
    thePage.httpRequest("/index/work/hot", { pageNumber: '1', pageSize:'6'}, thePage.hotWorkcallback, "post", function () {
      thePage.loadError();
    });
    app.doPost("/index/work/categorys", null, null, thePage.categoryCallback, "get");


    if (the_search_rank.length <= 0) {
      app.doPost("/index/work/recommends", null, null, thePage.searchRankCallback, "get");
    }
    if (the_copyriht_power.length <= 0) {
      app.doPost("/bql/api/count", null, null, thePage.copyrihtPowerCallback, "get");
    }
    app.doPost("/obligee/home/category", null, null, thePage.categoryObligeeCallback, "get");

    //查询版权人
    app.doPost("/obligee/home/obligee", null, null, thePage.obligeeCallback, "get");
    thePage.setData({
      sysTitle: app.globalData.sysTitle,
      version: app.versionNum,
      windowHeight: workHeight - app.globalData.statusBarHeight - app.globalData.titleBarHeight - 120,
      sysLogo: app.globalData.sysLogo,
      myTotal: app.globalData.userInfoauditCount ? app.globalData.userInfoauditCount : '',
      isIpx: app.globalData.isIpx ? true : false
    });
    // if (app.globalData.userInfo) {
    //    thePage.getCount();
    //   thePage.setData({ userInfo: app.globalData.userInfo})
    // }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  linkClick: function (res) {
    if (res.currentTarget.dataset.url == '') {
      return
    }
    wx.navigateTo({
      url: "/components/webview/c?url=" + app.base64encode(app.utf16to8(res.currentTarget.dataset.url)) + '&title=' + res.currentTarget.dataset.title + '&type=' + res.currentTarget.dataset.type
    })
  },
  onReady: function () {
    thePage.setData({
      cooperativers: thePage.buildGridShowData(demo_cooperativers, 3)
    });
  },
  buildGridShowData: function (data, size) {
    let rows = [];
    let cols;
    for (var i = 0; i < data.length; i++) {
      if (Math.floor(i % size) == 0) {
        cols = [];
        rows.push({ indx: i, cols: cols });
      }
      cols.push(data[i]);
    }
    return rows;
  },
  getScopeUserInfo: function () {
    wx.getSetting({
      success: setRes => {
        return setRes.authSetting['scope.userInfo'];
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log()
  },
  search: function () {
    wx.navigateTo({
      url: '../search/x'
    });
  },
  switchNavigate: function (e) {
    if (this.data.tabIndx == -1) {
      return;
    }
    let indx = e.currentTarget.dataset.current;
    this.setData({
      tabIndx: indx,
    });
  },
  upper(e) {

  },
  lower(e) {

  },
  scroll(e) {

  },
  /**
   * 
   */
  onPullDownRefresh: function () {
    refreshStatus = true;
    app.doPost("/index/work/categorys", null, null, thePage.categoryCallback, "get");
    thePage.httpRequest("/index/work/hot", { pageNumber:'1',pageSize:'6'}, thePage.hotWorkcallback, "post", function () {
      thePage.loadError();
    });
    var params = { "pageNumber": 1, "pageSize": 100 };
    app.doPost("/dynamic/query", params, null, thePage.queryDynamicCallback, "get");
    app.doPost("/index/work/recommends", null, null, thePage.searchRankCallbakc, "get");
    app.doPost("/bql/api/count", null, null, thePage.copyrihtPowerCallback, "get");
    app.doPost("/obligee/home/obligee", null, null, thePage.obligeeCallback, "get");
    app.doPost("/obligee/home/category", null, null, thePage.categoryObligeeCallback, "get");
    app.doCssPost("index", "index", "servicesload", new Object(), function (status, res) {
      function sortNumber(a, b) {
        return a.sort - b.sort
      }
      thePage.setData({ copyrightServices: res.data.result.sort(sortNumber) });// sort
    });
    if (!app.globalData.userInfo) {
      thePage.login()
    }
    wx.stopPullDownRefresh();
  },
  onPageScroll: function (e) {
    if (e.scrollTop > 74 && !this.data.translateY) {
      thePage.hideTopbar(e);
    } else if (e.scrollTop < 75 && this.data.translateY != ""){
      thePage.showTopbar(e);
    }
  },
  // 显示TOP-BAR
  showTopbar: function (e) {
    this.setData({
      translateY: '',
      navTitle: ""
    });

  },
  // 隐藏Topbar
  hideTopbar: function (e) {
    let h = app.globalData.statusBarHeight + app.globalData.titleBarHeight - 75
    this.setData({
      translateY: 'position:fixed;top:' + h + 'px',
      navTitle: "版权百科"
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
    if (offsetX > 64) {
      thePage.showNavigate(offsetX);
    }
    else if (offsetX < -64) {
      thePage.showUserbar(offsetX);
    }

    if (offsetY < -100) {
      thePage.hideTopbar();
    }
  },
  getCount: function () {
    if (app.globalData.userInfo && !this.data.userDashboard.bql_size) {
      var token = app.globalData.userInfo.authToken;
      thePage.setData({
        bqlStatus: false
      })
      thePage.httpRequest(
        '/auth/count?token=' + token, null, function (result) {
          var data = result;
          var userInfo = data.result.userInfo;
          if (data.resultCode == '200') {
            thePage.setData({
              userDashboard: {
                bql_size: userInfo.coyrightPower,
                recentPower: userInfo.recentPower,
                totalPower: userInfo.totalPower,
                exchange: userInfo.exchange,
                count_edit: userInfo.editCountStr,
                count_audit: userInfo.auditCountStr,
                count_share: userInfo.shareCountStr,
                count_browse: userInfo.browseCountStr ? userInfo.browseCountStr : 0,
                wait_audit: userInfo.waitAuditStr,
                character: {
                  sharer: userInfo.share ? "blue" : "disabled",
                  editor: userInfo.editor ? "blue" : "disabled",
                  auditor: userInfo.audit ? "blue" : "disabled",
                },
              },
            });
            app.globalData.userDashboard = thePage.data.userDashboard;
          } else {
            thePage.setData({
              bqlStatus: true
            })
          }
        }, 'get', function () {
          thePage.setData({
            bqlStatus: true
          })
        });
    }
  },
  // 显示用户导航
  showUserbar: function (offsetX) {
    if (this.data.navigateZindex == 0) {
      this.setData({
        navigateZindex: 0,
        userbarZindex: 1,
        mask_display_userbar: "mask_display_userbar",
        mask_display_navigate: "",
        display_userbar_tag: "none",
        display_navigate_tag: "none",
        f
      });
    }
    else {
      thePage.hideNavigate(offsetX);
    }
  },
  // 显示功能导航
  showNavigate: function (offsetX) {
    if (this.data.userbarZindex == 0) {
      this.setData({
        userbarZindex: 0,
        navigateZindex: 1,
        mask_display_userbar: "",
        mask_display_navigate: "mask_display_navigate",
        display_userbar_tag: "none",
        display_navigate_tag: "none",
        translateX: 'transform: translateX(' + this.data.windowWidth * 0.7 + 'px);'
      });
    }
    else {
      thePage.hideNavigate(offsetX);
    }
  },
  httpRequest(url, para, callback, method, callbackerror) {
    wx.request({
      url: 'https://t.banquanbaike.com.cn' + url,
      data: para,
      method: method != null ? method : "GET",
      dataType: "json",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'appid': "wx7d1808b88bcec345"
      },
      success: function (res) {
        res = res.data;
        callback(res);
      },
      fail: function () {
        wx.hideLoading();
        if (callbackerror) {
          callbackerror()
        } else {
          wx.showToast({
            icon: "none",
            title: '网络连接错误'
          })
        }
      },
      complete: function (res) {
        if (res.errMsg == "request:fail ") {
          if (callbackerror) {
            callbackerror()
          }
        }
      }
    })
  },
  // 遮拦
  hideNavigate: function (offsetX) {
    if (this.data.navigateZindex != 0 ||
      this.data.userbarZindex != 0) {
      if (offsetX) {
      }
      this.setData({
        navigateZindex: 0,
        userbarZindex: 0,
        mask_display_userbar: "",
        mask_display_navigate: "",
        display_userbar_tag: "block",
        display_navigate_tag: "block",
        translateX: '',
      });
    }
  },
  /**
   * 用户点击登录，初始化用户数据
   */
  // 登录代码
  login: function (that) {
    wx.login({
      success: res => {
        //用户授权核心代码

        wx.getUserInfo({
          success: userRes => {
            app.doPost(
              '/auth/xcx/new', {
                code: res.code,
                encryptedData: userRes.encryptedData,
                iv: userRes.iv
              }, null, function (result) {
                var data = result;
                var userInfo = data.result.userInfo
                app.globalData.userInfo = userInfo;
                if (data.resultCode == '200') {
                  wx.setStorageSync("userInfo", data.result.userInfo);
                  var userInfo = data.result.userInfo;
                  app.globalData.userInfo = userInfo;
                  app.globalData.cookie = userInfo.authToken;
                  thePage.setData({
                    userInfo: userInfo,
                    myTotal: userInfo.myTotal
                  });
                  thePage.getNews()
                  thePage.getCount()
                }
              }, "post")
          }, fail: function () {

          }, complete: function () {

          }
        })
      }
    })
  },
  query: function (res) {

  },
  onauthorizeEvent: function (e) {
    this.setData({
      authIsShow: e.detail == 1 ? true : false
    });
    this.login(this);
  },
  queryAuditor: function () {  //审核中申请查询
    var token = app.globalData.userInfo.authToken;
    let h = app.globalData.statusBarHeight + app.globalData.titleBarHeight
    thePage.setData({
      messageHeight: h
    })
    app.doPost(
      '/apply/queryAuditor?token=' + token, null, null, function (data) {
        if (data.resultCode == '200') {
          if (data.result.status == 3) {  //没有申请
            wx.navigateTo({
              url: '../imauditor/x'
            });
          } else if (data.result.status == 0) {  //申请待审核
            wx.navigateTo({
              url: '../copyright/complete/x?word=版权审核者申请成功&index=0'
            });
          } else if (data.result.status == 1) {  //申请通过
            $Message({
              content: '恭喜你，你已经是审核者，无需再申请！',
              type: 'success'
            });
          } else if (data.result.status == 2) { //申请失败
            wx.navigateTo({
              url: '../imauditor/x?status=' + data.result.status + '&id=' + data.result.datas.id
            });
          }
        }
      }, 'get');
  },
  queryEditor: function () {  //编辑者申请
    var token = app.globalData.userInfo.authToken;
    let h = app.globalData.statusBarHeight + app.globalData.titleBarHeight
    thePage.setData({
      messageHeight: h
    })
    // wx.navigateTo({
    //   url: '../redactor/x'
    // });
    app.doPost(
      '/apply/queryEditor?token=' + token, null, null, function (data) {
        if (data.resultCode == '200') {
          if (data.result.status == 0) {  //没有申请
            wx.navigateTo({
              url: '../redactor/x'
            });
          } else if (data.result.status == 1) {  //申请通过
            $Message({
              content: '恭喜你，你已经是编辑者，无需再申请！',
              type: 'success'
            });
          }
        }
      }, 'get');
  },
  queryRegister: function () {
    let token = app.globalData.userInfo.authToken;
    app.doPost(
      '/register/realNameStatus?token=' + token, null, null, function (data) {
        if (data.resultCode == '200') {
          if (data.result.status == 3) {  //没有申请
            wx.navigateTo({
              url: '../certificate/x'
            });
          } else if (data.result.status == 0) {  //申请待审核
            wx.navigateTo({
              url: '../copyright/complete/x?word=实名认证申请成功&index=0'
            });
          } else if (data.result.status == 1) {  //申请通过
            $Message({
              content: '恭喜你，你已经是实名认证通过！',
              type: 'success'
            });
          } else if (data.result.status == 2) { //申请失败
            wx.navigateTo({
              url: '../certificate/x?status=' + data.result.status + '&code=' + data.result.datas.realCode
            });
          }
        }
      }, 'get');
  },
  categoryObligeeCallback: res => {
    var categorys = res.result.categorys;
    var e, rows;
    var owner_categories = [];
    for (var i = 0; i < categorys.length; i++) {
      rows = thePage.buildGridShowData(categorys[i].subtypes, 4);
      e = {};
      e.rows = rows;
      e.name = categorys[i].name;
      owner_categories.push(e);
    }
    thePage.setData({
      owner_categories: owner_categories,
    });
  },
  obligeeCallback: res => {
    thePage.setData({
      copyrighters: thePage.buildGridShowData(res.result.obligee, 3),
    });
  },
  hotWorkcallback: function (res) {
    var hots = res.result.hots;
    if (hots.length < 1) {
      return
    }
    let arrayHot = thePage.buildGridShowData(hots, 3)
    thePage.setData({
      _hotCopyrights: hots,
      errorNetwork: false,
      hotCopyrights: thePage.data.hotCopyrights.concat(arrayHot),
      hotTotal:res.result.total,
    });
    console.log("获取的最终的数据", thePage.data.hotCopyrights)
    if (refreshStatus) {
      $Message({
        content: '数据已刷新！',
        type: 'success'
      });
    }
  },
  categoryCallback: function (res) {
    var categorys = res.result.categorys;
    thePage.categorySetData(categorys);
  },
  categorySetData: function (categorys) {
    var e, rows;
    var categories = [];
    for (var i = 0; i < categorys.length; i++) {
      rows = thePage.buildGridShowData(categorys[i].subtypes, 4);
      e = {};
      e.rows = rows;
      e.name = categorys[i].name;
      categories.push(e);
    }
    thePage.setData({
      categories: categories,
    });
  },
  getNews: function (page) {
    let _page = page ? page : 0;
    this.setData({
      newsPage: _page
    })
    app.doCssPost("index", "copyright", "news", { word: '版权', page: _page }, function (status, res) {
      if (status) {
        thePage.copyrightNewsFn(res)
      } else {
        console.log('网络连接失败')
      }
    });
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
  searchRankCallback: function (rs) {//搜索排行榜回调
    var recommends = rs.result.recommends;
    app.globalData.the_search_rank = recommends;
    thePage.setData({
      the_search_rank: recommends,
    });
    wx.hideLoading();
  },
  copyrihtPowerCallback: function (rs) {
    var powers = rs.result.contributionRanks;
    var powerCount = rs.result.scoreCount;
    var editCount = rs.result.editCount;
    var auditCount = rs.result.auditCount;
    var shareCount = rs.result.shareCount;

    thePage.data.rankNumber = 1;
    app.globalData.the_copyriht_power = powers;
    app.globalData.copyriht_power = powerCount;
    thePage.data.scoreCount = powerCount;
    thePage.data.editCount = editCount;
    thePage.data.auditCount = auditCount;
    thePage.data.shareCount = shareCount;
    app.globalData.bqData = {
      scoreCount: powerCount,
      editCount: editCount,
      auditCount: auditCount,
      shareCount: shareCount
    }

    thePage.setData({
      the_copyriht_power: powers,
      copyriht_power: powerCount,
      scoreCount: powerCount,
      editCount: editCount,
      auditCount: auditCount,
      shareCount: shareCount,
    });
    wx.hideLoading();
  },
  goHome: function () {
    wx.navigateTo({
      url: '../index/x'
    });
  },
  onShareAppMessage: function (res) {
    app.pageShareLog('index', 'index', 'index', 'index', this.url)
    return {
      title: ("版权百科专业的版权信息平台")
    }
  },
  handleChange({ detail }) {
    thePage.setData({
      searchOption: detail.key,
      searchTips: detail.key == "searchCopyright" ? "请输入版权的关键词，例如'权利的游戏'" : "请输入公司名、人名，例如'金庸'",
    });
    this.searchSuggest()
  },
  searchSuggest: function () {
    let that = this;
    let type = "w";
    if (this.data.searchOption == "searchCopyright") {
      type = "w";
    } else {
      type = "o";
    }
    app.doPost("/search/suggest?keyword=" + that.data.hotWords + '&type=' + type, null, null, function (rs) {
      that.setData({
        searchTipsList: rs.result.searchResult
      })
    }, "get");
  },
  searchBq() {
    let that = this;
    if (this.data.searchOption == "searchCopyright") {
      wx.navigateTo({
        // url: "../search/x?keywords=" +that.data.hotWords
        url: "../search/subject/x?keywords=" + that.data.hotWords + '&type=search'
      });
    }
    else {
      wx.navigateTo({
        url: "../search/owners/x?keywords=" + that.data.hotWords + '&type=search'
      });
    }
  },
  checkNewVersion: () => {
    let h = app.globalData.statusBarHeight + app.globalData.titleBarHeight
    thePage.setData({
      messageHeight: h
    })
    app.checkNewVersion(function () {
      $Message({
        content: '你使用的当前小程序已是最新版本，无需跟新',
        type: 'success',
        duration: 10
      });
    })
  },
  searchInput: function (e) {
    let that = this;
    this.setData({
      hotWords: e.detail.value
    });
    if (e.detail.value != '') {
      this.searchSuggest()
    } else {
      this.setData({
        searchTipsList: []
      });
    }
  },
  //搜索获得焦点
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
    }, 200)
  },
  onHide: function () {

    this.setData({
      searchTipsList: []
    })
  },
  onReachBottom: function () {
    if (this.data.navigateZindex == 1) {
      var number = thePage.data.rankNumber + 1;
      var token = app.globalData.userInfo.authToken;
      var params = { "token": token, "pageNumber": number, "pageSize": 10 };
      app.doPost("/bql/api/count", params, null, function (rs) {
        var powers = rs.result.contributionRanks;
        if (powers != null && powers.length > 0) {
          thePage.data.rankNumber = number;
          var copyrihtPowers = app.globalData.the_copyriht_power;
          for (var i = 0; i < powers.length; i++) {
            copyrihtPowers.push(powers[i]);
          }
          app.globalData.the_copyriht_power = copyrihtPowers;
          thePage.setData({
            the_copyriht_power: copyrihtPowers,
          });
        }
        wx.hideLoading();
      }, "get");
    }
    if (this.data.tabIndx == 0 && !this.data.newsLast && this.data.bottombar_position=='baike') {
      thePage.setData({
        loadAll: false
      });
      let pageNow = thePage.data.newsPage + 1;
      thePage.getNews(pageNow)
    }
  },
  copyrightService: function (e) {
    let bcode = e.currentTarget.dataset.bcode;
    let bview = e.currentTarget.dataset.bimg;
    let title = e.currentTarget.dataset.btitle;
    let name = e.currentTarget.dataset.bname;
    let durl = e.currentTarget.dataset.durl;
    let introduce = e.currentTarget.dataset.introduce;
    if (durl && durl != "") {
      wx.navigateTo({
        url: durl,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })

    } else {
      if (bcode =='software'){
        wx.navigateTo({ url:'../services/copyrightServices/index?bcode=software'})
      } else if (bcode =='gamecoderegister'){
        wx.navigateTo({ url: '../services/copyrightServices/index?bcode=gamecoderegister' })
      }else{
        wx.navigateTo({
          url: '../services/copyrightbusiness/servicecontent/x?bcode=' + bcode + "&bview=" + bview + "&btitle=" + title + "&bname=" + name + "&introduce=" + introduce,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    }

  },
  bannerJump:function(){
    wx.navigateTo({
      url: '../search/subject/x?keywords=冬宫',
    })
  },
  // 右拉获取数据的接口
  scrollnew(e) {
    console.log("这个是右拉的按钮",e)
    let new_hotCopyrights = thePage.data.hotCopyrights;
    console.log(thePage.data.hotCopyrights)
    if (parseInt(thePage.data.pageNumber * 6) >= thePage.data.hotTotal) {
      return
    }
    thePage.data.pageNumber = parseInt(thePage.data.pageNumber) + 1
    thePage.httpRequest("/index/work/hot", { pageNumber: thePage.data.pageNumber, pageSize: '6' }, thePage.hotWorkcallback, "post", function () {
      thePage.loadError();
    }); 
  },
})

var demo_cooperativers = [
  {
    image: "http://img.mp.itc.cn/upload/20170322/00fdc529722b4bba914a65fbbd6358c9_th.jpeg",
    name: "中国版权保护中心",
    url: "http://www.ccopyright.com.cn/",
  }
];
