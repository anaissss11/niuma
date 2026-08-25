const TARGET=510;

function k(){
    return new Date().toDateString()
}

function reset(){
    if(localStorage.day!==k()){
        localStorage.day=k();
        localStorage.removeItem("start");
        localStorage.removeItem("end")
    }
}

function fmt(t){
    return new Date(t).toLocaleTimeString([],{
        hour:"2-digit",
        minute:"2-digit",
        hour12:false
    })
}

function saveHist(){
    if(!localStorage.start||!localStorage.end)return;

    let h=JSON.parse(localStorage.hist||"[]");

    let d=Math.floor(
        (localStorage.end-localStorage.start)/60000
    );

    h.unshift({
        day:new Date().toLocaleDateString(),
        s:fmt(localStorage.start),
        e:fmt(localStorage.end),
        m:d
    });

    localStorage.hist=JSON.stringify(h)
}

function clockIn(){
    if(localStorage.start)return;
    localStorage.start=Date.now();
    render()
}

function clockOut(){
    if(localStorage.end)return;
    localStorage.end=Date.now();
    saveHist();
    render()
}

/* iPhone兼容版时间编辑 */
function pick(cb){

    let val = prompt(
        "请输入时间(HH:MM)",
        "09:00"
    );

    if(!val) return;

    let arr = val.split(":");

    if(arr.length !== 2){
        alert("格式错误，例如 08:30");
        return;
    }

    let h = parseInt(arr[0]);
    let m = parseInt(arr[1]);

    if(isNaN(h) || isNaN(m)){
        alert("格式错误");
        return;
    }

    let d = new Date();
    d.setHours(h,m,0,0);

    cb(d.getTime());
}

function editStart(){
    pick(v=>{
        localStorage.start=v;
        render();
    })
}

function editEnd(){
    pick(v=>{
        localStorage.end=v;
        saveHist();
        render();
    })
}

function resetToday(){

    if(!confirm("Reset today?")){
        return;
    }

    localStorage.removeItem("start");
    localStorage.removeItem("end");

    inBtn.disabled=false;
    outBtn.disabled=false;

    inBtn.textContent="IN";
    outBtn.textContent="OUT";

    inBtn.classList.remove("done");
    outBtn.classList.remove("done");

    render();
}

function render(){

    reset();

    let s=localStorage.start?+localStorage.start:null;
    let e=localStorage.end?+localStorage.end:null;

    startTime.textContent=s?fmt(s):'--:--';
    endTime.textContent=e?fmt(e):'--:--';

    expected.textContent=s?
        fmt(s+30600000):
        '--:--';

    let m=s?
        Math.floor(((e||Date.now())-s)/60000):
        0;

    prog.value=Math.min(m,TARGET);

    if(m>=TARGET){
        status.textContent='✅ 可以下班啦';
        prog.className='donebar';
    }else{
        status.textContent='🚜 Keep Farming';
        prog.className='';
    }

    if(s){
        inBtn.textContent='✓';
        inBtn.disabled=true;
        inBtn.classList.add('done');
    }

    if(e){
        outBtn.textContent='✓';
        outBtn.disabled=true;
        outBtn.classList.add('done');
    }

    let h=JSON.parse(localStorage.hist||'[]');

    history.innerHTML=
        h.map(x=>
            x.day+'<br>'
            +x.s+' → '+x.e+'<br>'
            +Math.floor(x.m/60)+'h '
            +(x.m%60)+'m<br><br>'
        ).join('')
        ||'No Records';
}

render();
setInterval(render,30000);