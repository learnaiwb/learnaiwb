// pages/songDetail/songDetail.js
import request from '../../utils/request'
import PubSub, { publish } from 'pubsub-js'
import moment from 'moment'


let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,//音乐是否播放
    song:{},//歌曲详情对象
    musicId:'',//音乐ID
    musicLink:'',//音乐的链接
    dtime:'00:00',//歌曲总时长
    ctime:"00:00",//歌曲实时
    currentWidth:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //options 用于接受路由跳转的query参数，但是数据太长会被截断
    if(options !== {}){
      let id = options.id;
      //获取音乐详情
      this.getDetailSong(id);
      this.setData({
        musicId:id
      });

      //判断当前页面音乐是否在播放
      if(app.globalData.isMusicPlay && app.globalData.musicID === id){
        this.setData({
          isPlay:true
        })
      }
      /***
       * 如果用户操作系统的控制音乐播放/暂停按钮，页面不知道，导致页面显示是否播放的状态和真实的音乐播放状态不一致
       * 
       */
    //音乐播放实例   // 创建控制音乐播放实例
    this.manager = wx.getBackgroundAudioManager();
    //监视音乐播放/暂停
    this.manager.onPlay(()=>{
      //修改音乐是否的状态
      console.log('play')
      app.globalData.musicID = id;
      this.changePlayState(true)
    });
    this.manager.onPause(()=>{
      console.log('pause')
      this.changePlayState(false)
    });
    };
    this.manager.onStop(()=>{
      console.log('pause')
      this.changePlayState(false)
    });
    this.manager.onTimeUpdate(()=>{
      console.log('update')
      //实时时间
      let ctime = moment(this.manager.currentTime*1000).format('mm:ss');
      //实时位置
      let currentWidth = this.manager.currentTime/this.manager.duration * 450;
      this.setData({
        ctime,
        currentWidth
      })
    });
    this.manager.onEnded(()=>{
      this.handleSwitch({currentTarget:'next'});
      this.setData({
        currentWidth:0,
        currentTime:'00:00'
      })
    })
  },
  // 获取音乐的详情信息
  async getDetailSong(id){
    let songData = await request('/song/detail',{ids:id});
    let dtime = moment(songData.songs[0].dt).format('mm:ss');
    this.setData({
      song:songData.songs[0],
      dtime
    });
    //动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },
  //点击播放/暂停的回调
  handleMusicPlay(){
    let isPlay = !this.data.isPlay;
    // this.setData({
    //   isPlay
    // });
    this.musicControl(isPlay,this.data.musicLink);
  },
  //控制音乐播放/暂停的功能函数
  async musicControl(isPlay,musicLink=null){
    app.globalData.isMusicPlay = isPlay;

    if(isPlay){
      //获取音乐播放的链接
      if(!musicLink){
        let musicLinkData = await request('/song/url',{id:this.data.musicId});
        //指定音乐链接
        this.manager.src = musicLinkData.data[0].url;
        this.setData({
          musicLink: this.manager.src
        })
      }else{
        this.manager.src = musicLink;
      }

      this.manager.title = this.data.song.name;
    }else{
      //暂停音乐
      this.manager.pause();
    }
  },
  //修改播放器状态功能函数
  changePlayState(isPlay){
    this.setData({
      isPlay
    })
  },
  //点击切歌的回调
  handleSwitch(event){
    //获取类型
    let type = event.currentTarget.id;
    //切歌的时候，当前页面就不要唱歌了
    this.manager.stop();

    //订阅来自recommendSong页面发布的musicID消息
    PubSub.subscribe('musicID',(msg,musicID)=>{
      //要播放新的id的歌曲了，更新musicID
      this.setData({musicId:musicID});
      //获取新的歌曲的信息
      this.getDetailSong(musicID);
      //同步更新全局的音乐ID
      app.globalData.musicID = musicID;//改变全局的存储音乐id
      this.musicControl(this.data.isPlay)
      //取消订阅
      PubSub.unsubscribe('musicID')
    })
    //发布消息
    PubSub.publish('switchType',type)
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