// The splash screen waits on this: it resolves once the dotted wave has drawn
// enough smooth frames that revealing the page won't show dots popping in.
let resolveWave: () => void = () => {};

export const waveReady = new Promise<void>((resolve) => {
  resolveWave = resolve;
});

export const markWaveReady = () => resolveWave();
