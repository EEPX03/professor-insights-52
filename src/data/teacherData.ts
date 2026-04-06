// 資料來源：中正大學企管系 https://busadm.ccu.edu.tw/p/412-1248-3236.php?Lang=zh-tw
// 瀏覽數為各老師頁面上的真實「瀏覽數」欄位（2026/04/06 擷取）
// 部分資料為 AI 預估（照片清晰度、外在感知、笑容程度）

export interface TeacherData {
  name: string;
  url: string;
  photo: string;
  views: number; // Y - 真實瀏覽數（從各老師頁面底部「瀏覽數」欄位擷取）
  wordCount: number;
  rank: string;
  rankScore: number; // 教授=4, 副教授=3, 助理教授=2, 講師=1
  gender: string;
  genderScore: number; // 男=1, 女=2
  photoClarity: number; // 0-100 AI 預估
  appearance: number; // 0-100 AI 預估（親切/專業感）
  researchCount: number;
  infoScore: number; // 0-100
  smileScore: number; // 0-100 AI 預估
  titleCount: number; // 0, 1, 2
  nameLength: number; // 2 or 3
}

function getRankScore(rank: string): number {
  switch (rank) {
    case "教授": return 4;
    case "副教授": return 3;
    case "助理教授": return 2;
    case "講師": return 1;
    default: return 4;
  }
}

const rawTeachers = [
  { name: "黃正魁", url: "https://busadm.ccu.edu.tw/p/405-1248-31588,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/336/m/mczh-tw400x400_small31588_323838433375.png", views: 13904, wordCount: 33546, rank: "教授", gender: "男", researchCount: 5, infoScore: 100, titleCount: 2, nameLength: 3, photoClarity: 72, appearance: 78, smileScore: 72 },
  { name: "陳世彬", url: "https://busadm.ccu.edu.tw/p/405-1248-31583,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/584/m/mczh-tw400x400_small31583_752687633182.png", views: 7196, wordCount: 15007, rank: "教授", gender: "男", researchCount: 6, infoScore: 100, titleCount: 0, nameLength: 3, photoClarity: 68, appearance: 70, smileScore: 55 },
  { name: "連雅慧", url: "https://busadm.ccu.edu.tw/p/405-1248-31584,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/212/m/mczh-tw400x400_small31584_458392533193.png", views: 10042, wordCount: 28595, rank: "教授", gender: "女", researchCount: 4, infoScore: 100, titleCount: 2, nameLength: 3, photoClarity: 75, appearance: 82, smileScore: 85 },
  { name: "鍾憲瑞", url: "https://busadm.ccu.edu.tw/p/405-1248-31585,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/338/m/mczh-tw400x400_small31585_218222233459.png", views: 5562, wordCount: 1589, rank: "教授", gender: "男", researchCount: 4, infoScore: 40, titleCount: 0, nameLength: 3, photoClarity: 60, appearance: 65, smileScore: 45 },
  { name: "莊世杰", url: "https://busadm.ccu.edu.tw/p/405-1248-31587,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/340/m/mczh-tw400x400_small31587_360974133394.png", views: 8148, wordCount: 15492, rank: "教授", gender: "男", researchCount: 4, infoScore: 100, titleCount: 1, nameLength: 3, photoClarity: 70, appearance: 72, smileScore: 60 },
  { name: "盧龍泉", url: "https://busadm.ccu.edu.tw/p/405-1248-31586,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/218/m/mczh-tw400x400_small31586_788704447386.jpg", views: 7004, wordCount: 33128, rank: "教授", gender: "男", researchCount: 3, infoScore: 100, titleCount: 1, nameLength: 3, photoClarity: 65, appearance: 68, smileScore: 65 },
  { name: "王明昌", url: "https://busadm.ccu.edu.tw/p/405-1248-31589,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/155/m/mczh-tw400x400_small31589_785342751343.jpeg", views: 6632, wordCount: 17434, rank: "教授", gender: "男", researchCount: 5, infoScore: 100, titleCount: 0, nameLength: 3, photoClarity: 80, appearance: 75, smileScore: 75 },
  { name: "許嘉文", url: "https://busadm.ccu.edu.tw/p/405-1248-42953,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/299/m/mczh-tw400x400_small42953_31428293195.jpg", views: 13033, wordCount: 1467, rank: "教授", gender: "男", researchCount: 4, infoScore: 100, titleCount: 1, nameLength: 3, photoClarity: 78, appearance: 80, smileScore: 80 },
  { name: "鎮明常", url: "https://busadm.ccu.edu.tw/p/405-1248-31582,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/120/m/mczh-tw400x400_small31582_987996933108.png", views: 10855, wordCount: 29937, rank: "教授", gender: "男", researchCount: 13, infoScore: 100, titleCount: 3, nameLength: 3, photoClarity: 62, appearance: 70, smileScore: 50 },
  { name: "鄭祥麟", url: "https://busadm.ccu.edu.tw/p/405-1248-31591,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/635/m/mczh-tw400x400_small31591_42734833349.png", views: 6641, wordCount: 1534, rank: "教授", gender: "男", researchCount: 4, infoScore: 100, titleCount: 1, nameLength: 3, photoClarity: 66, appearance: 68, smileScore: 58 },
  { name: "曾光華", url: "https://busadm.ccu.edu.tw/p/405-1248-31592,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/215/m/mczh-tw400x400_small31592_632013033093.jpeg", views: 8844, wordCount: 1381, rank: "教授", gender: "男", researchCount: 3, infoScore: 100, titleCount: 0, nameLength: 3, photoClarity: 82, appearance: 85, smileScore: 88 },
  { name: "劉敏熙", url: "https://busadm.ccu.edu.tw/p/405-1248-31598,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/782/m/mczh-tw400x400_small31598_237999633273.png", views: 8211, wordCount: 10504, rank: "教授", gender: "男", researchCount: 3, infoScore: 100, titleCount: 2, nameLength: 3, photoClarity: 58, appearance: 66, smileScore: 52 },
  { name: "陳明德", url: "https://busadm.ccu.edu.tw/p/405-1248-31593,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/300/m/mczh-tw400x400_small31593_56588433339.png", views: 5049, wordCount: 1634, rank: "副教授", gender: "男", researchCount: 6, infoScore: 100, titleCount: 0, nameLength: 3, photoClarity: 70, appearance: 72, smileScore: 63 },
  { name: "蘇宏仁", url: "https://busadm.ccu.edu.tw/p/405-1248-31595,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/174/m/mczh-tw400x400_small31595_814317333313.png", views: 5190, wordCount: 1310, rank: "副教授", gender: "男", researchCount: 2, infoScore: 100, titleCount: 0, nameLength: 3, photoClarity: 64, appearance: 67, smileScore: 60 },
  { name: "游蓓怡", url: "https://busadm.ccu.edu.tw/p/405-1248-31596,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/511/m/mczh-tw400x400_small31596_258452933209.png", views: 6484, wordCount: 5722, rank: "副教授", gender: "女", researchCount: 3, infoScore: 100, titleCount: 1, nameLength: 3, photoClarity: 74, appearance: 80, smileScore: 83 },
  { name: "楊文芬", url: "https://busadm.ccu.edu.tw/p/405-1248-31597,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/73/m/mczh-tw400x400_small31597_100660133295.jpeg", views: 6948, wordCount: 1442, rank: "副教授", gender: "女", researchCount: 3, infoScore: 100, titleCount: 0, nameLength: 3, photoClarity: 76, appearance: 78, smileScore: 78 },
  { name: "宋豪漳", url: "https://busadm.ccu.edu.tw/p/405-1248-31599,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/806/m/mczh-tw400x400_small31599_447503447296.jpg", views: 7355, wordCount: 12424, rank: "副教授", gender: "男", researchCount: 4, infoScore: 100, titleCount: 0, nameLength: 3, photoClarity: 72, appearance: 74, smileScore: 68 },
  { name: "陳詠卉", url: "https://busadm.ccu.edu.tw/p/405-1248-31600,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/260/m/mczh-tw400x400_small31600_422416533251.png", views: 6170, wordCount: 1396, rank: "助理教授", gender: "女", researchCount: 2, infoScore: 100, titleCount: 2, nameLength: 3, photoClarity: 70, appearance: 76, smileScore: 74 },
  { name: "賴璽方", url: "https://busadm.ccu.edu.tw/p/405-1248-31601,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/980/m/mczh-tw400x400_small31601_300921833238.jpeg", views: 6964, wordCount: 6691, rank: "助理教授", gender: "男", researchCount: 4, infoScore: 70, titleCount: 0, nameLength: 3, photoClarity: 84, appearance: 73, smileScore: 72 },
  { name: "龔天鈞", url: "https://busadm.ccu.edu.tw/p/405-1248-31602,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/708/m/mczh-tw400x400_small31602_263095847255.jpg", views: 7556, wordCount: 4060, rank: "助理教授", gender: "男", researchCount: 4, infoScore: 100, titleCount: 0, nameLength: 3, photoClarity: 78, appearance: 71, smileScore: 66 },
  { name: "陳維婷", url: "https://busadm.ccu.edu.tw/p/405-1248-84820,c3236.php?Lang=zh-tw", photo: "https://busadm.ccu.edu.tw/var/file/248/1248/pictures/289/m/mczh-tw400x400_small84820_346768507086.jpg", views: 1365, wordCount: 7777, rank: "助理教授", gender: "女", researchCount: 5, infoScore: 100, titleCount: 0, nameLength: 3, photoClarity: 86, appearance: 84, smileScore: 90 },
];

export const teacherData: TeacherData[] = rawTeachers.map((t) => {
  const rankScore = getRankScore(t.rank);
  return {
    ...t,
    rankScore,
    genderScore: t.gender === "女" ? 2 : 1,
  };
});
