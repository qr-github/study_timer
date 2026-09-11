let totalSeconds = 0;

//時間追加ボタン
const add_5_min = document.getElementById('min_5');
const add_10_min = document.getElementById('min_10');
const add_15_min = document.getElementById('min_15');
const add_20_min = document.getElementById('min_20');
const add_25_min = document.getElementById('min_25');
const add_30_min = document.getElementById('min_30');
const time_conf_btn = document.getElementById('wrap_btn_time_conf');

//スタート，リセットボタン
const st_btn = document.getElementById('start_btn');
const rf_btn = document.getElementById('refresh_btn');

//時間表示部分
const ten_min = document.getElementById('ten_min');
const one_min = document.getElementById('one_min');
const ten_sec = document.getElementById('ten_sec');
const one_sec = document.getElementById('one_sec');
ranks =[
    {ten_p: ten_min, one_p: one_min},
    {ten_p: ten_sec, one_p: one_sec}
]

//icon
const img_icon = document.getElementById('st_icon');

//audio_config
const sounds_conf_area = document.getElementById('sound_conf');
const sound_name = document.getElementById('sound_name_text');
let currentIndex = 0; //初期値

//audio
const alarm_audio = new Audio('/sounds/rain.mp3');
const shiningStar = new Audio('/sounds/shining_star.mp3');
let audioList = [
    {audio: alarm_audio, name: "雨"},
    {audio: shiningStar, name: "シャイニングスター"}
]
alarm_audio.loop = true;
alarm_audio.volume = 0.5;
shiningStar.loop = true;
shiningStar.volume = 0.5;
let currentAudio = audioList[currentIndex]; //初期値
let is_playing = currentAudio.audio; //初期値



//flag
let sound_play = false;
let is_audio_active = false;

//===ロジック部分===
function time_config(seconds){
    totalSeconds += seconds;
    return totalSeconds;
}

function convert(total_sec){
    const min = Math.trunc(total_sec / 60);
    const sec = total_sec % 60;
    return min_sec = {min, sec};
}

function convert_rank(mixRank){
    const ten_place = Math.trunc(mixRank / 10);
    const one_place = mixRank % 10;
    return rank = {ten_place, one_place};
}

function change_display(rank_num, target_rank){
    const num_str = String(rank_num);
    target_rank.innerText = num_str;
}

function update_display(min_sec){
    targets = [
        {value: min_sec.min, ten_p: ten_min, one_p: one_min},
        {value: min_sec.sec, ten_p: ten_sec, one_p: one_sec}
    ]
    targets.forEach(item => {
        const rank = convert_rank(item.value);
        change_display(rank.ten_place, item.ten_p);
        change_display(rank.one_place, item.one_p);
    });
}

function rf_display(){
    totalSeconds = 0;
    ranks.forEach(item =>{
        change_display(0, item.ten_p);
        change_display(0, item.one_p);
    });
}

function btn_icon_change(icon_src, btn_element, text){
    img_icon.src = icon_src;
    btn_element.querySelector(".btn_text").innerText = text;
}

function sound_play_conf(select_sound, flag_sound_play){
    sound_play = flag_sound_play;
    if(sound_play){
        select_sound.play();
    }else{
        select_sound.pause();
        select_sound.currentTime = 0;
    }
}

function sound_play_sys(){
    currentIndex = currentIndex + 1;
    currentIndex = currentIndex % audioList.length;
    currentAudio = audioList[currentIndex];
    is_playing = currentAudio.audio;
    sound_name.innerText = currentAudio.name;
}

//実処理部分
time_conf_btn.addEventListener('click', (e) => {
    const clicked_btn = e.target.closest('button');
    const conf_num = Number(clicked_btn.dataset.sec);
    const min_sec = convert(time_config(conf_num));

    update_display(min_sec);
    console.log(totalSeconds); //デバッグ用
})

rf_btn.addEventListener('click', () => {
    rf_display();
    btn_icon_change("icons/play_arrow.svg", st_btn, "START");
    sound_play_conf(is_playing, false);
    console.log(totalSeconds); //デバッグ用
})

let timer = null;
st_btn.addEventListener('click', () => {
    if(totalSeconds != 0 && timer == null){ //スタート
        btn_icon_change("icons/play_pause.svg", st_btn, "PAUSE");
        timer = setInterval(() => {
                    if(totalSeconds != 0 && !(totalSeconds < 0) ){
                        totalSeconds--;
                        const min_sec = convert(totalSeconds);
                        update_display(min_sec);
                    }else{
                        clearInterval(timer);
                        timer = null;
                        rf_display();
                        is_audio_active = true;
                        sound_play_conf(is_playing, true);
                        console.log("設定時間経過：0で止めます"); //デバッグ用
                    }
                }, 1000);
    }else if(!(timer == null)){ //一時停止
        clearInterval(timer);
        timer = null;
        btn_icon_change("icons/play_arrow.svg", st_btn, "START");
        //console.log("今ここ1");
    }else{ //無設定時の誤スタート防止処理
        clearInterval(timer);
        timer = null;
        rf_display();
        btn_icon_change("icons/play_arrow.svg", st_btn, "START");
        is_audio_active = false;
        sound_play_conf(is_playing, false);
        //console.log("今ここ2");
    }
})

sounds_conf_area.addEventListener('click', () => {
    if(is_audio_active === true){
        const swap_audio = is_playing;
        sound_play_conf(swap_audio, false);
        sound_play_sys();
        sound_play_conf(is_playing, true);
    }else{
        sound_play_sys();
    }
})



