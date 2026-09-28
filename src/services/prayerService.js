// Accurate Algerian Wilayas Prayer Calculation
// Covering the 58 Wilayas of Algeria

export const ALGERIAN_WILAYAS = [
  { code: '01', name: 'أدرار (Adrar)', lat: 27.8744, lng: -0.2939, timezone: 1 },
  { code: '02', name: 'الشلف (Chlef)', lat: 36.1652, lng: 1.3345, timezone: 1 },
  { code: '03', name: 'الأغواط (Laghouat)', lat: 33.8000, lng: 2.8651, timezone: 1 },
  { code: '04', name: 'أم البواقي (Oum El Bouaghi)', lat: 35.8753, lng: 7.1135, timezone: 1 },
  { code: '05', name: 'باتنة (Batna)', lat: 35.5559, lng: 6.1741, timezone: 1 },
  { code: '06', name: 'بجاية (Béjaïa)', lat: 36.7559, lng: 5.0843, timezone: 1 },
  { code: '07', name: 'بسكرة (Biskra)', lat: 34.8517, lng: 5.7281, timezone: 1 },
  { code: '08', name: 'بشار (Béchar)', lat: 31.6167, lng: -2.2167, timezone: 1 },
  { code: '09', name: 'البليدة (Blida)', lat: 36.4700, lng: 2.8300, timezone: 1 },
  { code: '10', name: 'البويرة (Bouira)', lat: 36.3749, lng: 3.9020, timezone: 1 },
  { code: '11', name: 'تمنراست (Tamanrasset)', lat: 22.7850, lng: 5.5228, timezone: 1 },
  { code: '12', name: 'تبسة (Tébessa)', lat: 35.4042, lng: 8.1242, timezone: 1 },
  { code: '13', name: 'تلمسان (Tlemcen)', lat: 34.8783, lng: -1.3150, timezone: 1 },
  { code: '14', name: 'تيارت (Tiaret)', lat: 35.3710, lng: 1.3170, timezone: 1 },
  { code: '15', name: 'تيزي وزو (Tizi Ouzou)', lat: 36.7118, lng: 4.0459, timezone: 1 },
  { code: '16', name: 'الجزائر العاصمة (Alger)', lat: 36.7538, lng: 3.0588, timezone: 1 },
  { code: '17', name: 'الجلفة (Djelfa)', lat: 34.6728, lng: 3.2630, timezone: 1 },
  { code: '18', name: 'جيجل (Jijel)', lat: 36.8206, lng: 5.7667, timezone: 1 },
  { code: '19', name: 'سطيف (Sétif)', lat: 36.1911, lng: 5.4137, timezone: 1 },
  { code: '20', name: 'سعيدة (Saïda)', lat: 34.8303, lng: 0.1517, timezone: 1 },
  { code: '21', name: 'سكيكدة (Skikda)', lat: 36.8663, lng: 6.9000, timezone: 1 },
  { code: '22', name: 'سيدي بلعباس (Sidi Bel Abbès)', lat: 35.2000, lng: -0.6300, timezone: 1 },
  { code: '23', name: 'عنابة (Annaba)', lat: 36.9000, lng: 7.7667, timezone: 1 },
  { code: '24', name: 'قالمة (Guelma)', lat: 36.4622, lng: 7.4261, timezone: 1 },
  { code: '25', name: 'قسنطينة (Constantine)', lat: 36.3650, lng: 6.6147, timezone: 1 },
  { code: '26', name: 'المدية (Médéa)', lat: 36.2642, lng: 2.7539, timezone: 1 },
  { code: '27', name: 'مستغانم (Mostaganem)', lat: 35.9333, lng: 0.0903, timezone: 1 },
  { code: '28', name: 'المسيلة (M\'Sila)', lat: 35.7058, lng: 4.5419, timezone: 1 },
  { code: '29', name: 'معسكر (Mascara)', lat: 35.4000, lng: 0.1333, timezone: 1 },
  { code: '30', name: 'ورقلة (Ouargla)', lat: 31.9500, lng: 5.3333, timezone: 1 },
  { code: '31', name: 'وهران (Oran)', lat: 35.6971, lng: -0.6308, timezone: 1 },
  { code: '32', name: 'البيض (El Bayadh)', lat: 33.6833, lng: 1.0167, timezone: 1 },
  { code: '33', name: 'إليزي (Illizi)', lat: 26.4833, lng: 8.4667, timezone: 1 },
  { code: '34', name: 'برج بوعريريج (Bordj Bou Arréridj)', lat: 36.0732, lng: 4.7611, timezone: 1 },
  { code: '35', name: 'بومرداس (Boumerdès)', lat: 36.7664, lng: 3.4772, timezone: 1 },
  { code: '36', name: 'الطارف (El Tarf)', lat: 36.7672, lng: 8.3139, timezone: 1 },
  { code: '37', name: 'تندوف (Tindouf)', lat: 27.6742, lng: -8.1478, timezone: 1 },
  { code: '38', name: 'تيسمسيلت (Tissemsilt)', lat: 35.6072, lng: 1.8108, timezone: 1 },
  { code: '39', name: 'الوادي (El Oued)', lat: 33.3683, lng: 6.8674, timezone: 1 },
  { code: '40', name: 'خنشلة (Khenchela)', lat: 35.4358, lng: 7.1433, timezone: 1 },
  { code: '41', name: 'سوق أهراس (Souk Ahras)', lat: 36.2864, lng: 7.9511, timezone: 1 },
  { code: '42', name: 'تيبازة (Tipaza)', lat: 36.5942, lng: 2.4475, timezone: 1 },
  { code: '43', name: 'ميلة (Mila)', lat: 36.4503, lng: 6.2644, timezone: 1 },
  { code: '44', name: 'عين الدفلى (Aïn Defla)', lat: 36.2644, lng: 1.9678, timezone: 1 },
  { code: '45', name: 'النعامة (Naâma)', lat: 33.2667, lng: -0.3167, timezone: 1 },
  { code: '46', name: 'عين تموشنت (Aïn Témouchent)', lat: 35.2975, lng: -1.1400, timezone: 1 },
  { code: '47', name: 'غرداية (Ghardaïa)', lat: 32.4909, lng: 3.6736, timezone: 1 },
  { code: '48', name: 'غليزان (Relizane)', lat: 35.7400, lng: 0.5561, timezone: 1 },
  { code: '49', name: 'تيميمون (Timimoun)', lat: 29.2639, lng: 0.2311, timezone: 1 },
  { code: '50', name: 'برج باجي مختار (Bordj Badji Mokhtar)', lat: 21.3278, lng: 0.9542, timezone: 1 },
  { code: '51', name: 'أولاد جلال (Ouled Djellal)', lat: 34.4333, lng: 5.0667, timezone: 1 },
  { code: '52', name: 'بني عباس (Béni Abbès)', lat: 30.1333, lng: -2.1667, timezone: 1 },
  { code: '53', name: 'إن صالح (In Salah)', lat: 27.1936, lng: 2.4608, timezone: 1 },
  { code: '54', name: 'إن قزام (In Guezzam)', lat: 19.5683, lng: 5.7725, timezone: 1 },
  { code: '55', name: 'تقرت (Touggourt)', lat: 33.1053, lng: 6.0581, timezone: 1 },
  { code: '56', name: 'جانت (Djanet)', lat: 24.5539, lng: 9.4853, timezone: 1 },
  { code: '57', name: 'المغير (El M\'Ghair)', lat: 33.9500, lng: 5.9167, timezone: 1 },
  { code: '58', name: 'المنيعة (El Menia)', lat: 30.5833, lng: 2.8833, timezone: 1 },
];

// Calculation of prayer times using standard astronomical algorithms adapted for Algerian latitudes
export const calculatePrayerTimes = (wilayaCode = '16', date = new Date()) => {
  const wilaya = ALGERIAN_WILAYAS.find(w => w.code === wilayaCode) || ALGERIAN_WILAYAS[15]; // Default Algiers
  const lat = wilaya.lat;
  const lng = wilaya.lng;
  const timezone = wilaya.timezone;

  // Day of year calculation
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Sun declination and equation of time
  const b = (2 * Math.PI * (dayOfYear - 81)) / 365;
  const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  const declination = 23.45 * Math.sin((2 * Math.PI * (284 + dayOfYear)) / 365) * (Math.PI / 180);

  // Solar noon
  const solarNoon = 12 + timezone - (lng / 15) - (eot / 60);

  const radLat = lat * (Math.PI / 180);

  // Fajr angle 18 deg, Isha 17 deg (Ministry of Religious Affairs standard)
  const fajrAngle = 18 * (Math.PI / 180);
  const ishaAngle = 17 * (Math.PI / 180);

  const cosHourAngle = (angle) => {
    return (Math.sin(-angle) - Math.sin(radLat) * Math.sin(declination)) / (Math.cos(radLat) * Math.cos(declination));
  };

  const fajrHA = Math.acos(Math.max(-1, Math.min(1, cosHourAngle(fajrAngle)))) * (180 / Math.PI) / 15;
  const sunriseHA = Math.acos(Math.max(-1, Math.min(1, cosHourAngle(0.833 * Math.PI / 180)))) * (180 / Math.PI) / 15;
  const ishaHA = Math.acos(Math.max(-1, Math.min(1, cosHourAngle(ishaAngle)))) * (180 / Math.PI) / 15;

  // Asr shadow angle (Shafi'i/Hanbali/Maliki standard: shadow = 1)
  const asrAngle = -Math.atan(1 + Math.tan(Math.abs(radLat - declination)));
  const asrHA = Math.acos(Math.max(-1, Math.min(1, (Math.sin(asrAngle) - Math.sin(radLat) * Math.sin(declination)) / (Math.cos(radLat) * Math.cos(declination))))) * (180 / Math.PI) / 15;

  const formatHours = (decimalHours) => {
    let h = Math.floor(decimalHours);
    let m = Math.floor((decimalHours - h) * 60);
    if (m === 60) {
      h += 1;
      m = 0;
    }
    h = (h + 24) % 24;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const fajr = solarNoon - fajrHA;
  const sunrise = solarNoon - sunriseHA;
  const dhuhr = solarNoon;
  const asr = solarNoon + asrHA;
  const maghrib = solarNoon + sunriseHA;
  const isha = solarNoon + ishaHA;

  const prayers = [
    { id: 'fajr', name: 'الفجر', time: formatHours(fajr), decimal: fajr },
    { id: 'sunrise', name: 'الشروق', time: formatHours(sunrise), decimal: sunrise },
    { id: 'dhuhr', name: 'الظهر', time: formatHours(dhuhr), decimal: dhuhr },
    { id: 'asr', name: 'العصر', time: formatHours(asr), decimal: asr },
    { id: 'maghrib', name: 'المغرب', time: formatHours(maghrib), decimal: maghrib },
    { id: 'isha', name: 'العشاء', time: formatHours(isha), decimal: isha },
  ];

  // Determine current and next prayer
  const now = date.getHours() + date.getMinutes() / 60;
  let nextPrayer = prayers.find(p => p.decimal > now && p.id !== 'sunrise') || prayers[0];
  let currentPrayer = prayers.filter(p => p.decimal <= now && p.id !== 'sunrise').pop() || prayers[prayers.length - 1];

  // Remaining minutes to next prayer
  let diffMinutes = Math.round((nextPrayer.decimal - now) * 60);
  if (diffMinutes < 0) diffMinutes += 24 * 60;

  return {
    wilaya,
    prayers,
    nextPrayer,
    currentPrayer,
    remainingMinutes: diffMinutes,
    remainingText: diffMinutes > 60 ? `${Math.floor(diffMinutes / 60)} س و ${diffMinutes % 60} د` : `${diffMinutes} دقيقة`,
  };
};
