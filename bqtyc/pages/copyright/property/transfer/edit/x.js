// pages/copyright/related/add/x.js
const app = getApp()
var thePage;
var work_data;
const { $Message } = require('../../../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    modes: ["转让", "赠予","继承", "承受"],
    modesValue: [4,5,6,7],
    mode: 0,
    citiaoCode: '',//词条CODE
    authType:'4', //转移方式
    links: [],  //参考资料
    currencies: ["人民币", "美元"],
    moneyType:'rmb', //金额类型
    amountUnit: "万", //转让涉及金额单位
    currency: 0,
    units: ["万", "亿"],
    unit: 0,
    regions: ["所有地区", "中国大陆地区", "中国香港地区", "中国台湾地区", "中国澳门地区"],
    rightScope: [{ type: '20', value: "全部财产权" }, { type: '5', value: "复制权" }, { type: '6', value: "发行权" }, { type: '7', value: "出租权" }, { type: '8', value: "展览权" }, { type: '9', value: "表演权" }, { type: '10', value: "放映权" }, { type: '11', value: "广播权" }, { type: '12', value: "信网传播权" }, { type: '13', value: "摄制权" }, { type: '14', value: "改编权" }, { type: '15', value: "翻译权" }, { type: '16', value: "汇编权" }, { type: '17', value: "其他" }],
    region: 0,
    current:[],  //权力范围
    switch1:true,
    authIsShow:true,
    postObj: {
      contactName: '',
      contactEmail: '',
      contactPhone: ''
    },
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
    appearCountry:"所有地区", //地域范围
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
        url: '../../../../../components/uploader/c',
      })
    }
    else if (index == 0) {
      wx.navigateTo({
        url: '../../../../../components/pasteurl/c',
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
          if (!app.globalData.userInfo.authToken){
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
    let work_id = options.workSeqNo;//这里从全局的测试数据中取数据
    thePage.setData({
      workId: work_id,
      rejectStatus: options.rejectStatus == 1 ? true : false,
      citiaoClass: options.citiaoClass ? options.citiaoClass : "",
      token: app.globalData.userInfo.authToken,
      citiaoCode: options.citiaoCode ? options.citiaoCode : '',
      operation: options.operation ? options.operation : '',
      status: options.status ? options.status : '',
      form: options.form ? options.form : '',
      tableType: options.tableType ? options.tableType : 1,
      messageHeight: app.globalData.statusBarHeight + app.globalData.titleBarHeight,
      pageTitle: options.status ? '编辑权利转移' : '新增权利转移'
    });
    thePage.getData();
  },
  getData(){
    app.doPost('/apply/getContact', { token: app.globalData.userInfo.authToken ? app.globalData.userInfo.authToken : '' }, null, function (data) {
      var postObj = thePage.data.postObj;
      postObj.contactName = data.result.info.realName;
      postObj.contactEmail = data.result.info.email,
        postObj.contactPhone =data.result.info.phone,
        thePage.setData({
        postObj: postObj,
        });
    }, 'get');
    if (thePage.data.status) {
      app.doPost('/citiao/get', { token: app.globalData.userInfo.authToken, citiaoCode: thePage.data.citiaoCode, tableType: thePage.data.tableType, timestamp: (new Date()).valueOf() }, null, function (data) {

        let _citiao = data.result.model.citiao;
        let _moneyType = thePage.objIsNull(_citiao.transferRight.amountInfo)
        thePage.setData({
          citiao: _citiao,
          amountInfo: _moneyType,
          region: thePage.data.regions.indexOf(_citiao.transferRight.appearCountry) != -1 ? thePage.data.regions.indexOf(_citiao.transferRight.appearCountry) : 0,
          currency: thePage.data.currencies.indexOf(_moneyType.moneyType) != -1 ? thePage.data.currencies.indexOf(_moneyType.moneyType) : 0,
          unit: thePage.data.units.indexOf(_moneyType.amountUnit) != -1 ? thePage.data.units.indexOf(_moneyType.amountUnit) : 0,
          switch1: _moneyType.amountPublic == 1 ? true : false,
          mode: thePage.data.modesValue.indexOf(_citiao.transferRight.authType) != -1 ? thePage.data.modesValue.indexOf(_citiao.transferRight.authType) : 0,
          current: thePage.scopeFun(_citiao.transferRight.rightScope),
          links: thePage.createLinks(_citiao.attaches)
        })
      }, 'get');
    }
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
  onauthorizeEvent: function (e) {
    this.setData({
      authIsShow: e.detail == 1 ? true : false
    });
    app.login(()=>{
      thePage.getData()
    });
  },
  objIsNull:function(obj){
    if(!obj){
      return {
        amount: '',
        amountDesc: '',
        amountPublic: true,
        amountUnit: '',
        moneyType: ''
      }
    }else{
      Object.keys(obj).forEach(function (key) {
        console.log(key, obj[key]);
        if (!obj[key]){
          if (!obj[key] && key == 'amountPublic') {
            obj[key] = 1
          }else{
            obj[key]=''
          }
        }
      })
      return obj
    }
  },
  createLinks: function (arr) {
    let newArr = [];
    if(!arr){
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
  scopeFun: function (str) {
    let newArr = [];
    this.data.rightScope.forEach(function(item,p2) {
      if (item.type == str) {
        newArr.push(item.value)
      }
    });
    return newArr;
  },
  getInfo:function(code){
    app.doPost('/transfe/init?', { citiaoCode: code, status:1,timestamp: (new Date()).valueOf() }, null, function (data) {
      thePage.setData({
        powerType: data.result.powerType,
        work: data.result.workModel,
      });
    }, 'get');
  },
  bindModeChange: function (res) {
    this.setData({
      mode: res.detail.value,
      authType: this.data.modesValue[res.detail.value]
    })
  },
  bindRegionChange: function (res) {
    this.setData({
      region: res.detail.value,
      appearCountry: this.data.regions[res.detail.value]
    })
  },
  bindCurrencyChange: function (res) {
    this.setData({
      currency: res.detail.value,
      moneyType: res.detail.value == 0 ? 'rmb':'dollar'
    })
  },
  bindUnitChange: function (res) {
    this.setData({
      unit: res.detail.value,
      amountUnit: this.data.units[res.detail.value]
    })
  },
  onChange: function (event){
    console.log(event.detail)
    this.setData({
      switch1: event.detail.value
    })
  },
  rightScopeChange(e) {
    
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
    e.description = e.description ? e.description:"";
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
  linksPublicChange: function (event){
    let _index=event.currentTarget.dataset.index;
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
        url: "../../../../../components/webview/c?title=" + '参考资料' + "&type=权利转让" + "&url=" + app.urlDecode(e.currentTarget.dataset.url),
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
  cancelSave: function () {
    app.doPost('/personal/cancel', { citiaoCode: thePage.data.citiaoCode, token: thePage.data.token, status: thePage.data.status, timestamp: (new Date()).valueOf() }, null, function (data) {
      $Message({
        content: '该词条已撤销成功',
        type: 'success'
      });
      thePage.backPage()
    })
  },
  formSubmit(e) {
    thePage=this;
    var formData = e.detail.value;
    formData.attaches = this.data.links;
    formData.amountPublic = thePage.data.switch1 ? 1 : 0   
    let _rightScope = [];
    let _current = thePage.data.current;
    let _r = thePage.data.rightScope;
    for (var i = 0; i < _current.length;i++){
      for (var j = 0; j < _r.length; j++) {
        if (_current[i] == _r[j].value) {
          _rightScope.push(_r[j].type)
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
      accusationSubject:null,
      attacheExplain:null,
      refCitiaoCode: formData.refCitiaoCode ? formData.refCitiaoCode : '',
      workSeqNo: formData.workSeqNo,
      attaches: _links,
      auditStatus: thePage.data.status,
      attathRemark: formData.attathRemark,
      citiaoClass: formData.citiaoClass ? formData.citiaoClass : thePage.data.citiaoClass,
      citiaoCode: formData.citiaoCode ? formData.citiaoCode : '',
      contactName: formData.contactName,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      citiaoType: formData.citiaoType ? formData.citiaoType : 2,
      rightScope: formData.rightScope,
      transferRight: {
        amountInfo: {
          amount: formData.amount,
          amountDesc: formData.amountDesc,
          amountPublic: formData.amountPublic,
          amountUnit: formData.amountUnit,
          moneyType: formData.moneyType
        },
        appearCountry: formData.appearCountry,
        appearCountryDesc: formData.appearCountry,
        authType: thePage.data.authType,
        fromName: formData.fromName,
        rightRemark: formData.rightRemark,
        rightScope: formData.rightScope,
        fromAlias: formData.fromName,
        endTime:null,
        startTime:null,
        toName: formData.toName,
        toAlias: formData.toName
      }
    }
    console.log(_citiao)

    if (this.data.pageTitle == "编辑权利转移") {
      app.doPost('/citiao/modify', { token: thePage.data.token, citiao: _citiao }, null, function (data) {
        $Message({
          content: '编辑权利转移权保存成功，请等待审核通过!',
          type: 'success'
        });
        thePage.backPage()
      }, 'get');
      return
    }
    app.doPost('/citiao/create', { token: thePage.data.token, citiao: _citiao }, null, function (data) {
      $Message({
        content: '权力转移添加申请成功，请等待审核通过!',
        type: 'success'
      });
      thePage.backPage()
    }, 'get');
  },
  onHide: function () {
    this.setData({
      actionsOpened: false
    });
  }
})