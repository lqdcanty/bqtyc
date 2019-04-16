// pages/owner/bqradd/x.js
const { $Message } = require('../../../dist/base/index');
var thePage;
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon:true,
    obligeeTypes: ["未知", "企业","个人"],
    obligeeType:1,
    charactersArr:null,
    character:0,
    charactersObj:null,
    subtypes:[],
    subtype:0,
    cover:'',
    tag:'',
    tags:[],
    tagsString:'',
    characters: '',
    identity:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage=this;
    app.doPost('/obligee/home/category',null,null,function(data){
      var charactersObj=data.result.categorys;
      var charactersArr = [],subtypes=[];
      charactersObj.forEach((item,index)=>{
        charactersArr.push(item.name); 
      })
      charactersObj[0].subtypes.forEach((inner, ind) => {
        subtypes.push(inner.name);
      })
      thePage.setData({
        charactersArr: charactersArr,
        charactersObj: charactersObj,
        subtypes: subtypes
      })
      
    },'get')
  },
  formSubmit:function(even){
    
    var user = app.globalData.userInfo;
    console.log(even.detail.value)
    var obj = even.detail.value;
    obj.token=user ? user.authToken : '';
    //obj.token="11111"
    console.log(obj,"obj")
    if (!obj.name){
      $Message({
        content:'版权人名称必填',
        type:'error'
      })
      return;
    }
    var english = /^([A-Za-z]+\s?)*[A-Za-z]$/g;
    if (obj.englishName){
      if (!english.test(obj.englishName)) {
        $Message({
          content: '英文名只能是英文字母',
          type: 'error'
        })
        return;
      }
    }
    if (!obj.isHidden) {
      $Message({
        content: '是否对外公示必填',
        type: 'error'
      })
      return;
    }
   //[{"category": "动漫", "name": "漫画平台"}] 
    if (!obj.characters) {
      $Message({
        content: '身份类型必填',
        type: 'error'
      })
      return;
    }
    
    if (!obj.cover) {
      $Message({
        content: '封面必填',
        type: 'error'
      })
      return;
    }
    if (!obj.tags) {
      $Message({
        content: '身份标签必填',
        type: 'error'
      })
      return;
    }
    app.doPost('/obligee/add', obj, null, function (data) {
      $Message({
        content: '新建成功',
        type: 'success'
      })
      console.log(data.result.code, "data")
      setTimeout(()=>{
        
        wx.navigateTo({
          url: '../x?code=' + data.result.code
        })
      },1000)
    },'post')
  },
  addType:function(){
    var identity = thePage.data.identity;
    var obj = {};
    obj.category = thePage.data.charactersArr[thePage.data.character];
    obj.name = thePage.data.subtypes[thePage.data.subtype];
    
    if (identity==null){
      identity = [obj]
    }else{
      var sumName = 0, sumCategory=0;
      identity.forEach((item)=>{
        item.name != obj.name ? sumName++ : sumName = sumName;
      })
      if (sumName == identity.length) identity.push(obj); 
      else {
        identity.forEach((ind) => {
          ind.category != obj.category ? sumCategory++ : sumCategory = sumCategory;
        })
        if (sumCategory === identity.length) identity.push(obj);
        else $Message({ content: '该身份类型已添加', type: 'error' });
      }
    }
    thePage.setData({
      identity: identity,
      characters: JSON.stringify(identity)
    })
    console.log(obj, "objobj", identity)
  },
  
  bindObligeeTypesChange:function({detail}){
    thePage.setData({
      obligeeType: detail.value
    })
  },
  bindCharacterChange:function({detail}){
    thePage.data.charactersObj.forEach((item,index)=>{
      var subtypes=[];
      if (thePage.data.charactersArr[detail.value] == item.name){
        item.subtypes.forEach((inner,ind)=>{
          subtypes.push(inner.name);
        })
        thePage.setData({
          subtypes: subtypes
        })
      }
    })
    thePage.setData({
      character: detail.value
    })
  },
  bindSubtypeChange: function ({ detail }){
    thePage.setData({
      subtype: detail.value
    })
  },
  chooseImage: function (e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths, "tempFilePaths")
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 5000
        })
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: 'https://t.banquanbaike.com.cn/file/upload/server',
            filePath: tempFilePaths[i],
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              var result = JSON.parse(res.data);
              wx.hideToast();
              if (result.resultCode == "200") {
                var url = result.result.url;
                thePage.setData({
                  cover: url
                });
                console.log(url, "endUrl")
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
        }
      }
    })
  },
  addTags:function(){
    var tags = thePage.data.tags;
    if (!thePage.data.tag) {
      $Message({
        content: '标签不能为空',
        type: 'error'
      })
      return;
    } else if (thePage.data.tag.length > 6) {
      $Message({
        content: '标签不不能超过6个字',
        type: 'error'
      })
      return;
    }
    var sum=0;
    tags.forEach((item)=>{
      item != thePage.data.tag ? sum++:sum=sum;
    })
    sum == tags.length ? tags.push(thePage.data.tag) : $Message({content: '该标签已添加', type: 'error' });
    thePage.setData({
      tags: tags,
      tagsString: tags.join(),
      tag:''
    })
  },
  tagInputEvent:function({detail}){
    thePage.setData({
      tag: detail.value
    })
  },
  deleteTag: function (e) {
    var tags = thePage.data.tags;
    tags.splice(e.currentTarget.dataset.index, 1);
    thePage.setData({
      tags: tags,
      tagsString: tags.join()
    })
  },
  deleteTagr: function (e) {
    var identity = thePage.data.identity;
    identity.splice(e.currentTarget.dataset.index, 1);
    thePage.setData({
      identity: identity,
      characters: JSON.stringify(identity)
    })
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