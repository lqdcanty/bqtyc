// pages/copyright/related/add/x.js
const app = getApp()
var thePage;
var work_data;
const { $Message } = require('../../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authortypes: [],
    authortype: 0,
    current: [], 
    authIsShow: true,
    showIcon: true,
    scopeRemark:'如果你只是参与制作无需选择权力内容。',
    links: [],  //参考资料
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
    ]
  },
  onActionCancel() {
    this.setData({
      actionsOpened: false
    });
  },
  handleAction(e) {
    console.log("handleAction", e);
    const index = e.detail.index;
    if( index==1){
      wx.navigateTo({
        url: '../../../../components/uploader/c',
      })
    }
    else if (index == 0) {
      wx.navigateTo({
        url: '../../../../components/pasteurl/c',
      })
    }
  },
  addReferer(e) {
    this.setData({
      actionsTitle: "参考资料请选择以下2种方式提供",
      actionsOpened: true,
      actions: [
        {
          name: '复制粘贴引用链接',
          icon: 'accessory',
        },
        {
          name: '拍照或从相册上传图片',
          icon: 'picture',
        },
      ],
    });
  },
  onLoad: function (options) {
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
    console.log(options)
    let work_id = options.workSeqNo;//这里从全局的测试数据中取数据
    thePage.setData({
      workId: work_id,
      rejectStatus: options.rejectStatus ? true : false,
      citiaoClass: options.citiaoClass ? options.citiaoClass : 10,
      token: app.globalData.userInfo.authToken,
      citiaoCode: options.citiaoCode ? options.citiaoCode : '',
      operation: options.operation ? options.operation : '',
      status: options.status ? options.status : '',
      form: options.form ? options.form : '',
      tableType: options.tableType ? options.tableType : 1,
      messageHeight: app.globalData.statusBarHeight + app.globalData.titleBarHeight,
      pageTitle: options.status ? '编辑邻接权' : '新增邻接权'
    });
    thePage.getData();
  },
  getData() {

    app.doPost('/apply/getContact', { token: app.globalData.userInfo.authToken ? app.globalData.userInfo.authToken : '' }, null, function (data) {
    var postObj = thePage.data.postObj;
      postObj.contactName = postObj.contactName ? postObj.contactName : data.result.info.realName;
      postObj.contactEmail = postObj.contactEmail ? postObj.contactEmail : data.result.info.email,
        postObj.contactPhone = postObj.contactPhone ? postObj.contactPhone : data.result.info.phone,
        thePage.setData({
          postObj: postObj,
        });
    }, 'get');
    app.doPost('/personal/initSingature', { workSeqNo: thePage.data.workId }, null, function (data) {
      thePage.setData({
        authortypes: data.result.list.map(item => {
          return item.name
        })
      })
      if (thePage.data.status) {
        app.doPost('/citiao/get', { token: app.globalData.userInfo.authToken, citiaoCode: thePage.data.citiaoCode, tableType: thePage.data.tableType, timestamp: (new Date()).valueOf() }, null, function (data) {
          let _citiao = data.result.model.citiao;
          console.log(thePage.data.authortypes)
          console.log(thePage.data.authortypes.indexOf(_citiao.abutRight.roleName))
          thePage.setData({
            citiao: _citiao,
            basicInfo: _citiao.abutRight,
            authortype: thePage.data.authortypes.indexOf(_citiao.abutRight.roleName) != -1 ? thePage.data.authortypes.indexOf(_citiao.abutRight.roleName) : 0,
            current: thePage.scopeFun(data.result.model.abutCopyrightVo.scopes),
            links: thePage.createLinks(_citiao.attaches)
          })
          console.log(thePage.data.citiao)
        }, 'get');
      }
    }, 'get', null);
    app.doPost('/personal/right/scope', { type: 3 },null, function (data) {
        thePage.setData({
          rightScope:data.result.datas
        })
    }, 'get',null);

    app.doPost('/work/details', { workSeqNo: thePage.data.workId, timestamp: (new Date()).valueOf() }, null, function (data) {
      thePage.setData({
        powerType: data.result.powerType,
        work: data.result.workModel,
      });
    }, 'get');

    if (thePage.data.form == 'e') {
      thePage.getInfo(thePage.data.code)
    }
  },
  scopeFun: function (arr) {
    let newArr = [];
    thePage.data.rightScope.forEach((item, i) => {
      arr.forEach((itemA, i) => {
        if (item.key == itemA) {
          newArr.push(item.value)
        }
      });
    });
    return newArr;
    console.log(newArr)
  },
  onauthorizeEvent: function (e) {
    this.setData({
      authIsShow: e.detail == 1 ? true : false
    });
    app.login(() => {
      thePage.getData()
    });
  },
  rightScopeChange(e) {
    console.log(e)
    const index = this.data.current.indexOf(e.detail.value);
    index === -1 ? this.data.current.push(e.detail.value) : this.data.current.splice(index, 1);
    thePage.setData({
      current: this.data.current,
      scopeRemark: this.data.current.length < 1 ? '如果你只是参与制作无需选择权力内容。' :'邻接权权利归属与录制者，如果你是本作品录制者，请标志标记自己的权利。如果你只是参与制作那么只用署名即可。'
    })
    console.log(thePage.data.current)
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
  linksPublicChange: function (event) {
    let _index = event.currentTarget.dataset.index;
    this.data.links[_index].isPublic = event.detail.value;
    thePage.setData({
      links: this.data.links
    });
  },
  outLink: function (e) {
    if (e.type == 'click' && e.currentTarget.dataset.type == 0) {

      wx.navigateTo({
        url: "../../../../../components/webview/c?title=" + '参考资料' + "&type=权利转让" + "&url=" + app.urlDecode(e.currentTarget.dataset.url),
      })
    } else if (e.type == 'click' && e.currentTarget.dataset.type == 1) {
      wx.previewImage({
        current: e.currentTarget.dataset.url,
        urls: [e.currentTarget.dataset.url],
      })
    }
  },
  createLinks: function (arr) {
    let newArr = [];
    if (!arr) {
      return []
    }
    arr.forEach((p1, p2) => {
      let t = {
        title: p1.fileName,
        url: p1.attachUrl,
        isPublic: p1.isPublic,
        type: p1.attachType,
        typeDec: p1.attachDesc
      }
      newArr.push(t)
    })
    return newArr
  },
  bindRoleValChange(res){
    this.setData({
      authortype: res.detail.value
    })
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
  cancelSave: function () {
    app.doPost('/personal/cancel', { status: thePage.data.status,citiaoCode: thePage.data.citiaoCode, token: thePage.data.token, status: thePage.data.status, timestamp: (new Date()).valueOf() }, null, function (data) {
      $Message({
        content: '该词条已撤销成功',
        type: 'success'
      });
      thePage.backPage()
    })
  },
  formSubmit(e) {
    thePage = this;
    var formData = e.detail.value;
    formData.attaches = this.data.links;
    formData.amountPublic = thePage.data.switch1 ? 1 : 0
    let _rightScope = [];
    let _current = thePage.data.current;
    let _r = thePage.data.rightScope;
    for (var i = 0; i < _current.length; i++) {
      for (var j = 0; j < _r.length; j++) {
        if (_current[i] == _r[j].value) {
          _rightScope.push(_r[j].key)
        }
      }
    }
    formData.rightScope = _rightScope.join(',');
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
    let _citiao = {
      accusationSubject: null,
      attacheExplain: null,
      refCitiaoCode: formData.refCitiaoCode ? formData.refCitiaoCode : '',
      workSeqNo: formData.workSeqNo,
      attaches: _links,
      auditStatus: thePage.data.status,
      attathRemark: formData.attathRemark != '' ? formData.attathRemark:'附件描述',
      citiaoClass: formData.citiaoClass ? formData.citiaoClass : thePage.data.citiaoClass,
      citiaoCode: formData.citiaoCode ? formData.citiaoCode : '',
      contactName: formData.contactName,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      citiaoType: formData.citiaoType ? formData.citiaoType : 4,
      rightScope: formData.rightScope,
      abutRight: {
        creativeWay: formData.creativeWay,
        roleAliasval: formData.roleAliasval,
        authType: thePage.data.authType,
        roleName: formData.roleName,
        roleVal: formData.roleVal,
        rightRemark: formData.rightRemark,
        rightScope: formData.rightScope,
        endTime: null,
        startTime: null,
      }
    }
    console.log(_citiao)

    if (this.data.pageTitle == "编辑邻接权") {
      app.doPost('/citiao/modify', {token: thePage.data.token, citiao: _citiao }, null, function (data) {
        $Message({
          content: '编辑邻接权成功，请等待审核通过!',
          type: 'success'
        });
        thePage.backPage()
      }, 'get');
      return
    }
    app.doPost('/citiao/create', { token: thePage.data.token, citiao: _citiao }, null, function (data) {
      $Message({
        content: '邻接权添加申请成功，请等待审核通过!',
        type: 'success'
      });
      thePage.backPage()
    }, 'get');
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
  onHide: function () {
    this.setData({
      actionsOpened: false
    });
  }
})