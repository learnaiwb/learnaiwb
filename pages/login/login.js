// pages/login/login.js
//登录流程
/**
 * 1.收集数据
 * 2.前端验证
 *    -1.用户信息是否合法,账号、密码
 *    -2.验证不通过提示用户，通过的话发请求给后端
 * 3.后端验证
 *    -1.验证用户是否存在
 *    -2.不存在注册
 *    -3.存在验证密码，密码不正确返回前端
 *    -4.密码正确返回数据，并携带用户信息
 */
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleInput(event){
    let type = event.currentTarget.id;
    this.setData({
      [type]:event.detail.value
    })
  },
async login(){
    let {phone,password} = this.data;
    if(!phone){
      wx.showToast({
        title: '手机号不能为空',
        icon:'none'
      })
      return
    }
      let phoneReg = /^1[3-9]\d{9}$/;
      if(!phoneReg.test(phone)){
        wx.showToast({
          title: '手机格式不正确',
          icon: 'none'
        })
        return
      }
      if(!password){
        wx.showToast({
          title: '密码不可为空',
          icon:'none'
        })
        return
      }
      //后端验证
      let result = await request('/login/cellphone',{phone,password,isLogin:true});
      if(result.code === 200){
        wx.showToast({
          title: '登录成功',
        });
        //将用户信息存储到本地
        wx.setStorageSync('userInfo', JSON.stringify(result.profile));
        //要切换到tabbar页面，得用这个函数,会销毁掉之前页面，可以执行personal的Onload
        wx.reLaunch({
          url: '/pages/personal/personal',
        })
            }else if(result.code === 502){
          wx.showToast({
            title: '密码错误',
          })}else if(result.code === 400){
            wx.showToast({
              title: '手机号错误',
            })}else{
              wx.showToast({
                title: '请重新登录',
              })
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

  }
})