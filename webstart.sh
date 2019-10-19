#!/bin/bash
SESSION=$USER

cp ./config_devl.yml aiweb/config.yml
cp ./config_devl.yml aiserver/config.yml
tmux new-session -d -s $SESSION

# Setup a window for tailing log files
tmux rename-window -t 1 react
tmux send-keys "cd appserver" C-m
tmux send-keys "yarn start" C-m
tmux new-window -t $SESSION -n "aiweb"
tmux send-keys "cd aiweb" C-m
#tmux send-keys "nvm use
tmux send-keys "node app.js" C-m
tmux new-window -t $SESSION -n "aiserver"
tmux send-keys "cd aiserver" C-m
tmux send-keys "a" C-m
tmux send-keys "python aiserver.py" C-m

# Set default window
tmux select-window -t $SESSION:1

# Attach to session
tmux attach-session -t $SESSION
