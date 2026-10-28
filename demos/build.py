import os
from jinja2 import Environment, FileSystemLoader
env = Environment(loader=FileSystemLoader('templates'), autoescape=True,
  trim_blocks=True, lstrip_blocks=True)

demos = [{
  "title": 'canvas LEDs',
  "dir" : 'leds',
  "theme": "dark1",
  "highlight_theme" : "monokai"
}, {
  "title": 'Hello World',
  "dir" : 'helloworld',
  "theme": "dark2",
  "highlight_theme" : "monokai" 
}, {
  "title": 'CSS Cubes!',
  "dir" : 'css3d'
}]

for demo in demos:
  with open( demo["dir"] + '/demo.js', 'r') as f:
    code = f.read()

  template = env.get_template('demo.html')

  # css theme
  theme = demo.get("theme")
  highlight_theme = demo.get("highlight_theme")

  # only link a demo-specific stylesheet if there is one
  local_css = os.path.exists(demo["dir"] + '/demo.css')

  html = template.render(title=demo["title"], code=code, theme=theme,
    highlight_theme=highlight_theme, local_css=local_css)

  with open(demo["dir"] + '/index.html', 'w') as f3:
    f3.write(html)
