// modelTest.js

var model = require('../../components/area/model.js')
const { $Message } = require('../../dist/base/index');
//  var model ="";
const app = getApp();
var show = false;
var item = {};

Page({
  data: {
    item: {
      show: show
    },
    showIcon: true,
    imgurl1:"http://fdfs.banquanjia.com.cn/group2/M00/1C/4C/CgoKDVySFAKAEU2PAAASHd_Zxe0926.png",
    imgurl2:"http://fdfs.banquanjia.com.cn/group2/M00/1C/81/CgoKC1ySFDCAM7HkAAAPq9FLwV4679.png",
    index:0,
    attachment1:'',
    attachment2:'',
    array:['身份证','营业执照']
  },
  onLoad:function(options){
    this.setData({
      token: app.globalData.userInfo.authToken
    })
    let that = this;
    that.setData({
      messageHeight: app.globalData.statusBarHeight + app.globalData.titleBarHeight
    })
    app.pageRouteLog("certificate", "certificate", 'certificate', 'certificate', this.url)
    if (options.status) {
      $Message({
        content: '你的实名认证申请被驳回，请重新申请',
        type: 'error'
      });
      let token = app.globalData.userInfo.authToken;
      app.doPost(
        '/register/real/detail?realCode=' + options.code, null, null, function (data) {
          that.setData({
            name: data.result.datas.name,
            index: data.result.datas.certType=='id_card' ? 0 : 1,
            certType: data.result.datas.certType,
            certNumber: data.result.datas.certNumber,
            province: data.result.datas.province,
            city: data.result.datas.city,
            realCode: data.result.datas.realCode,
            country: data.result.datas.country,
            attachment1: data.result.datas.attachment1,
            imgurl1: data.result.datas.attachment1 != '' ?data.result.datas.attachment1:"http://fdfs.banquanjia.com.cn/group2/M00/1C/4C/CgoKDVySFAKAEU2PAAASHd_Zxe0926.png",
            attachment2: data.result.datas.attachment2,
            imgurl2: data.result.datas.attachment2 != '' ? data.result.datas.attachment2 : "http://fdfs.banquanjia.com.cn/group2/M00/1C/81/CgoKC1ySFDCAM7HkAAAPq9FLwV4679.png",
          })
        }, 'get');
    }
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
    console.log(model)
  },
  //点击选择城市按钮显示picker-view
  translate: function (e) {
    model.animationEvents(this, 0, true, 400);
    
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    console.log("id = " + e.target.dataset.id)
    model.animationEvents(this, 200, false, 400);
    //点击确定按钮更新数据(id=444是背后透明蒙版 id=555是取消按钮)
    if (e.target.dataset.id == 666) {
      this.updateShowData()
    }
  },
  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);
    //如果想滑动的时候不实时更新，只点确定的时候更新，注释掉下面这行代码即可。
    this.updateShowData()
  },
  //更新顶部展示的数据
  updateShowData: function (e) {
    item = this.data.item;
    console.log(item)
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      country: item.countys[item.value[2]].name
    });
  },
  chooseImage1:function(){
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        that.setData({
          imgurl1: res.tempFilePaths[0]
        });
        that.imgUpload(res.tempFilePaths[0], 1)
      }
    })
  },
  chooseImage2: function () {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          imgurl2: res.tempFilePaths[0]
        });
        that.imgUpload(res.tempFilePaths[0], 2)
      }
    })
  },
  bindPickerChange:function(res){
    this.setData({
      index: res.detail.value,
      imgurl2: "../../img/id-card.png",
      certType: res.detail.value==0?'id_card':'passport'
    })
  },
  imgUpload: function (imgUrl, type) {
    let that=this;
    wx.uploadFile({
      url: 'https://t.banquanbaike.com.cn/file/upload/server',
      filePath: imgUrl,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
        //"Content-Type": "application/json"
      },
      success: function (res) {
        var result = JSON.parse(res.data);
        console.log(res, "res11")
        wx.hideToast();
        if (result.resultCode == "200") {
          var url = result.result.url;
          if (type == 1) {
            that.setData({
              attachment1: url
            });
          } else {
            that.setData({
              attachment2: url
            });
          }

        } else {
          wx.showModal({
            title: '错误提示',
            content: '图片上传失败',
            showCancel: false,
            success: function (res) { }
          })
        }
      },
      fail: function (res) {
        wx.hideToast();
        wx.showModal({
          title: '错误提示',
          content: '封面图片上传失败',
          showCancel: false,
          success: function (res) {
          }
        })
      }
    });
  },
  formSubmit(e) {
    var formData = e.detail.value;
    if (!this.data.name || this.data.name.lenght<1){
      $Message({
        content: '姓名不能为空，请填写',
        type: 'error'
      });
      return
    }
    if (!this.data.certNumber || this.data.certNumber.lenght < 1) {
      $Message({
        content: '证件号码不能为空，请填写',
        type: 'error'
      });
      return
    }
    if (!this.data.attachment1 || this.data.attachment1 == '' || !this.data.attachment2 || this.data.attachment2 == '') {
      $Message({
        content: '请上传证件照',
        type: 'error'
      });
      return
    }
    app.doPost('/register/realName', formData, null, function (data) {
      wx.navigateTo({
        url: '../copyright/complete/x?word=实名认证成功&index=1'
      })
    }, 'get');
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function () {
    app.pageShareLog("certificate", "certificate", 'certificate', 'certificate', this.url)
    return {
      title: ('邀请你实名认证'),
    }
  },
  nono: function () { }
})
