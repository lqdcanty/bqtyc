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
    navTitle: "新建人身权",
    showIcon: true,
    fixedTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight + 5,
    authortypes: null,
    authortype: 0,
    work: null,
    powerType: '',
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
    switch1: '',
    links: [],
    title: '',
    current: ['署名权'],
    animal: '姓名',
    checked: false,
    disabled: false,
    postObj: {
      roleName: '',
      roleVal: '',
      roleAliasVal: '',
      createType: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      token: '',
      workSeqNo: '',
      attathRemark:'',
      rightScope: [],
      rightRemark:'',
    },
    contentObj: null,
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
    submitEnable:true
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
  handleDelete: function () {
    wx.navigateTo({
      url: '../../../welcome/x?word=撤销词条',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    var user = app.globalData.userInfo;
    var itemTaken = "postObj.token";
    var itemWorkSeqNo = 'postObj.workSeqNo';
    if (options.delete == 1) {
      thePage.setData({
        deleteButton: true
      })
    }
    thePage.setData({
      [itemTaken]: user ? user.authToken : '',
      [itemWorkSeqNo]: options.workSeqNo,
      token: user ? user.authToken : '' 
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
    // apply / getContact ? token = xxx
    app.doPost('/apply/getContact', { token: user ? user.authToken : '' }, null, function (data) {
      var postObj = thePage.data.postObj;
      postObj.contactName = data.result.info.realName;
      postObj.contactEmail = data.result.info.email,
        postObj.contactPhone = data.result.info.phone,
      thePage.setData({
        postObj: postObj,
      });
    }, 'get');

    app.doPost('/personal/initSingature', { workSeqNo: options.workSeqNo, timestamp: (new Date()).valueOf() }, null, function (data) {
      var authortypes = data.result.list;
      var authortypesArr = [];
      var roleName ='postObj.roleName'
      authortypes.forEach((item) => {
        authortypesArr.push(item.name)
      })
      thePage.setData({
        authortypes: authortypesArr,
        [roleName]: authortypesArr[0]
      });
    }, 'get');
    
    app.doPost('/personal/right/scope', { type: '1' }, null, function (data) {
      thePage.setData({
        roleArr: data.result.datas
      });
    }, 'get');
  },
  attathRemarkInput: function (e) {
    var postObj = thePage.data.postObj;
    postObj.attathRemark = e.detail.value;
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
  rightRemarkInput: function (res){
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
    if (thePage.data.postObj.signature == "") {
      
      $Message({
        content: '请输入角色名称',
        type: 'warning'
      });
      return;
    }
    if (thePage.data.postObj.roleVal == "") {
      $Message({
        content: '请输入署名人名称',
        type: 'warning'
      });
      return;
    }
    if (thePage.data.current.length ==0) {
      $Message({
        content: '请选择权利范围',
        type: 'warning'
      });
      return;
    }
    if (thePage.data.links.length == 0) {
      $Message({
        content: '请添加版权词条参考资料附件',
        type: 'warning'
      });
      return;
    }
    if (thePage.data.postObj.attathRemark=='') {
      $Message({
        content: '附件描述不能为空',
        type: 'warning'
      });
      return;
    }
    if (!thePage.data.postObj.contactName) {
      thePage.setData({ submitEnable: !thePage.data.submitEnable })
      $Message({
        content: '联系人信息必填',
        type: 'warning',
      });
      return false;
    }
    if (!thePage.data.postObj.contactPhone) {
      thePage.setData({ submitEnable: !thePage.data.submitEnable })
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
        thePage.setData({ submitEnable: !thePage.data.submitEnable })
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
        thePage.setData({ submitEnable: !thePage.data.submitEnable })
        $Message({
          content: '请输入正确的联系邮箱',
          type: 'warning'
        });
        return false;
      }
    }
    //
    var postObj = thePage.data.postObj;
    postObj.attaches = JSON.stringify(thePage.data.links);
    thePage.setData({
      postObj: postObj
    })
    var currentNumber = [];
    thePage.data.current.forEach((item) => {
      console.log(item)
      thePage.data.roleArr.forEach((type) => {
        console.log(type)
        if (item == type.value) {
          currentNumber.push(type.key)
        }
      })
    })
    postObj.rightScope = currentNumber.join();
    console.log(thePage.data.postObj, "postObj");
    //thePage.setData({ submitEnable: !thePage.data.submitEnable })
    app.doPost('/personal/create/new', thePage.data.postObj, null, function (data) {
      $Message({
        content: '词条新建成功！',
        type: 'success',
      });
      thePage.setData({ submitEnable: true })
      setTimeout(() => {
        wx.navigateTo({
          url: '../../complete/x?word=词条创建成功&workSeqNo=' + thePage.data.work.workSeqNo + '&index=2&citiao=1',
        })
      }, 1000)
    },function(){
      //thePage.setData({ submitEnable: !thePage.data.submitEnable })
    } ,'post');
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
        if (item.type == 'link'){
          item.typeDec = "参考链接"
        } else if (item.type == 'image'){
          item.typeDec = "参考图片"
        } else if (item.type == 'file'){
          item.typeDec = "参考文件"
        }
      })
      if(e.images&&e.images.length>0){
        item.cover = e.images[0];
      }
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
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})