// pages/recommendSong/recommendSong.js
import request from '../../utils/request'
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',//天
    month:'',//月
    recommendList:[],
    index:0 //点击音乐的数组下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success:()=>{
          //跳转到登录页面
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    //更新日期状态数据
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    //获取每日推荐数据
    this.getDayList();
    //订阅来自songDetail页面发布的消息
    PubSub.subscribe('switchType',(msg,data)=>{
      let {recommendList,index} = this.data;
      if(data === 'pre'){
        index-=1;
        console.log('index=',index)
       index= (index==0?0:index);
      }else{
        index+=1;
      index = (  index == recommendList.length?index-1:index);
      }
      this.setData({
        index
      })
      PubSub.publish('musicID',recommendList[index].id)
    })
  },
  async getDayList(){
    let res = await request('/recommend/songs');
    this.setData({
      recommendList:res.recommend
    })
  },
  
  toSongDetail(event){
    let song = event.currentTarget.dataset.song;
    let index = event.currentTarget.dataset.index;
    //保存点击的第几首歌的下标
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?id='+ song.id,
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