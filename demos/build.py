from jinja2 import Environment, FileSystemLoader
env = Environment(loader=FileSystemLoader('templates'), 
  extensions=['jinja2.ext.autoescape'],
  autoescape=True)

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
  theme = demo["theme"] if demo.has_key("theme") else None
  highlight_theme = demo["highlight_theme"] if demo.has_key("highlight_theme") else None

  html = template.render(title=demo["title"], 
    code=code, theme=theme, highlight_theme=highlight_theme)

  with open(demo["dir"] + '/index.html', 'w') as f3:
    f3.write(html)
