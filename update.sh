#!/bin/bash

git pull
grunt build
forever restart server/index.js