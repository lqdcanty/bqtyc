
const app = getApp()
var thePage, user;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sysLogo: app.globalData.sysLogo,
    authIsShow: true,
    categories: ["影视", "文字", "艺术", "动漫", "音乐", "软件"],
    showIcon: true,
    types: [
      "电影",
      "电视剧",
      "体育赛事",
      "纪录片",
      "综艺节目",
      "短视频",
      "剧本",
    ],
    category: 0,
    type: 0,
    theTagDeleting: '',
    files: [],
    origins: [{ "title": "出品方", "name": "", "remark": "发起、进行主要投资并制作电影和以类似摄制电影的方法创作的作品，进行创作备案或上映备案的主体公司，作品的著作权人，拥有作品人身权全部权利" }, { "title": "导演", "name": "", "remark": "是制作影视作品的组织者和领导者，把文学剧本搬上荧屏的总负责人。" }],
    categoryName: "",
    typeName: "",
    name: "",
    titile: "",
    introduction: "",
    introLen: 0,
    tags: [],
    images: [],
    workSeqNo: "",
    
  },
  onauthorizeEvent: function (e) {
    this.setData({
      authIsShow: e.detail == 1 ? true : false
    });
    app.globalData.authIsShow = e.detail == 1 ? true : false;
    app.login(function (res) {
      app.globalData.userInfo = res.result.userInfo;
      user = res.result.userInfo
      thePage.getData(thePage.data.optionsObj);
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
            thePage.getData(thePage.data.optionsObj);
          })
        }
      }
    })
  },
  chooseImage: function (e) {
    this.setData({
      imageActionsOpened: false
    });
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片//thePage.data.files.concat(res.tempFilePaths)
        thePage.setData({
          files: res.tempFilePaths
        });
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 1000
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
              thePage.data.images = [];
              var result = JSON.parse(res.data);
              if (result.resultCode == "200") {
                var url = result.result.url;
                thePage.data.images.push(url);
                //thePage.updateHigherPage(url);
                // thePage.setData({
                //   files: thePage.data.files
                // });
              } else {
                wx.hideToast();
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
                content: '图片上传失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          });
        }
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  bindCategoryChange(e) {
    var index = e.detail.value;
    var category = thePage.data.categories[index];
    thePage.data.categoryName = category;
    var params = { "category": category };
    app.doPost("/work/type/query", params, "", function (rs) {
      var types = rs.result.types;
      var cdata = [];
      for (var i = 0; i < types.length; i++) {
        cdata.push(types[i].type);
      }
      thePage.data.types = cdata;
      thePage.setData({
        types: cdata,
        category: index
      });
    }, "get");
  },
  bindTypeChange(e) {
    var index = e.detail.value;
    var type = thePage.data.types[index];
    var category = thePage.data.categoryName;
    thePage.data.typeName = type;
    var params = { "category": category,"type": type };
    app.doPost("/work/query/origin", params, "", function (rs) {
      if (rs.resultCode == '200') {
        var origins = rs.result.origins;
        thePage.data.origins = [];
        for (var i = 0; i < origins.length; i++) {
          var origin = {
            title: origins[i].name,
            name: "",
            remark: origins[i].remark
          }
          thePage.data.origins.push(origin);
        }
        thePage.setData({
          type: index,
          origins: thePage.data.origins
        });
      } else {
        wx.hideToast();
        wx.showModal({
          title: '错误提示',
          content: '原始权利人获取失败',
          showCancel: false,
          success: function (res) { }
        })
      }
    }, "get");
  },
  onActionCancel() {
    this.setData({
      actionsOpened: false,
      imageView: "block",
      buttonView: "block"
    });
  },
  handleAction(e) {
    var val = thePage.data.theTagDeleting;
    var tags = thePage.data.tags;
    for (var i = 0; i < tags.length; i++) {
      if (tags[i] == val) {
        tags.splice(i, 1);
      }
    }
    thePage.data.tags = tags;
    thePage.setData({
      tags: tags
    })
    this.setData({
      actionsOpened: false,
      imageView: "block",
      buttonView: "block"
    });
  },
  deleteTag(e) {
    var val = e._relatedInfo.anchorTargetText;
    thePage.data.theTagDeleting = val;
    this.setData({
      theTagDeleting: val,
      actionsOpened: true,
      imageView: "none",
      buttonView: "none",
      actions: [
        {
          name: '确定',
          icon: 'right',
        },
      ],
    });
  },
  onCancel() {
    this.setData({
      actionsOpened: false,
      imageView: "block",
      buttonView: "block"
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    
    thePage.setData({
      optionsObj: options
    })
    var user=app.globalData.userInfo;
    if (user){
      thePage.getData(options);
    }else{
      thePage.getScopeUserInfo();
    }

  },
  getData: function (options){
    let workSeqNo = options.workSeqNo;//这里从全局的测试数据中取数据
    let workCode = options.workCode;
    var params = { "workSeqNo": workSeqNo };
    var tempParams = { "workSeqNo": workCode };
    app.doPost("/work/type/categorys", null, null, function (rs) {
      var categorys = rs.result.categorys;
      var cdata = [];
      for (var i = 0; i < categorys.length; i++) {
        cdata.push(categorys[i].category);
      }
      thePage.data.categories = cdata;
      thePage.setData({
        categories: cdata,
        buttonView: "block",
        imageView: "block"
      });
      wx.hideLoading();
    }, "get");
    if (workCode != null && workCode != 'undefined'){
      console.log(workCode);
      app.doPost("/work/wx/temp/detail", tempParams, "查询词条", function (rs) {
        var model = rs.result.workModel;
        thePage.data.images = model.covers;
        thePage.data.title = model.workTitle;
        thePage.data.name = model.name;
        thePage.data.introduction = model.introduction;
        thePage.data.tags = model.tags;
        thePage.data.typeName = model.type;
        thePage.data.categoryName = model.category;
        thePage.data.workSeqNo = model.workSeqNo;
        thePage.data.origins = model.original;
        var cindex = thePage.categoryIndex(model.category);

        var types = rs.result.types;
        var cdata = [];
        for (var i = 0; i < types.length; i++) {
          cdata.push(types[i].type);
        }
        thePage.data.types = cdata;
        var tindex = thePage.typeIndex(model.type);
        thePage.setData({
          files: model.covers,
          title: model.workTitle,
          name: model.name,
          introduction: model.introduction,
          tags: model.tags,
          type: tindex,
          category: cindex,
          workSeqNo: model.workSeqNo,
          origins: model.original,
          introLen: model.introduction.length,
          types: cdata
        });

      });
    }
    if (workSeqNo != null && workSeqNo != 'undefined') {
      app.doPost("/work/wx/detail", params, "查询词条", function (rs) {
        if (rs.resultCode == "200") {
          var model = rs.result.workModel;
          thePage.data.images = model.covers;
          thePage.data.title = model.workTitle;
          thePage.data.name = model.name;
          thePage.data.introduction = model.introduction;
          thePage.data.tags = model.tags;
          thePage.data.typeName = model.type;
          thePage.data.categoryName = model.category;
          thePage.data.workSeqNo = model.workSeqNo;
          thePage.data.origins = model.original;
          var cindex = thePage.categoryIndex(model.category);

          var types = rs.result.types;
          console.log(types);
          var cdata = [];
          for (var i = 0; i < types.length; i++) {
            cdata.push(types[i].type);
          }
          thePage.data.types = cdata;
          var tindex = thePage.typeIndex(model.type);
          var origins = rs.result.origins;
          thePage.data.origins = [];
          for (var i = 0; i < origins.length; i++) {
            var origin = {
              title: origins[i].name,
              name: "",
              remark: origins[i].remark
            }
            thePage.data.origins.push(origin);
          }
          thePage.setData({
            files: model.covers,
            title: model.workTitle,
            name: model.name,
            introduction: model.introduction,
            tags: model.tags,
            type: tindex,
            category: cindex,
            workSeqNo: model.workSeqNo,
            origins: model.original,
            introLen: model.introduction.length,
            types: cdata
          });


          let id = "#textareawrap";
          let query = wx.createSelectorQuery();//创建查询对象
          query.select(id).boundingClientRect();//获取view的边界及位置信息
          query.exec(function (res) {
            if (res[0] && res[0].height) {
              thePage.setData({
                height: res[0].height + "px"
              });
            }
          })

        }
      }, "get");
    }
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

  },
  nameBindtap: function (event) {
    this.setData({
      name: event.detail.detail.value
    })
  },
  titleBindtap: function (event) {
    this.setData({
      title: event.detail.detail.value
    })
  },
  introBindtap: function (e) {
    var intro = e.detail.value;
    if (intro.length > 1024) {
      wx.showModal({
        title: '错误提示',
        content: '作品简介不能超过1024',
        showCancel: false,
        success: function (res) { }
      })
    }
    thePage.data.introduction = e.detail.value;
    this.setData({
      introduction: e.detail.value,
      introLen: intro.length
    })
    let id = "#textareawrap";
    let query = wx.createSelectorQuery();//创建查询对象
    query.select(id).boundingClientRect();//获取view的边界及位置信息
    query.exec(function (res) {
      thePage.setData({
        height: res[0].height + "px"
      });
      console.log(res[0].height + "px")
    })
  },
  originBindtap: function (e) {
    var key = e.target.dataset.origin;
    var val = e.detail.value;
    var origins = thePage.data.origins;
    for (var i = 0; i < origins.length; i++) {
      if (origins[i].title == key) {
        origins[i].name = val;
      }
    }
    thePage.data.origins = origins;
    thePage.setData({
      origins: origins
    })
  },
  tagInputEvent: function (event) {
    console.log(event)
    this.setData({
      tag: event.detail.detail.value
    })
  },
  addTags: function (e) {
    var tags = thePage.data.tags;
    if (tags == null) {
      tags = new Array(0);
    }
    var tag = this.data.tag;
    if (tag.length > 6) {
      wx.showModal({
        title: '温馨提示',
        content: '标签长度不能超过６个字',
        showCancel: false,
        success: function (res) { }
      })
      return;
    }
    if (tag != "" && tag != null) {
      tags.push(tag);
    }
    thePage.data.tags = tags;
    thePage.setData({
      tags: tags,
      tag: ''
    });
  },
  handleTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  handleTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },
  handleClick: function (e) {//单击
    var image = e.currentTarget.dataset.image;
    if (this.endTime - this.startTime < 350) {
      wx.previewImage({
        current: image, // 当前显示图片的http链接
        urls: this.data.files // 需要预览的图片http链接列表
      })
    }
  },
  handleLongPress: function (e) {//长按
    var val = e.currentTarget.dataset.index;
    this.setData({
      imageIndex: val,
      imageActionsOpened: true,
      buttonView: "none",
      imageActions: [
        {
          name: '确定',
          icon: 'right',
        },
      ],
    });
  },
  imageActionCancel() {
    this.setData({
      imageActionsOpened: false,
      buttonView: "block"
    });
  },
  onCancel() {
    this.setData({
      imageActionsOpened: false,
      buttonView: "block"
    });
  },
  imageHandleAction: function (e) {
    var index = e.currentTarget.dataset.imageindex;
    var files = thePage.data.files;
    var images = thePage.data.images;
    files.splice(index, 1);
    images.splice(index, 1);
    this.setData({
      files: files,
      imageActionsOpened: false,
      buttonView: "block"
    });
  },
  handleSave: function (e) {
    var token = app.globalData.userInfo.authToken;
    var porigins = [];
    var tag = "";
    var tags = thePage.data.tags;
    // var origins = thePage.data.origins;
    // for (var i = 0; i < origins.length; i++) {
    //   var key = origins[i].title;
    //   var val = origins[i].name;
    //   var origin = {
    //     roleName: key,
    //     roleVal: val
    //   };
    //   //origin[key] = val;
    //   porigins.push(origin);
    // }
    if (tags != null) {
      for (var i = 0; i < tags.length; i++) {
        tag = tag + tags[i] + ",";
      }
    }
    if (tag.indexOf(",") > 0) {
      tag = tag.substring(0, tag.length - 1);
    }
    var params = {
      name: thePage.data.name,
      workTitle: thePage.data.title,
      cover: thePage.data.images,
      category: thePage.data.categoryName,
      type: thePage.data.typeName,
      introduction: thePage.data.introduction,
      tags: tag,
      token: token,
      workSeqNo: thePage.data.workSeqNo
    };
    // original: JSON.stringify(porigins),
    app.doPost("/work/wx/edit", params, "词条编辑中", function (rs) {
      if (rs.resultCode == "200") {
        // var workSeqNo = rs.result.workSeqNo;
        // wx.navigateTo({
        //   url: "./audit/x?workSeqNo=" + workSeqNo
        // });
        wx.navigateTo({
          url: "../../copyright/complete/x?word=词条编辑申请提交成功&type=" + thePage.data.typeName
        });
      } else {
        wx.hideToast();
        wx.showModal({
          title: '错误提示',
          content: rs.resultMsg,
          showCancel: false,
          success: function (res) { }
        })
      }
    }, "post");
  },
  categoryIndex: function (category){
    var categories = thePage.data.categories;
    for(var i = 0;i < categories.length; i++){
      if (category == categories[i]){
        return i;
      }
    }
  },
  typeIndex: function (type) {
    var types = thePage.data.types;
    for (var i = 0; i < types.length; i++) {
      if (type == types[i]) {
        return i;
      }
    }
  },

})