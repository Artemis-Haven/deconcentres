#!/usr/bin/env bash
# Construit la version en ligne du site dans _site/ :
# JS regroupé et minifié, CSS minifié, liens versionnés contre les vieux caches.
# Usage local : bash .github/build.sh
set -euo pipefail

cd "$(dirname "$0")/.."

ESBUILD="npx --yes esbuild@0.25.0"
OUT="_site"
VERSION="$(git rev-parse --short=8 HEAD 2>/dev/null || date +%s)"

rm -rf "$OUT"
mkdir -p "$OUT"

# Fichiers du site, sans les sources JS (remplacées par les bundles) ni les fichiers de travail
rsync -a \
    --exclude ".git" --exclude ".github" --exclude ".gitignore" --exclude ".vscode" \
    --exclude ".DS_Store" --exclude ".claude" --exclude "communication" --exclude "$OUT" \
    --exclude "js" --exclude "style.css" \
    ./ "$OUT/"

# JS : un fichier par page d'entrée, modules inclus
$ESBUILD js/main.js js/site.js js/contact.js \
    --bundle --minify --format=esm --outdir="$OUT/js" --log-level=warning

# CSS : minifié, puis intégré dans chaque page (plus de requête bloquante).
# style.css reste publié pour les pages HTML encore en cache.
$ESBUILD style.css --minify --outfile="$OUT/style.css" --log-level=warning

# HTML : CSS intégré (chemins absolus, la 404 pouvant être servie à n'importe quelle adresse),
# préchargement du bundle du jeu, et liens JS versionnés pour contourner le cache
for page in "$OUT"/*.html; do
    CSS_FILE="$OUT/style.css" perl -0pi -e '
        BEGIN { local $/; open my $f, "<", $ENV{CSS_FILE} or die; $css = <$f>; $css =~ s/\s+\z//; $css =~ s{url\(("?)assets/}{url($1/assets/}g; }
        s{(\n(\s*)<link rel="stylesheet" href="/?style\.css">)}{$1\n$2<link rel="modulepreload" href="js/main.js">} if /src="js\/main\.js"/;
        s{<link rel="stylesheet" href="/?style\.css">}{<style>$css</style>};
        s{(src="/?js/[a-z]+\.js|href="js/main\.js)"}{$1?v='"$VERSION"'"}g;
    ' "$page"
done

echo "Site construit dans $OUT/ (version $VERSION)"
