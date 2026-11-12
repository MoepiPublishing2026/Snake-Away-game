const fs = require("fs");
const path = require("path");

const RATE = 22050;
const outDir = path.join(__dirname, "..", "assets", "sfx");
fs.mkdirSync(outDir, { recursive: true });

function clamp(value) {
  return Math.max(-1, Math.min(1, value));
}

function render(seconds, fill, peakTarget = 0.94) {
  const length = Math.max(1, Math.floor(RATE * seconds));
  const samples = new Float64Array(length);
  fill(samples, length);
  let peak = 0;
  for (let i = 0; i < length; i += 1) peak = Math.max(peak, Math.abs(samples[i]));
  const gain = peak > 0.001 ? peakTarget / peak : 1;
  const fade = Math.min(180, Math.floor(length / 8));
  const pcm = Buffer.alloc(44 + length * 2);
  pcm.write("RIFF", 0);
  pcm.writeUInt32LE(36 + length * 2, 4);
  pcm.write("WAVE", 8);
  pcm.write("fmt ", 12);
  pcm.writeUInt32LE(16, 16);
  pcm.writeUInt16LE(1, 20);
  pcm.writeUInt16LE(1, 22);
  pcm.writeUInt32LE(RATE, 24);
  pcm.writeUInt32LE(RATE * 2, 28);
  pcm.writeUInt16LE(2, 32);
  pcm.writeUInt16LE(16, 34);
  pcm.write("data", 36);
  pcm.writeUInt32LE(length * 2, 40);
  for (let i = 0; i < length; i += 1) {
    let edge = 1;
    if (i < fade) edge = i / fade;
    else if (i > length - fade) edge = (length - i) / fade;
    const value = clamp(samples[i] * gain * edge);
    pcm.writeInt16LE(Math.round(value * 32767), 44 + i * 2);
  }
  return pcm;
}

function env(time, attack, release, duration) {
  if (time < attack) return time / attack;
  const remain = duration - time;
  if (remain < release) return Math.max(0, remain / release);
  return 1;
}

function addNote(samples, start, duration, freq, volume, partial = 0.25) {
  const from = Math.floor(start * RATE);
  const count = Math.floor(duration * RATE);
  for (let i = 0; i < count && from + i < samples.length; i += 1) {
    const time = i / RATE;
    const amp = env(time, 0.015, Math.min(0.12, duration * 0.45), duration) * volume;
    const wave = Math.sin(2 * Math.PI * freq * time) + partial * Math.sin(2 * Math.PI * freq * 2 * time);
    samples[from + i] += wave * amp;
  }
}

function write(name, seconds, fill, peakTarget) {
  fs.writeFileSync(path.join(outDir, name), render(seconds, fill, peakTarget));
}

write("correct.wav", 0.22, (samples) => {
  addNote(samples, 0, 0.12, 784, 0.45);
  addNote(samples, 0.08, 0.14, 1046, 0.4);
});

write("wrong.wav", 0.28, (samples) => {
  const count = samples.length;
  for (let i = 0; i < count; i += 1) {
    const time = i / RATE;
    const freq = 240 - time * 280;
    const amp = env(time, 0.01, 0.12, 0.28) * 0.45;
    samples[i] += Math.sign(Math.sin(2 * Math.PI * freq * time)) * 0.35 * amp;
    samples[i] += Math.sin(2 * Math.PI * freq * time) * amp;
  }
});

write("hit.wav", 0.32, (samples) => {
  addNote(samples, 0, 0.3, 146, 0.55, 0.1);
  for (let i = 0; i < samples.length; i += 1) {
    const time = i / RATE;
    samples[i] += (Math.random() * 2 - 1) * Math.exp(-time * 14) * 0.35;
  }
});

write("lose.wav", 1.25, (samples) => {
  addNote(samples, 0, 0.38, 494, 0.55, 0.15);
  addNote(samples, 0.28, 0.4, 392, 0.55, 0.12);
  addNote(samples, 0.56, 0.42, 330, 0.6, 0.1);
  addNote(samples, 0.86, 0.38, 247, 0.7, 0.08);
});

write("win.wav", 1.45, (samples) => {
  addNote(samples, 0, 0.28, 523, 0.5, 0.35);
  addNote(samples, 0.16, 0.28, 659, 0.5, 0.35);
  addNote(samples, 0.32, 0.28, 784, 0.55, 0.4);
  addNote(samples, 0.5, 0.7, 1047, 0.6, 0.45);
  addNote(samples, 0.5, 0.7, 1319, 0.28, 0.2);
  addNote(samples, 0.5, 0.55, 1568, 0.18, 0.2);
});

write("reward.wav", 1.15, (samples) => {
  [0, 0.08, 0.16, 0.26, 0.38].forEach((start, index) => {
    addNote(samples, start, 0.22, 988 * Math.pow(1.2, index), 0.42, 0.7);
  });
  addNote(samples, 0.52, 0.55, 1568, 0.45, 0.5);
  addNote(samples, 0.52, 0.55, 2093, 0.25, 0.4);
});

write("miss.wav", 0.55, (samples) => {
  addNote(samples, 0, 0.28, 392, 0.45, 0.05);
  addNote(samples, 0.2, 0.32, 262, 0.5, 0.05);
});

write("tick.wav", 0.045, (samples) => {
  for (let i = 0; i < samples.length; i += 1) {
    const time = i / RATE;
    samples[i] += (Math.random() * 2 - 1) * Math.exp(-time * 90) * 0.8;
    samples[i] += Math.sin(2 * Math.PI * 1800 * time) * Math.exp(-time * 70) * 0.5;
  }
});

write("click.wav", 0.07, (samples) => {
  addNote(samples, 0, 0.07, 660, 0.4, 0.2);
});

write("start.wav", 0.4, (samples) => {
  addNote(samples, 0, 0.18, 523, 0.45, 0.3);
  addNote(samples, 0.12, 0.26, 784, 0.5, 0.35);
});

write("quiz.wav", 0.2, (samples) => {
  addNote(samples, 0, 0.18, 880, 0.4, 0.4);
});

write("freeze.wav", 0.42, (samples) => {
  for (let i = 0; i < samples.length; i += 1) {
    const time = i / RATE;
    const freq = 1200 + Math.sin(time * 40) * 80;
    const amp = env(time, 0.02, 0.18, 0.42) * 0.28;
    samples[i] += Math.sin(2 * Math.PI * freq * time) * amp;
    samples[i] += Math.sin(2 * Math.PI * (freq * 1.5) * time) * amp * 0.4;
  }
});

write("hint.wav", 0.28, (samples) => {
  addNote(samples, 0, 0.12, 1174, 0.3, 0.5);
  addNote(samples, 0.1, 0.16, 1568, 0.28, 0.5);
});

write("shuffle.wav", 0.26, (samples) => {
  for (let i = 0; i < samples.length; i += 1) {
    const time = i / RATE;
    const amp = env(time, 0.01, 0.08, 0.26) * (0.4 - time);
    samples[i] += (Math.random() * 2 - 1) * amp * 0.55;
    samples[i] += Math.sin(2 * Math.PI * (500 + time * 900) * time) * amp * 0.2;
  }
});

write("buy.wav", 0.18, (samples) => {
  addNote(samples, 0, 0.1, 1318, 0.35, 0.6);
  addNote(samples, 0.07, 0.1, 1760, 0.3, 0.6);
});

write("deny.wav", 0.14, (samples) => {
  addNote(samples, 0, 0.13, 196, 0.4, 0);
});

write("spin.wav", 0.55, (samples) => {
  for (let i = 0; i < samples.length; i += 1) {
    const time = i / RATE;
    const amp = env(time, 0.03, 0.16, 0.55);
    samples[i] += (Math.random() * 2 - 1) * amp * (0.15 + time);
    samples[i] += Math.sin(2 * Math.PI * (220 + time * 1400) * time) * amp * 0.55;
  }
});

write("music.wav", 5, (samples) => {
  const melody = [523.25, 659.25, 783.99, 659.25, 880, 783.99, 659.25, 523.25];
  melody.forEach((freq, index) => addNote(samples, index * 0.625, 0.58, freq, 0.22, 0.18));
  addNote(samples, 0, 2.4, 196, 0.16, 0.05);
  addNote(samples, 2.5, 2.4, 164.81, 0.14, 0.05);
  addNote(samples, 0, 5, 261.63, 0.05, 0);
  addNote(samples, 0, 5, 329.63, 0.04, 0);
}, 0.55);

console.log("wrote sfx to", outDir);
