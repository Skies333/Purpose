"""Junta os ficheiros de src/ num único index.html na raiz do repositório.
Uso: python3 src/build.py"""
from pathlib import Path
src = Path(__file__).parent
t = (src / 'template.html').read_text(encoding='utf-8')
for k, f in [('ENGINE', 'engine.js'), ('DATA', 'data.js'), ('GYM', 'gym.js'), ('CLOUD', 'cloud.js'), ('APP', 'app.js')]:
    t = t.replace(f'/*{k}*/', (src / f).read_text(encoding='utf-8'))
(src.parent / 'index.html').write_text(t, encoding='utf-8')
print('index.html atualizado')
