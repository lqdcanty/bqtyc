// pages/copyright/related/add/x.js
const { $Message } = require('../../../../../dist/base/index');
const app = getApp();
var thePage;
var work_data;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currencies: ["人民币", "美元"],
    currency: 0,
    currency2: 0,
    currency3: 0,
    postObj: {
      contactName: '',
      contactEmail: '',
      contactPhone: ''
    },
    units: ["万", "亿"],
    moneyType: 'rmb', //金额类型
    amountUnit: "万", //转让涉及金额单位
    amountInfo:{
      moneyType: 'rmb',
      amountPublic:1,
      amountUnit: "万"
    },    //评估价值
    principalDebt: {
      moneyType: 'rmb',
      amountPublic: 1,
      amountUnit: "万"
    },    //主债务
    guarantee: {
      moneyType: 'rmb',
      amountPublic: 1,
      amountUnit: "万"
    },    //担保
    rightScope: [{ type: '20', value: "全部财产权" }, { type: '5', value: "复制权" }, { type: '6', value: "发行权" }, { type: '7', value: "出租权" }, { type: '8', value: "展览权" }, { type: '9', value: "表演权" }, { type: '10', value: "放映权" }, { type: '11', value: "广播权" }, { type: '12', value: "信网传播权" }, { type: '13', value: "摄制权" }, { type: '14', value: "改编权" }, { type: '15', value: "翻译权" }, { type: '16', value: "汇编权" }, { type: '17', value: "其他" }],
    unit: 0,
    unit2: 0,
    unit3: 0,
    showIcon: true,
    regions: ["所有地区", "中国大陆地区", "中国香港地区", "中国台湾地区", "中国澳门地区"],
    region: 0,
    endTime:'请选择日期',
    startTime: '请选择日期',
    links: [],
    switch1: true,
    switch2: true,
    switch3: true,
    switch4: true,
    switch5: true,
    authIsShow: true,
    timePublic:1,
    endTimePublic:1,
    formData:{},
    workSeqNo:'',
    current: [],
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
    title:'权利质押',
  },

  handleAction(e) {
    console.log("handleAction", e);
    const index = e.detail.index;
    if (index == 1) {
      wx.navigateTo({
        url: '/components/uploader/c',
      })
    }
    else if (index == 0) {
      wx.navigateTo({
        url: '/components/pasteurl/c',
      })
    }
    this.setData({
      actionsOpened: false
    });
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    console.log(options)
    let thePage=this;
    let launchOptions = wx.getLaunchOptionsSync()
    if (launchOptions.scene != 1001 && launchOptions.scene != 1005 && launchOptions.scene != 1006 ){
      thePage.setData({
        backUrl:'../../../../index/x'
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
    thePage.setData({
      rejectStatus: options.rejectStatus == 1 ? true : false,
      workSeqNo: options.workSeqNo ? options.workSeqNo:'',
      citiaoClass: options.citiaoClass ? options.citiaoClass : "",
      token: app.globalData.userInfo.authToken,
      citiaoCode: options.citiaoCode ? options.citiaoCode : '',
      operation: options.operation ? options.operation : '',
      status: options.status ? options.status : '',
      tableType:options.tableType ? options.tableType : 1,
      messageHeight: app.globalData.statusBarHeight + app.globalData.titleBarHeight,
      pageTitle: options.status ? '编辑权利质押' : '新增权利质押'
    });
    thePage.getData()
  },
  getData(){
    let thePage = this;
    app.doPost('/apply/getContact', { token: app.globalData.userInfo.authToken ? app.globalData.userInfo.authToken : '' }, null, function (data) {
      var postObj = thePage.data.postObj;
      postObj.contactName = data.result.info.realName;
      postObj.contactEmail = data.result.info.email,
        postObj.contactPhone = data.result.info.phone,
        thePage.setData({
        postObj: postObj,
        });
    }, 'get');
    if (thePage.data.status) {
      app.doPost('/citiao/get', { token: app.globalData.userInfo.authToken, citiaoCode: thePage.data.citiaoCode, tableType: thePage.data.tableType, timestamp: (new Date()).valueOf() }, null, function (data) {

        let _citiao = data.result.model.citiao;
        let _principalDebt = _citiao.pledgeRight.principalDebt ? _citiao.pledgeRight.principalDebt : '';
        let _evaluation = _citiao.pledgeRight.evaluation ? _citiao.pledgeRight.evaluation : '';
        let _guarantee = _citiao.pledgeRight.guarantee ? _citiao.pledgeRight.guarantee : '';
        thePage.setData({
          citiao: _citiao,
          startTime: thePage.createTime(_citiao.pledgeRight.startTime),
          endTime: thePage.createTime(_citiao.pledgeRight.endTime),
          switch1: _citiao.pledgeRight.startTimePublic == 1 ? true : false,
          switch2: _citiao.pledgeRight.endTimePublic == 1 ? true : false,

          currency: thePage.data.currencies.indexOf(_evaluation.moneyType ? _evaluation.moneyType : "人民币"),
          currency2: thePage.data.currencies.indexOf(_principalDebt.moneyType ? _principalDebt.moneyType : "人民币"),
          currency3: thePage.data.currencies.indexOf(_guarantee.moneyType ? _guarantee.moneyType : "人民币"),
          unit1: thePage.data.units.indexOf(_evaluation.amountUnit ? _evaluation.amountUnit : "万"),
          unit2: thePage.data.units.indexOf(_principalDebt.amountUnit ? _principalDebt.amountUnit : "万"),
          unit3: thePage.data.units.indexOf(_guarantee.amountUnit ? _guarantee.amountUnit : "万"),

          switch3: _evaluation.amountPublic == 1 ? true : false,
          switch4: _principalDebt.amountPublic == 1 ? true : false,
          switch4: _guarantee.amountPublic == 1 ? true : false,

          current: thePage.scopeFun(_citiao.pledgeRight.rightScope),
          links: thePage.createLinks(_citiao.attaches)
        })
      }, 'get');
    }
    app.doPost('/work/details', { workSeqNo: thePage.data.workSeqNo, timestamp: (new Date()).valueOf() }, null, function (data) {
      thePage.setData({
        powerType: data.result.powerType,
        work: data.result.workModel,
      });
    }, 'get');
  },
  onauthorizeEvent: function (e) {
    this.setData({
      authIsShow: e.detail == 1 ? true : false
    });
    app.login(() => {
      thePage.getData()
    });
  },
  createTime:function(time){
    let date = new Date(time);
    let _time = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
    return _time
  },
  createLinks: function (arr) {
    let newArr = [];
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
  scopeFun: function (str) {
    let newArr = [];
    this.data.rightScope.forEach(function (item, p2) {
      if (item.type == str) {
        newArr.push(item.value)
      }
    });
    return newArr;
  },
  bindDateChange: function (res) {
    this.setData({
      startTime: res.detail.value,
    })
  },
  bindDateChange2: function (res) {
    this.setData({
      endTime: res.detail.value,
    })
  },
  bindCurrencyChange: function (res) {
    this.setData({
      currency: res.detail.value
    })
  },
  bindCurrencyChange2: function (res) {
    this.setData({
      currency2: res.detail.value
    })
  },
  bindCurrencyChange3: function (res) {
    this.setData({
      currency3: res.detail.value
    })
  },
  bindUnitChange: function (res) {
    this.setData({
      unit: res.detail.value
    })
  },
  bindUnitChange2: function (res) {
    this.setData({
      unit2: res.detail.value
    })
  },
  bindUnitChange3: function (res) {
    this.setData({
      unit3: res.detail.value
    })
  },
  onChange: function (res) {
    this.setData({
      switch1: res.detail.value
    })
  },
  onChange2: function (res) {
    this.setData({
      switch2: res.detail.value
    })
  },
  onChange3: function (res) {
    this.setData({
      switch3: res.detail.value
    })
  },
  onChange4: function (res) {
    this.setData({
      switch4: res.detail.value
    })
  },
  onChange5: function (res) {
    this.setData({
      switch5: res.detail.value
    })
  },

  rightScopeChange(e) {
    thePage=this;
    if (e.detail.value == "全部财产权") {
      this.setData({
        current: ['全部财产权']
      });
    } else {
      if (thePage.data.current.indexOf('全部财产权') != -1) {
        thePage.data.current = [];
      }
      const index = thePage.data.current.indexOf(e.detail.value);
      index === -1 ? thePage.data.current.push(e.detail.value) : thePage.data.current.splice(index, 1);
      thePage.setData({
        current: thePage.data.current
      });
    }

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
      // if (thePage.data.title && thePage.data.title != "") {
      //   e.title = thePage.data.title;
      // }
      thePage.setData({
        links: links,
        //title: e.length + '张图片',
      });
    } else {
      links.push(e);
      // if (this.data.title && this.data.title != "") {
      //   e.title = this.data.title;
      // }
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
  onActionCancel() {
    this.setData({
      actionsOpened: false
    });
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
    thePage=this;
    app.doPost('/personal/cancel', { citiaoCode: thePage.data.citiaoCode, token: thePage.data.token, status: thePage.data.status, timestamp: (new Date()).valueOf() }, null, function (data) {
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
    let _rightScope = [];
    let _current = thePage.data.current;
    let _r = thePage.data.rightScope;
    for (var i = 0; i < _current.length; i++) {
      for (var j = 0; j < _r.length; j++) {
        if (_current[i] == _r[j].value) {
          _rightScope.push(_r[j].type)
        }
      }
    }
    formData.rightScope = _rightScope.join(',');
    console.log(formData.attaches)
    console.log(this.data.links)
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
      refCitiaoCode: formData.refCitiaoCode ? formData.refCitiaoCode : '',
      workSeqNo: formData.workSeqNo,
      attaches: _links,
      attathRemark: formData.attathRemark,
      citiaoClass: formData.citiaoClass ? formData.citiaoClass : thePage.data.citiaoClass,
      citiaoCode: formData.citiaoCode ? formData.citiaoCode : '',
      contactName: formData.contactName,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      auditStatus: thePage.data.status,
      citiaoType: formData.citiaoType ? formData.citiaoType : 2,
      rightScope: formData.rightScope,
      pledgeRight: {
        evaluation: {
          amount: formData.amount1,
          company: formData.company,
          amountDesc: formData.company,
          amountPublic: thePage.data.switch3 ? 1 : 0,
          amountUnit: formData.amountUnit1,
          moneyType: formData.moneyType1
        },
        principalDebt: {
          amount: formData.amount2,
          amountDesc: formData.amountDesc1,
          amountPublic: thePage.data.switch4 ? 1 : 0,
          amountUnit: formData.amountUnit2,
          moneyType: formData.moneyType2
        },
        guarantee: {
          amount: formData.amount3,
          amountDesc: formData.amountDesc2,
          amountPublic: thePage.data.switch5 ? 1 : 0,
          amountUnit: formData.amountUnit3,
          moneyType: formData.moneyType3
        },

        endTime: new Date(formData.endTime).getTime(),
        endTimePublic: thePage.data.switch2 ? 1 : 0,
        fromName: formData.fromName,
        rightRemark: formData.rightRemark,
        rightScope: formData.rightScope,
        startTime: new Date(formData.startTime).getTime(),
        startTimePublic: thePage.data.switch1 ? 1 : 0,
        toName: formData.toName
      }
    }
    console.log(_citiao)

    if (this.data.pageTitle == "编辑许可使用") {
      app.doPost('/citiao/modify', { token: thePage.data.token, citiao: _citiao }, null, function (data) {
        $Message({
          content: '编辑许可使用权保存成功，请等待审核通过!',
          type: 'success'
        });
        thePage.backPage()
      }, 'get');
      return
    }
    app.doPost('/citiao/create', { token: thePage.data.token, citiao: _citiao }, null, function (data) {
      $Message({
        content: '许可使用权添加申请成功，请等待审核通过!',
        type: 'success'
      });
      thePage.backPage()
    }, 'get');
  }
})