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
    console.log(totalSeconds); //デバッグ用
})

let timer = null;
st_btn.addEventListener('click', () => {
    if(totalSeconds != 0 && timer == null){
        timer = setInterval(() => {
                    if(totalSeconds != 0 && !(totalSeconds < 0) ){
                        totalSeconds--;
                        const min_sec = convert(totalSeconds);
                        update_display(min_sec);
                    }else{
                        clearInterval(timer);
                        timer = null;
                        rf_display();
                        console.log("設定時間経過：0で止めます"); //デバッグ用
                    }
                }, 1000);
    }else if(!(timer == null)){
        clearInterval(timer);
        timer = null;
    }else{
        clearInterval(timer);
        timer = null;
        rf_display();
    }
})


