const fs = require('fs');
const path = require('path');

const samplesDir = path.join(__dirname, '..', 'data', 'voice_samples');
const publicAudioDir = path.join(__dirname, '..', 'public', 'audio');
const yusufStoryDir = path.join(__dirname, '..', 'public', 'stories', 'yusuf');

fs.mkdirSync(publicAudioDir, { recursive: true });
fs.mkdirSync(yusufStoryDir, { recursive: true });

// Copy the Yusuf story audio (Yusufjon - hikoya.m4a) to public/stories/yusuf/nurqissa_full.m4a and .mp3
const files = fs.readdirSync(samplesDir);
console.log("All sample files in data/voice_samples:", files);

// Identify files
let yusufFile = files.find(f => f.includes('1790060399190') || f.toLowerCase().includes('yusuf'));
let solihBakir1 = files.find(f => f.includes('1790060416129'));
let solihBakir2 = files.find(f => f.includes('1790060418899'));
let sohilsizDengiz = files.find(f => f.includes('1790060404158'));
let qalbiGulAyol = files.find(f => f.includes('1790060420564'));

console.log("Matched files:", {
  yusufFile,
  solihBakir1,
  solihBakir2,
  sohilsizDengiz,
  qalbiGulAyol
});

// 1. Copy actor voice samples to public/audio/
if (solihBakir1) {
  fs.copyFileSync(path.join(samplesDir, solihBakir1), path.join(publicAudioDir, 'solih_bakir_sample1.mp3'));
  fs.copyFileSync(path.join(samplesDir, solihBakir1), path.join(publicAudioDir, 'actor_dublyaj_main.mp3'));
  console.log("Copied solih_bakir_sample1.mp3 & actor_dublyaj_main.mp3");
}

if (solihBakir2) {
  fs.copyFileSync(path.join(samplesDir, solihBakir2), path.join(publicAudioDir, 'solih_bakir_sample2.mp3'));
  console.log("Copied solih_bakir_sample2.mp3");
}

if (yusufFile) {
  fs.copyFileSync(path.join(samplesDir, yusufFile), path.join(yusufStoryDir, 'yusuf_actor_full.m4a'));
  fs.copyFileSync(path.join(samplesDir, yusufFile), path.join(publicAudioDir, 'yusufjon_hikoya.m4a'));
  console.log("Copied yusuf_actor_full.m4a");
}

if (sohilsizDengiz) {
  fs.copyFileSync(path.join(samplesDir, sohilsizDengiz), path.join(publicAudioDir, 'sohilsiz_dengiz.m4a'));
}

if (qalbiGulAyol) {
  fs.copyFileSync(path.join(samplesDir, qalbiGulAyol), path.join(publicAudioDir, 'qalbi_gul_ayol.mp3'));
}

console.log("Audio files successfully organized!");
