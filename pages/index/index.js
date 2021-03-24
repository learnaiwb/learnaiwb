import request from "../../utils/request"

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],//轮播图数据
    recommendList: [], //推荐歌单
    topList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // var reqTask = wx.request({
    //   url: 'http://localhost:3000/banner',
    //   data: {type:2},
    //   header: {'content-type':'application/json'},
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: (result)=>{
    //     console.log(result);
    //   },
    //   fail: (err)=>{console.log(err)},
    //   complete: ()=>{}
    // });
    // 获取轮播图数据
    let result = await request('/banner',{type:2});
    this.setData({
      bannerList:result.banners
    })
    //获取推荐歌单数据
    let recommendListData =await request('/personalized',{limit:10});
    this.setData({
      recommendList: recommendListData.result
    })

    //获取排行榜数据
    let index = 0;
    let resultArr = [];
    while(index < 5){
      let topListData = await request('/top/list',{idx: index++});
      //splice会修改原数组 slice不会
      let topListItem = {name: topListData.playlist.name,tracks:topListData.playlist.tracks.slice(0,3)};
      resultArr.push(topListItem)
      this.setData({
        topList: resultArr
      })
    }


  },
  toRecommendSong(){
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
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