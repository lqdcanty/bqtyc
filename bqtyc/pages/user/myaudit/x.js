const app = getApp()
var thePage, token, user;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabIndx: "tab2",
    myedit: null,
    showIcon: true,
    citiaoPass: [],
    passNumber: 0,
    citiaoWait: [],
    waitNumber: 0,
    citiaoReject: [],
    rejectNumber: 0,
    authIsShow:true,
    sysLogo: app.globalData.sysLogo,
  },
  onauthorizeEvent: function (e) {
    this.setData({
      authIsShow: e.detail == 1 ? true : false
    });
    app.globalData.authIsShow = e.detail == 1 ? true : false;
    app.login(function (res) {
      app.globalData.userInfo = res.result.userInfo;
      user = res.result.userInfo
      thePage.getData(thePage.data.optionsObj);
    })
  },
  getScopeUserInfo: function () {//授权判断
    wx.login({
      success: res => {
        //用户授权核心代码
        wx.getUserInfo({
          success: userRes => {
            app.doPost(
              '/auth/xcx/force/login', {
                code: res.code,
                encryptedData: userRes.encryptedData,
                iv: userRes.iv
              }, null, function (result) {
                var data = result;
                if (data.resultCode == '200') {
                  app.globalData.userInfo = data.result.userInfo;
                  user = data.result.userInfo;
                  thePage.getData(thePage.data.optionsObj);
                }
              }, "post")
          }, fail: function (result) {
            console.log("未获取到用户信息--->");
            if (callbackerror) {
              callbackerror(result);
            }
            //TODO:执行二次授权
          }
        })
      }
    })
  },
  handleChange({ detail }) {
    this.setData({
      tabIndx: detail.key
    });
    var token = user.authToken;
    var indx = this.data.tabIndx;
    var params = { "token": token };
    if (indx == "tab1"){
      var params = { "token": token, "pageNumber": 1, "pageSize": 5 };
      app.doPost("/citiao/wait/audit", params, "数据加载中", function (rs) {
        var datas = rs.result.datas;
        thePage.data.waitNumber = 1;
        thePage.data.citiaoWait = datas;
        thePage.data.tabIndx = 'tab1';
        thePage.setData({
          citiaoWait: datas,
          myedit: {
            count_newly: 0,
            count_audit: rs.result.totalStr,
            count_success: thePage.data.myedit.count_success,
            count_reject: thePage.data.myedit.count_reject,
          },
        });
        wx.hideLoading();
      }, "get");
    }
    if (indx == "tab2"){
      var params = { "token": token, "pageNumber": 1, "pageSize": 5 };
      app.doPost("/citiao/audit/pass/query", params, "数据加载中", function (rs) {
        var datas = rs.result.datas;
        thePage.data.passNumber = 1;
        //var passs = thePage.data.citiaoPass;
        //passs = thePage.getResultDate(datas, passs);
        thePage.data.citiaoPass = datas;
        thePage.data.tabIndx = 'tab2';
        thePage.setData({
          citiaoPass: datas
        });
        wx.hideLoading();
      }, "get");
    }
    if (indx == "tab3") {
      var params = { "token": token, "status": "reject", "pageNumber": 1, "pageSize": 5 };
      app.doPost("/citiao/wait/audit/query", params, "数据加载中", function (rs) {
        var datas = rs.result.datas;
        thePage.data.rejectNumber = 1;
        thePage.data.citiaoReject = datas;
        thePage.data.tabIndx = 'tab3';
        thePage.setData({
          citiaoReject: datas,
          myedit: {
            count_newly: 0,
            count_audit: thePage.data.myedit.count_audit,
            count_success: thePage.data.myedit.count_success,
            count_reject: rs.result.totalStr,
          }
        });
        wx.hideLoading();
      }, "get");
    }
  },
  onCancel() {
    this.setData({
      actionsOpened: false
    });
  },
  openActions(e) {
    this.setData({
      actionsOpened: true,
      actions: [
        {
          name: '查看版权词条详情',
          icon: 'browse',
        },
      ],
    });
    // {
    //   name: '同意词条收录',
    //     icon: 'right',
    //     },
    // {
    //   name: '拒绝词条收录',
    //     icon: 'delete',
    //     },

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    var pages = getCurrentPages();
    user = app.globalData.userInfo;
    if (pages.length == 1) {
      thePage.setData({ backUrl: '/pages/index/x' })
    }
    //token = user.authToken;
    thePage.setData({
      optionsObj: options
    })
    if (user) {
      thePage.getData(options);
    } else {
      thePage.getScopeUserInfo();
    }
  },
  getData: function (options){
    var tabIndex = "tab2";
    var params = { "token": user.authToken };
    app.doPost("/citiao/audit/conut", params, null, function (rs) {
      thePage.data.myedit = { count_success: rs.result.pass, count_audit: rs.result.waitAudit, count_reject: rs.result.reject }
      if (rs.result.waitAudit != null && rs.result.waitAudit > 0) {
        tabIndex = "tab1";
      }
      thePage.setData({
        myedit: {
          count_success: rs.result.pass,
          count_audit: rs.result.waitAudit,
          count_reject: rs.result.reject,
        },
      });
      if (typeof options.tabIndex != 'undefined') {
        tabIndex = options.tabIndex;
      }
      thePage.data.tabIndx = tabIndex;
      thePage.setData({
        tabIndx: tabIndex
      });
      if (tabIndex == 'tab1') {
        var params = { "token": user.authToken, "pageNumber": 1, "pageSize": 5 };
        app.doPost("/citiao/wait/audit", params, "数据加载中", function (rs) {
          var datas = rs.result.datas;
          thePage.data.waitNumber = 1;
          thePage.data.citiaoWait = datas;
          thePage.setData({
            citiaoWait: datas,
            myedit: {
              count_newly: 0,
              count_audit: rs.result.totalStr,
              count_success: thePage.data.myedit.count_success,
              count_reject: thePage.data.myedit.count_reject,
            }
          });
          wx.hideLoading();
        }, "get");
      }
      if (tabIndex == 'tab2') {
        var params = { "token": user.authToken, "pageNumber": 1, "pageSize": 10 };
        app.doPost("/citiao/audit/pass/query", params, "数据加载中", function (rs) {
          if (rs.resultCode == '200') {
            var datas = rs.result.datas;
            if (datas != null && datas.length > 0) {
              thePage.data.passNumber = 1;
              thePage.data.citiaoPass = datas;
              thePage.setData({
                citiaoPass: datas
              });
            } else {
              thePage.setData({
                citiaoPass: null
              })
            }
          } else {
            wx.showToast({
              title: rs.resultMsg,
              icon: 'success',
              duration: 2000
            });
          }
          wx.hideLoading();
        }, "get");
      }
      if (tabIndex == 'tab3') {
        var rejectNumber = thePage.data.rejectNumber;
        var params = { "token": user.authToken, "status": "reject", "pageNumber": rejectNumber, "pageSize": 5 };
        app.doPost("/citiao/wait/audit/query", params, "数据加载中", function (rs) {
          var datas = rs.result.datas;
          thePage.data.rejectNumber = 1;
          var waits = thePage.data.citiaoReject;
          for (var i = 0; i < datas.length; i++) {
            waits.push(datas[i]);
          }
          thePage.data.citiaoReject = waits;
          thePage.setData({
            citiaoReject: waits,
            myedit: {
              count_newly: 0,
              count_success: thePage.data.myedit.count_success,
              count_audit: thePage.data.myedit.count_audit,
              count_reject: rs.result.totalStr
            }
          });
          wx.hideLoading();
        }, "get");
      }
      thePage.setData({
        searchBarTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight
      });
    }, "get");
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
    this.setData({
      actionsOpened: false
    });
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
    wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let tabindex = thePage.data.tabIndx;
    var token = app.globalData.userInfo.authToken;
    if (tabindex == "tab2") {
      var passNumber = thePage.data.passNumber + 1;
      var params = { "token": token, "pageNumber": passNumber, "pageSize": 10 };
      app.doPost("/citiao/audit/pass/query", params, "数据加载中", function (rs) {
        var datas = rs.result.datas;
        thePage.data.passNumber = rs.result.pageNumber;
        var passs = thePage.data.citiaoPass;
        passs = thePage.getResultDate(datas, passs);
        thePage.data.citiaoPass = passs;
        thePage.setData({
          citiaoPass: passs,
        });
        wx.hideLoading();
      }, "get");
    }
    if (tabindex == "tab1") {
      var waitNumber = thePage.data.waitNumber + 1;
      var params = { "token": token, "pageNumber": waitNumber, "pageSize": 5 };
      app.doPost("/citiao/wait/audit", params, "数据加载中", function (rs) {
        var datas = rs.result.datas;
        thePage.data.waitNumber = rs.result.pageNumber;
        var waits = thePage.data.citiaoWait;
        for (var i = 0; i < datas.length; i++) {
          waits.push(datas[i]);
        }
        thePage.data.citiaoWait = waits;
        thePage.setData({
          citiaoWait: waits,
          myedit: {
            count_newly: 0,
            count_audit: rs.result.totalStr,
            count_success: thePage.data.myedit.count_success,
            count_reject: thePage.data.myedit.count_reject
          }
        });
        wx.hideLoading();
      }, "get");
    }
    if (tabindex == "tab3") {
      var rejectNumber = thePage.data.rejectNumber + 1;
      var params = { "token": token,"status": "reject", "pageNumber": rejectNumber, "pageSize": 5 };
      app.doPost("/citiao/wait/audit/query", params, "数据加载中", function (rs) {
        var datas = rs.result.datas;
        thePage.data.rejectNumber = rs.result.pageNumber;
        var waits = thePage.data.citiaoReject;
        for (var i = 0; i < datas.length; i++) {
          waits.push(datas[i]);
        }
        thePage.data.citiaoReject = waits;
        thePage.setData({
          citiaoReject: waits,
          myedit: {
             count_newly: 0,
            count_success: thePage.data.myedit.count_success,
            count_audit: thePage.data.myedit.count_audit,
            count_reject: rs.result.totalStr
          }
        });
        wx.hideLoading();
      }, "get");
    }
  },
  getResultDate: function (datas, passs) {
    for (var j = 0; j < datas.length; j++) {
      var date = datas[j].date;
      var rdata = datas[j].citiaos;
      var isContinue = thePage.isCountinueDate(date, passs);
      if (isContinue) {
        for (var i = 0; i < passs.length; i++) {
          var pdate = passs[i].date;
          var pData = passs[i].citiaos;
          if (date == pdate) {
            for (var k = 0; k < rdata.length; k++) {
              pData.push(rdata[k]);
            }
          }
        }
      } else {
        passs.push({ "date": date, "citiaos": datas[j].citiaos });
      }
    }
    return passs;
  },
  isCountinueDate: function (date, passs) {
    for (var i = 0; i < passs.length; i++) {
      if (passs[i].date == date) {
        return true;
      }
    }
    return false;
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  clickUrl: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: "../../../components/webview/c?url=" + encodeURIComponent(url)
    });
  },
  handleAction: function (rs) {
    console.log(rs);
    var index = rs.detail.index;
    var citiao = rs.currentTarget.dataset.citiao;
    var bigtype = rs.currentTarget.dataset.bigtype;
    var smalltype = rs.currentTarget.dataset.smalltype;
    var workSeqNo = rs.currentTarget.dataset.workseqno;
    var token = app.globalData.userInfo.authToken;
    if (index == 0) {
      wx.navigateTo({
        url: "../../copyright/preview/x?workSeqNo=" + workSeqNo + "&citiaoCode=" + citiao
      })
    }
    if (index == 1) {
      var params = { "token": token, "citiaoCode": citiao, "status": "pass"};
      app.doPost("/citiao/audit", params, null, function (rs) {
        thePage.onCancel();
        if (rs.resultCode == '200'){
          wx.showToast({
            title: '审核成功',
            icon: 'success',
            duration: 2000
          });
          var params = { "token": token, "pageNumber": 1, "pageSize": 5 };
          app.doPost("/citiao/wait/audit", params, null, function (rs) {
            var datas = rs.result.datas;
            thePage.data.waitNumber = rs.result.pageNumber;
            thePage.data.citiaoWait = datas;
            thePage.setData({
              citiaoWait: datas,
              myedit: {
                count_newly: 0,
                count_success: thePage.data.myedit.count_success,
                count_audit: thePage.data.myedit.count_audit,
                count_reject: thePage.data.myedit.count_reject,
              },
            });
          }, "get");
        } else {
          wx.showToast({
            title: '审核失败',
            icon: 'success',
            duration: 2000
          });
        }
      }, "get");
    }
    if (index == 2) {
      var params = { "token": token, "citiaoCode": citiao, "status": "reject" };
      app.doPost("/citiao/audit", params, null, function (rs) {
        thePage.onCancel();
        if (rs.resultCode == '200') {
          wx.showToast({
            title: '审核成功',
            icon: 'success',
            duration: 2000
          });
          var params = { "token": token, "pageNumber": 1, "pageSize": 5 };
          app.doPost("/citiao/wait/audit", params, null, function (rs) {
            var datas = rs.result.datas;
            thePage.data.waitNumber = rs.result.pageNumber;
            thePage.data.citiaoWait = datas;
            thePage.setData({
              citiaoWait: datas,
              myedit: {
                count_newly: 0,
                count_success: thePage.data.myedit.count_success,
                count_audit: thePage.data.myedit.count_audit,
                count_reject: thePage.data.myedit.count_reject,
              },
            });
          }, "get");
        } else {
          wx.showToast({
            title: rs.resultMsg,
            icon: 'success',
            duration: 2000
          });
        }
      }, "get");
    }
  },
})