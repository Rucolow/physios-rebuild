#!/usr/bin/env bash
# 既存の Rucolow/physios のマイグレーションと seeds（清水の実データ一式）を作業用の空の DB に入れる。
# import-shimizu.sh の写し元を作るためだけに使う。本番の DB には向けない。
#
#   bash scripts/build-source-db.sh /path/to/physios "postgres://.../source"
set -euo pipefail
repo="$1"; url="$2"
cd "$repo"
P=(psql "$url" -v ON_ERROR_STOP=1 -q)
"${P[@]}" < scripts/lib/auth-stub.sql
for f in supabase/migrations/*.sql; do "${P[@]}" < "$f" > /dev/null; done
"${P[@]}" < supabase/seed.sql > /dev/null
# shellcheck disable=SC1091
source scripts/lib/shimizu-seeds.sh
apply_shimizu_seeds "${P[@]}" > /dev/null
echo "source db ready"
