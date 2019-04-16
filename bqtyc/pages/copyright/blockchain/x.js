const goto = "components/webview";
const app = getApp()
var thePage, user;
Page({
  data: {
    copyright: null,
    pageIndx: 0,
    tabIndx: 0,
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    statusBarHeight: 0,
    titleBarHeight: 0,
    work:null,
    detailAll:null,
    detailObj:null,
    powerType:'',
    listIndex:0,
    imagesMak:'../../../img/id-card.png',
    imagesMakShow:false,
    navTitle: "版权词条详情",
    showIcon: true,
    fixedTop: app.globalData.statusBarHeight + app.globalData.titleBarHeight,
    rightType:'',
    allScope:{
      personalRight: [{ type: '1', value: "署名权" }, { type: '2', value: "发表权" }, { type: '3', value: "修改权" }, { type: '4', value: "保护作品完整权" }],
     propertyScope: [{ type: '20', value: "全部财产权" }, { type: '5', value: "复制权" }, { type: '6', value: "发行权" }, { type: '7', value: "出租权" }, { type: '8', value: "展览权" }, { type: '9', value: "表演权" }, { type: '10', value: "放映权" }, { type: '11', value: "广播权" }, { type: '12', value: "信网传播权" }, { type: '13', value: "摄制权" }, { type: '14', value: "改编权" }, { type: '15', value: "翻译权" }, { type: '16', value: "汇编权" }, { type: '17', value: "其他" }]},
    propertyRight: [], 
    personRight: []
    
  },
  onShareAppMessage: function (res) {
    console.log("有一个分享请求", res);
    console.log(this.data.work.type, this.data.work.name, this.data.work.category, this.data.work.type)
    return {
      title: ("[" + this.data.work.type + "]" +
        this.data.work.name + "@" + this.data.work.category + '[' + thePage.data.rightType+']'),
    }
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    thePage =this;
    console.log(options,"options")
    // if (options.rightType=='人身权'){//判断是哪一个权利类型
    //   thePage.setData({ rightType: '人身权'})
    // } else if (options.rightType == '财产权'){
    //   thePage.setData({ rightType: '财产权'})
    // }

    thePage.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      titleBarHeight: app.globalData.titleBarHeight,
      rightType: options.rightType  
    }) 
    //thePage = this;
   
    app.doPost('/work/details', { workSeqNo: options.workSeqNo, timestamp: (new Date()).valueOf() }, null, function (data) {
      thePage.setData({
        work: data.result.workModel,
        powerType: data.result.powerType
      });
    }, 'get');
    user = app.globalData.userInfo;
    app.doPost('/chain/queryChainView', { citiaoCode: options.citiaoCode, token: user ? user.authToken : '', timestamp: (new Date()).valueOf() }, null, function (data) {
      thePage.setData({
        detailAll: data.result.list,
        detailObj: data.result.list.length > 0 ? data.result.list[thePage.data.listIndex] : []
      });
      thePage.sopeRight(thePage.data.detailObj.rightScopes);
    }, 'get');

  },
  sopeRight:function(sopeRight){
    var allScope = thePage.data.allScope;
    var personRight=[],propertyRight=[];
    if (thePage.data.rightType == '人身权') {
      allScope.personalRight.forEach((item)=>{
        sopeRight.forEach((right)=>{
          if (item.value == right){
            item.isflage=true;
          }
        })
        personRight.push(item)
      })
    } else if (thePage.data.rightType == "财产权"){
      allScope.propertyScope.forEach((item) => {
        sopeRight.forEach((right) => {
          if (item.value == right) {
            item.isflage = true;
          }
        })
        propertyRight.push(item)
      })
    }
    thePage.setData({ propertyRight: propertyRight, personRight: personRight})
  },
  onReady:function(){
    
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  switchNavigate: function (e) {
    let indx = e.currentTarget.dataset.current;
    if (this.data.tabIndx == -1) {
      return;
    } else {
      thePage.setData({
        tabIndx: indx,
      });
    }
  },
  changeProperty: function (e) {
    thePage.setData({
      listIndex: e.detail.current,
      detailObj: thePage.data.detailAll[e.detail.current]
    })
    thePage.sopeRight(thePage.data.detailObj.rightScopes);
  },
  blockClick: function (e){
    var fileType = e.currentTarget.dataset.filetype;
    var url = e.currentTarget.dataset.url;
    var arr = [url]; 
    if (fileType==0){
      
      wx.navigateTo({
        url: "../../../components/webview/c?title=[" + thePage.data.work.category + "]" + thePage.data.work.name + "@" + thePage.data.work.type + '[' + thePage.data.rightType+']' + "&type=版权词条参考资料" + "&url=" + app.urlDecode(url) ,
        });
    } else if (fileType == 1){
      wx.previewImage({
        urls: arr,// 需要预览的图片http链接列表
      })
    }else if (fileType == 2){
      wx.downloadFile({
        url: url,
        success: function (res) {
          var filePath = res.tempFilePath
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功')
            }
          })
        }
      })
    }
  }
})
