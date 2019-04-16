Page({
    data: {
      showIcon: true,
        files: []
    },
    chooseImage: function (e) {
      var that = this;
      console.log(e,"ee")
     
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
              //url:'http://192.168.0.20:18088/file/upload/server',
              filePath: tempFilePaths[i],
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
                  that.setData({
                    files: that.data.files.concat(url)
                  });
                  console.log(that.data.files.concat(url),"endUrl")
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
        // var that = this;
        // wx.chooseImage({
        //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        //     success: function (res) {
        //         // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //       console.log(res,"huoqu")
        //         that.setData({
        //             files: that.data.files.concat(res.tempFilePaths)
        //         });
        //       console.log(that.data.files,"all")
        //     }
        // })
    },
    
    previewImage: function(e){
      wx.previewImage({
          current: e.currentTarget.id, // 当前显示图片的http链接
          urls: this.data.files // 需要预览的图片http链接列表
      })
      console.log(e,"图片")
  },
  onCancel(){
    this.setData({
      files:[]
    })
  },
  onOk() {
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一个页面
    var list = this.data.files;
    if (list.length==1){
      prevPage.addLink({
        url: this.data.files,
        title: '一张图片',
        type: "image",
        label: "内容是一张",
        desc: '',
        cover: this.data.files
      });
    }else{
      var newList=[];
      list.forEach(function(item){
        newList.push({
          url: item,
          title: '一张图片',
          type: "image",
          label: "内容是一张",
          desc: '',
          cover: item
        })
      })
      prevPage.addLink(newList);
    } 
    wx.navigateBack({ changed: true });//返回上一页
  }
});