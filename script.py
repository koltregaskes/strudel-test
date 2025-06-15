# Let me start by organizing all the information I've gathered and create the Strudel code structure

# Key information about "The Prodigy - Everybody's in the Place":
track_info = {
    "tempo": 131,  # BPM
    "key": "C♯/D♭ major",
    "style": "Breakbeat/Hardcore",
    "duration": "3:33",
    "main_vocal_sample": "Everybody is in the place - from MC Duke & Merlin - Freestyle Part 2",
    "structure": "Intro, Main breaks, Buildup, Drop, Breakdown, Outro"
}

print("Track Analysis for Strudel Recreation:")
print("=====================================")
for key, value in track_info.items():
    print(f"{key.replace('_', ' ').title()}: {value}")

# Convert BPM to Strudel cycles per minute (cpm)
# Strudel uses cycles per minute, where 1 cycle = 4 beats in 4/4 time
# So 131 BPM = 131/4 = 32.75 cycles per minute
cpm = 131 / 4
print(f"\nStrudel CPC (Cycles Per Minute): {cpm}")

# Sample sources I can use
sample_sources = [
    "Built-in Strudel samples (drum machines)",
    "GitHub: tidalcycles/dirt-samples",
    "Public domain samples from archive.org",
    "Creative Commons samples from freesound.org",
    "Roland drum machine samples"
]

print(f"\nAvailable Sample Sources:")
for i, source in enumerate(sample_sources, 1):
    print(f"{i}. {source}")