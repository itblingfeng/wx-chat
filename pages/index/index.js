//index.js
//获取应用实例

const app = getApp()
Page({
  data: {
    userInfo: {},
   
    openid: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var _this = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.getStorage({
      key: 'OPENID',
      success: function(res) {
      _this.setData({
        openid:res.data
      })
      },
    })
    if(!_this.data.openid){
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            method: 'POST',
            url: 'http://localhost:9000/chat/login/' + res.code,
            success: function (e) {
              wx.setStorage({
                key: 'OPENID',
                data: e.data.data,
              })
              _this.setData({
                openid: e.data.data
              })
              
           
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
        
      }
      })
    };
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  join:function(){
    wx.request({
      url: 'https://www.chat.blingfeng.cn/chat/random',
      method:'POST',
      success:function(e){
        wx.navigateTo({
          url: '../chat/chat?to='+e.data.data,
        })
      }
    })
    
  }

})
