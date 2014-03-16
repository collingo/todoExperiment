#!/bin/bash

grunt build
forever restart server/index.js