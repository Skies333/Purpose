# purpose

App web de treino para casa e ginásio, com bonecos animados a demonstrar cada exercício, temporizador com voz, plano semanal, registo de cargas, medalhas e progresso.

**Abrir:** https://skies333.github.io/purpose/

No telemóvel, adiciona ao ecrã principal (Safari › Partilhar › Adicionar ao ecrã principal) para abrir em ecrã inteiro, como uma app.

## O que tem

- Modo **Em casa** (sem equipamento) e **Ginásio** (barras, halteres e máquinas)
- 16 treinos e mais de 50 exercícios animados
- Temporizador com voz em português, som de fim de exercício e tempo-limite nas repetições
- Aquecimento e alongamento automáticos
- Registo de cargas e recordes pessoais no ginásio
- Plano semanal, progresso, peso corporal e 22 medalhas
- Calculadora de proteína, calorias e água

O progresso fica guardado no navegador de cada pessoa.

## Estrutura

| Pasta / ficheiro | O que é |
| --- | --- |
| `index.html` | A app completa (gerada a partir de `src/`) |
| `manifest.webmanifest`, `icon-*.png` | Ícone e modo ecrã inteiro no telemóvel |
| `src/` | Código-fonte: motor de animação, exercícios, treinos e app |
| `brand/` | Logo em SVG e PNG, ícone e versões animadas (MP4, GIF, SVG) |

Para alterar a app, edita os ficheiros em `src/` e corre:

```
python3 src/build.py
```
