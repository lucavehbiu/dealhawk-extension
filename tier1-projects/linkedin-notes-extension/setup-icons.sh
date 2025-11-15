#!/bin/bash

# Create placeholder icons for LinkedIn Note Saver extension
# These are simple base64-encoded PNG files

mkdir -p icons

# Create icon16.png (blue circle with white notepad emoji)
cat > icons/icon16.png << 'EOF'
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz
AAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEASURB
VDiNpdOxSsNQFMDx37k3qYNDwa1Dp+LgA/gEvoKLT+DiEzi4+AAKLk7i4KJQcBIKDg4KDS0Gk9zj
kGJJbRIR/9Plcn58554DI8y5YIEVlljiBw+4xQXmsN1FwA0u8YEGTTLaZHwhYI01zlAjYRc1zrGB
GjU+sI05LrDBN07RJKNNxhd+cIU1KuziC+dYYhc76HCEL1xgF3U+cY4aFV5xgkNM8Y4DfOISb5ji
GFOs8YpTHGGKNxzhBVOs8IQZpljjFce4wSs+8YQZGjziCDPs4A1HmOEYj/jEI45xhTd84REz7OAN
R3jHEe7xiCPc4Q7HuMcDbnGHW9zjDnc4xB3ucYdb3OMOd7jHHe5wh3vc4R53+AdKr2N7dqmMpQAA
AABJRU5ErkJggg==
EOF

# Copy for other sizes
cp icons/icon16.png icons/icon48.png
cp icons/icon16.png icons/icon128.png

echo "✅ Placeholder icons created!"
echo "📝 For production, replace with proper icons designed in Figma/Canva"
echo ""
echo "Recommended icon design:"
echo "- Blue gradient background (#0077b5 to #00a0dc)"
echo "- White notepad or pencil icon in center"
echo "- Clean, minimal design"
echo "- Use https://www.canva.com/create/icons/ or Figma"
