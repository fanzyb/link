const video = document.getElementById('video');
const qualityList = document.querySelector('#quality-list');

const logoImage = {
    dark: 'https://raw.githubusercontent.com/fanzyb/link/main/images/logom3u8white.png',
    light: 'https://raw.githubusercontent.com/fanzyb/link/main/images/logom3u8black.png'
};

function playM3u8(url) {
    if (Hls.isSupported()) {
        video.volume = 1;
        const hls = new Hls();
        const m3u8Url = decodeURIComponent(url)
        hls.loadSource(m3u8Url);
        hls.currentLevel = -1;
        hls.loadLevel = -1;
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            const levels = hls.levels;
            qualityList.innerHTML = '';

            const liDark = document.createElement('li');
            liDark.style.listStyle = 'none';
            qualityList.appendChild(liDark);

            if(levels.length > 1){
                for (let i = 0; i < levels.length; i++) {
                    const level = levels[i];
                    const listItem = document.createElement('li');
                    const levelBtn = document.createElement('button');
                    levelBtn.classList.add('btn', 'btn-primary');
                    levelBtn.textContent = level.height + 'p';
                    levelBtn.value = i;
                    listItem.style.listStyle = 'none';
                    listItem.appendChild(levelBtn);
                    qualityList.appendChild(listItem);
                    levelBtn.addEventListener('click', function () {
                        hls.currentLevel = parseInt(this.value);
                    });
                }
            }
            video.play();
        });
        //document.title = "JKT48 Live - " + url;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('canplay', function () {
            video.play();
        });
        video.volume = 1;
        //document.title = "JKT48 Live - " + url;
    }
}

function initialize() {
    const modeSwitch = document.getElementById('mode-switch');
    const logo = document.getElementById('logo');
    const body = document.body;

    modeSwitch.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        modeSwitch.classList.toggle('btn-light');
        modeSwitch.classList.toggle('btn-dark');
        modeSwitch.innerHTML = body.classList.contains('dark-mode') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

        logo.src = body.classList.contains('dark-mode') ? logoImage.dark : logoImage.light;

        // Menyimpan preferensi mode pada local storage
        const preferredMode = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('preferredMode', preferredMode);
    });
}

initialize();

function playPause() {
    video.paused ? video.play() : video.pause();
}

function volumeUp() {
    if (video.volume <= 0.9) video.volume += 0.1;
}

function volumeDown() {
    if (video.volume >= 0.1) video.volume -= 0.1;
}

function seekRight() {
    video.currentTime += 5;
}

function seekLeft() {
    video.currentTime -= 5;
}

function vidFullscreen() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    }
}

playM3u8(window.location.href.split("#")[1]);
$(window).on('load', function () {
    $('#video').on('click', function () { this.paused ? this.play() : this.pause(); });
    Mousetrap.bind('space', playPause);
    Mousetrap.bind('up', volumeUp);
    Mousetrap.bind('down', volumeDown);
    Mousetrap.bind('right', seekRight);
    Mousetrap.bind('left', seekLeft);
    Mousetrap.bind('f', vidFullscreen);
});


if (window.innerWidth >= 1024) {
    video.style.cssText = 'height: 80vh; max-height: calc(100vw * 9 / 16);' //pc
} else {
    video.style.cssText = 'max-height: 80vh; max-width: 100%;' //hp
}

// Memeriksa preferensi mode pada local storage
const preferredMode = localStorage.getItem('preferredMode');
if (preferredMode === 'dark') {
    // Jika mode gelap dipilih sebelumnya, aktifkan dark mode
    document.body.classList.add('dark-mode');
    document.getElementById('mode-switch').classList.add('btn-dark');
    document.getElementById('mode-switch').innerHTML = '<i class="fas fa-sun"></i>';
    document.getElementById('links').classList.add('btn-dark');
    document.getElementById('logo').src = 'https://raw.githubusercontent.com/fanzyb/link/main/images/logom3u8white.png';
}