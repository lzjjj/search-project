//app.js
import requestUrls from './common/api.js'

App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        var that = this
        var code = res.code
        console.log(code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.getStorage({
          key: 'trd_session',
          success: res1 => {
            if (res1.data != undefined) {
              wx.request({
                url: requestUrls.WeChatlogin + '?trd_session=' + res1.data,
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: res2 => {
                  if (res2.data.msg == 'noLogin') {
                    wx.request({
                      url: requestUrls.WeChatlogin + '?code=' + code,
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      success: res3 => {
                        wx.setStorage({
                          key: 'trd_session',
                          data: res3.data.obj.trd_session
                        })
                      }
                    })
                  }
                }
              })
            } else {
              wx.request({
                url: requestUrls.WeChatlogin + '?code=' + code,
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: res4 => {
                  wx.setStorage({
                    key: 'trd_session',
                    data: res4.data.obj.trd_session
                  })
                }
              })
            }
          },
          fail: function() {
            wx.request({
              url: requestUrls.WeChatlogin + '?code=' + code,
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: res5 => {
                wx.setStorage({
                  key: 'trd_session',
                  data: res5.data.obj.trd_session
                })
              }
            })
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
