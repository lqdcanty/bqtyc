const { $Toast } = require('../../dist/base/index');
const { $Message } = require('../../dist/base/index');
var thePage;
var obj = wx.getSystemInfoSync();
var workHeight = obj.windowHeight;
var workWidth = obj.windowWidth;
var url = "";
var app = getApp()
var checking = false;
textareaHeight: workHeight - 256,
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    checked: false,
    textNumber:0,
  },
  onInput(e){
    url = e.detail.value;
    this.setData({
      textNumber: url.length
    })
  },
  onOk(){
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一个页面
    prevPage.addLink({
      url: encodeURIComponent(url),
      title: this.data.title,
      cover: this.data.cover,
      description: this.data.description,
      images: this.data.images,
      plateform: this.data.plateform,
      author: this.data.author,
      avatar: this.data.avatar,
      time: this.data.time,
      type: this.data.type,
    });
    wx.navigateBack({ changed: true });//返回上一页
  },
  onPaste(){
    var i = url.indexOf("http");
    if( i > 0 ) {
      url = url.substring(i);
      thePage.setData({
        url: url
      });
    }
    if ( i >= 0 ){
      if (!checking ){
        checking = true;
        $Toast({
          content: '检查中...',
          type: 'loading'
        });
        // url = "http://127.0.0.1:8080/http!get.action?link=" +protocol + encodeURIComponent(url);
        // link = "https://proxyxcx.banquanbaike.com.cn/http!get.action?link=" + protocol + encodeURIComponent(link);
        // let link = "http://127.0.0.1:8080/http!getinfo.action?link=" + encodeURIComponent(url);
       // let link = "https://proxyxcx.banquanbaike.com.cn/http!getinfo.action?link=" + encodeURIComponent(url);
        let link = "https://p.banquanbaike.com.cn/pageinfo?link=" + encodeURIComponent(url);
        console.log("redirect", link);
        wx.request({
          url: link,
          method: "GET",
          header: {        
          },
          success(res) {
            console.log("onPaste.success", res);
            if (res.statusCode == 200) {
              if (res.data.yes) {
                if( res.data.type == "link" ){
                }
                else if (res.data.type == "image") {
                  res.data.title = "图片";
                  res.data.description = "暂无备注信息";
                }
                else if (res.data.type == "file") {
                  res.data.title = "文件";
                  res.data.description = "暂无备注信息";
                  res.data.cover = "../../images/unknown.png";
                }
                thePage.setData({
                  checked: res.data.yes,
                  title: res.data.title,
                  cover: res.data.cover,
                  description: res.data.description,
                  images: res.data.images,
                  plateform: res.data.plateform,
                  author: res.data.author,
                  avatar: res.data.avatar,
                  time: res.data.time,
                  type: res.data.type,
                });
              }
              else {
                $Message({
                  content: "请复制粘贴正确的URL链接",
                  type: 'error',
                  duration: 3
                });
              }
            }
            else {
              checked = false;
              $Message({
                content: "请求网络失败["+res.statusCode+"]",
                type: 'error',
                duration: 3
              });
            }
          },
          fail(res) {
            console.log("onPaste.fail", res);
            $Message({
              content: "出现错误",
              type: 'error',
              duration: 3
            });
          },
          complete(res) {
            checking = false;
            $Toast.hide();
          }
        });
      }
    }
    else{
      $Message({
        content: "请复制粘贴正确的URL链接",
        type: 'error',
        duration: 1000000
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;

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