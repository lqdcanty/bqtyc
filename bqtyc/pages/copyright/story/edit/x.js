// pages/copyright/related/add/x.js\
const { $Message } = require('../../../../dist/base/index');
const app = getApp()
var thePage;
var work_data;
var user;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deleteButton:false,
    navTitle: "创建版权故事词条",
    showIcon: true,
    fixedTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight + 5,
    links: [],
    creatives: ["原创", "转载"],
    creative: 0,
    powerType: '',
    postObj: {},
    work: null,
    imagesArr: [],
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
    initObj:null,
    editButton:true,
    cancelButton:false,
    token:'',
    postObj: {
      author: '', //作者
      sourceFrom: '',//来源
      type: null,//1原创 2转载
      pic: [],//图片数组
      url: '',//故事链接地址
      longDesc: '',//longDesc
      title: '',//故事标题
      token: '',
      citiaoCode: '',
      workSeqNo: '',
      contactName: '',//联系人
      contactPhone: '',//联系电话
      contactEmail: '',//联系邮箱,
      attachType:null,//附件类型
    },
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
    this.setData({
      actionsOpened: false
    });
  },
  /**
   * 添加链接
   */
  addLink(e) {
    console.log(e, "link");
    //let links = this.data.links
    var authorItem = "postObj.author", soureFromItem = "postObj.sourceFrom", picItem = "postObj.pic", longDescItem = "postObj.longDesc", titleItem = "postObj.title", urlItem = "postObj.url", attachTypeItem ="postObj.attachType";
    thePage.setData({
      [authorItem]: e.author ? e.author:'', //作者
      [soureFromItem]: e.plateform ? e.plateform:'',//来源
      [picItem]: e.images ? e.images:'',//图片数组
      [urlItem]: e.url ? e.url:'',//故事链接地址
      [longDescItem]: e.description ? e.description:'',//longDesc
      [titleItem]: e.title ? e.title:'',//故事标题
    });
    if (e.type=='link'){
      thePage.setData({
        [attachTypeItem]:1,
        imagesArr:[]
      })
    } else if (e.type == 'image'){
      thePage.setData({
        [attachTypeItem]: 2,
        [longDescItem]:''
      })
    } else if (e.type == 'file'){
      thePage.setData({
        [attachTypeItem]: 3,
        imagesArr:[],
      })
    }
    var imagesArr = [];
    if (typeof e === 'object' && !isNaN(e.length)) {
      e.forEach((item) => {
        imagesArr.push(item.url);
      })
      thePage.setData({
        imagesArr: imagesArr,
        [picItem] : imagesArr,
        [attachTypeItem]: 2,
      })
    } else if (e.type == 'image') {
      imagesArr.push(e.cover[0])
      thePage.setData({
        imagesArr: imagesArr,
        [attachTypeItem]: 2,
        [picItem]: imagesArr
      })
    }
    console.log(this.data.links, "lins")
  },
  addReferer(e) {
    this.setData({
      actionsTitle: "版权故事内容请选择以下2种方式提供",
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
  onCancel() {
    this.setData({
      actionsOpened: false
    });
  },
  bindAuthortypeChange: function (res) {
    var postObj = thePage.data.postObj;
    postObj.type = thePage.data.creatives[res.detail.value];
    thePage.setData({
      creative: res.detail.value,
      postObj: postObj
    })
  },
  onInput: function (e) {
    var postObj = thePage.data.postObj;
    postObj.author = e.detail.value;
    thePage.setData({
      postObj: postObj
    })
  },
  contactInput: function (e) {
    var postObj = thePage.data.postObj;
    postObj.contactName = e.detail.value;
    thePage.setData({
      postObj: postObj
    })
  },
  contact_phoneInput: function (e) {
    var postObj = thePage.data.postObj;
    postObj.contactPhone = e.detail.value;
    thePage.setData({
      postObj: postObj
    })
  },
  contact_emailInput: function (e) {
    var postObj = thePage.data.postObj;
    postObj.contactEmail = e.detail.value;
    thePage.setData({
      postObj: postObj
    })
  },
  titleInput: function (e) {
    var postObj = thePage.data.postObj;
    postObj.title = e.detail.value;
    console.log(e.detail.value, "title")
    thePage.setData({
      postObj: postObj
    })
  },
  titleSourceFrom:function(e){
    var postObj = thePage.data.postObj;
    postObj.sourceFrom = e.detail.detail.value;
    thePage.setData({
      postObj: postObj
    })
  },
  titleInputI: function (e) {
    var postObj = thePage.data.postObj;
    postObj.title = e.detail.detail.value;
    thePage.setData({
      postObj: postObj
    })
  },
  longDescTnput:function(e){
    var postObj = thePage.data.postObj;
    postObj.longDesc = e.detail.detail.value;
    thePage.setData({
      postObj: postObj
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    user = app.globalData.userInfo;
    thePage.setData({
      token: user ? user.authToken : '',
      status: options.status
    });
    if (options.status == 'wait_audit') {
      thePage.setData({
        deleteButton: false,
        editButton: false,
        cancelButton: true,
        workSeqNo: options.workSeqNo
      })
    } else if (options.cancel == 1) {
      thePage.setData({
        deleteButton: false,
        editButton: false,
        cancelButton: true,
        workSeqNo: options.workSeqNo
      })
    }
    app.doPost('/work/details', { workSeqNo: options.workSeqNo }, null, function (data) {
      thePage.setData({
        work: data.result.workModel,
        powerType: data.result.powerType
      });
    }, 'get');
    app.doPost('/story/init', { citiaoCode: options.citiaoCode, token: user ? user.authToken : '', isMine: options.isMine, status: options.status}, null, function (data) {
      var dataObj = data.result.model;
      if (data.result.model.type =='转载'){
        thePage.setData({
          creative:1
        })
      } else if (data.result.model.type == '原创'){
        thePage.setData({
          creative: 0
        })
      }
      thePage.setData({
        postObj: {
          author: dataObj.author, //作者
          type: dataObj.type,//1原创 2转载
          pic: dataObj.pic,//图片数组
          url: dataObj.url,//故事链接地址
          longDesc: dataObj.subTitle,//longDesc
          title: dataObj.title,//故事标题
          attachType: dataObj.attachType,
          //attachType:1,
          contactName: dataObj.contactName,//联系人
          contactPhone: dataObj.contactPhone,//联系电话
          contactEmail: dataObj.contactEmail,//联系邮箱
          token: user.authToken,
          workSeqNo: options.workSeqNo,
          citiaoCode: options.citiaoCode
        }
      })
      if (dataObj.attachType==2){
        thePage.setData({
          imagesArr: dataObj.pic
        })
      }
    
      var item = "postObj.sourceFrom";
      thePage.setData({
        [item]: data.result.model.sourceFrom
      });
    }, 'get');
  },
  handleSave: function () {
    if (thePage.data.postObj.author == "") {
      $Message({
        content: '请输入作者名称',
        type: 'warning'
      });
      return;
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
    if (postObj.type =='转载'){
      postObj.type=2;
    } else if (postObj.type == '原创'){
      postObj.type = 1;
    }
    console.log(postObj,"提交数据")
    app.doPost('/story/edit', postObj, null, function (data) {
      $Message({
        content: '词条编辑成功！',
        type: 'success',
      });
      setTimeout(() => {
        wx.navigateTo({
          url: '../x?workSeqNo=' + thePage.data.work.workSeqNo,
        })
      }, 1000)
    }, 'post');
    
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})