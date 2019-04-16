// pages/copyright/related/add/x.js
const { $Message } = require('../../../../dist/base/index');
const app = getApp()
var thePage;
var work_data, user;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: "删除人身权词条",
    showIcon: true,
    fixedTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight + 5,
    authortypes: null,
    authortype: 0,
    sysLogo: app.globalData.sysLogo,
    work: null,
    powerType: '',
    deleteButton: false,
    actionsDelete: [{
      name: '删除',
      color: '#fff',
      fontsize: '20',
      width: 100,
      icon: 'delete',
      background: '#ed3f14'
    },
    {
      name: '返回',
      width: 100,
      color: '#80848f',
      fontsize: '20',
      icon: 'undo'
    }],
    refer_actions: [
      {
        color: '#fff',
        fontsize: '22',
        width: 48,
        icon: 'delete',
        background: '#ed3f14'
      },
      {
        width: 48,
        color: '#80848f',
        fontsize: '20',
        icon: 'undo'
      }
    ],
    switch1: '',
    links: [],
    title: '',
    current: ['署名权'],
    animal: '姓名',
    checked: false,
    disabled: false,
    token: '',
    editButton: true,
    postObj: {
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      token: '',
      citiaoCode: '',
      workSeqNo: '',
      attachRemark: '',
      deleteRemark:'',
      auditStatus:''
    },
    citiaoCode: '',
    contentObj: null,
    status: '',
    workSeqNo: '',
    rightScopeObj:{},
    authIsShow:true
  },
  onauthorizeEvent: function (e) {
    this.setData({
      authIsShow: e.detail == 1 ? true : false
    });
    app.globalData.authIsShow = e.detail == 1 ? true : false;
    app.login(function (res) {
      app.globalData.userInfo = res.result.userInfo;
      user = res.result.userInfo
      thePage.getDataFun(thePage.data.optionsObj);
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
          app.login(function (res) {
            app.globalData.userInfo = res.result.userInfo;
            user = res.result.userInfo
            thePage.getDataFun(thePage.data.optionsObj);
          })
        }
      }
    })
  },
  handleTypeChange: function ({ detail = {} }) {
    const index = this.data.current.indexOf(detail.value);
    index === -1 ? this.data.current.push(detail.value) : this.data.current.splice(index, 1);
    this.setData({
      current: this.data.current
    });
    console.log(this.data.current, "current")
  },
  onActionCancel() {
    this.setData({
      actionsOpened: false
    });
  },
  handleAction(e) {
    console.log("handleAction", e);
    const index = e.detail.index;
    if (index == 1) {
      wx.navigateTo({
        url: '../../../../components/uploader/c',
      })
    }
    else if (index == 0) {
      wx.navigateTo({
        url: '../../../../components/pasteurl/c',
      })
    }
    thePage.setData({
      actionsOpened: false
    });
  },
  outLink: function (e) {
    if (e.type == 'click' && e.currentTarget.dataset.type == 'link') {
      console.log("调外链接")
      wx.navigateTo({
        url: "../../../../components/webview/c?title=[" + thePage.data.work.category + "]" + thePage.data.work.name + "@" + thePage.data.work.type + "版权力" + "&type=人身权" + "&url=" + app.urlDecode(e.currentTarget.dataset.url),
      })
    } else if (e.type == 'click' && e.currentTarget.dataset.type == 'image') {
      wx.previewImage({
        current: e.currentTarget.dataset.url,
        urls: [e.currentTarget.dataset.url],
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  swipoutChange: function (e) {
    console.log(e, "detail");
    var links = thePage.data.links;
    if (e.detail.index == 0) {
      wx.showModal({
        title: "提示",
        content: '确定要删除该条附件吗？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            links.splice(e.currentTarget.dataset.index, 1);
            thePage.setData({ links: links })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }
  },
  onLoad: function (options) {
    console.log(options)
    thePage = this;
    console.log(app.globalData.userInfo);
    user = app.globalData.userInfo;
    thePage.setData({ optionsObj: options})
    if (user) {
      thePage.getDataFun(options);
    } else {
      thePage.getScopeUserInfo();
    }  
    console.log(user)
    console.log(thePage.data.authIsShow)
  },
  getDataFun: function (options){
    var itemTaken = "postObj.token";
    var itemWorkSeqNo = 'postObj.workSeqNo';
    var itemCitiaoCode = "postObj.citiaoCode";
    if (options.delete == 1) {
      thePage.setData({
        deleteButton: true,
        editButton: false,
        cancelButton: false,
        workSeqNo: options.workSeqNo
      })
    } else if (options.cancel == 1) {
      thePage.setData({
        deleteButton: false,
        editButton: false,
        cancelButton: true,
        workSeqNo: options.workSeqNo
      })
    } else if(options.reject==1){
      thePage.setData({
        deleteButton: false,
        editButton: true,
        cancelButton: false,
        workSeqNo: options.workSeqNo
      })
    }
    thePage.setData({
      [itemTaken]: user ? user.authToken : '',
      [itemWorkSeqNo]: options.workSeqNo,
      [itemCitiaoCode]: options.citiaoCode,
      token: user ? user.authToken : '',
      citiaoCode: options.citiaoCode,
      status: options.status
    });
    app.doPost('/work/details', { workSeqNo: options.workSeqNo }, null, function (data) {
      var postObj = thePage.data.postObj;
      postObj.samllClass = data.result.powerType;
      thePage.setData({
        work: data.result.workModel,
        powerType: data.result.powerType,
        postObj: postObj
      });
    }, 'get');

    app.doPost('/citiao/get', { token: user ? user.authToken : '', citiaoCode: options.citiaoCode, tableType: 2 }, null, function (data) {
      var dataObj = data.result.model.citiao;
      var postObj = thePage.data.postObj;
      postObj.contactName = dataObj.contactName;
      postObj.contactEmail = dataObj.contactEmail;
      postObj.contactPhone = dataObj.contactPhone;
      postObj.auditStatus = dataObj.auditStatus;
      postObj.deleteRemark = dataObj.deleteApplyItem? dataObj.deleteApplyItem.deleteRemark:'';
      thePage.setData({
        contentObj: dataObj
      });
      thePage.sopeRight(dataObj.rightScope.split(','))
      if (!dataObj.deleteApplyItem) {
        console.log("dataObjdataObjdataObjdataObj-----")
        if (!(postObj.contactName && postObj.contactPhone)) {
          app.doPost('/apply/getContact', { token: thePage.data.token }, null, function (res) {
            postObj.contactName = postObj.contactName ? postObj.contactName : res.result.info.realName;
            postObj.contactEmail = postObj.contactEmail ? postObj.contactEmail : res.result.info.email;
            postObj.contactPhone = postObj.contactPhone ? postObj.contactPhone : res.result.info.phone;
            thePage.setData({
              postObj: postObj,
            });

          }, 'get');
        }
      } else {
        console.log("dataObjdataObjdataObjdataObj")
        dataObj.deleteApplyItem.attaches.forEach((item) => {
          item.public = item.isPublic == 1 ? true : false;
          item.title = item.attachDesc;
          item.url = item.attachUrl;
          if (item.attachType == 0) {
            item.type = 'link';
            item.typeDec = '参考链接'
          } else if (item.attachType == 1) {
            item.type = 'image';
            item.typeDec = '参考图片';
          } else if (item.attachType == 2) {
            item.type = 'file';
            item.typeDec = '参考文件';
          }
        })
        postObj.attachRemark = dataObj.deleteApplyItem.attachRemark;
        postObj.contactName = dataObj.deleteApplyItem.contactName;
        postObj.contactEmail = dataObj.deleteApplyItem.contactEmail;
        postObj.contactPhone = dataObj.deleteApplyItem.contactPhone;
        thePage.setData({
          postObj: postObj,
          links: dataObj.deleteApplyItem.attaches
        });
        console.log(dataObj.deleteApplyItem.attaches, "attaches")
      }
    }, 'get');
  },
  cancelSave:function(){
    app.doPost('/personal/cancel', { citiaoCode: thePage.data.contentObj.citiaoCode, token: thePage.data.token, status: thePage.data.status, timestamp: (new Date()).valueOf() }, null, function (data) {
      $Message({
        content: '该词条已撤销成功',
        type: 'success'
      });
      setTimeout(() => {
        var pages = getCurrentPages(); // 获取页面栈
        var currPage = pages[pages.length - 1]; // 当前页面
        var prevPage = pages[pages.length - 2];
        prevPage.getData({ workSeqNo: thePage.data.work.workSeqNo, token: thePage.data.token });
        wx.navigateBack();
      }, 800)
    },'get')
  },
  sopeRight: function (sopeRight) {
    console.log(sopeRight, "sopeRight");
    thePage.setData({ rightScopeObj: {} })
    sopeRight.forEach((item) => {
      switch (item) {
        case '2':
          var rightScopeObj = thePage.data.rightScopeObj;
          rightScopeObj.shumingquan = true;
          thePage.setData({ rightScopeObj: rightScopeObj });
          break;
        case '1':
          var rightScopeObj = thePage.data.rightScopeObj;
          rightScopeObj.fabiaoquan = true;
          thePage.setData({ rightScopeObj: rightScopeObj });
          break;
        case '3':
          var rightScopeObj = thePage.data.rightScopeObj;
          rightScopeObj.xiugaiquan = true;
          thePage.setData({ rightScopeObj: rightScopeObj });
          break;
        case '4':
          var rightScopeObj = thePage.data.rightScopeObj;
          rightScopeObj.baofuzuopinquan = true;
          thePage.setData({ rightScopeObj: rightScopeObj });
          break;
      }
    })
  },
  attathRemarkInput: function (e) {
    var postObj = thePage.data.postObj;
    postObj.attachRemark = e.detail.value;
    thePage.setData({
      postObj: postObj
    })
  },
  bindAuthortypeChange: function (res) {
    var postObj = thePage.data.postObj;
    postObj.roleName = thePage.data.authortypes[res.detail.value];
    thePage.setData({
      authortype: res.detail.value,
      postObj: postObj
    })
  },
  deleteInput: function (res) {
    var postObj = thePage.data.postObj;
    postObj.deleteRemark = res.detail.value;
    thePage.setData({
      postObj: postObj
    })
  },
  signatureInput: function (res) {
    var postObj = thePage.data.postObj;
    postObj.roleVal = res.detail.value;
    thePage.setData({
      postObj: postObj
    })
  },
  signatureAuthorInput: function (res) {
    var postObj = thePage.data.postObj;
    postObj.roleAliasVal = res.detail.value;
    thePage.setData({
      postObj: postObj
    })
  },
  originalAuthorInput: function (res) {
    var postObj = thePage.data.postObj;
    postObj.createType = res.detail.value;
    thePage.setData({
      postObj: postObj
    })
  },
  rightRemarkInput: function (res) {
    var postObj = thePage.data.postObj;
    postObj.rightRemark = res.detail.value;
    thePage.setData({
      postObj: postObj
    })
  },
  contactInput: function (res) {
    var postObj = thePage.data.postObj;
    postObj.contactName = res.detail.value;
    thePage.setData({
      postObj: postObj
    })
  },
  contact_phoneInput: function (res) {
    var postObj = thePage.data.postObj;
    postObj.contactPhone = res.detail.value;
    thePage.setData({
      postObj: postObj
    })
  },
  contact_emailInput: function (res) {
    var postObj = thePage.data.postObj;
    postObj.contactEmail = res.detail.value;
    thePage.setData({
      postObj: postObj
    })
  },
  handleSave: function () {
    if (!thePage.data.postObj.deleteRemark) {
      $Message({
        content: '请填删除原因',
        type: 'warning'
      });
      return;
    }
    if (thePage.data.links.length == 0) {
      $Message({
        content: '请填写附件',
        type: 'warning'
      });
      return;
    }
    if (!thePage.data.postObj.contactName) {
      $Message({
        content: '联系人信息必填',
        type: 'warning',
      });
      return false;
    }
    if (!thePage.data.postObj.contactPhone) {
      $Message({
        content: '联系人电话信息必填',
        type: 'warning',
      });
      return false;
    }
    if (thePage.data.postObj.contactPhone) {
      var is = /^0[\d]{2,3}-[\d]{7,8}$/ //座机格式
      var isPhone = /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/;;// 手机
      if (is.test(thePage.data.postObj.contactPhone) || isPhone.test(thePage.data.postObj.contactPhone)) {

      } else {
        $Message({
          content: '请输入正确的联系方式',
          type: 'warning'
        });
        return false;
      }
    }
    if (thePage.data.postObj.contactEmail) {
      var szReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;//
      if (szReg.test(thePage.data.postObj.contactEmail)) {
      } else {
        $Message({
          content: '请输入正确的联系邮箱',
          type: 'warning'
        });
        return false;
      }
    }

    var postObj = thePage.data.postObj;
    postObj.attaches = JSON.stringify(thePage.data.links);
    thePage.setData({
      postObj: postObj
    })
    console.log(thePage.data.postObj, "postObj");

    app.doPost('/citiao/delete', thePage.data.postObj, null, function (data) {
      console.log(data, "data")
      // $Message({
      //   content: '词条删除成功！',
      //   type: 'success',
      // });
      setTimeout(() => {
        wx.navigateTo({
          url: '../../complete/x?word=词条删除成功&workSeqNo=' + thePage.data.work.workSeqNo +'&index=2&citiao=1',
        })
      }, 800)
    }, 'post');
  },
  onChange: function (res) {
    console.log(res, "res--list");
    var sItem = "links[" + res.currentTarget.dataset.index + "].public";
    this.setData({
      [sItem]: res.detail.value
    })
    console.log(thePage.data.links, "修改后links")
  },
  addLink(e) {
    var e = e;
    let links = thePage.data.links;
    if (typeof e === 'object' && !isNaN(e.length)) {
      e.forEach((item) => {
        item.public = true;
        item.url = decodeURIComponent(item.url);
        if (item.type == 'link') {
          item.typeDec = "参考链接"
        } else if (item.type == 'image') {
          item.typeDec = "参考图片"
        } else if (item.type == 'file') {
          item.typeDec = "参考文件"
        }
      })
      links = links.concat(e);
      this.setData({
        links: links,
      });
    } else {
      e.public = true;
      if (e.type == 'link') {
        e.typeDec = "参考链接"
      } else if (e.type == 'image') {
        e.typeDec = "参考图片"
      } else if (e.type == 'file') {
        e.typeDec = "参考文件"
      }
      e.url = decodeURIComponent(e.url);
      links.push(e);
      this.setData({
        links: links,
      });
    }
    console.log(this.data.links, "lins");
  },
  addReferer(e) {
    this.setData({
      actionsTitle: "添加参考资料请选择以下2种方式提供",
      actionsOpened: true,
      actions: [
        {
          name: '复制粘贴内容链接',
          icon: 'accessory',
        },
        {
          name: '拍照或从相册上传图片',
          icon: 'picture',
        },
      ],
    });
  },
  onActionCancel() {
    this.setData({
      actionsOpened: false
    });
  }
})