const app = getApp()
var thePage, user;
Page({
  /**
   * 页面的初始数据
   */
  data:{
    tabIndx: "tab2",
    showIcon: true,
    authIsShow:true,
    sysLogo: app.globalData.sysLogo,
    myedit: null,
    citiaoPass: [],
    passNumber: 0,
    citiaoWait:[],
    waitNumber: 0,
    citiaoReject:[],
    rejectNumber: 0,
    citiaoCode: "",
    bigType: "",
    smallType: "",
    workSeqNo: "",
    operateType: ""
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
    wx.getSetting({
      success: setRes => {
        console.log(setRes, "第一页的设置11")
        var t = setRes.authSetting['scope.userInfo'];
        if (t == 'undefined ' || t == null) {
          thePage.setData({
            authIsShow: false
          });
        } else {
          thePage.setData({
            authIsShow: true
          });
        }
        app.login(function (res) {
          app.globalData.userInfo = res.result.userInfo;
          user = res.result.userInfo
          thePage.getData(thePage.data.optionsObj);
        })
      }
    })
  },
  handleChange({ detail }) {
    this.setData({
      tabIndx: detail.key
    });
    var token = app.globalData.userInfo.authToken;
    var indx = this.data.tabIndx;
    if (indx == "tab1") {
      var params = { "token": token, "status": "wait_audit", "pageNumber": 1, "pageSize": 5 };
      app.doPost("/citiao/wait/query", params, "", function (rs) {
        var datas = rs.result.datas;
        thePage.data.waitNumber = rs.result.pageNumber;
        thePage.data.citiaoWait = datas;
        thePage.data.tabIndx = 'tab1';
        thePage.setData({
          citiaoWait: datas,
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
    if (indx == 'tab2') {
      var params = { "token": token, "pageNumber": 1, "pageSize": 10 };
      app.doPost("/citiao/pass/query", params, "数据加载中", function (rs) {
        if (rs.resultCode == '200') {
          var datas = rs.result.datas;
          if (datas != null && datas.length > 0) {
            thePage.data.passNumber = rs.result.pageNumber;
            thePage.data.citiaoPass = datas;
            thePage.data.tabIndx = 'tab2';
            thePage.setData({
              citiaoPass: datas,
              myedit: {
                count_newly: 0,
                count_audit: thePage.data.myedit.count_audit,
                count_success: rs.result.totalStr,
                count_reject: thePage.data.myedit.count_reject
              }
            });
          } else {
            thePage.data.citiaoPass = [];
            thePage.setData({
              citiaoPass: []
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
    if (indx == "tab3") {
      var params = { "token": token, "status": "reject", "pageNumber": 1, "pageSize": 5 };
      app.doPost("/citiao/wait/query", params, "", function (rs) {
        var datas = rs.result.datas;
        thePage.data.rejectNumber = rs.result.pageNumber;
        thePage.data.citiaoReject = datas;
        thePage.data.tabIndx = 'tab3';
        thePage.setData({
          citiaoReject: datas,
          myedit: {
            count_newly: 0,
            count_reject: rs.result.totalStr,
            count_audit: thePage.data.myedit.count_audit,
            count_success: thePage.data.myedit.count_success
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
  onCancelCz() {
    this.setData({
      actionsCzOpened: false
    });
  },
  openActionsCz(e) {
    var citiaoCode = e.target.dataset.citiao;
    var bigType = e.target.dataset.bigtype;
    var smallType = e.target.dataset.smalltype;
    var workSeqNo = e.target.dataset.workseqno;
    thePage.data.citiaoCode = citiaoCode;
    thePage.data.bigType = bigType;
    thePage.data.smallType = smallType;
    thePage.data.workSeqNo = workSeqNo;
    this.setData({
      actionsCzOpened: true,
      actionsCz: [
         {
          name: '查看版权词条详情',
          icon: 'browse',
        },
      ],
    });

    // {
    //   name: '修改词条编辑内容',
    //     icon: 'editor',
    //     },
    // {
    //   name: '删除当前词条编辑',
    //     icon: 'delete',
    //     },

  },
  onCancelReject() {
    this.setData({
      actionsRejectOpened: false
    });
  },
  openActionsReject(e) {
    var citiaoCode = e.target.dataset.citiao;
    var bigType = e.target.dataset.bigtype;
    var smallType = e.target.dataset.smalltype;
    var workSeqNo = e.target.dataset.workseqno;
    var operateType = e.target.dataset.operatetype;
    thePage.data.citiaoCode = citiaoCode;
    thePage.data.bigType = bigType;
    thePage.data.smallType = smallType;
    thePage.data.workSeqNo = workSeqNo;
    thePage.data.operateType = operateType;
    this.setData({
      actionsRejectOpened: true,
      actionsCz: [
        {
          name: '查看版权词条详情',
          icon: 'browse',
        },
        {
          name: '修改词条编辑内容',
          icon: 'editor',
        }
      ],
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的版权词条编辑'
    });
    thePage = this;
    user=app.globalData.userInfo;
    var pages = getCurrentPages();
    if (pages.length == 1) {
      thePage.setData({ backUrl: '/pages/index/x' })
    }
    thePage.setData({ optionsObj: options})
    if (user) {
      thePage.getData(options);
    } else {
      thePage.getScopeUserInfo();
    }
    //setInterval
    // setTimeout(function () {
    //   thePage.setData({
    //     myedit: {
    //       count_success: 1,
    //       count_audit: 3,
    //       count_reject: 1,
    //     },
    //   });
    // }, 1000);
  },
  getData: function (options){
    var token = user.authToken;
    if (token == null || token == '') {
      wx.hideToast();
      wx.showModal({
        title: '提示',
        content: "未登陆",
        showCancel: false,
        success: function (res) { }
      })
    }
    var tabIndex = "tab2";
    var params = { "token": token };
    app.doPost("/citiao/edit/conut", params, null, function (rs) {
      thePage.data.myedit = { count_success: rs.result.pass, count_audit: rs.result.waitAudit, count_reject: rs.result.reject }
      if (rs.result.waitAudit != null && rs.result.waitAudit > 0) {
        tabIndex = "tab1";
      }
      thePage.setData({
        myedit: {
          count_success: rs.result.pass,
          count_audit: rs.result.waitAudit,
          count_reject: rs.result.reject,
          count_newly: rs.result.newly,
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
        var params = { "token": token, "status": "wait_audit", "pageNumber": 1, "pageSize": 5 };
        app.doPost("/citiao/wait/query", params, "数据加载中", function (rs) {
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
      if (tabIndex == 'tab2') {
        var params = { "token": token, "pageNumber": 1, "pageSize": 10 };
        app.doPost("/citiao/pass/query", params, "数据加载中", function (rs) {
          if (rs.resultCode == '200') {
            var datas = rs.result.datas;
            if (datas != null && datas.length > 0) {
              console.log(1)
              thePage.data.passNumber = rs.result.pageNumber;
              thePage.data.citiaoPass = datas;
              thePage.setData({
                citiaoPass: datas,
                myedit: {
                  count_newly: 0,
                  count_audit: thePage.data.myedit.count_audit,
                  count_success: rs.result.totalStr,
                  count_reject: thePage.data.myedit.count_reject
                }
              });
            } else {
              console.log(2)
              thePage.data.citiaoPass = [];
              thePage.setData({
                citiaoPass: []
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
        var params = { "token": token, "status": "reject", "pageNumber": 1, "pageSize": 5 };
        app.doPost("/citiao/wait/query", params, "数据加载中", function (rs) {
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
              count_audit: thePage.data.myedit.count_audit,
              count_success: thePage.data.myedit.count_success,
              count_reject: rs.result.totalStr
            }
          });
          wx.hideLoading();
        }, "get");
      }

    }, "get");
    thePage.setData({
      searchBarTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight
    });
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
      actionsCzOpened: false,
      actionsRejectOpened: false,
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
    if (tabindex == "tab1") {
      var waitNumber = thePage.data.waitNumber + 1;
      var params = { "token": token, "status": "wait_audit", "pageNumber": waitNumber, "pageSize": 5 };
      app.doPost("/citiao/wait/query", params, "数据加载中", function (rs) {
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
    if (tabindex == "tab2") {
      var passNumber = thePage.data.passNumber + 1;
      var params = { "token": token, "pageNumber": passNumber, "pageSize": 10 };
      app.doPost("/citiao/pass/query", params, "数据加载中", function (rs) {
        var datas = rs.result.datas;
        thePage.data.passNumber = rs.result.pageNumber;
        var passs = thePage.data.citiaoPass;
        passs = thePage.getResultDate(datas, passs);
        thePage.data.citiaoPass = passs;
        thePage.setData({
          citiaoPass: passs,
          myedit: {
            count_newly: 0,
            count_audit: thePage.data.myedit.count_audit,
            count_success: rs.result.totalStr,
            count_reject: thePage.data.myedit.count_reject
          }
        });
        wx.hideLoading();
      }, "get");
    }
    if (tabindex == "tab3") {
      var rejectNumber = thePage.data.rejectNumber + 1;
      var params = { "token": token, "status": "reject", "pageNumber": rejectNumber, "pageSize": 5 };
      app.doPost("/citiao/wait/query", params, "数据加载中", function (rs) {
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
  getResultDate: function (datas, passs){
    for (var j = 0; j < datas.length; j++) {
      var date = datas[j].date;
      var rdata = datas[j].citiaos;
      var isContinue = thePage.isCountinueDate(date, passs);
      if (isContinue) {
        for (var i = 0; i < passs.length; i++) {
          var pdate = passs[i].date;
          var pData = passs[i].citiaos;
          if (date == pdate){
            for (var k = 0; k < rdata.length; k++) {
              pData.push(rdata[k]);
            }
          }
        }
      } else {
        passs.push({ "date": date, "citiaos": datas[j].citiaos});
      }
    }
    return passs;
  },
  isCountinueDate: function(date, passs){
    for (var i = 0; i < passs.length; i++) {
      if (passs[i].date == date){
        return true;
      }
    }
    return false;
  }
  ,
  handleOpen(e) {
    let index=e.currentTarget.dataset.index;
    let actions = [];
    thePage.setData({
      activeActionCitiao: this.data.citiaoWait[index]
    })
    this.data.citiaoWait[index].attachs.forEach(function (p1, p2) {
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
    this.setData({
      actions: actions,
      actionsOpened: true
    });
  },
  handleCancel() {
    this.setData({
      actionsOpened: false
    });
  },
  handleAction: ({ detail }) => {
    let _index = detail.index;
    let item = thePage.data.activeActionCitiao.attachs[_index]
    if (item.fileType == 0) {
      wx.navigateTo({
        url: '../../../components/webview/c?url=' + app.urlDecode(item.url) + '&title=' + item.fileName
      })
    } else if (item.fileType == 1) {
      wx.previewImage({
        current: item.url, // 当前显示图片的http链接
        urls: [item.url] // 需要预览的图片http链接列表
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  handleActionCz: function(rs){
    var citiao = thePage.data.citiaoCode;
    var workSeqNo = thePage.data.workSeqNo;
    wx.navigateTo({
      url: "../../copyright/preview/x?workSeqNo=" + workSeqNo + "&citiaoCode=" + citiao
    })
  },
  handleActionReject: function (rs) {
    var index = rs.detail.index;
    var citiao = thePage.data.citiaoCode;
    var workSeqNo = thePage.data.workSeqNo;
    var tabIndex = thePage.data.tabIndx;
    var operateType = thePage.data.operateType;
    if(index == 0){
      wx.navigateTo({
        url: "../../copyright/preview/x?workSeqNo=" + workSeqNo + "&citiaoCode=" + citiao
      })
    } else if (index == 1){
      
      if ("人身权" == thePage.data.bigType) {
        if ("新增" == thePage.data.operateType || "编辑" == thePage.data.operateType) {
          wx.navigateTo({
            url: "../../copyright/personal/edit/x?workSeqNo=" + workSeqNo + "&citiaoCode=" + citiao + "&type=wechat&isMine=true&status=reject&tableType=2"
          })      
        } else if ("删除" == thePage.data.operateType) {
          wx.navigateTo({
            url: "../../copyright/property/delete/x?workSeqNo=" + workSeqNo + "&citiaoCode=" + citiao + "&type=wechat&isMine=true&status=reject&citiaoClass=2&tableType=2"
          })
        }
      } else if ("财产权" == thePage.data.bigType) {
        if ("许可使用" == thePage.data.smallType) {
          if ("新增" == thePage.data.operateType || "编辑" == thePage.data.operateType){
            wx.navigateTo({
              url: "../../copyright/property/license/add/x?workSeqNo=" + workSeqNo + "&citiaoCode=" + citiao + "&type=wechat&isMine=true&status=reject&citiaoClass=2&tableType=2"
            })
          } else if ("删除" == thePage.data.operateType){
            wx.navigateTo({
              url: "../../copyright/property/common/delete/x?workSeqNo=" + workSeqNo + "&citiaoCode=" + citiao + "&type=wechat&isMine=true&status=reject&citiaoClass=2&tableType=2"
            })
          }
        } else if ("权利转让" == thePage.data.smallType) {
          if ("新增" == thePage.data.operateType || "编辑" == thePage.data.operateType) {
            wx.navigateTo({
              url: "../../copyright/property/transfer/edit/x?workSeqNo=" + workSeqNo + "&citiaoCode=" + citiao + "&type=wechat&isMine=true&status=reject&citiaoClass=&tableType=2"
            }) 
          } else if ("删除" == thePage.data.operateType) {
            wx.navigateTo({
              url: "../../copyright/property/common/delete/x?workSeqNo=" + workSeqNo + "&citiaoCode=" + citiao + "&type=wechat&isMine=true&status=reject&citiaoClass=3&tableType=2"
            })
          }
        } else if ("版权质押" == thePage.data.smallType) {
          if ("新增" == thePage.data.operateType || "编辑" == thePage.data.operateType) {
            wx.navigateTo({
              url: "../../copyright/property/pledge/add/x?workSeqNo=" + workSeqNo + "&citiaoCode=" + citiao + "&type=wechat&isMine=true&status=reject&citiaoClass=4&tableType=&tableType=2"
            })         
          } else if ("删除" == thePage.data.operateType) {
            wx.navigateTo({
              url: "../../copyright/property/common/delete/x?workSeqNo=" + workSeqNo + "&citiaoCode=" + citiao + "&type=wechat&isMine=true&status=reject&citiaoClass=4&tableType=2"
            })
          }
        }
      } else if ("官方登记" == thePage.data.smallType) {
        wx.navigateTo({
          url: "../../copyright/register/edit/x?workSeqNo=" + workSeqNo + "&citiaoCode=" + citiao + "&type=wechat&isMine=true&status=reject&citiaoClass=&tableType=2"
        })  
      } else if ("侵权举报" == thePage.data.smallType) {
        wx.navigateTo({
          url: "../../copyright/pirate/edit/x?workSeqNo=" + workSeqNo + "&citiaoCode=" + citiao + "&type=wechat&isMine=true&status=reject&citiaoClass=4&tableType=2"
        })  
      } else if ("使用版权" == thePage.data.smallType) {
        wx.navigateTo({
          url: "../../copyright/related/edit/x?workSeqNo=" + workSeqNo + "&citiaoCode=" + citiao + "&type=wechat&isMine=true&status=reject&citiaoClass=4&tableType=2"
        })  
      } else if ("衍生版权" == thePage.data.smallType) {
        wx.navigateTo({
          url: "../../copyright/derive/edit/x?workSeqNo=" + workSeqNo + "&citiaoCode=" + citiao + "&type=wechat&isMine=true&status=reject&citiaoClass=&tableType=2"
        })        
      } else if ("邻接权" == thePage.data.smallType) {
        if ("新增" == thePage.data.operateType || "编辑" == thePage.data.operateType) {
          wx.navigateTo({
            url: "../../copyright/neighboring/edit/x?workSeqNo=" + workSeqNo + "&citiaoCode=" + citiao + "&type=wechat&isMine=true&status=reject&citiaoClass=4&tableType=2"
          })  
        } else if ("删除" == thePage.data.operateType) {
          wx.navigateTo({
            url: "../../copyright/neighboring/delete/x?workSeqNo=" + workSeqNo + "&citiaoCode=" + citiao + "&type=wechat&isMine=true&status=reject&citiaoClass=4&tableType=2"
          })
        }
      }
    }
  },
  clickUrl: function(e){
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: "../../../components/webview/c?url=" + encodeURIComponent(url)
    });
  },
})