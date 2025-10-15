let player = videojs('my-video', {
    controls: true,
    fluid: true,
    playbackRates: [2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25],
    skinStyle: 'bold',
    plugins: {
        hotkeys: {
          enableModifiersForNumbers: false,
          volumeStep: 0.1,
          seekStep: 5,
        },
    }
})