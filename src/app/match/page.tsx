"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SenpaiLogo from "@/components/SenpaiLogo";

// ─── 志望校（グループ別） ────────────────────────────────
const UNIVERSITY_GROUPS = [
  { group: "早慶", schools: ["早稲田大学", "慶應義塾大学"] },
  { group: "上智・ICU", schools: ["上智大学", "ICU"] },
  { group: "MARCH", schools: ["明治大学", "青山学院大学", "立教大学", "中央大学", "法政大学"] },
  { group: "関関同立", schools: ["関西学院大学", "関西大学", "同志社大学", "立命館大学"] },
];

// ─── 都道府県 ────────────────────────────────────────────
const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

// ─── 高校リスト（都道府県別） ─────────────────────────────
// [表示名, よみがな] の形式。よみがなでソートして確実に50音順にする
type SchoolEntry = readonly [string, string];

const HIGH_SCHOOLS_BY_PREF: Record<string, SchoolEntry[]> = {
  "北海道": [
    ["旭川東", "あさひかわひがし"], ["旭川西", "あさひかわにし"], ["旭川南", "あさひかわみなみ"],
    ["江別", "えべつ"], ["小樽潮陵", "おたるちょうりょう"],
    ["帯広柏葉", "おびひろかしわば"], ["釧路湖陵", "くしろこりょう"],
    ["函館中部", "はこだてちゅうぶ"], ["函館ラ・サール", "はこだてらさーる"],
    ["北嶺", "ほくれい"], ["立命館慶祥", "りつめいかんけいしょう"],
    ["札幌開成", "さっぽろかいせい"], ["札幌光星", "さっぽろこうせい"],
    ["札幌第一", "さっぽろだいいち"], ["札幌北", "さっぽろきた"],
    ["札幌南", "さっぽろみなみ"], ["札幌東", "さっぽろひがし"], ["札幌西", "さっぽろにし"],
    ["その他北海道", "そのたほっかいどう"],
  ],
  "青森県": [
    ["青森", "あおもり"], ["青森東", "あおもりひがし"], ["青森南", "あおもりみなみ"],
    ["青森中央", "あおもりちゅうおう"], ["五所川原", "ごしょがわら"],
    ["弘前", "ひろさき"], ["弘前学院聖愛", "ひろさきがくいんせいあい"],
    ["八戸", "はちのへ"], ["八戸北", "はちのへきた"], ["八戸学院光星", "はちのへがくいんこうせい"],
    ["三本木", "さんぼんぎ"],
    ["その他青森県", "そのたあおもりけん"],
  ],
  "岩手県": [
    ["一関第一", "いちのせきだいいち"], ["岩手", "いわて"],
    ["花巻北", "はなまききた"],
    ["盛岡第一", "もりおかだいいち"], ["盛岡第二", "もりおかだいに"], ["盛岡第三", "もりおかだいさん"],
    ["盛岡中央", "もりおかちゅうおう"],
    ["その他岩手県", "そのたいわてけん"],
  ],
  "宮城県": [
    ["泉", "いずみ"], ["石巻", "いしのまき"],
    ["尚絅学院", "しょうけいがくいん"],
    ["聖ウルスラ学院英智", "せいうるすらがくいん"],
    ["仙台第一", "せんだいだいいち"], ["仙台第二", "せんだいだいに"], ["仙台第三", "せんだいだいさん"],
    ["仙台育英学園", "せんだいいくえいがくえん"], ["仙台白百合学園", "せんだいしらゆりがくえん"],
    ["東北学院", "とうほくがくいん"], ["東北学院榴ヶ岡", "とうほくがくいんつつじがおか"],
    ["宮城第一", "みやぎだいいち"], ["宮城野", "みやぎの"],
    ["その他宮城県", "そのたみやぎけん"],
  ],
  "秋田県": [
    ["秋田", "あきた"], ["秋田北", "あきたきた"], ["秋田南", "あきたみなみ"],
    ["大館鳳鳴", "おおだてほうめい"], ["角館", "かくのだて"],
    ["横手", "よこて"], ["能代", "のしろ"],
    ["その他秋田県", "そのたあきたけん"],
  ],
  "山形県": [
    ["鶴岡南", "つるおかみなみ"],
    ["天童", "てんどう"],
    ["山形東", "やまがたひがし"], ["山形南", "やまがたみなみ"], ["山形西", "やまがたにし"],
    ["山形学院", "やまがたがくいん"],
    ["酒田東", "さかたひがし"],
    ["その他山形県", "そのたやまがたけん"],
  ],
  "福島県": [
    ["会津", "あいづ"], ["安積", "あさか"], ["安積黎明", "あさかれいめい"],
    ["磐城", "いわき"],
    ["橘", "たちばな"],
    ["福島", "ふくしま"], ["福島東", "ふくしまひがし"],
    ["その他福島県", "そのたふくしまけん"],
  ],
  "茨城県": [
    ["江戸川学園取手", "えどがわがくえんとりで"],
    ["茨城キリスト教学園", "いばらききりすときょうがくえん"],
    ["牛久栄進", "うしくえいしん"],
    ["水戸第一", "みとだいいち"], ["水戸第二", "みとだいに"],
    ["土浦第一", "つちうらだいいち"], ["土浦第二", "つちうらだいに"],
    ["竹園", "たけぞの"],
    ["茗溪学園", "めいけいがくえん"],
    ["常総学院", "じょうそうがくいん"],
    ["清真学園", "せいしんがくえん"],
    ["つくば秀英", "つくばしゅうえい"],
    ["その他茨城県", "そのたいばらきけん"],
  ],
  "栃木県": [
    ["宇都宮", "うつのみや"], ["宇都宮女子", "うつのみやじょし"],
    ["宇都宮東", "うつのみやひがし"],
    ["国学院大学栃木", "こくがくいんだいがくとちぎ"],
    ["小山", "おやま"],
    ["作新学院", "さくしんがくいん"],
    ["佐野日本大学", "さのにほんだいがく"],
    ["栃木", "とちぎ"], ["栃木女子", "とちぎじょし"],
    ["真岡", "もおか"],
    ["その他栃木県", "そのたとちぎけん"],
  ],
  "群馬県": [
    ["共愛学園", "きょうあいがくえん"],
    ["桐生", "きりゅう"],
    ["高崎", "たかさき"], ["高崎女子", "たかさきじょし"],
    ["太田", "おおた"],
    ["前橋", "まえばし"], ["前橋女子", "まえばしじょし"],
    ["渋川女子", "しぶかわじょし"],
    ["その他群馬県", "そのたぐんまけん"],
  ],
  "埼玉県": [
    ["浦和", "うらわ"], ["浦和第一女子", "うらわだいいちじょし"],
    ["浦和実業学園", "うらわじつぎょうがくえん"],
    ["大宮", "おおみや"],
    ["春日部", "かすかべ"], ["春日部女子", "かすかべじょし"],
    ["川越", "かわごえ"], ["川越女子", "かわごえじょし"], ["川越東", "かわごえひがし"],
    ["川口北", "かわぐちきた"],
    ["開智", "かいち"],
    ["熊谷", "くまがや"],
    ["慶應義塾志木", "けいおうぎじゅくしき"],
    ["栄東", "さかえひがし"],
    ["城西川越", "じょうさいかわごえ"],
    ["所沢北", "ところざわきた"],
    ["昌平", "しょうへい"],
    ["西武学園文理", "せいぶがくえんぶんり"],
    ["獨協埼玉", "どっきょうさいたま"],
    ["不動岡", "ふどうおか"],
    ["立教新座", "りっきょうにいざ"],
    ["和光国際", "わこうこくさい"],
    ["越谷北", "こしがやきた"],
    ["本庄東", "ほんじょうひがし"],
    ["その他埼玉県", "そのたさいたまけん"],
  ],
  "千葉県": [
    ["稲毛", "いなげ"],
    ["市川", "いちかわ"],
    ["柏", "かしわ"],
    ["国府台", "こうのだい"],
    ["芝浦工業大学柏", "しばうらこうぎょうだいがくかしわ"],
    ["渋谷教育学園幕張", "しぶやきょういくがくえんまくはり"],
    ["昭和学院秀英", "しょうわがくいんしゅうえい"],
    ["専修大学松戸", "せんしゅうだいがくまつど"],
    ["千葉", "ちば"], ["千葉東", "ちばひがし"],
    ["東葛飾", "とうかつしか"],
    ["東邦大学付属東邦", "とうほうだいがくふぞくとうほう"],
    ["船橋", "ふなばし"], ["船橋東", "ふなばしひがし"],
    ["八千代松陰", "やちよしょういん"],
    ["木更津", "きさらづ"],
    ["麗澤", "れいたく"],
    ["日本大学習志野", "にほんだいがくならしの"],
    ["長生", "ちょうせい"],
    ["成田", "なりた"],
    ["その他千葉県", "そのたちばけん"],
  ],
  "東京都": [
    ["ICU高校", "あいしーゆーこうこう"],
    ["青山", "あおやま"],
    ["麻布", "あざぶ"],
    ["足立", "あだち"],
    ["上野", "うえの"],
    ["桜蔭", "おういん"],
    ["大妻", "おおつま"],
    ["桜美林", "おうびりん"],
    ["小山台", "おやまだい"],
    ["開成", "かいせい"],
    ["科学技術", "かがくぎじゅつ"],
    ["学習院", "がくしゅういん"],
    ["学習院女子", "がくしゅういんじょし"],
    ["国立", "くにたち"],
    ["恵泉女学園", "けいせんじょがくえん"],
    ["慶應義塾", "けいおうぎじゅく"],
    ["光塩女子学院", "こうえんじょしがくいん"],
    ["晃華学園", "こうかがくえん"],
    ["小松川", "こまつかわ"],
    ["国分寺", "こくぶんじ"],
    ["駒場東邦", "こまばとうほう"],
    ["駒場", "こまば"],
    ["狛江", "こまえ"],
    ["吉祥女子", "きちじょうじょし"],
    ["共立女子", "きょうりつじょし"],
    ["暁星", "ぎょうせい"],
    ["女子学院", "じょしがくいん"],
    ["渋谷教育学園渋谷", "しぶやきょういくがくえんしぶや"],
    ["品川女子学院", "しながわじょしがくいん"],
    ["白鴎", "はくおう"],
    ["白百合学園", "しらゆりがくえん"],
    ["芝", "しば"],
    ["新宿", "しんじゅく"],
    ["杉並", "すぎなみ"],
    ["聖心女子学院", "せいしんじょしがくいん"],
    ["成蹊", "せいけい"],
    ["成城", "せいじょう"],
    ["専修大学附属", "せんしゅうだいがくふぞく"],
    ["竹早", "たけはや"],
    ["玉川聖学院", "たまがわせいがくいん"],
    ["中央大学附属", "ちゅうおうだいがくふぞく"],
    ["中央大学杉並", "ちゅうおうだいがくすぎなみ"],
    ["帝京大学", "ていきょうだいがく"],
    ["戸山", "とやま"],
    ["桐朋", "とうほう"],
    ["桐朋女子", "とうほうじょし"],
    ["豊島岡女子学園", "としまがおかじょしがくえん"],
    ["東洋英和女学院", "とうようえいわじょがくいん"],
    ["日本女子大学附属", "にほんじょしだいがくふぞく"],
    ["日比谷", "ひびや"],
    ["雙葉", "ふたば"],
    ["法政大学", "ほうせいだいがく"],
    ["三田", "みた"],
    ["向丘", "むこうがおか"],
    ["明治大学付属明治", "めいじだいがくふぞくめいじ"],
    ["明治大学付属八王子", "めいじだいがくふぞくはちおうじ"],
    ["山脇学園", "やまわきがくえん"],
    ["立教池袋", "りっきょういけぶくろ"],
    ["立教女学院", "りっきょうじょがくいん"],
    ["両国", "りょうごく"],
    ["早稲田実業学校", "わせだじつぎょうがっこう"],
    ["早稲田高校", "わせだこうこう"],
    ["西", "にし"],
    ["その他東京都", "そのたとうきょうと"],
  ],
  "神奈川県": [
    ["AICJ", "えーあいしーじぇい"],
    ["浅野", "あさの"],
    ["厚木", "あつぎ"],
    ["栄光学園", "えいこうがくえん"],
    ["小田原", "おだわら"],
    ["鎌倉", "かまくら"],
    ["鎌倉学園", "かまくらがくえん"],
    ["鎌倉女学院", "かまくらじょがくいん"],
    ["川和", "かわわ"],
    ["神奈川大学附属", "かながわだいがくふぞく"],
    ["関東学院", "かんとうがくいん"],
    ["希望ケ丘", "きぼうがおか"],
    ["慶應義塾", "けいおうぎじゅく"],
    ["相模原", "さがみはら"],
    ["湘南", "しょうなん"],
    ["湘南白百合学園", "しょうなんしらゆりがくえん"],
    ["聖光学院", "せいこうがくいん"],
    ["逗子開成", "ずしかいせい"],
    ["茅ケ崎北陵", "ちがさきほくりょう"],
    ["中央大学附属横浜", "ちゅうおうだいがくふぞくよこはま"],
    ["桐光学園", "とうこうがくえん"],
    ["桐蔭学園", "とういんがくえん"],
    ["日本女子大学附属", "にほんじょしだいがくふぞく"],
    ["平塚江南", "ひらつかこうなん"],
    ["フェリス女学院", "ふぇりすじょがくいん"],
    ["法政大学第二", "ほうせいだいがくだいに"],
    ["柏陽", "はくよう"],
    ["光陵", "こうりょう"],
    ["山手学院", "やまてがくいん"],
    ["横須賀", "よこすか"],
    ["横浜国際", "よこはまこくさい"],
    ["横浜市立サイエンスフロンティア", "よこはましりつさいえんすふろんてぃあ"],
    ["横浜市立南", "よこはましりつみなみ"],
    ["横浜翠嵐", "よこはますいらん"],
    ["横浜雙葉", "よこはまふたば"],
    ["横浜緑ケ丘", "よこはまみどりがおか"],
    ["横浜平沼", "よこはまひらぬま"],
    ["その他神奈川県", "そのたかながわけん"],
  ],
  "新潟県": [
    ["新潟", "にいがた"], ["新潟南", "にいがたみなみ"], ["新潟明訓", "にいがためいくん"],
    ["長岡", "ながおか"], ["長岡大手", "ながおかおおて"],
    ["三条", "さんじょう"],
    ["柏崎", "かしわざき"],
    ["高田", "たかだ"],
    ["その他新潟県", "そのたにいがたけん"],
  ],
  "富山県": [
    ["氷見", "ひみ"],
    ["富山", "とやま"], ["富山中部", "とやまちゅうぶ"], ["富山北部", "とやまほくぶ"], ["富山第一", "とやまだいいち"],
    ["高岡", "たかおか"],
    ["砺波", "となみ"],
    ["その他富山県", "そのたとやまけん"],
  ],
  "石川県": [
    ["金沢泉丘", "かなざわいずみがおか"], ["金沢二水", "かなざわにすい"],
    ["金沢桜丘", "かなざわさくらがおか"], ["金沢大学附属", "かなざわだいがくふぞく"],
    ["七尾", "ななお"],
    ["北陸学院", "ほくりくがくいん"],
    ["星稜", "せいりょう"],
    ["小松", "こまつ"],
    ["その他石川県", "そのたいしかわけん"],
  ],
  "福井県": [
    ["啓新", "けいしん"],
    ["高志", "こうし"],
    ["北陸", "ほくりく"],
    ["藤島", "ふじしま"],
    ["武生", "たけふ"],
    ["若狭", "わかさ"],
    ["その他福井県", "そのたふくいけん"],
  ],
  "山梨県": [
    ["甲府第一", "こうふだいいち"], ["甲府南", "こうふみなみ"], ["甲府西", "こうふにし"],
    ["駿台甲府", "すんだいこうふ"],
    ["韮崎", "にらさき"],
    ["都留", "つる"],
    ["その他山梨県", "そのたやまなしけん"],
  ],
  "長野県": [
    ["上田", "うえだ"],
    ["岡谷東", "おかやひがし"],
    ["諏訪清陵", "すわせいりょう"],
    ["長野", "ながの"], ["長野日本大学", "ながのにほんだいがく"],
    ["野沢北", "のざわきた"],
    ["松本深志", "まつもとふかし"],
    ["屋代", "やしろ"],
    ["その他長野県", "そのたながのけん"],
  ],
  "岐阜県": [
    ["鶯谷", "うぐいすだに"],
    ["岐阜", "ぎふ"], ["岐阜北", "ぎふきた"],
    ["加納", "かのう"],
    ["斐太", "ひだ"],
    ["大垣北", "おおがききた"],
    ["多治見北", "たじみきた"],
    ["土岐紅陵", "ときこうりょう"],
    ["その他岐阜県", "そのたぎふけん"],
  ],
  "静岡県": [
    ["磐田南", "いわたみなみ"],
    ["清水東", "しみずひがし"],
    ["静岡", "しずおか"], ["静岡東", "しずおかひがし"], ["静岡雙葉", "しずおかふたば"],
    ["不二聖心女子学院", "ふじせいしんじょしがくいん"],
    ["富士", "ふじ"],
    ["浜松北", "はままつきた"], ["浜松西", "はままつにし"], ["浜松日体", "はままつにったい"],
    ["沼津東", "ぬまづひがし"],
    ["その他静岡県", "そのたしずおかけん"],
  ],
  "愛知県": [
    ["愛知", "あいち"], ["愛知淑徳", "あいちしゅくとく"],
    ["旭丘", "あさひがおか"],
    ["一宮", "いちのみや"],
    ["岡崎", "おかざき"], ["岡崎西", "おかざきにし"], ["岡崎北", "おかざききた"],
    ["刈谷", "かりや"],
    ["菊里", "きくざと"],
    ["桜台", "さくらだい"],
    ["時習館", "じしゅうかん"],
    ["椙山女学園", "すぎやまじょがくえん"],
    ["千種", "ちくさ"],
    ["中京大学附属中京", "ちゅうきょうだいがくふぞくちゅうきょう"],
    ["東海", "とうかい"],
    ["瑞陵", "ずいりょう"],
    ["西春", "にしはる"],
    ["日進西", "にっしんにし"],
    ["南山", "なんざん"],
    ["名古屋", "なごや"], ["名古屋女子大学", "なごやじょしだいがく"],
    ["向陽", "こうよう"],
    ["明和", "めいわ"],
    ["滝", "たき"],
    ["その他愛知県", "そのたあいちけん"],
  ],
  "三重県": [
    ["暁", "ぎょう"],
    ["桑名", "くわな"],
    ["四日市", "よっかいち"], ["四日市南", "よっかいちみなみ"],
    ["上野", "うえの"],
    ["津", "つ"], ["津西", "つにし"],
    ["伊勢", "いせ"],
    ["その他三重県", "そのたみえけん"],
  ],
  "滋賀県": [
    ["石山", "いしやま"],
    ["彦根東", "ひこねひがし"],
    ["膳所", "ぜぜ"],
    ["守山", "もりやま"],
    ["比叡山", "ひえいざん"],
    ["水口東", "みなくちひがし"],
    ["その他滋賀県", "そのたしがけん"],
  ],
  "京都府": [
    ["大谷", "おおたに"],
    ["嵯峨野", "さがの"],
    ["同志社", "どうしゃ"], ["同志社女子", "どうしゃじょし"],
    ["西京", "にしきょう"],
    ["花園", "はなぞの"],
    ["堀川", "ほりかわ"],
    ["紫野", "むらさきの"],
    ["莵道", "うじ"],
    ["洛南", "らくなん"], ["洛星", "らくせい"], ["洛北", "らくほく"],
    ["立命館", "りつめいかん"],
    ["京都女子", "きょうとじょし"],
    ["京都聖母学院", "きょうとせいぼがくいん"],
    ["鴨沂", "おうき"],
    ["ノートルダム女学院", "のーとるだむじょがくいん"],
    ["その他京都府", "そのたきょうとふ"],
  ],
  "大阪府": [
    ["今宮", "いまみや"],
    ["泉陽", "せんよう"],
    ["岸和田", "きしわだ"],
    ["関西大学第一", "かんさいだいがくだいいち"], ["関西大学北陽", "かんさいだいがくほくよう"],
    ["関西大倉", "かんさいおおくら"],
    ["清風", "せいふう"], ["清風南海", "せいふうなんかい"],
    ["近畿大学附属", "きんきだいがくふぞく"],
    ["高津", "こうづ"],
    ["三国丘", "みくにがおか"],
    ["市岡", "いちおか"],
    ["四天王寺", "してんのうじ"],
    ["住吉", "すみよし"],
    ["生野", "いくの"],
    ["清水谷", "しみずたに"],
    ["帝塚山学院泉ヶ丘", "てづかやまがくいんいずみがおか"],
    ["天王寺", "てんのうじ"],
    ["東", "ひがし"],
    ["豊中", "とよなか"],
    ["富田林", "とんだばやし"],
    ["浪速", "なにわ"],
    ["西", "にし"],
    ["北野", "きたの"],
    ["茨木", "いばらき"],
    ["桜塚", "さくらづか"],
    ["大手前", "おおてまえ"],
    ["大阪桐蔭", "おおさかとういん"],
    ["大阪星光学院", "おおさかせいこうがくいん"],
    ["八尾", "やお"],
    ["和泉", "いずみ"],
    ["履正社", "りせいしゃ"],
    ["その他大阪府", "そのたおおさかふ"],
  ],
  "兵庫県": [
    ["芦屋", "あしや"],
    ["尼崎稲園", "あまがさきいなぞの"],
    ["伊丹", "いたみ"],
    ["加古川東", "かこがわひがし"], ["加古川西", "かこがわにし"],
    ["関西学院", "かんせいがくいん"],
    ["甲陽学院", "こうようがくいん"],
    ["神戸", "こうべ"], ["神戸女学院", "こうべじょがくいん"],
    ["須磨学園", "すまがくえん"],
    ["仁川学院", "にがわがくいん"],
    ["姫路西", "ひめじにし"], ["姫路東", "ひめじひがし"],
    ["兵庫", "ひょうご"],
    ["報徳学園", "ほうとくがくえん"],
    ["白陵", "はくりょう"],
    ["長田", "ながた"],
    ["西宮東", "にしのみやひがし"], ["西宮北", "にしのみやきた"],
    ["六甲学院", "ろっこうがくいん"],
    ["雲雀丘学園", "ひばりがおかがくえん"],
    ["宝塚北", "たからづかきた"],
    ["その他兵庫県", "そのたひょうごけん"],
  ],
  "奈良県": [
    ["育英西", "いくえいにし"],
    ["畝傍", "うねび"],
    ["奈良", "なら"], ["奈良北", "ならきた"], ["奈良育英", "ならいくえい"],
    ["奈良女子大学附属", "ならじょしだいがくふぞく"],
    ["帝塚山", "てづかやま"],
    ["東大寺学園", "とうだいじがくえん"],
    ["西大和学園", "にしやまとがくえん"],
    ["郡山", "こおりやま"],
    ["高田", "たかだ"],
    ["その他奈良県", "そのたならけん"],
  ],
  "和歌山県": [
    ["近畿大学附属和歌山", "きんきだいがくふぞくわかやま"],
    ["智辯学園和歌山", "ちべんがくえんわかやま"],
    ["桐蔭", "とういん"],
    ["向陽", "こうよう"],
    ["星林", "せいりん"],
    ["和歌山北", "わかやまきた"],
    ["その他和歌山県", "そのたわかやまけん"],
  ],
  "鳥取県": [
    ["倉吉東", "くらよしひがし"],
    ["鳥取西", "とっとりにし"], ["鳥取東", "とっとりひがし"],
    ["米子東", "よなごひがし"], ["米子西", "よなごにし"],
    ["その他鳥取県", "そのたとっとりけん"],
  ],
  "島根県": [
    ["益田", "ますだ"],
    ["出雲", "いずも"],
    ["浜田", "はまだ"],
    ["松江北", "まつえきた"], ["松江南", "まつえみなみ"],
    ["その他島根県", "そのたしまねけん"],
  ],
  "岡山県": [
    ["岡山朝日", "おかやまあさひ"], ["岡山城東", "おかやまじょうとう"], ["岡山白陵", "おかやまはくりょう"],
    ["倉敷天城", "くらしきあまき"], ["倉敷青陵", "くらしきせいりょう"],
    ["就実", "しゅうじつ"],
    ["山陽学園", "さんようがくえん"],
    ["その他岡山県", "そのたおかやまけん"],
  ],
  "広島県": [
    ["AICJ", "えーあいしーじぇい"],
    ["安田女子", "やすだじょし"],
    ["崇徳", "すうとく"],
    ["近畿大学附属広島", "きんきだいがくふぞくひろしま"],
    ["基町", "もとまち"],
    ["広島国泰寺", "ひろしまこくたいじ"],
    ["広島大学附属", "ひろしまだいがくふぞく"], ["広島大学附属福山", "ひろしまだいがくふぞくふくやま"],
    ["広島女学院", "ひろしまじょがくいん"],
    ["修道", "しゅうどう"],
    ["その他広島県", "そのたひろしまけん"],
  ],
  "山口県": [
    ["高川学園", "たかがわがくえん"],
    ["山口", "やまぐち"],
    ["宇部", "うべ"],
    ["下関西", "しものせきにし"],
    ["徳山", "とくやま"],
    ["防府", "ほうふ"],
    ["その他山口県", "そのたやまぐちけん"],
  ],
  "徳島県": [
    ["徳島北", "とくしまきた"],
    ["徳島文理", "とくしまぶんり"],
    ["城南", "じょうなん"],
    ["富岡西", "とみおかにし"],
    ["脇町", "わきまち"],
    ["その他徳島県", "そのたとくしまけん"],
  ],
  "香川県": [
    ["尽誠学園", "じんせいがくえん"],
    ["高松", "たかまつ"], ["高松第一", "たかまつだいいち"],
    ["丸亀", "まるがめ"],
    ["三木", "みき"],
    ["香川誠陵", "かがわせいりょう"],
    ["その他香川県", "そのたかがわけん"],
  ],
  "愛媛県": [
    ["愛光", "あいこう"],
    ["今治西", "いまばりにし"],
    ["済美", "さいび"],
    ["新田", "にった"],
    ["帝京第五", "ていきょうだいご"],
    ["松山東", "まつやまひがし"], ["松山南", "まつやまみなみ"],
    ["その他愛媛県", "そのたえひめけん"],
  ],
  "高知県": [
    ["高知", "こうち"], ["高知追手前", "こうちおうてまえ"], ["高知学芸", "こうちがくげい"],
    ["土佐", "とさ"], ["土佐塾", "とさじゅく"],
    ["その他高知県", "そのたこうちけん"],
  ],
  "福岡県": [
    ["嘉穂", "かほ"],
    ["久留米大学附設", "くるめだいがくふせつ"],
    ["城南", "じょうなん"],
    ["修猷館", "しゅうゆうかん"],
    ["春日", "かすが"],
    ["筑紫丘", "ちくしがおか"], ["筑陽学園", "ちくようがくえん"],
    ["東福岡", "ひがしふくおか"],
    ["福岡", "ふくおか"],
    ["福岡大学附属大濠", "ふくおかだいがくふぞくおおほり"],
    ["飯塚", "いいづか"],
    ["三池", "みいけ"],
    ["明善", "めいぜん"],
    ["八幡", "やはた"],
    ["小倉", "こくら"],
    ["西南学院", "せいなんがくいん"],
    ["香住丘", "かすみがおか"],
    ["その他福岡県", "そのたふくおかけん"],
  ],
  "佐賀県": [
    ["佐賀西", "さがにし"], ["佐賀東", "さがひがし"],
    ["唐津東", "からつひがし"],
    ["弘学館", "こうがくかん"],
    ["早稲田佐賀", "わせださが"],
    ["鳥栖", "とす"],
    ["その他佐賀県", "そのたさがけん"],
  ],
  "長崎県": [
    ["青雲", "せいうん"],
    ["長崎西", "ながさきにし"], ["長崎北", "ながさききた"], ["長崎南山", "ながさきなんざん"],
    ["佐世保北", "させぼきた"],
    ["諫早", "いさはや"],
    ["その他長崎県", "そのたながさきけん"],
  ],
  "熊本県": [
    ["九州学院", "きゅうしゅうがくいん"],
    ["熊本", "くまもと"], ["熊本第一", "くまもとだいいち"],
    ["済々黌", "せいせいこう"],
    ["玉名", "たまな"],
    ["ルーテル学院", "るーてるがくいん"],
    ["その他熊本県", "そのたくまもとけん"],
  ],
  "大分県": [
    ["大分上野丘", "おおいたうえのがおか"], ["大分豊府", "おおいたほうふ"],
    ["大分舞鶴", "おおいたまいづる"], ["大分東明", "おおいたとうめい"],
    ["岩田", "いわた"],
    ["別府鶴見丘", "べっぷつるみがおか"],
    ["その他大分県", "そのたおおいたけん"],
  ],
  "宮崎県": [
    ["延岡", "のべおか"],
    ["宮崎西", "みやざきにし"], ["宮崎南", "みやざきみなみ"], ["宮崎日本大学", "みやざきにほんだいがく"],
    ["都城西", "みやこのじょうにし"],
    ["その他宮崎県", "そのたみやざきけん"],
  ],
  "鹿児島県": [
    ["加治木", "かじき"],
    ["甲南", "こうなん"],
    ["鹿屋", "かのや"], ["鹿児島実業", "かごしまじつぎょう"],
    ["ラ・サール", "らさーる"],
    ["鶴丸", "つるまる"],
    ["その他鹿児島県", "そのたかごしまけん"],
  ],
  "沖縄県": [
    ["開邦", "かいほう"],
    ["球陽", "きゅうよう"],
    ["興南", "こうなん"],
    ["沖縄尚学", "おきなわしょうがく"],
    ["首里", "しゅり"],
    ["那覇", "なは"],
    ["与勝", "よかつ"],
    ["その他沖縄県", "そのたおきなわけん"],
  ],
};

// よみがなで50音順ソート（「その他〇〇」は常に末尾）
function sortSchools(schools: SchoolEntry[]): string[] {
  const others = schools.filter(([, k]) => k.startsWith("そのた"));
  const rest = schools.filter(([, k]) => !k.startsWith("そのた"));
  return [
    ...rest.sort(([, a], [, b]) => a.localeCompare(b, "ja")).map(([n]) => n),
    ...others.map(([n]) => n),
  ];
}

// ─── その他定数 ─────────────────────────────────────────
const DEVIATION_ORDER = ["〜40", "40〜50", "50〜60", "60〜70", "70以上", "わからない"];

const STUDY_SYSTEMS = ["国公立文系", "国公立理系", "私立文系", "私立理系", "医学部・医療系", "その他"];

const EXAM_YEARS = ["現役（高1）", "現役（高2）", "現役（高3）", "1浪", "2浪以上"];

const START_TIMINGS = [
  "高1から", "高2から", "高3の春（4〜6月）から",
  "高3の夏（7〜8月）から", "高3の秋以降から", "浪人してから",
];

const CLUB_ACTIVITIES = [
  "部活なし", "文化部（受験まで）", "運動部（受験まで）",
  "部活引退済みで勉強スタート", "アルバイトしながら",
];

const STUDY_STYLES = [
  "完全独学（塾なし）", "大手予備校（河合・駿台・東進等）",
  "地方の個人塾・学習塾", "映像授業のみ（スタサプ等）",
  "オンライン塾", "学校の補習・授業のみ",
];

const HIGH_SCHOOL_LEVELS = [
  "進学校（偏差値70以上）", "中堅校（55〜70）",
  "一般校（55未満）", "通信制・定時制",
];

const WEAKNESS_TAGS = [
  "英語が伸びない", "国語・現代文が苦手", "古文・漢文が苦手",
  "数学が全然できない", "社会の暗記が追いつかない", "理科が苦手",
  "計画を立てても続かない", "モチベーションが上がらない",
  "スマホ・SNSがやめられない", "睡眠・生活リズムが乱れる",
  "過去問の使い方がわからない", "参考書を何周しても定着しない",
  "メンタルが不安定・焦りが強い", "家族に理解されない",
  "学校の授業と受験勉強の両立", "友達と差が開いて焦る",
];

const WANT_TO_KNOW_TAGS = [
  "参考書ルート・使い方", "スランプの乗り越え方",
  "直前期（11月〜）の過ごし方", "浪人するかの決断",
  "塾・予備校の選び方", "1日のスケジュール・時間管理",
  "模試の活用・判定の見方", "志望校の決め方・変え方",
  "メンタル・気持ちの切り替え", "部活引退後の切り替え方",
  "地方から東京受験のリアル", "浪人生活の実態",
];

const RESULT_PREFERENCES = ["第一志望合格した先輩", "浪人して合格した先輩", "不合格体験も読みたい", "こだわらない"];

// ─── スコアリング ─────────────────────────────────────────
const DEVIATION_SCORE = [28, 22, 15, 8, 0];

type Profile = {
  targetUniversity: string;
  studySystem: string;
  deviation: string;
  examYear: string;
  startTiming: string;
  clubActivity: string;
  studyStyle: string;
  highSchoolLevel: string;
  prefecture: string;
  highSchool: string;
  weaknesses: string[];
  wantToKnow: string[];
  resultPreference: string;
};

type Experience = {
  id: string;
  target_university: string;
  target_faculty: string | null;
  result: string;
  title: string | null;
  start_deviation: string | null;
  exam_year: string | null;
  study_style: string | null;
  study_start_timing: string | null;
  high_school_deviation: string | null;
  high_school_name: string | null;
  prefecture: string | null;
  tags: string[] | null;
  tutor_profile_id: string | null;
  is_currently_online?: boolean;
};

type ScoredExp = Experience & { score: number; matchPoints: string[] };

function calcScore(p: Profile, exp: Experience): { score: number; matchPoints: string[] } {
  let score = 0;
  const matchPoints: string[] = [];

  // 志望校（最重要）
  if (p.targetUniversity && exp.target_university === p.targetUniversity) {
    score += 28; matchPoints.push(`志望校が一致: ${p.targetUniversity.replace("大学", "")}`);
  }

  // 志望系統
  if (p.studySystem) {
    const tags = exp.tags ?? [];
    if (tags.some(t => t.includes(p.studySystem.slice(0, 3)))) {
      score += 14; matchPoints.push(`志望系統が近い: ${p.studySystem}`);
    }
  }

  // 偏差値（開始偏差値でマッチ）
  if (p.deviation && exp.start_deviation) {
    const pi = DEVIATION_ORDER.indexOf(p.deviation);
    const ei = DEVIATION_ORDER.indexOf(exp.start_deviation);
    if (pi !== -1 && ei !== -1) {
      const diff = Math.abs(pi - ei);
      const pts = DEVIATION_SCORE[Math.min(diff, DEVIATION_SCORE.length - 1)];
      if (pts > 0) {
        score += pts;
        matchPoints.push(diff === 0 ? `開始偏差値が同じ: ${p.deviation}` : "開始偏差値が近い");
      }
    }
  }

  // 受験状況
  if (p.examYear) {
    const expYear = exp.exam_year ?? "";
    const yearKey = p.examYear.replace(/（.*?）/, "");
    if (expYear.includes(yearKey)) {
      score += 12; matchPoints.push(`受験状況が一致: ${yearKey}`);
    }
  }

  // 勉強開始時期
  if (p.startTiming && exp.study_start_timing) {
    const key = p.startTiming.slice(0, 3);
    if (exp.study_start_timing.includes(key)) {
      score += 10; matchPoints.push(`勉強開始時期が近い: ${p.startTiming}`);
    }
  }

  // 通塾スタイル
  if (p.studyStyle && exp.study_style) {
    const styleKey = p.studyStyle.includes("独学") ? "独学"
      : p.studyStyle.includes("映像") ? "映像"
      : p.studyStyle.includes("大手") ? "予備校"
      : p.studyStyle.slice(0, 4);
    if (exp.study_style.includes(styleKey)) {
      score += 10; matchPoints.push(`勉強スタイルが一致: ${styleKey}`);
    }
  }

  // 高校・都道府県マッチ（同じ高校が最優先、次に同じ都道府県）
  if (p.highSchool && exp.high_school_name) {
    if (exp.high_school_name === p.highSchool) {
      score += 40; matchPoints.push(`同じ高校出身: ${p.highSchool}`);
    } else if (p.prefecture && exp.prefecture) {
      const prefKey = p.prefecture.replace(/[都道府県]$/, "");
      if (exp.prefecture.includes(prefKey)) {
        score += 8; matchPoints.push(`同じ都道府県出身（${p.prefecture}）`);
      }
    }
  } else if (p.prefecture && exp.prefecture) {
    const prefKey = p.prefecture.replace(/[都道府県]$/, "");
    if (exp.prefecture.includes(prefKey)) {
      score += 8; matchPoints.push(`同じ都道府県出身（${p.prefecture}）`);
    }
  }

  // タグマッチ（苦手・悩み + 知りたいこと）
  const expTags = exp.tags ?? [];
  const queryTags = [...p.weaknesses, ...p.wantToKnow];
  for (const qt of queryTags) {
    const key = qt.slice(0, 4);
    if (expTags.some(t => t.includes(key))) {
      score += 6; matchPoints.push(`#${qt}`);
    }
  }

  // 先輩の結果の希望
  if (p.resultPreference && p.resultPreference !== "こだわらない") {
    if (p.resultPreference.includes("浪人") && (exp.exam_year ?? "").includes("浪")) {
      score += 5; matchPoints.push("浪人経験あり");
    }
    if (p.resultPreference.includes("不合格") && exp.result === "不合格") {
      score += 5; matchPoints.push("不合格体験あり");
    }
    if (p.resultPreference.includes("第一志望") && exp.result === "合格") {
      score += 4;
    }
  }

  return { score, matchPoints };
}

// ─── UIコンポーネント ─────────────────────────────────────
function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
      <div className="mb-3">
        <p className="text-sm font-black text-slate-900">{title}</p>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors focus:outline-none ${
        selected
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
      }`}
    >
      {label}
    </button>
  );
}

function TagChip({ label, selected, onClick, max, currentCount }: {
  label: string; selected: boolean; onClick: () => void; max: number; currentCount: number;
}) {
  const disabled = !selected && currentCount >= max;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
        selected
          ? "border-cyan-600 bg-cyan-600 text-white"
          : disabled
            ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
            : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
      }`}
    >
      {label}
    </button>
  );
}

const RESULT_COLORS: Record<string, string> = {
  合格: "bg-lime-100 text-lime-700",
  不合格: "bg-red-100 text-red-700",
};

const MAX_TAGS = 6;

// ─── メイン ───────────────────────────────────────────────
export default function MatchPage() {
  const [profile, setProfile] = useState<Profile>({
    targetUniversity: "",
    studySystem: "",
    deviation: "",
    examYear: "",
    startTiming: "",
    clubActivity: "",
    studyStyle: "",
    highSchoolLevel: "",
    prefecture: "",
    highSchool: "",
    weaknesses: [],
    wantToKnow: [],
    resultPreference: "",
  });
  const [results, setResults] = useState<ScoredExp[] | null>(null);
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  const toggleSingle = (
    key: "targetUniversity" | "studySystem" | "deviation" | "examYear" | "startTiming" | "clubActivity" | "studyStyle" | "highSchoolLevel" | "resultPreference",
    val: string
  ) => set(key, profile[key] === val ? "" : val);

  const toggleMulti = (key: "weaknesses" | "wantToKnow", val: string, max: number) => {
    setProfile((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(val)
          ? arr.filter((v) => v !== val)
          : arr.length < max ? [...arr, val] : arr,
      };
    });
  };

  const handleMatch = async () => {
    setLoading(true);
    const [{ data }, { data: online }] = await Promise.all([
      supabase
        .from("experiences")
        .select("id,target_university,target_faculty,result,title,start_deviation,exam_year,study_style,study_start_timing,high_school_deviation,high_school_name,prefecture,tags,tutor_profile_id")
        .not("target_university", "is", null)
        .neq("target_university", ""),
      supabase
        .from("tutor_availability_status")
        .select("tutor_profile_id")
        .eq("is_currently_online", true),
    ]);

    const onlineSet = new Set((online ?? []).map((r) => r.tutor_profile_id as string));
    const scored = ((data ?? []) as Experience[])
      .map((exp) => ({
        ...exp,
        is_currently_online: !!exp.tutor_profile_id && onlineSet.has(exp.tutor_profile_id),
        ...calcScore(profile, exp),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    setResults(scored);
    setLoading(false);
  };

  const isReady = Object.entries(profile).some(([k, v]) =>
    k !== "weaknesses" && k !== "wantToKnow" ? !!v : (v as string[]).length > 0
  );

  const totalTags = profile.weaknesses.length + profile.wantToKnow.length;

  // ── 結果画面 ──────────────────────────────────────────
  if (results !== null) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-4">
            <SenpaiLogo />
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-8 space-y-4">
          <div>
            <p className="text-xs font-black tracking-[0.28em] text-cyan-600">MATCH RESULT</p>
            <h1 className="mt-1 text-xl font-black text-slate-950">あなたと境遇が近い先輩</h1>
            <p className="text-sm text-slate-400">共通点が多い順に表示しています</p>
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <p className="font-black text-slate-700">条件に近い先輩が見つかりませんでした</p>
              <p className="mt-2 text-sm text-slate-400">条件を変えて再度お試しください</p>
            </div>
          ) : results.map((exp, i) => {
            const maxScore = 180;
            const pct = Math.min(99, Math.round((exp.score / maxScore) * 100));
            return (
              <div
                key={exp.id}
                className={`rounded-2xl border-2 p-5 bg-white ${
                  exp.is_currently_online ? "border-lime-300" : i === 0 ? "border-cyan-300" : "border-slate-200"
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-lg font-black ${i === 0 ? "text-cyan-600" : "text-slate-400"}`}>
                        #{i + 1}
                      </span>
                      <span className="font-black text-slate-950">{exp.target_university}</span>
                      {exp.target_faculty && <span className="text-xs text-slate-400">{exp.target_faculty}</span>}
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${RESULT_COLORS[exp.result] ?? "bg-slate-100 text-slate-600"}`}>
                        {exp.result}
                      </span>
                      {exp.is_currently_online && (
                        <span className="rounded-full border border-lime-200 bg-lime-50 px-2.5 py-0.5 text-xs font-black text-lime-700">
                          今すぐ相談可
                        </span>
                      )}
                    </div>
                    {exp.title && <p className="mt-1 text-sm font-bold text-slate-600">「{exp.title}」</p>}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-2xl font-black text-cyan-600">{pct}%</p>
                    <p className="text-xs text-slate-400">一致度</p>
                  </div>
                </div>

                {exp.matchPoints.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {exp.matchPoints.slice(0, 6).map((pt) => (
                      <span key={pt} className="rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-0.5 text-xs font-bold text-cyan-700">
                        {pt}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/experiences/${exp.id}`}
                    className="rounded-xl border border-slate-200 py-2.5 text-center text-xs font-black text-slate-700 hover:bg-slate-50"
                  >
                    体験記を読む
                  </Link>
                  <Link
                    href={`/experiences/${exp.id}#consult`}
                    className="rounded-xl bg-slate-950 py-2.5 text-center text-xs font-black text-white hover:bg-cyan-700"
                  >
                    先輩に相談する →
                  </Link>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setResults(null)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
          >
            条件を変えてもう一度探す
          </button>
        </main>
      </div>
    );
  }

  // ── 検索フォーム ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-4">
          <SenpaiLogo />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 text-center">
          <p className="text-xs font-black tracking-[0.32em] text-cyan-600">BEST MATCH</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950">自分にぴったりの先輩を見つける</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            志望校・偏差値・高校・悩みまで細かく絞って、<br />
            本当に境遇が似た先輩だけを表示します。
          </p>
        </div>

        <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          {/* 志望校（グループ別） */}
          <div className="border-b border-slate-100 pb-5">
            <div className="mb-3">
              <p className="text-sm font-black text-slate-900">志望校</p>
              <p className="text-xs text-slate-400">受けたい大学を1つ選ぶ</p>
            </div>
            <div className="space-y-3">
              {UNIVERSITY_GROUPS.map((g) => (
                <div key={g.group}>
                  <p className="mb-1.5 text-[10px] font-black tracking-[0.2em] text-slate-400">{g.group}</p>
                  <div className="flex flex-wrap gap-2">
                    {g.schools.map((u) => (
                      <Chip
                        key={u}
                        label={u.replace("大学", "")}
                        selected={profile.targetUniversity === u}
                        onClick={() => toggleSingle("targetUniversity", u)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Section title="志望系統" subtitle="文理・国公立・私立の区分">
            {STUDY_SYSTEMS.map((s) => (
              <Chip key={s} label={s} selected={profile.studySystem === s}
                onClick={() => toggleSingle("studySystem", s)} />
            ))}
          </Section>

          <Section title="今の偏差値の目安">
            {DEVIATION_ORDER.map((d) => (
              <Chip key={d} label={d} selected={profile.deviation === d}
                onClick={() => toggleSingle("deviation", d)} />
            ))}
          </Section>

          {/* 出身高校（都道府県 → 高校） */}
          <div className="border-b border-slate-100 pb-5">
            <div className="mb-3">
              <p className="text-sm font-black text-slate-900">出身高校</p>
              <p className="text-xs text-slate-400">都道府県を選んでから高校を選ぶ（任意）　同じ高校の先輩を最優先でマッチします</p>
            </div>
            <div className="space-y-2">
              <select
                value={profile.prefecture}
                onChange={(e) => {
                  set("prefecture", e.target.value);
                  set("highSchool", "");
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
              >
                <option value="">都道府県を選ぶ</option>
                {PREFECTURES.map((pref) => (
                  <option key={pref} value={pref}>{pref}</option>
                ))}
              </select>

              {profile.prefecture && HIGH_SCHOOLS_BY_PREF[profile.prefecture] && (
                <select
                  value={profile.highSchool}
                  onChange={(e) => set("highSchool", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
                >
                  <option value="">高校を選ぶ（任意）</option>
                  {sortSchools(HIGH_SCHOOLS_BY_PREF[profile.prefecture]).map((hs) => (
                    <option key={hs} value={hs}>{hs}</option>
                  ))}
                </select>
              )}

              {profile.highSchool && (
                <p className="text-xs text-cyan-600 font-bold">
                  ✓ {profile.highSchool}出身の先輩を優先してマッチします
                </p>
              )}
            </div>
          </div>

          <Section title="出身高校のレベル感">
            {HIGH_SCHOOL_LEVELS.map((h) => (
              <Chip key={h} label={h} selected={profile.highSchoolLevel === h}
                onClick={() => toggleSingle("highSchoolLevel", h)} />
            ))}
          </Section>

          <Section title="現在の受験学年・状況">
            {EXAM_YEARS.map((y) => (
              <Chip key={y} label={y} selected={profile.examYear === y}
                onClick={() => toggleSingle("examYear", y)} />
            ))}
          </Section>

          <Section title="本格的に受験勉強を始めた時期">
            {START_TIMINGS.map((t) => (
              <Chip key={t} label={t} selected={profile.startTiming === t}
                onClick={() => toggleSingle("startTiming", t)} />
            ))}
          </Section>

          <Section title="部活・課外活動の状況">
            {CLUB_ACTIVITIES.map((c) => (
              <Chip key={c} label={c} selected={profile.clubActivity === c}
                onClick={() => toggleSingle("clubActivity", c)} />
            ))}
          </Section>

          <Section title="通塾・勉強スタイル">
            {STUDY_STYLES.map((s) => (
              <Chip key={s} label={s} selected={profile.studyStyle === s}
                onClick={() => toggleSingle("studyStyle", s)} />
            ))}
          </Section>

          <div className="border-b border-slate-100 pb-5">
            <div className="mb-3">
              <p className="text-sm font-black text-slate-900">今の悩み・苦手なこと</p>
              <p className="text-xs text-slate-400">
                当てはまるものを選ぶ（最大{MAX_TAGS}個 / 残り{MAX_TAGS - totalTags}個）
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {WEAKNESS_TAGS.map((t) => (
                <TagChip key={t} label={t} selected={profile.weaknesses.includes(t)}
                  onClick={() => toggleMulti("weaknesses", t, MAX_TAGS - profile.wantToKnow.length)}
                  max={MAX_TAGS - profile.wantToKnow.length} currentCount={profile.weaknesses.length} />
              ))}
            </div>
          </div>

          <div className="border-b border-slate-100 pb-5">
            <div className="mb-3">
              <p className="text-sm font-black text-slate-900">先輩に聞きたいこと</p>
              <p className="text-xs text-slate-400">
                知りたいテーマを選ぶ（最大{MAX_TAGS}個 / 残り{MAX_TAGS - totalTags}個）
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {WANT_TO_KNOW_TAGS.map((t) => (
                <TagChip key={t} label={t} selected={profile.wantToKnow.includes(t)}
                  onClick={() => toggleMulti("wantToKnow", t, MAX_TAGS - profile.weaknesses.length)}
                  max={MAX_TAGS - profile.weaknesses.length} currentCount={profile.wantToKnow.length} />
              ))}
            </div>
          </div>

          <Section title="先輩の結果の希望">
            {RESULT_PREFERENCES.map((r) => (
              <Chip key={r} label={r} selected={profile.resultPreference === r}
                onClick={() => toggleSingle("resultPreference", r)} />
            ))}
          </Section>
        </div>

        <button
          type="button"
          onClick={handleMatch}
          disabled={!isReady || loading}
          className="mt-5 w-full rounded-2xl bg-slate-950 py-4 text-base font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700 disabled:opacity-40"
        >
          {loading ? "マッチング中..." : "ぴったりの先輩を探す →"}
        </button>
        {!isReady && (
          <p className="mt-2 text-center text-xs text-slate-400">どれか1つ以上選ぶと診断できます</p>
        )}
      </main>
    </div>
  );
}
