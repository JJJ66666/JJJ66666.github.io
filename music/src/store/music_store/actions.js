export const actions = {
    setAudio({
        state
    }, audio) {
        state.audio = audio
        
    },

    changeAudioSrc({
        state
    }, url) {
        state.audioSrc = url;
        state.status = 1;
        return state.audio;
    },
    //home页面克隆数组o 存放到state
    addHomeMusicList({
        state
    }, o) {
        state.homeMusicList = o
        return state.homeMusicList
    },
    //暂停/播放
    play({
        state
    }, status) {
        state.status = status
    },
    //获取当前歌曲id
    getNowId({
        state
    }, id) {
        state.nowSongId = id
    },
    //切换当前播放列表playedMusicList
    toggleMusicList({state},arr){
        state.playedMusicList = arr
        
    },

    //添加已播放的音乐
    addPlayedMusic({state},item){
        for (let i = 0; i < state.playedMusicList.length; i++) {
            if (state.playedMusicList[i].id == item.id) {
                
                return;
            }
        }
        state.playedMusicList.push(item)
        
    }
}