const TARGET = 510;

function k() {
    return new Date().toDateString();
}

function fmt(t) {
    return new Date(t).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}

function archiveYesterday() {

    if (
        localStorage.day &&
        localStorage.day !== k() &&
        localStorage.start
    ) {

        let h = JSON.parse(localStorage.hist || "[]");

        h = h.filter(x => x.day !== localStorage.day);

        let s = +localStorage.start;

        let e = localStorage.end
            ? +localStorage.end
            : s;

        let m = Math.max(
            0,
            Math.floor((e - s) / 60000)
        );

        h.unshift({
            day: localStorage.day,
            s: fmt(s),
            e: localStorage.end
                ? fmt(e)
                : "--:--",
            m: m
        });

        localStorage.hist = JSON.stringify(h);
    }

    if (localStorage.day !== k()) {

        localStorage.day = k();

        localStorage.removeItem("start");
        localStorage.removeItem("end");
    }
}

function saveHist() {

    if (
        !localStorage.start ||
        !localStorage.end
    ) {
        return;
    }

    let h = JSON.parse(
        localStorage.hist || "[]"
    );

    let today = new Date()
        .toLocaleDateString();

    h = h.filter(
        x => x.day !== today
    );

    let d = Math.floor(
        (
            +localStorage.end -
            +localStorage.start
        ) / 60000
    );

    h.unshift({
        day: today,
        s: fmt(localStorage.start),
        e: fmt(localStorage.end),
        m: d
    });

    localStorage.hist =
        JSON.stringify(h);
}

function clockIn() {

    if (localStorage.start) {
        return;
    }

    localStorage.start =
        Date.now();

    localStorage.day = k();

    render();
}

function clockOut() {

    if (localStorage.end) {
        return;
    }

    localStorage.end =
        Date.now();

    saveHist();

    render();
}

function pick(cb) {

    let val = prompt(
        "请输入时间(HH:MM)",
        "09:00"
    );

    if (!val) return;

    let arr = val.split(":");

    if (arr.length !== 2) {

        alert(
            "格式错误，例如 08:30"
        );

        return;
    }

    let h = parseInt(arr[0]);
    let m = parseInt(arr[1]);

    if (
        isNaN(h) ||
        isNaN(m)
    ) {

        alert("格式错误");
        return;
    }

    let d = new Date();

    d.setHours(
        h,
        m,
        0,
        0
    );

    cb(d.getTime());
}

function editStart() {

    pick(v => {

        localStorage.start = v;

        if (!localStorage.day) {
            localStorage.day = k();
        }

        render();
    });
}

function editEnd() {

    pick(v => {

        localStorage.end = v;

        saveHist();

        render();
    });
}

function resetToday() {

    if (
        !confirm("Reset today?")
    ) {
        return;
    }

    localStorage.removeItem(
        "start"
    );

    localStorage.removeItem(
        "end"
    );

    render();
}

function render() {

    archiveYesterday();

    let s =
        localStorage.start
            ? +localStorage.