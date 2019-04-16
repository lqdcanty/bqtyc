// pages/copyright/property/x.js
var thePage; 
const app = getApp();
var obj = wx.getSystemInfoSync();
var workHeight = obj.windowHeight;
var workWidth = obj.windowWidth;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    prepertyObj:null,
    dataNo:false,
    amountObj:{},
    workSeqNo:'',
    windowWidth: workWidth,
    windowHeight: workHeight,
    actionsOpened: false,
    addactionsOpened: false,
    personalObj:null,
    powerType:'',
    showIcon: true,
    actions: [
      {
        name: '许可使用'
      },
      {
        name: '版权转让',
      },
      {
        name: '权利质押',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    thePage = this;
    thePage.setData({
      workNo: options.workSeqNo
    });
     this.getData();
  },
  getData () {
    app.doPost('/PropertyView/base', { workSeqNo: thePage.data.workNo, timestamp: (new Date()).valueOf() }, null, function (data) {
      var rightObj = [
        {
          name: '复制权',
          amount: data.result.type['5'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/41/CgoKDFw-pKCAY5hdAAAE1gw9dDM012.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/41/CgoKDFw-pKCAGemrAAAE2JrPynI994.png',
          width: '25%',
          border_bottom: '1',
          scope: '5'
        }, {
          name: '发行权',
          amount: data.result.type['6'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/73/CgoKC1w-pNCACVy8AAAFcktAErg941.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M02/0A/42/CgoKDFw-pK6AGQu3AAAFbHzrVqI370.png',
          width: '25%',
          border_bottom: '1',
          scope: '6'
        }, {
          name: '出租权',
          amount: data.result.type['7'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M02/0A/3E/CgoKDVw-pKSAVkf5AAAH09j0_OU084.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/3E/CgoKDVw-pKWANqIwAAAH1XS0w0A883.png',
          width: '25%',
          border_bottom: '1',
          scope: '7'
        }, {
          name: '展览权',
          amount: data.result.type['8'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/3E/CgoKDVw-pKOAYCMKAAAEAISTe70204.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M02/0A/3E/CgoKDVw-pKOAHE2BAAAD8_i6240777.png',
          width: '25%',
          border_bottom: '1',
          scope: '8'
        }, {
          name: '表演权',
          amount: data.result.type['9'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/3E/CgoKDVw-pKyAI1f4AAALEuGODAs997.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/3E/CgoKDVw-pKyAb3WAAAALO91hA-Y936.png',
          width: '25%',
          border_bottom: '1',
          scope: '9'
        }, {
          name: '放映权',
          amount: data.result.type['10'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/3E/CgoKDVw-pLCAH9tpAAALEcooIJc690.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/73/CgoKC1w-pNKAMCuQAAALCUZfQG4712.png',
          width: '25%',
          border_bottom: '1',
          scope: '10'
        }, {
          name: '广播权',
          amount: data.result.type['11'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M02/0A/73/CgoKC1w-pL-ALfv0AAARpX1YcVs864.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/73/CgoKC1w-pMCACVzKAAARwOQTasw136.png',
          width: '25%',
          border_bottom: '1',
          scope: '11'
        }, {
          name: '信网传播权',
          amount: data.result.type['12'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/3E/CgoKDVw-pKeAPHjmAAAMIjDOeB4245.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/73/CgoKC1w-pMmAPVUtAAAMUJ1DSpE021.png',
          width: '25%',
          border_bottom: '1',
          scope: '12'
        }, {
          name: '摄制权',
          amount: data.result.type['13'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/3E/CgoKDVw-pKqAXBhcAAAIwG0_rHE700.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/73/CgoKC1w-pMyALmbuAAAI03HuUVU129.png',
          width: '25%',
          border_bottom: '1',
          scope: '13'
        }, {
          name: '改编权',
          amount: data.result.type['14'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/41/CgoKDFw-pJ6AVQEoAAAJd6YhWq0306.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M02/0A/3E/CgoKDVw-pJ-AQB7qAAAJmkrt0FY662.png',
          width: '25%',
          border_bottom: '1',
          scope: '14'
        }, {
          name: '翻译权',
          amount: data.result.type['15'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/3E/CgoKDVw-pLOAdnr0AAAOmQdkdns773.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M02/0A/73/CgoKC1w-pNWALMmxAAAOpY8xRJc156.png',
          width: '25%',
          border_bottom: '1',
          scope: '15'
        }, {
          name: '汇编权',
          amount: data.result.type['16'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/73/CgoKC1w-pL6AUZVKAAALjv7nZcw575.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M00/0A/73/CgoKC1w-pL6AAtvsAAALlf9_4CA315.png',
          width: '25%',
          border_bottom: '1',
          scope: '16'
        }, {
          name: '其他',
          amount: data.result.type['17'],
          icon: 'http://fdfs.banquanjia.com.cn/group2/M01/0A/3E/CgoKDVw-pKiATVLYAAAP2pTQVYY782.png',
          iconActive: 'http://fdfs.banquanjia.com.cn/group2/M02/0A/3E/CgoKDVw-pKiAVCG9AAAPvB_OW5U171.png',
          width: '25%',
          border_bottom: '0',
          scope: '17'
        },
      ];
      thePage.setData({
        prepertyObj: rightObj,
        amountObj: data.result
        
      });
    }, 'get');
    app.doPost('/work/details', { workSeqNo: thePage.data.workNo, timestamp: (new Date()).valueOf() }, null, function (data) {
      thePage.setData({
        personalObj: data.result.workModel,
        powerType: data.result.powerType,
        workSeqNo: data.result.workModel.workSeqNo
      });
      // wx.setNavigationBarTitle({
      //   title: "财产权@" + data.result.workModel.name,
      // });
    }, 'get');
  },

  addCopyright:function(){
    wx.navigateTo({
      url: "common/show/edit/x"
    });
  },
  onShareAppMessage: function (res) {
    return {
      title: ("[" + this.data.personalObj.type + "]" +
        this.data.personalObj.name + "@" + this.data.personalObj.category),
    }
  },

  selectStatic (e){
    thePage.setData({
      actionsOpened:true,
      scope: e.currentTarget.dataset.scope
    })
  },
  selectStaticAdd(e){
    thePage.setData({
      addactionsOpened: true,
    })
  },
  handleAction({ detail }){
    console.log(detail.index, thePage.data.workSeqNo,"workSeqNo");
    switch (detail.index){
      case 0:
        wx.navigateTo({
          url: "common/show/detail/x?workSeqNo=" + thePage.data.workSeqNo + "&scope=" + thePage.data.scope+"&citiaoClass=2"
        });
        break;
      case 1:
        wx.navigateTo({
          url: "common/show/detail/x?workSeqNo=" + thePage.data.workSeqNo + "&scope=" + thePage.data.scope + "&citiaoClass=3"
        });
        break;
      case 2:
        wx.navigateTo({
          url: "common/show/detail/x?workSeqNo=" + thePage.data.workSeqNo + "&scope=" + thePage.data.scope + "&citiaoClass=4"
        });
        break;
    }
  },
  handleActionAdd({ detail }) {
    switch (detail.index) {
      case 0:
        wx.navigateTo({
          url: 'license/add/x?workSeqNo=' + thePage.data.workSeqNo + '&citiaoClass=2'
        });
        break;
      case 1:
        wx.navigateTo({
          url: 'transfer/edit/x?workSeqNo=' + thePage.data.workSeqNo + '&title=权利转让' + '&citiaoClass=3'
        });
        break;
      case 2:
        wx.navigateTo({
          url: 'pledge/add/x?workSeqNo=' + thePage.data.workSeqNo + '&citiaoClass=4'
        });
        break;
    }
  },
  onCancel() {
    this.setData({
      actionsOpened: false
    });
  },
  onCancelAdd() {
    this.setData({
      addactionsOpened: false
    });
  },
  onPullDownRefresh: function () {
    this.getData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 300)
  },
  onHide:function(){
      thePage.setData({
        actionsOpened:false,
        addactionsOpened:false
      })
  },
})