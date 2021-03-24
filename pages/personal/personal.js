import request from '../../utils/request'

// pages/personal/personal.js
let startY=0;
let moveY = 0;
let moveDistance =0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    converTransform: 'translateY(0)',
    converTransition: '',
    userInfo:{},
    recentPlayList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //读取用户信息
    let userInfo = wx.getStorageSync('userInfo');
    if(userInfo){
      this.setData({
        userInfo:JSON.parse(userInfo)
        //个人用户id:1671598201
      });
      //获取播放记录
      this.getUserRecentPlayList(this.data.userInfo.userId);
    }
  },
  async getUserRecentPlayList(uid){
    let recentPlayListData = await request('/user/record',{uid,type:0});
    let index =0;
    let recentPlayList = recentPlayListData.allData.splice(0,10).map(item=>{
      item.id = index++;
      return item;
    })
    this.setData({
      recentPlayList:recentPlayList
    })
  },
  bindtouchstart(event){
    startY = event.touches[0].clientY;
    this.setData({
      converTransition: ''
    })
  },
  bindtouchmove(event){
    moveY = event.touches[0].clientY;
    moveDistance = (moveY-startY);
    if(moveDistance <=0){
      moveDistance =0;
    }
    if(moveDistance>80){
      moveDistance = 80;
    }

    this.setData({
      converTransform: `translateY(${moveDistance}rpx)`
    })
  },
  bindtouchend(event){
    this.setData({
      converTransform: `translateY(0rpx)`,
      converTransition: 'transform 1s linear'
    })
  },
  //跳转至登录页面
  toLogin(event){
    wx.navigateTo({
      url: '/pages/login/login',
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

  }
})