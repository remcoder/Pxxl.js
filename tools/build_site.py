"""Build the GitHub Pages site into _site/.

Layout:
  site/     legacy assets that can't be regenerated (old versioned builds,
            images, landing page); copied first, kept so old URLs keep working
  demos/    current demos, copied over it
  dist/     the current build (run `npm run build` first)
  fonts/    copied to the root and to the legacy per-demo font folders;
            also zipped as fonts.zip
"""
import os
import shutil
import zipfile

root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
out = os.path.join(root, "_site")


def src(*p):
    return os.path.join(root, *p)


def dest(*p):
    return os.path.join(out, *p)


shutil.rmtree(out, ignore_errors=True)
shutil.copytree(src("site"), out)

shutil.copytree(src("demos"), dest("demos"), dirs_exist_ok=True,
                ignore=shutil.ignore_patterns("templates", "build.py", "__pycache__"))

shutil.copytree(src("dist"), dest("dist"))

# the landing page and the old demo pages expect these at the site root
for name in ("highlight.css", "monokai.css", "highlight.pack.js"):
    shutil.copy(src("demos", name), dest(name))

# fonts at the root, plus the per-demo locations older pages point to
for target in ("fonts", "demos/interactive/fonts", "demos/fireworks/fonts"):
    shutil.copytree(src("fonts"), dest(target), ignore=shutil.ignore_patterns("json"))

with zipfile.ZipFile(dest("fonts.zip"), "w", zipfile.ZIP_DEFLATED) as z:
    for folder, _, files in sorted(os.walk(src("fonts"))):
        for f in sorted(files):
            path = os.path.join(folder, f)
            rel = os.path.relpath(path, src("fonts"))
            if rel.startswith("json"):
                continue
            z.write(path, os.path.join("fonts", rel))

print("built", out)
