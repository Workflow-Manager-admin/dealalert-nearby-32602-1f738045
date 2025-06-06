#!/bin/bash
cd /home/kavia/workspace/code-generation/dealalert-nearby-32602-1f738045/dealalert_nearby
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

