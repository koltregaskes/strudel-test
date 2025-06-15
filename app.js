// The Prodigy - Everybody's in the Place Strudel Recreation App

class ProdigyStrudelApp {
    constructor() {
        this.isPlaying = false;
        this.currentTime = 0;
        this.totalTime = 213; // 3:33 in seconds
        this.currentCycle = 0;
        this.currentBeat = 1;
        this.strudelInstance = null;
        this.updateInterval = null;
        this.beatInterval = null;
        this.codeEditorVisible = false;
        
        // Track states
        this.trackStates = {
            mainbreak: { volume: 0.9, muted: false },
            kick: { volume: 0.8, muted: false },
            bass: { volume: 0.7, muted: false },
            stabs: { volume: 0.6, muted: false },
            lead: { volume: 0.5, muted: false },
            vocal: { volume: 0.8, muted: false },
            percussion: { volume: 0.5, muted: false }
        };
        
        // Global effects
        this.globalEffects = {
            masterVolume: 0.8,
            tempo: 131,
            reverb: 0.3,
            delay: 0.25,
            filter: 0.5
        };
        
        this.strudelCode = `// The Prodigy - Everybody's in the Place Recreation in Strudel
// Tempo: 131 BPM (32.75 cycles per minute)
// Key: C#/Db major
// Style: Breakbeat/Hardcore

// Load external samples
samples({
  // Main breakbeat samples
  'amenbreak': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/breaks125/000_breaks125-amen1.wav',
  'amenbreak2': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/breaks125/001_breaks125-amen2.wav',
  'amenbreak3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/breaks165/000_breaks165-amen1.wav',
  
  // Additional breaks and percussion
  'hardcore': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/hardcore/000_hardcore.wav',
  'hardcore2': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/hardcore/001_hardcore.wav',
  
  // Bass sounds
  'reese': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/reese/000_reese.wav',
  'subbass': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/bass/000_bass.wav',
  
  // Stabs and leads
  'stab': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/stab/000_stab.wav',
  'rave': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/rave/000_rave.wav',
  
  // Vocal elements (placeholder - would need to source actual vocal)
  'vocal': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/vocal/000_vocal.wav'
}, 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/');

// Set tempo (131 BPM = 32.75 cycles per minute)
setcps(131/120)

// === MAIN BREAKBEAT PATTERN ===
$: s("amenbreak*4")
  .slice(8, "<0 2 4 6> <1 3 5 7> <4 6 0 2> <7 5 3 1>")
  .speed("<1 1.1 0.9 1.05>")
  .pan("<0.2 0.8 0.5 0.3>")
  .gain(0.9)
  .room(0.1)
  .lpf(sine.range(3000, 8000).slow(2))
  .sometimes(rev)
  .every(4, fast(2))
  .id("mainbreak")

// === KICK PATTERN ===
$: s("bd*4")
  .mask("<1 1 1 0>/4")
  .bank("RolandTR909")
  .gain(0.8)
  .lpf(200)
  .id("kick")

// === BASS LINE ===
$: note("<cs2!4 fs2!4 gs2!4 cs3!4>/4")
  .s("reese")
  .cutoff(sine.range(200, 800).slow(4))
  .resonance(0.3)
  .gain(0.7)
  .every(8, add(note("12")))
  .id("bass")

// === STAB CHORDS ===
$: note("<[cs4,f4,gs4] ~ [cs4,f4,gs4] ~>")
  .s("stab")
  .gain(0.6)
  .attack(0.01)
  .decay(0.5)
  .delay(0.25)
  .room(0.8)
  .every(2, add(note("7")))
  .id("stabs")

// === LEAD ELEMENTS ===
$: s("rave*8")
  .n("<0 1 2 3>")
  .gain(sine.range(0.3, 0.8).fast(2))
  .pan(sine.slow(3))
  .lpf(perlin.range(1000, 5000).slow(2))
  .delay(0.125)
  .sometimes(rev)
  .id("lead")

// === VOCAL SAMPLES ===
$: s("vocal")
  .speed(1.2)
  .begin("<0 0.25 0.5>")
  .end("<0.25 0.5 0.75>")
  .gain(0.8)
  .delay(0.5)
  .room(0.6)
  .every(4, fast(2))
  .mask("<1 0 1 0>/2")
  .id("vocal")

// === PERCUSSION LAYER ===
$: stack(
  s("hh*16").gain("<0.3 0.6>*8").pan("<0.2 0.8>*4"),
  s("~ cp ~ ~").bank("RolandTR909").gain(0.5).delay(0.125),
  s("~ ~ oh ~").bank("RolandTR909").gain(0.4).every(3, fast(2))
).id("percussion")`;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeStrudel();
        this.updateTimeDisplay();
        this.updateVolumeDisplays();
        this.updateEffectDisplays();
        this.setupCodeEditor();
    }
    
    setupEventListeners() {
        // Play/Stop button
        const playStopBtn = document.getElementById('playStopBtn');
        playStopBtn.addEventListener('click', () => this.togglePlayStop());
        
        // Master volume
        const masterVolume = document.getElementById('masterVolume');
        masterVolume.addEventListener('input', (e) => {
            this.globalEffects.masterVolume = e.target.value / 100;
            this.updateVolumeDisplay(e.target.nextElementSibling, e.target.value);
            this.updateStrudelGain();
        });
        
        // Tempo slider
        const tempoSlider = document.getElementById('tempoSlider');
        tempoSlider.addEventListener('input', (e) => {
            this.globalEffects.tempo = parseInt(e.target.value);
            this.updateTempoDisplay(e.target.nextElementSibling, e.target.value);
            this.updateStrudelTempo();
        });
        
        // Track volume sliders
        document.querySelectorAll('.track-volume-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const trackId = e.target.dataset.track;
                const value = e.target.value / 100;
                this.trackStates[trackId].volume = value;
                this.updateVolumeDisplay(e.target.nextElementSibling, e.target.value);
                this.updateTrackGain(trackId);
            });
        });
        
        // Mute buttons
        document.querySelectorAll('.mute-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trackControl = e.target.closest('.track-control');
                const trackId = trackControl.dataset.track;
                this.toggleMute(trackId, btn, trackControl);
            });
        });
        
        // Effect sliders
        const reverbSlider = document.getElementById('reverbSlider');
        reverbSlider.addEventListener('input', (e) => {
            this.globalEffects.reverb = e.target.value / 100;
            this.updateEffectDisplay(e.target.nextElementSibling, e.target.value);
        });
        
        const delaySlider = document.getElementById('delaySlider');
        delaySlider.addEventListener('input', (e) => {
            this.globalEffects.delay = e.target.value / 100;
            this.updateEffectDisplay(e.target.nextElementSibling, e.target.value);
        });
        
        const filterSlider = document.getElementById('filterSlider');
        filterSlider.addEventListener('input', (e) => {
            this.globalEffects.filter = e.target.value / 100;
            this.updateEffectDisplay(e.target.nextElementSibling, e.target.value);
        });
        
        // Code editor controls
        const toggleCodeBtn = document.getElementById('toggleCodeBtn');
        toggleCodeBtn.addEventListener('click', () => this.toggleCodeEditor());
        
        const updateCodeBtn = document.getElementById('updateCodeBtn');
        updateCodeBtn.addEventListener('click', () => this.updateCode());
        
        const resetCodeBtn = document.getElementById('resetCodeBtn');
        resetCodeBtn.addEventListener('click', () => this.resetCode());
        
        const exportCodeBtn = document.getElementById('exportCodeBtn');
        exportCodeBtn.addEventListener('click', () => this.exportCode());
    }
    
    setupCodeEditor() {
        // Set initial code in textarea
        const codeTextarea = document.getElementById('strudelCode');
        codeTextarea.value = this.strudelCode;
        
        // Initially hide the code editor
        const codeEditor = document.getElementById('codeEditor');
        codeEditor.classList.remove('visible');
        
        // Hide control buttons initially
        const controlBtns = document.querySelectorAll('.code-control-btn');
        controlBtns.forEach(btn => btn.classList.remove('visible'));
    }
    
    async initializeStrudel() {
        try {
            // Initialize Strudel embed
            const strudelContainer = document.getElementById('strudelRepl');
            
            if (window.strudelEmbed) {
                this.strudelInstance = await window.strudelEmbed({
                    container: strudelContainer,
                    code: this.strudelCode,
                    enableEditor: false,
                    enableConsole: false,
                    height: 300
                });
                
                console.log('Strudel initialized successfully');
            } else {
                console.warn('Strudel embed not available, falling back to code display');
                this.fallbackCodeDisplay();
            }
            
        } catch (error) {
            console.error('Error initializing Strudel:', error);
            this.fallbackCodeDisplay();
        }
    }
    
    fallbackCodeDisplay() {
        const strudelContainer = document.getElementById('strudelRepl');
        strudelContainer.innerHTML = `
            <div style="padding: 20px; color: #ff0088; text-align: center; background: rgba(0,0,0,0.5); border-radius: 8px;">
                <p><strong>Strudel Live Coding Environment</strong></p>
                <p>To run this code with audio, copy it to <a href="https://strudel.cc" target="_blank" style="color: #00ff88;">strudel.cc</a></p>
                <p>This interface allows you to edit and export the code for use in the official Strudel environment.</p>
            </div>
        `;
    }
    
    togglePlayStop() {
        const btn = document.getElementById('playStopBtn');
        const playIcon = btn.querySelector('.play-icon');
        const playText = btn.querySelector('.play-text');
        
        if (this.isPlaying) {
            this.stop();
            btn.classList.remove('playing');
            playIcon.textContent = '▶';
            playText.textContent = 'Play';
        } else {
            this.play();
            btn.classList.add('playing');
            playIcon.textContent = '⏸';
            playText.textContent = 'Stop';
        }
    }
    
    play() {
        this.isPlaying = true;
        
        // Start Strudel if available
        if (this.strudelInstance && this.strudelInstance.start) {
            try {
                this.strudelInstance.start();
            } catch (error) {
                console.warn('Could not start Strudel instance:', error);
            }
        }
        
        // Start update intervals
        this.updateInterval = setInterval(() => {
            this.currentTime += 0.1;
            if (this.currentTime >= this.totalTime) {
                this.currentTime = 0;
            }
            this.updateTimeDisplay();
            this.updateProgress();
            this.updateTimelineMarker();
        }, 100);
        
        // Start beat indicator
        this.beatInterval = setInterval(() => {
            this.updateBeatIndicator();
        }, (60 / this.globalEffects.tempo) * 250); // Quarter note intervals
    }
    
    stop() {
        this.isPlaying = false;
        
        // Stop Strudel if available
        if (this.strudelInstance && this.strudelInstance.stop) {
            try {
                this.strudelInstance.stop();
            } catch (error) {
                console.warn('Could not stop Strudel instance:', error);
            }
        }
        
        // Clear intervals
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        if (this.beatInterval) {
            clearInterval(this.beatInterval);
            this.beatInterval = null;
        }
        
        // Reset beat indicators
        document.querySelectorAll('.beat-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
    }
    
    updateTimeDisplay() {
        const currentTimeEl = document.getElementById('currentTime');
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = Math.floor(this.currentTime % 60);
        currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const percentage = (this.currentTime / this.totalTime) * 100;
        progressFill.style.width = `${percentage}%`;
    }
    
    updateTimelineMarker() {
        const marker = document.getElementById('timelineMarker');
        const percentage = (this.currentTime / this.totalTime) * 100;
        marker.style.left = `${percentage}%`;
    }
    
    updateBeatIndicator() {
        // Remove active from all beats
        document.querySelectorAll('.beat-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Add active to current beat
        const currentBeatEl = document.querySelector(`[data-beat="${this.currentBeat}"]`);
        if (currentBeatEl) {
            currentBeatEl.classList.add('active');
        }
        
        // Update beat and cycle counters
        this.currentBeat = (this.currentBeat % 4) + 1;
        if (this.currentBeat === 1) {
            this.currentCycle++;
            document.getElementById('cycleNumber').textContent = this.currentCycle;
        }
    }
    
    toggleMute(trackId, button, trackControl) {
        const currentlyMuted = this.trackStates[trackId].muted;
        this.trackStates[trackId].muted = !currentlyMuted;
        
        if (this.trackStates[trackId].muted) {
            button.classList.add('active');
            button.textContent = 'Unmute';
            trackControl.classList.add('muted');
        } else {
            button.classList.remove('active');
            button.textContent = 'Mute';
            trackControl.classList.remove('muted');
        }
        
        this.updateTrackGain(trackId);
    }
    
    updateTrackGain(trackId) {
        // In a real implementation, this would update the Strudel pattern gain
        const gain = this.trackStates[trackId].muted ? 0 : this.trackStates[trackId].volume;
        console.log(`Updating ${trackId} gain to ${gain}`);
        
        // If Strudel instance is available, try to update the pattern
        if (this.strudelInstance && this.strudelInstance.evaluate) {
            try {
                const gainCode = `$${trackId}: $${trackId}.gain(${gain})`;
                this.strudelInstance.evaluate(gainCode);
            } catch (error) {
                console.warn('Could not update track gain:', error);
            }
        }
    }
    
    updateStrudelGain() {
        console.log(`Updating master gain to ${this.globalEffects.masterVolume}`);
        // Implementation would update overall Strudel gain
    }
    
    updateStrudelTempo() {
        console.log(`Updating tempo to ${this.globalEffects.tempo} BPM`);
        // Implementation would update Strudel tempo
        if (this.strudelInstance && this.strudelInstance.evaluate) {
            try {
                const tempoCode = `setcps(${this.globalEffects.tempo}/120)`;
                this.strudelInstance.evaluate(tempoCode);
            } catch (error) {
                console.warn('Could not update tempo:', error);
            }
        }
        
        // Update beat interval
        if (this.beatInterval) {
            clearInterval(this.beatInterval);
            this.beatInterval = setInterval(() => {
                this.updateBeatIndicator();
            }, (60 / this.globalEffects.tempo) * 250);
        }
    }
    
    updateVolumeDisplay(element, value) {
        element.textContent = `${value}%`;
    }
    
    updateTempoDisplay(element, value) {
        element.textContent = `${value} BPM`;
    }
    
    updateEffectDisplay(element, value) {
        element.textContent = `${value}%`;
    }
    
    updateVolumeDisplays() {
        // Initialize all volume displays
        document.querySelectorAll('.track-volume-slider').forEach(slider => {
            const display = slider.nextElementSibling;
            this.updateVolumeDisplay(display, slider.value);
        });
        
        const masterVolume = document.getElementById('masterVolume');
        this.updateVolumeDisplay(masterVolume.nextElementSibling, masterVolume.value);
        
        const tempoSlider = document.getElementById('tempoSlider');
        this.updateTempoDisplay(tempoSlider.nextElementSibling, tempoSlider.value);
    }
    
    updateEffectDisplays() {
        const reverbSlider = document.getElementById('reverbSlider');
        this.updateEffectDisplay(reverbSlider.nextElementSibling, reverbSlider.value);
        
        const delaySlider = document.getElementById('delaySlider');
        this.updateEffectDisplay(delaySlider.nextElementSibling, delaySlider.value);
        
        const filterSlider = document.getElementById('filterSlider');
        this.updateEffectDisplay(filterSlider.nextElementSibling, filterSlider.value);
    }
    
    toggleCodeEditor() {
        const codeEditor = document.getElementById('codeEditor');
        const toggleBtn = document.getElementById('toggleCodeBtn');
        const controlBtns = document.querySelectorAll('.code-control-btn');
        
        this.codeEditorVisible = !this.codeEditorVisible;
        
        if (this.codeEditorVisible) {
            codeEditor.classList.add('visible');
            toggleBtn.textContent = 'Hide Code';
            controlBtns.forEach(btn => btn.classList.add('visible'));
        } else {
            codeEditor.classList.remove('visible');
            toggleBtn.textContent = 'Show Code';
            controlBtns.forEach(btn => btn.classList.remove('visible'));
        }
    }
    
    updateCode() {
        const newCode = document.getElementById('strudelCode').value;
        
        if (this.strudelInstance && this.strudelInstance.evaluate) {
            try {
                this.strudelInstance.evaluate(newCode);
                console.log('Code updated successfully');
                this.showNotification('Code updated successfully!', 'success');
            } catch (error) {
                console.error('Error updating code:', error);
                this.showNotification('Error updating code: ' + error.message, 'error');
            }
        } else {
            this.showNotification('Strudel instance not available. Copy code to strudel.cc to run.', 'info');
        }
    }
    
    resetCode() {
        document.getElementById('strudelCode').value = this.strudelCode;
        this.updateCode();
        this.showNotification('Code reset to original', 'info');
    }
    
    exportCode() {
        const code = document.getElementById('strudelCode').value;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'prodigy-everybody-strudel.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Code exported successfully!', 'success');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        // Set background color based on type
        const colors = {
            success: '#00ff88',
            error: '#ff4444',
            info: '#0088ff',
            warning: '#ffaa00'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.style.color = ['success', 'warning'].includes(type) ? '#000' : '#fff';
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.prodigyApp = new ProdigyStrudelApp();
});

// Handle Strudel embed loading
window.addEventListener('load', () => {
    // Give extra time for Strudel to load
    setTimeout(() => {
        if (window.prodigyApp && !window.prodigyApp.strudelInstance) {
            window.prodigyApp.initializeStrudel();
        }
    }, 2000);
});