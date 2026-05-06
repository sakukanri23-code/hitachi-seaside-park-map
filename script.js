// --- 1. 設定データ (ここを編集して施設やゾーンを追加) ---

// 公園の境界線 (南西[lat, lng], 北東[lat, lng]) 
// 公園外に行き過ぎないようにロックします
const parkBounds = [
    [36.385, 140.585], // 南西端
    [36.415, 140.625]  // 北東端
];

// 施設リスト (name: 名前, pos: 座標, type: カテゴリ)
const facilities = [
    { name: "西口トイレ", pos: [36.3985, 140.5975], type: "toilet" },
    { name: "みはらしの丘前トイレ", pos: [36.4005, 140.6055], type: "toilet" },
    { name: "レイクサイドカフェ", pos: [36.3955, 140.6015], type: "cafe" },
    { name: "記念の森レストハウス", pos: [36.3980, 140.6010], type: "cafe" }
];

// ゾーンリスト (name: 名前, pos: 中心座標, color: エリアの色)
const zones = [
    { name: "みはらしエリア", pos: [36.401, 140.608], color: "#3498db" },
    { name: "プレジャーガーデン", pos: [36.392, 140.603], color: "#e67e22" },
    { name: "樹林エリア", pos: [36.398, 140.615], color: "#27ae60" },
    { name: "草原エリア", pos: [36.396, 140.607], color: "#f1c40f" }
];

// --- 2. 地図の初期化 ---

const map = L.map('map', {
    maxBounds: parkBounds, // 公園外を見せない
    maxBoundsViscosity: 1.0,
    minZoom: 14
}).setView([36.398, 140.605], 15);

// 背景地図 (公園内の道がわかりやすい地図を採用)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// --- 3. アイコンとマーカーの設定 ---

// カテゴリ別アイコン定義
const getIcon = (type) => {
    let color = "gray";
    let symbol = "📍";
    if (type === "toilet") { color = "blue"; symbol = "🚻"; }
    if (type === "cafe") { color = "orange"; symbol = "☕"; }

    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:${color}; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.3); font-size:16px;">${symbol}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
};

// 施設マーカーの配置
facilities.forEach(f => {
    L.marker(f.pos, { icon: getIcon(f.type) })
        .bindPopup(`<b>${f.name}</b>`)
        .addTo(map);
});

// ゾーン名の配置 (ラベルとして表示)
zones.forEach(z => {
    L.marker(z.pos, {
        icon: L.divIcon({
            className: 'zone-label',
            html: `<span style="color:${z.color};">${z.name}</span>`,
            iconSize: [100, 20]
        })
    }).addTo(map);
    
    // エリアを円で視覚化
    L.circle(z.pos, {
        color: z.color,
        fillColor: z.color,
        fillOpacity: 0.1,
        radius: 200
    }).addTo(map);
});

// --- 4. 位置情報機能 ---

let userMarker;
function locateUser() {
    map.locate({setView: true, maxZoom: 17});
}

map.on('locationfound', (e) => {
    // 公園内にいるかチェック
    if (!L.latLngBounds(parkBounds).contains(e.latlng)) {
        alert("現在、公園外にいるようです。マップを公園内に戻します。");
        map.setView([36.398, 140.605], 15);
        return;
    }

    if (userMarker) {
        userMarker.setLatLng(e.latlng);
    } else {
        userMarker = L.circleMarker(e.latlng, {
            radius: 8,
            fillColor: "#007bff",
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map).bindPopup("あなたはここにいます");
    }
});

map.on('locationerror', () => alert("位置情報を取得できませんでした。GPS設定を確認してください。"));
