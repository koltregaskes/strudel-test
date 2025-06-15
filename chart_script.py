import plotly.graph_objects as go
import pandas as pd

# Parse the data with the specific colors provided
data = [
  {"section": "Intro", "start": 0, "end": 15, "description": "Building tension", "color": "#FF6B35"},
  {"section": "Main", "start": 15, "end": 90, "description": "Full breakbeat with bass and stabs", "color": "#2196F3"},
  {"section": "Breakdown", "start": 90, "end": 120, "description": "Stripped to breaks and vocal", "color": "#9C27B0"},
  {"section": "Build", "start": 120, "end": 150, "description": "Adding layers with effects", "color": "#FF9800"},
  {"section": "Climax", "start": 150, "end": 195, "description": "Full arrangement", "color": "#4CAF50"},
  {"section": "Outro", "start": 195, "end": 213, "description": "Gradual fade with echoes", "color": "#F44336"}
]

# Create a DataFrame
df = pd.DataFrame(data)

# Create figure
fig = go.Figure()

# Add the bars for each section using the provided colors
for i, row in df.iterrows():
    fig.add_trace(go.Bar(
        x=[row['end'] - row['start']],  # Duration
        y=[row['section']],
        orientation='h',
        name=row['section'],
        marker_color=row['color'],
        text=f"{row['start']}-{row['end']}s",  # Time range as text
        textposition='inside',
        insidetextanchor='middle',
        textfont=dict(color='white', size=12),  # White text for better contrast
        base=row['start'],  # Start position
        hovertemplate=f"<b>{row['section']}</b><br>{row['start']}-{row['end']}s<br>{row['description']}<extra></extra>"
    ))

# Update layout with dark theme for electronic music aesthetic
fig.update_layout(
    title="The Prodigy Track Structure",
    barmode='overlay',
    showlegend=False,
    plot_bgcolor='#1a1a1a',  # Dark background
    paper_bgcolor='#0d0d0d',  # Even darker paper background
    font=dict(color='white')  # White text for all labels
)

# Update axes with dark theme styling
fig.update_xaxes(
    title="Time (sec)", 
    range=[0, 213], 
    tickvals=[0, 30, 60, 90, 120, 150, 180, 210],
    gridcolor='#444444',  # Dark grid lines
    linecolor='white',
    tickcolor='white'
)

fig.update_yaxes(
    categoryorder='array',
    categoryarray=df['section'].tolist()[::-1],  # Reverse order to get Intro at top
    gridcolor='#444444',  # Dark grid lines
    linecolor='white',
    tickcolor='white'
)

# Save the figure
fig.write_image("track_timeline.png")
fig