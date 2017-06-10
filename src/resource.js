var res = {
    HelloWorld_png: "res/HelloWorld.png",
    CloseNormal_png: "res/CloseNormal.png",
    CloseSelected_png: "res/CloseSelected.png",
    WhiteLight_png: "res/baiguang.png",
    Hp_png: "res/hp.png",

    Bg_jpg: "res/menu/bg.jpg",
    GameLogo_png: "res/menu/gamelogo.png",
    FailedLogo_png: "res/menu/renwushibai.png",
    Start_png: "res/menu/start.png",
    Sound_png: "res/menu/sound.png",
    SoundNo_png: "res/menu/soundno.png",
    H_png: "res/menu/h.png",
    H2_png: "res/menu/h2.png",
    H3_png: "res/menu/h3.png",
    LevelLogo_png: "res/menu/sel.png",
    Xg1_png: "res/menu/xg1.png",
    Xg2_png: "res/menu/xg2.png",
    Xg3_png: "res/menu/xg3.png",
    Suzi1_png: "res/menu/suzi1.png",
    BackBtn_png: "res/menu/backbtn.png",

    Click_mp3: "res/sounds/click.mp3",
    Darts_mp3: "res/sounds/darts.mp3",
    Dzkaiguan_mp3: "res/sounds/dzkaiguan.mp3",
    Faild_mp3: "res/sounds/Faild.mp3",
    Fall_mp3: "res/sounds/Fall.mp3",
    FsShow_mp3: "res/sounds/fs_show.mp3",
    Gamebg_mp3: "res/sounds/gamebg.mp3",
    Killemy_mp3: "res/sounds/kill_emy.mp3",
    Killself_mp3: "res/sounds/kill_self.mp3",
    Menubg_mp3: "res/sounds/menubg.mp3",
    Nadie_mp3: "res/sounds/na_die.mp3",
    Narun_mp3: "res/sounds/na_run.mp3",
    Ntnbom_mp3: "res/sounds/ntn_bom.mp3",
    Wallbom_mp3: "res/sounds/wall_bom.mp3",
    Win_mp3: "res/sounds/win.mp3",

    Role_plist: "res/role/role.plist",
    Emy_plist: "res/role/emy.plist",
    Role_png: "res/role/role.png",
    Emy_png: "res/role/emy.png",
    Other_plist: "res/others.plist",
    Other_png: "res/others.png",
    Other1_plist: "res/others1.plist",
    Other1_png: "res/others1.png",

    Ditubeijing_jpg: "res/ditubeijing.jpg",
    Beijing_jpg: "res/beijing.jpg",
    Baiguang_png: "res/baiguang.png",

    UIdiban_png: "res/menu/uidiban.png",
    Againbtn_png: "res/menu/againbtn.png",
    Bangzhu_png: "res/menu/bangzhu.png",
    Fenshen_png: "res/menu/fenshen.png",
    Shengyin_guan_png: "res/menu/shengyin_guan.png",
    Shengyin_kai_png: "res/menu/shengyin_kai.png",
    Zhuye_png: "res/menu/zhuye.png",
    Guanqian_png: "res/menu/guanqia.png",
    Goux_png: "res/menu/goux.png",
    Jisha_png: "res/menu/jisha.png",
    Shuzhibanzi_png: "res/menu/shuzhibanzi.png",
    Chonglai_png: "res/menu/chonglai.png",
    Xiegang_shuzhi_png: "res/menu/xiegang_shuzhi.png",
    Help_bj_png: "res/menu/help_bj.png",
    Tanchuang_diban_png: "res/menu/tanchuang_diban.png",
    Nextbtn_png: "res/menu/nextbtn.png",

    ZiSha_png: "res/zisha.png",

    Help_text_1_png: "res/help_text_1.png",
    Kaiguan_png: "res/kaiguan.png",


};


var g_resources = [];

for (var i = 1; i <= 30; i++) {
    res["Level" + i + "_tmx"] = "res/levels/level" + i + ".tmx";
    res["Level" + i + "_png"] = "res/levels/level" + i + ".png";
}

for (var i in res) {
    g_resources.push(res[i]);
}

