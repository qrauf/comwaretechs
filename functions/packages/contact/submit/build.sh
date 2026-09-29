#!/usr/bin/env bash
set -euo pipefail
composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader
