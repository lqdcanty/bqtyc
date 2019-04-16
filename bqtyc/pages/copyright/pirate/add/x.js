// 区块链页面
const app = getApp()
const { $Message } = require('../../../../dist/base/index');
var thePage;
Page({
  data: {
    selected:"请选择角色",
    actionsOpened: false,
    actions:[],
    status_info:'选择角色',
    checked:true,
    showIcon: true,
    radioValue:true,
    workSeqNo:'',
    checkboxChange:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // var workSeqNo ='201812051355245032';
    thePage = this;
    thePage.setData({
      checkboxChange: checkboxChangeArr
    })
    
  },
  openActions:function(res){
    console.log(res,"ee")
    thePage.setData({
      actionsOpened: true
    })
  },
  onCancel() {
    thePage.setData({
      actionsOpened: false
    });
  },
  handleAction:function({detail}){
    thePage.setData({
      selected: thePage.data.actions[detail.index].name,
      actionsOpened: false
    })
  },
  boxRadio:function(res){
    console.log(res,"radio")
    if (thePage.data.radiovalue){
      thePage.setData({
        radiovalue: false
      })
    }else{
      thePage.setData({
        radiovalue: true
      })
    }
  },
  formSubmit(e) {
    console.log(e.detail.value);
    if (e.detail.value.role =="请选择角色"){
      $Message({
        content: '请选择角色',
        type: 'warning'
      });
      return;
    }
    if (e.detail.value.roleVlue == ""){
      $Message({
        content: '请输入角色名称',
        type: 'warning'
      });
      return;
    }
    app.doPost('/personal/addSingature', { copyrightContent:JSON.stringify(e.detail.value), timestamp: (new Date()).valueOf() }, '', function (data) {
      $Message({
        content: '新增词条成功',
        type: 'success'
      });
    }, 'post');
  },
  onShareAppMessage: function (res) {
    console.log("有一个分享请求", res);
    console.log(this.data.personalObj.type, this.data.personalObj.name, this.data.personalObj.category, this.data.personalObj.type)
    return {
      title: ("[" + this.data.personalObj.type + "]" +
        this.data.personalObj.name + "@" + this.data.personalObj.category),
    }
  }
  
})
var checkboxChangeArr=[
  {
    name:'复制权'
  },
  {
    name: '发行权'
  },
  {
    name: '出租权'
  },
  {
    name: '发行权'
  },
  {
    name: '展览权'
  },
  {
    name: '表演权'
  },
  {
    name: '放映权'
  },
  {
    name: '信息网络传播权'
  },
  {
    name: '摄影权'
  },
  {
    name: '改编权'
  },
  {
    name: '翻译权'
  },
  {
    name: '汇编权'
  },
  {
    name: '其他权利'
  }
]

