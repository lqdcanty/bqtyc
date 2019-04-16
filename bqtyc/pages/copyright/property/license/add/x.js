// pages/copyright/related/add/x.js
const app = getApp()
var thePage;
const { $Message } = require('../../../../../dist/base/index');
var work_data;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    modes: ["专有许可","非专有许可"],
    modesValue: [2,3],
    authType:2,
    mode: 0,
    postObj: {
      contactName: '',
      contactEmail: '',
      contactPhone: ''
    },
    authIsShow: true,
    links: [],  //参考资料
    currencies: ["人民币", "美元", "欧元", "日元", "英镑",],
    currency: 0,
    currency2: 0,
    citiaoCode:'',
    units: ["万", "亿"],
    unit: 0,
    unit2:0,
    regions: ["所有地区", "中国大陆地区", "中国香港地区", "中国台湾地区", "中国澳门地区","其他"],
    region: 0,
    rightScope: [{ type: '20', value: "全部财产权" }, { type: '5', value: "复制权" }, { type: '6', value: "发行权" }, { type: '7', value: "出租权" }, { type: '8', value: "展览权" }, { type: '9', value: "表演权" }, { type: '10', value: "放映权" }, { type: '11', value: "广播权" }, { type: '12', value: "信网传播权" }, { type: '13', value: "摄制权" }, { type: '14', value: "改编权" }, { type: '15', value: "翻译权" }, { type: '16', value: "汇编权" }, { type: '17', value: "其他" }],
    current: [],  //权力范围
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
    permitRight:{}
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
        url: '/components/uploader/c',
      })
    }
    else if (index == 0) {
      wx.navigateTo({
        url: '/components/pasteurl/c',
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
    let work_id = options.workSeqNo;//这里从全局的测试数据中取数据
    thePage.setData({
      workId: work_id,
      rejectStatus: options.rejectStatus==1 ? true : false,
      citiaoClass: options.citiaoClass ? options.citiaoClass:"",
      token: app.globalData.userInfo.authToken,
      citiaoCode: options.citiaoCode ? options.citiaoCode : '', 
      operation: options.operation ? options.operation: '',
      status: options.status ? options.status : '',
      tableType: options.tableType==2 ? 2 : 1,
      pageTitle: options.status ?'编辑许可使用':'新增许可使用'
    });
    thePage.getData();
  },
  getData(){
    app.doPost('/apply/getContact', { token: app.globalData.userInfo.authToken ? app.globalData.userInfo.authToken : '' }, null, function (data) {
      var postObj = thePage.data.postObj;
      postObj.contactName =data.result.info.realName;
      postObj.contactEmail = data.result.info.email,
      postObj.contactPhone = data.result.info.phone,
      thePage.setData({
        postObj: postObj,
      });
    }, 'get');
    if (thePage.data.status) {
      app.doPost('/citiao/get', { token: app.globalData.userInfo.authToken, citiaoCode: thePage.data.citiaoCode, tableType: thePage.data.tableType, timestamp: (new Date()).valueOf() }, null, function (data) {

        let _citiao = data.result.model.citiao;
        let _amountInfo = _citiao.permitRight.amountInfo ? _citiao.permitRight.amountInfo : '';
        let _incomeAmountInfo = _citiao.permitRight.incomeAmountInfo ? _citiao.permitRight.incomeAmountInfo : '';
        thePage.setData({
          citiao: _citiao,
          startTime: data.result.model.permit.startTimeStr,
          endTime: data.result.model.permit.endTimeStr,
          startTimeOpen: _citiao.permitRight.startTimePublic == 1 ? true : false,
          endTimeOpen: _citiao.permitRight.endTimePublic == 1 ? true : false,
          region: thePage.data.regions.indexOf(_citiao.permitRight.appearCountry) != -1 ? thePage.data.regions.indexOf(_citiao.permitRight.appearCountry):0,
          currency: thePage.data.currencies.indexOf(_amountInfo.moneyType ? _amountInfo.moneyType : "人民币"),
          unit: thePage.data.units.indexOf(_amountInfo.amountUnit ? _amountInfo.amountUnit : "万"),
          amountUnitOpen: _amountInfo.amountPublic == 1 ? true : false,
          currency2: thePage.data.currencies.indexOf(_incomeAmountInfo.moneyType ? _incomeAmountInfo.moneyType : "人民币"),
          unit2: thePage.data.units.indexOf(_incomeAmountInfo.amountUnit ? _incomeAmountInfo.amountUnit : "万"),
          amountUnitOpen2: _incomeAmountInfo.amountPublic == 1 ? true : false,
          mode: parseInt(_citiao.permitRight.authType) - 2,
          current: thePage.scopeFun(_citiao.permitRight.rightScope),
          links: thePage.createLinks(_citiao.attaches)
        })
      }, 'get');
    }
    app.doPost('/work/details', { workSeqNo: thePage.data.workId, timestamp: (new Date()).valueOf() }, null, function (data) {
      thePage.setData({
        powerType: data.result.powerType,
        work: data.result.workModel
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
  createLinks:function(arr){
    let newArr=[];
    arr.forEach((p1,p2)=>{
      let t={
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
  scopeFun:function(str){
    let newArr = [];
    thePage.data.rightScope.forEach((item, i) => {
      if(item.type==str){
        newArr.push(item.value)
      }
    });
    return newArr;
  },
  bindModeChange: function (res) {
    this.setData({
      mode: res.detail.value,
      authType: parseInt(res.detail.value) + 2
    })
  },
  bindRegionChange: function (res) {
    this.setData({
      region: res.detail.value,
      appearCountry: this.data.regions[res.detail.value]
    })
  },
  bindDateChange: function (res){
    this.setData({
      startTime: res.detail.value,
    })
  },
  bindDateChange1: function (res) {
    this.setData({
      endTime: res.detail.value,
    })
  },
  bindCurrencyChange: function(res) {
    this.setData({
      currency: res.detail.value
    })
  },
  bindCurrencyChange2: function (res) {
    this.setData({
      currency2: res.detail.value
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
  onChangeAmountPublic2:function(res){
    this.setData({
      amountUnitOpen2: res.detail.value
    })
  },
  onChangeAmountPublic1: function (res) {
    this.setData({
      amountUnitOpen: res.detail.value
    })
  },
  onChangeTime: function (res) {
    this.setData({
      startTimeOpen: res.detail.value
    })
  },
  onChangeTime2: function (res) {
    this.setData({
      endTimeOpen: res.detail.value
    })
  },
  rightScopeChange(e) {
    console.log(e)
    if (e.detail.value =="全部财产权"){
      this.setData({
        current: ['全部财产权']
      });
    }else{
      if (thePage.data.current.indexOf('全部财产权')!=-1){
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
  outLink: function (e) {
    if (e.type == 'click' && e.currentTarget.dataset.type == 0) {
    
      wx.navigateTo({
        url: "../../../../../components/webview/c?title="+ '参考资料' + "&type=许可使用" + "&url=" + app.urlDecode(e.currentTarget.dataset.url),
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
  onHide(){
    this.setData({
      actionsOpened: false
    });
  },
  backPage(){
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
  formSubmit(e) {
    thePage = this;
    let h = app.globalData.statusBarHeight + app.globalData.titleBarHeight
    thePage.setData({
      messageHeight: h
    })
    var formData = e.detail.value;
    formData.amountPublic = thePage.data.amountUnitOpen ? 1 : 0
    formData.amountPublic2 = thePage.data.amountUnitOpen2 ? 1 : 0
    formData.startTimePublic = thePage.data.startTimeOpen ? 1 : 0
    formData.endTimePublic = thePage.data.endTimeOpen ? 1 : 0
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
    let _links=[];
    thePage.data.links.forEach((p1,p2) => {
      _links.push({
        attachDesc: p1.typeDec,
        fileName: p1.title,
        attachType: p1.type,
        isPublic: p1.isPublic ? 1 : 0,
        attachUrl: p1.url
      })
    })
    let _citiao={
      refCitiaoCode: formData.refCitiaoCode ? formData.refCitiaoCode:'',
      workSeqNo: formData.workSeqNo,
      attaches: _links,
      attathRemark: formData.attathRemark,
      citiaoClass: formData.citiaoClass ? formData.citiaoClass : thePage.data.citiaoClass,
      citiaoCode: formData.citiaoCode ? formData.citiaoCode : '',
      contactName: formData.contactName,
      contactEmail: formData.contactEmail,
      auditStatus: thePage.data.status,
      contactPhone: formData.contactPhone,
      citiaoType: formData.citiaoType ? formData.citiaoType : 2,
      rightScope: formData.rightScope,
      permitRight:{
        amountInfo:{
          amount: formData.amount,
          amountDesc: formData.amountDesc,
          amountPublic: formData.amountPublic,
          amountUnit: formData.amountUnit,
          moneyType: formData.moneyType
        },
        appearCountry: formData.appearCountry,
        appearCountryDesc: formData.appearCountry,
        authType: thePage.data.authType,
        endTime: new Date(formData.endTime).getTime(),
        endTimePublic: formData.endTimePublic,
        fromName: formData.fromName,
        rightRemark: formData.rightRemark,
        rightScope: formData.rightScope,
        startTime: new Date(formData.startTime).getTime(),
        startTimePublic: formData.startTimePublic,
        toName: formData.toName,
        incomeAmountInfo:{
          amount: formData.amount2,
          amountDesc: formData.amountDesc2,
          amountPublic: formData.amountPublic2,
          amountUnit: formData.amountUnit2,
          moneyType: formData.moneyType2
        }
      }
    }
    console.log(_citiao)

    if (this.data.pageTitle=="编辑许可使用"){
      app.doPost('/citiao/modify', { token:thePage.data.token, citiao:_citiao }, null, function (data) {
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
