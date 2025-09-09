sudo dnf install wl-clipboard
set -g mouse on

# Copy to clipboard automatically on mouse selection
bind -T copy-mode-vi MouseDragEnd1Pane send-keys -X copy-pipe-and-cancel "wl-copy"
bind -T copy-mode MouseDragEnd1Pane send-keys -X copy-pipe-and-cancel "wl-copy"