#!/usr/bin/env bash
cd frontend
npm run build
cd ..
gcloud app deploy -q
gcloud app browse