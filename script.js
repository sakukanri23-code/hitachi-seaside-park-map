// 公園の中心座標（ネモフィラで有名な「みはらしの丘」付近）
const parkCenter = [36.401, 140.607];

// 地図の初期化
const map = L.map('map').setView(parkCenter, 15);

// 背景地図（OpenStreetMap）
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 施設データ（サンプル）
const facilities = [
    { name: "みはらしの丘 (ネモフィラ/コキア)", pos: [36.401, 140.607], type: "spot" },
    { name: "西口レストハウス (カフェ)", pos: [36.398, 140.598], type: "cafe" },
    { name: "プレジャーガーデン (遊園地)", pos: [36.392, 140.603], type: "spot" },
    { name: "トイレ (西口付近)", pos: [36.397, 140.597], type: "toilet" }
];

// アイコン設定
const icons = {
    cafe: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/924/924514.png', iconSize: [32, 32] }),
    toilet: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/2207/2207347.png', iconSize: [32, 32] }),
    spot: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', iconSize: [32, 32] })
};

// マーカーの設置
facilities.forEach(f => {
    L.marker(f.pos, { icon: icons[f.type] || icons.spot })
        .bindPopup(`<b>${f.name}</b>`)
        .addTo(map);
});

// 現在地表示機能
let userMarker;
function locateUser() {
    map.locate({setView: true, maxZoom: 16});
}

map.on('locationfound', function(e) {
    if (userMarker) {
        userMarker.setLatLng(e.latlng);
    } else {
        userMarker = L.marker(e.latlng, {
            icon: L.divIcon({className: 'user-location', html: '<div style="background:blue; width:12px; height:12px; border-radius:50%; border:2px solid white;"></div>'})
        }).addTo(map);
    }
});

map.on('locationerror', function() {
    alert("位置情報が取得できませんでした。");
});
