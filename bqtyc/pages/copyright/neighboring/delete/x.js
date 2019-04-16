// pages/copyright/related/add/x.js
const { $Message } = require('../../../../dist/base/index');
const app = getApp()
var thePage;
var work_data;
Page({

  /**
   * 页面的初始数据
   */ 
  data: {
    navTitle: "删除领接权",
    showIcon: true,
    fixedTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight + 5,
    authortypes: null,
    authortype: 0,
    work: null,
    powerType: '',
    authIsShow:true,
    deleteButton: false,
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
    rightScope: [{ type: '20', value: "全部财产权" }, { type: '5', value: "复制权" }, { type: '6', value: "发行权" }, { type: '7', value: "出租权" }, { type: '8', value: "展览权" }, { type: '9', value: "表演权" }, { type: '10', value: "放映权" }, { type: '11', value: "广播权" }, { type: '12', value: "信网传播权" }, { type: '13', value: "摄制权" }, { type: '14', value: "改编权" }, { type: '15', value: "翻译权" }, { type: '16', value: "汇编权" }, { type: '17', value: "其他" }],
    switch1: '',
    links: [],
    title: '',
    checked: false,
    disabled: false,
    token: '',
    editButton: true,
    postObj: {
      contactName: '',
      contactEmail: '',
      contactPhone: ''
    },
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
    navTitle:'',
    citiaoCode: '',
    contentObj: null,
    status: '',
    workSeqNo: '',
    rightScopeObj:{}
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
        url: '../../../../../components/uploader/c',
      })
    }
    else if (index == 0) {
      wx.navigateTo({
        url: '../../../../../components/pasteurl/c',
      })
    }
    thePage.setData({
      actionsOpened: false
    });
  },
  outLink: function (e) {
    if (e.type == 'click' && e.currentTarget.dataset.type == 0) {
      wx.navigateTo({
        url: "../../../../../components/webview/c?title=" + '参考资料' + "&type=财产权" + "&url=" + app.urlDecode(e.currentTarget.dataset.url),
      })
    } else if (e.type == 'click' && e.currentTarget.dataset.type == 1) {
      wx.previewImage({
        current: e.currentTarget.dataset.url,
        urls: [e.currentTarget.dataset.url],
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    thePage = this;
    let launchOptions = wx.getLaunchOptionsSync()
    if (launchOptions.scene != 1001 && launchOptions.scene != 1005 && launchOptions.scene != 1006) {
      thePage.setData({
        backUrl: '../../../../index/x'
      })
    }
    wx.getSetting({
      success: setRes => {
        var t = setRes.authSetting['scope.userInfo'];
        if (t == 'undefined ' || t == null) {
          thePage.setData({
            authIsShow: false
          });
        } else {
          if (!app.globalData.userInfo.authToken) {
            app.login(() => {
              thePage.getData()
            });
          }
        }
      }
    });
    if (!options) {
      return;
    }
    var user = app.globalData.userInfo;
    thePage.setData({
      token: user ? user.authToken : '',
      status: options.status,
      workSeqNo: options.workSeqNo,
      rejectStatus: options.rejectStatus ? true : false,
      operation: options.operation ? options.operation : '',
      messageHeight: app.globalData.statusBarHeight + app.globalData.titleBarHeight,
      citiaoCode: options.citiaoCode,
      tableType: options.tableType ==2 ? 2 : 1
    });
    thePage.getData()
  },
  getData(){
    app.doPost('/apply/getContact', { token: app.globalData.userInfo.authToken ? app.globalData.userInfo.authToken : '' }, null, function (data) {
      var postObj = thePage.data.postObj;
      postObj.contactName = data.result.info.realName;
      postObj.contactEmail = data.result.info.email,
        postObj.contactPhone = data.result.info.phone,
        thePage.setData({
          postObj: postObj,
        });
    }, 'get');
    app.doPost('/personal/right/scope', { type: 3 }, null, function (data) {
      thePage.setData({
        rightScope: data.result.datas
      })
      app.doPost('/citiao/get', { token: app.globalData.userInfo.authToken, citiaoCode: thePage.data.citiaoCode, tableType: thePage.data.tableType, timestamp: (new Date()).valueOf() }, null, function (data) {
        let _citiao = data.result.model.citiao;
        thePage.setData({
          citiao: _citiao,
          basicInfo: _citiao.abutRight,
          rightScope: thePage.scopeFun(data.result.model.abutCopyrightVo.scopes),
          links: thePage.createLinks(_citiao.attaches)
        })
        if (data.result.model.citiao.deleteApplyItem) {
          thePage.setData({
            deleteRemark: _citiao.deleteApplyItem.deleteRemark,
            links: thePage.createLinks(_citiao.deleteApplyItem.attaches)
          });
        }
      }, 'get');
    }, 'get', null);
    app.doPost('/work/details', { workSeqNo: thePage.data.workSeqNo }, null, function (data) {
      var postObj = thePage.data.postObj;
      postObj.samllClass = data.result.powerType;
      thePage.setData({
        work: data.result.workModel,
        powerType: data.result.powerType,
        postObj: postObj
      });
    }, 'get');
  },
  scopeFun: function (arr) {
    let newArr = [];
    thePage.data.rightScope.forEach((item, i) => {
      arr.forEach((itemA, i) => {
        if (item.key == itemA) {
          item.seleted=true
        }
      });
    });
    return thePage.data.rightScope;
  },
  onauthorizeEvent: function (e) {
    this.setData({
      authIsShow: e.detail == 1 ? true : false
    });
    app.login(this);
  },
  createLinks: function (arr) {
    let newArr = [];
    arr.forEach((p1, p2) => {
      let t = {
        title: p1.fileName ? p1.fileName:'',
        url: p1.attachUrl,
        isPublic: p1.isPublic,
        type: p1.attachType,
        typeDec: p1.attachDesc ? p1.attachDesc:''
      }
      newArr.push(t)
    })
    return newArr
  },
  linksPublicChange: function (event) {
   
    let _index = event.currentTarget.dataset.index;
    this.data.links[_index].isPublic = event.detail.value;
    console.log(this.data.links[_index].isPublic)
    thePage.setData({
      links: this.data.links
    });
  },

  deleteInput: function (res) {
   
    var postObj = thePage.data.postObj;
    postObj.deleteRemark = res.detail.value;
    thePage.setData({
      postObj: postObj
    })
  },
  backPage() {
    setTimeout(() => {
      var pages = getCurrentPages(); // 获取页面栈
      var prevPage = pages[pages.length - 2];
      wx.navigateBack({
        success: function () {
          prevPage.getData(); // 执行前一个页面的onLoad方法
        }
      });
    }, 800)
  },
  cancelSave: function () {
    app.doPost('/personal/cancel', { citiaoCode: thePage.data.citiaoCode, token: thePage.data.token, status: thePage.data.status, timestamp: (new Date()).valueOf() }, null, function (data) {
      $Message({
        content: '该词条已撤销成功',
        type: 'success'
      });
      thePage.backPage()
    })
  },
  outLink: function (e) {
    if (e.type == 'click' && e.currentTarget.dataset.type == 0) {

      wx.navigateTo({
        url: "../../../../../components/webview/c?title=" + '参考资料' + "&type=权利质押" + "&url=" + app.urlDecode(e.currentTarget.dataset.url),
      })
    } else if (e.type == 'click' && e.currentTarget.dataset.type == 1) {
      wx.previewImage({
        current: e.currentTarget.dataset.url,
        urls: [e.currentTarget.dataset.url],
      })
    }
  },
  swipoutChange: function (e) {
    console.log(e, "detail");
    var links = thePage.data.links;
    if (e.detail.index == 0) {
      wx.showModal({
        title: "提示",
        content: '确定要删除该条附件吗？',
        success: function (res) {
          if (res.confirm) {
            links.splice(e.currentTarget.dataset.index, 1);
            thePage.setData({ links: links })
          } else if (res.cancel) {
          }
        }
      })

    }
  },
  formSubmit(e) {
    thePage = this;
    var formData = e.detail.value;
    if (!formData.deleteRemark) {
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
    if (!formData.contactName) {
      $Message({
        content: '联系人信息必填',
        type: 'warning',
      });
      return false;
    }
    if (!formData.contactPhone) {
      $Message({
        content: '联系人电话信息必填',
        type: 'warning',
      });
      return false;
    }
    if (formData.contactPhone) {
      var is = /^0[\d]{2,3}-[\d]{7,8}$/ //座机格式
      var isPhone = /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/;;// 手机
      if (is.test(formData.contactPhone) || isPhone.test(formData.contactPhone)) {

      } else {
        $Message({
          content: '请输入正确的联系方式',
          type: 'warning'
        });
        return false;
      }
    }
    if (formData.contactEmail) {
      var szReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;//
      if (szReg.test(formData.contactEmail)) {
      } else {
        $Message({
          content: '请输入正确的联系邮箱',
          type: 'warning'
        });
        return false;
      }
    }
    let _links = [];
    thePage.data.links.forEach((p1, p2) => {
      _links.push({
        attachDesc: p1.typeDec,
        fileName: p1.title,
        attachType: p1.type,
        isPublic: p1.isPublic ? 1 : 0,
        attachUrl: p1.url
      })
    })
    let delete_citiao=thePage.data.citiao
    console.log(delete_citiao)
    formData.attaches = _links;
    delete_citiao.auditStatus = thePage.data.status,
    delete_citiao.deleteApplyItem=formData
    app.doPost('/citiao/remove', { token: thePage.data.token, citiao: JSON.stringify(delete_citiao)}, null, function (data) {
      console.log(data, "data")
      $Message({
        content: '词条删除成功！',
        type: 'success',
      });
      thePage.backPage()
    }, 'post');
  },
  addLink(e) {
    thePage = this;
    var e = e;
    e.isPublic = false;
    e.description = e.description ? e.description : "";
    e.url = decodeURIComponent(e.url);
    if (e.type == 'link') {
      e.type = 0;
      e.typeDec = '参考链接';
    } else if (e.type == 'image') {
      e.type = 1;
      e.typeDec = '参考图片';
    } else if (e.type == 'file') {
      e.type = 2;
      e.typeDec = '参考文件';
    }
    console.log(e, "link");
    let links = thePage.data.links;
    if (typeof e === 'object' && !isNaN(e.length)) {
      links = links.concat(e);
      thePage.setData({
        links: links,
      });
    } else {
      links.push(e);
      thePage.setData({
        links: links,
        title: e.title,
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