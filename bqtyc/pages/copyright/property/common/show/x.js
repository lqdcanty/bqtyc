const app = getApp();
var thePage;
var obj = wx.getSystemInfoSync();
var workHeight = obj.windowHeight;
var workWidth = obj.windowWidth;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commonObj:null,
    windowWidth: workWidth,
    windowHeight: workHeight,
    workNo:null,
    showIcon: true,
    citiaoClass:null,
    personalObj:null,
    powerType:'',
    titleStr:'',
    loading:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    thePage=this;
    var titleArr = ["许可使用", "权利转让", "权利质押"]
    thePage.setData({
      workNo: options.workSeqNo,
      citiaoClass: options.citiaoClass,
      navHeight: app.globalData.statusBarHeight + app.globalData.titleBarHeight,
      titleStr: titleArr[parseInt(options.citiaoClass) - 2]
    });
   
    thePage.getData()
    
  },
  getData () {
    app.doPost('/PropertyView/queryByClass', { workSeqNo: thePage.data.workNo, citiaoClass: thePage.data.citiaoClass, timestamp: (new Date()).valueOf() }, null, function (data) {
      var rightObj = [
        {
          name: '全部财产权',
          amount: data.result.type['20'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/41/CgoKDFw-pKCAY5hdAAAE1gw9dDM012.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/41/CgoKDFw-pKCAGemrAAAE2JrPynI994.png',
          width: '25%',
          border_bottom: '1',
          scope: '20',
          url: 'detail/x'
        },
        {
          name: '复制权',
          amount: data.result.type['5'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/41/CgoKDFw-pKCAY5hdAAAE1gw9dDM012.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/41/CgoKDFw-pKCAGemrAAAE2JrPynI994.png',
          width: '25%',
          border_bottom: '1',
          scope: '5',
          url: 'detail/x'
        }, {
          name: '发行权',
          amount: data.result.type['6'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/73/CgoKC1w-pNCACVy8AAAFcktAErg941.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M02/0A/42/CgoKDFw-pK6AGQu3AAAFbHzrVqI370.png',
          width: '25%',
          border_bottom: '1',
          scope: '6',
          url: 'detail/x'
        }, {
          name: '出租权',
          amount: data.result.type['7'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M02/0A/3E/CgoKDVw-pKSAVkf5AAAH09j0_OU084.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/3E/CgoKDVw-pKWANqIwAAAH1XS0w0A883.png',
          width: '25%',
          border_bottom: '1',
          scope: '7',
          url: 'detail/x'
        }, {
          name: '展览权',
          amount: data.result.type['8'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/3E/CgoKDVw-pKOAYCMKAAAEAISTe70204.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M02/0A/3E/CgoKDVw-pKOAHE2BAAAD8_i6240777.png',
          width: '25%',
          border_bottom: '1',
          scope: '8',
          url: 'detail/x'
        }, {
          name: '表演权',
          amount: data.result.type['9'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/3E/CgoKDVw-pKyAI1f4AAALEuGODAs997.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/3E/CgoKDVw-pKyAb3WAAAALO91hA-Y936.png',
          width: '25%',
          border_bottom: '1',
          scope: '9',
          url: 'detail/x'
        }, {
          name: '放映权',
          amount: data.result.type['10'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/3E/CgoKDVw-pLCAH9tpAAALEcooIJc690.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/73/CgoKC1w-pNKAMCuQAAALCUZfQG4712.png',
          width: '25%',
          border_bottom: '1',
          scope: '10',
          url: 'detail/x'
        }, {
          name: '广播权',
          amount: data.result.type['11'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M02/0A/73/CgoKC1w-pL-ALfv0AAARpX1YcVs864.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/73/CgoKC1w-pMCACVzKAAARwOQTasw136.png',
          width: '25%',
          border_bottom: '1',
          scope: '11',
          url: 'detail/x'
        }, {
          name: '信网传播权',
          amount: data.result.type['12'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/3E/CgoKDVw-pKeAPHjmAAAMIjDOeB4245.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/73/CgoKC1w-pMmAPVUtAAAMUJ1DSpE021.png',
          width: '25%',
          border_bottom: '1',
          scope: '12',
          url: 'detail/x'
        }, {
          name: '摄制权',
          amount: data.result.type['13'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/3E/CgoKDVw-pKqAXBhcAAAIwG0_rHE700.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/73/CgoKC1w-pMyALmbuAAAI03HuUVU129.png',
          width: '25%',
          border_bottom: '1',
          scope: '13',
          url: 'detail/x'
        }, {
          name: '改编权',
          amount: data.result.type['14'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/41/CgoKDFw-pJ6AVQEoAAAJd6YhWq0306.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M02/0A/3E/CgoKDVw-pJ-AQB7qAAAJmkrt0FY662.png',
          width: '25%',
          border_bottom: '1',
          scope: '14',
          url: 'detail/x'
        }, {
          name: '翻译权',
          amount: data.result.type['15'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/3E/CgoKDVw-pLOAdnr0AAAOmQdkdns773.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M02/0A/73/CgoKC1w-pNWALMmxAAAOpY8xRJc156.png',
          width: '25%',
          border_bottom: '1',
          scope: '15',
          url: 'detail/x'
        }, {
          name: '汇编权',
          amount: data.result.type['16'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/73/CgoKC1w-pL6AUZVKAAALjv7nZcw575.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/73/CgoKC1w-pL6AAtvsAAALlf9_4CA315.png',
          width: '25%',
          border_bottom: '0',
          scope: '16',
          url: 'detail/x'
        }, {
          name: '其他',
          amount: data.result.type['17'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/3E/CgoKDVw-pKiATVLYAAAP2pTQVYY782.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M02/0A/3E/CgoKDVw-pKiAVCG9AAAPvB_OW5U171.png',
          width: '25%',
          border_bottom: '0',
          scope: '17',
          url: 'detail/x'
        },
      ];
      thePage.setData({
        commonObj: data.result,
        prepertyObj: rightObj,
        loading: false
      });

    }, 'get');
    app.doPost('/work/details', { workSeqNo: thePage.data.workNo, timestamp: (new Date()).valueOf() }, null, function (data) {
      thePage.setData({
        powerType: data.result.powerType,
        personalObj: data.result.workModel,
        workSeqNo: data.result.workModel.workSeqNo
      });
    }, 'get');
  },
  onShareAppMessage: function (res) {
    return {
      title: ("[" + thePage.data.personalObj.type + "]" +
      thePage.data.personalObj.name + "@" + thePage.data.personalObj.category),
    }
  },
  addCopyright:function(){
    wx.navigateTo({
      url: "edit/x"
    });
  },


  pledge_p(res) {
    console.log(thePage.data.titleStr)
    if (thePage.data.titleStr == "权利质押") {
      wx.navigateTo({
        url: '../../pledge/add/x?workSeqNo=' + thePage.data.workNo + '&citiaoClass=' + thePage.data.citiaoClass
      });
    } else if (thePage.data.titleStr == "权利转让"){
      wx.navigateTo({
        url: '../../transfer/edit/x?workSeqNo=' + thePage.data.workNo + '&title=权利转让' + '&citiaoClass=' + thePage.data.citiaoClass
      });
    }else {
      wx.navigateTo({
        url: '../../license/add/x?workSeqNo=' + thePage.data.workNo + '&citiaoClass=' + thePage.data.citiaoClass
      });
    }
  },
  onPullDownRefresh: function () {
      this.getData();
    setTimeout(()=>{
          wx.stopPullDownRefresh();
      },300)
  }
})