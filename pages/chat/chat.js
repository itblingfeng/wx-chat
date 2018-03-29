var utils = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList:[],
    input:null,
    openid:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getStorage({
      key: 'OPENID',
      success: function(res) {
        _this.setData({
          openid:res.data
        })
      },
    })
    var _this = this;
    //建立连接
    wx.connectSocket({
      url: "wss://www.chat.blingfeng.cn/websocket/"+_this.data.openid+"/"+options.to,
    })

    //连接成功
    wx.onSocketOpen(function () {
      console.log('连接成功');
    })
    wx.onSocketMessage(function(res){
      
       var list = [];
       list = _this.data.newsList;
      var  _data = JSON.parse(res.data);
     
       list.push(_data);
       console.log(list)
       _this.setData({
         newsList:list
       })
       
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
    
  },
  send :function(){
    var _this = this;
    if(_this.data.input){
    wx.sendSocketMessage({
      data: _this.data.input,
    })
    var list = [];
    list = this.data.newsList;
    var temp = { 'message': _this.data.input, 'date': utils.formatTime(new Date()), type: 1 };
    list.push(temp);
    this.setData({
      newsList:list,
      input:null
    })
    }
    
  },
  bindChange:function(res){
    this.setData({
      input: res.detail.value
    })
  },
  back:function(){
    wx.closeSocket();
    console.log('连接断开');
  }
})