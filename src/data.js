/* ===== Treinos ===== */
// item: [exercício, 't' (segundos) | 'r' (repetições), quantidade, porLado?]
const WORKOUTS = [
  { id: 'brutal', name: 'Corpo Inteiro Brutal', cat: 'Corpo inteiro', rounds: 4, rest: 20, roundRest: 75, rate: 10,
    desc: 'Circuito pesado que mistura força e cardio. Treina tudo: peito, costas, pernas, ombros e core. Ideal para dias em que tens 40 minutos e energia.',
    items: [['burpee', 't', 40], ['pushup', 'r', 15], ['jumpsquat', 't', 40], ['row', 'r', 12], ['lunges', 'r', 20], ['pike', 'r', 10], ['climbers', 't', 40], ['plank', 't', 45]] },
  { id: 'push', name: 'Peito, Ombros & Tríceps', cat: 'Parte de cima', rounds: 4, rest: 45, roundRest: 90, rate: 7,
    desc: 'Volume alto de empurrar para hipertrofia. Começa pelas variantes mais difíceis e acaba com flexões até à falha.',
    items: [['decline', 'r', 12], ['wide', 'r', 15], ['pike', 'r', 10], ['diamond', 'r', 12], ['dips', 'r', 15], ['pushup', 'r', 'MÁX']] },
  { id: 'pull', name: 'Costas & Postura', cat: 'Parte de cima', rounds: 4, rest: 40, roundRest: 90, rate: 6,
    desc: 'Costas largas sem barra: remadas debaixo da mesa, extensões e trabalho de omoplatas. Equilibra o volume de flexões e melhora a postura.',
    items: [['row', 'r', 12], ['superman', 'r', 15], ['yraise', 'r', 12], ['row', 'r', 10], ['hollow', 't', 30]] },
  { id: 'legs', name: 'Pernas & Glúteos', cat: 'Pernas', rounds: 4, rest: 40, roundRest: 90, rate: 8,
    desc: 'Pernas fortes com o peso do corpo: búlgaros e trabalho unilateral para compensar a falta de carga, mais isometria para queimar.',
    items: [['squat', 'r', 20], ['bulgarian', 'r', 10, 1], ['lunges', 'r', 20], ['bridge1', 'r', 12, 1], ['wallsit', 't', 45], ['calf', 'r', 25], ['jumpsquat', 't', 30]] },
  { id: 'upper', name: 'Parte de Cima Completa', cat: 'Parte de cima', rounds: 4, rest: 30, roundRest: 75, rate: 7,
    desc: 'Peito, costas, ombros e braços na mesma sessão. Alterna empurrar e puxar para descansares um músculo enquanto treinas outro.',
    items: [['pushup', 'r', 15], ['row', 'r', 12], ['pike', 'r', 10], ['superman', 'r', 15], ['dips', 'r', 15], ['diamond', 'r', 12]] },
  { id: 'core', name: 'Core de Aço', cat: 'Core', rounds: 3, rest: 20, roundRest: 60, rate: 6,
    desc: 'Abdominais definidos e core forte. Combina movimento e isometria para trabalhar todas as camadas.',
    items: [['crunch', 'r', 20], ['legraise', 'r', 15], ['climbers', 't', 40], ['hollow', 't', 30], ['plank', 't', 60]] },
  { id: 'hiit', name: 'HIIT Queima Total', cat: 'HIIT', rounds: 4, rest: 20, roundRest: 60, rate: 12,
    desc: '40 s a fundo, 20 s de descanso. Queima gordura e melhora o cardio sem perder massa muscular.',
    items: [['burpee', 't', 40], ['jacks', 't', 40], ['highknees', 't', 40], ['jumpsquat', 't', 40], ['climbers', 't', 40]] },
  { id: 'express', name: 'Expresso 15 min', cat: 'Corpo inteiro', rounds: 3, rest: 15, roundRest: 45, rate: 9,
    desc: 'Pouco tempo? Corpo inteiro em 15 minutos para não falhar o dia.',
    items: [['pushup', 'r', 12], ['squat', 'r', 20], ['climbers', 't', 30], ['row', 'r', 10], ['plank', 't', 40]] },
  { id: 'legsx', name: 'Pernas Explosivas', cat: 'Pernas', rounds: 4, rest: 30, roundRest: 75, rate: 10,
    desc: 'Potência e resistência nas pernas com saltos, afundos laterais e sumo.',
    items: [['jumpsquat', 't', 30], ['lateral', 'r', 16], ['sumo', 'r', 20], ['lunges', 'r', 20], ['calf', 'r', 30]] },
  { id: 'mobility', name: 'Mobilidade & Recuperação', cat: 'Mobilidade', rounds: 2, rest: 10, roundRest: 20, rate: 3,
    desc: 'Sessão leve para os dias de descanso. Solta a anca, os ombros e a coluna para treinares melhor amanhã.',
    items: [['dog', 't', 45], ['hipflex', 't', 40, 1], ['cobra', 't', 30], ['bridge', 'r', 15], ['sumo', 'r', 12]] },
];
const WMAP = Object.fromEntries(WORKOUTS.map(w => [w.id, w]));
const CATS = ['Todos', 'Corpo inteiro', 'Parte de cima', 'Pernas', 'Core', 'HIIT', 'Mobilidade'];

const LEVELS = [
  { id: 'int', label: 'Intermédio', k: .75, dr: -1, rk: 1.25 },
  { id: 'av', label: 'Avançado', k: 1, dr: 0, rk: 1 },
  { id: 'br', label: 'Brutal', k: 1.25, dr: 1, rk: .8 },
];

// Plano semanal (0 = domingo)
const PLAN = {
  1: { w: 'push', focus: 'Empurrar' },
  2: { w: 'legs', focus: 'Pernas' },
  3: { w: 'pull', focus: 'Puxar + core', extra: 'core' },
  4: { w: 'hiit', focus: 'Cardio + mobilidade', extra: 'mobility' },
  5: { w: 'brutal', focus: 'Corpo inteiro' },
  6: { w: 'upper', focus: 'Parte de cima' },
  0: { w: 'mobility', focus: 'Descanso ativo' },
};
const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const DAYS_S = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

// Aquecimento e alongamento automáticos: [exercício, segundos, porLado?]
const WARMUP = [['jacks', 30], ['armcircles', 30], ['squat', 30], ['highknees', 20]];
const COOLDOWN = [['child', 30], ['cobra', 25], ['dog', 30], ['hipflex', 40, 1]];
const PUSH_EX = ['pushup', 'wide', 'diamond', 'decline', 'pike'];
const LEG_EX = ['squat', 'sumo', 'bulgarian', 'lunges', 'lateral'];

/* ===== Ginásio ===== */
// item: [exercício, 'r', reps, porLado, séries]
WORKOUTS.push(
  { id: 'gpush', place: 'gym', mode: 'sets', name: 'Peito & Tríceps', cat: 'Peito & Tríceps', rest: 90, roundRest: 120, rate: 6,
    desc: 'Dia de empurrar: supino pesado primeiro, depois inclinado, dips e isolamento de ombros e tríceps.',
    items: [['bench', 'r', 8, 0, 4], ['incline', 'r', 10, 0, 3], ['dipsbar', 'r', 10, 0, 3], ['ohpress', 'r', 10, 0, 3], ['lateralraise', 'r', 15, 0, 3], ['pushdown', 'r', 12, 0, 3]] },
  { id: 'gpull', place: 'gym', mode: 'sets', name: 'Costas & Bíceps', cat: 'Costas & Bíceps', rest: 90, roundRest: 120, rate: 6,
    desc: 'Dia de puxar para costas largas e grossas: elevações, puxadas, remadas e bíceps no fim.',
    items: [['pullup', 'r', 'MÁX', 0, 3], ['barrow', 'r', 8, 0, 4], ['pulldown', 'r', 10, 0, 3], ['cablerow', 'r', 12, 0, 3], ['curl', 'r', 10, 0, 3], ['hangleg', 'r', 12, 0, 3]] },
  { id: 'glegs', place: 'gym', mode: 'sets', name: 'Pernas Completas', cat: 'Pernas', rest: 120, roundRest: 120, rate: 7,
    desc: 'Agachamento pesado, leg press, posteriores e glúteos. O dia mais duro da semana, e o que mais faz crescer.',
    items: [['bbsquat', 'r', 8, 0, 4], ['legpress', 'r', 12, 0, 3], ['rdl', 'r', 10, 0, 3], ['hipthrust', 'r', 10, 0, 3], ['legext', 'r', 15, 0, 3], ['dblunge', 'r', 10, 1, 2]] },
  { id: 'gupper', place: 'gym', mode: 'sets', name: 'Parte de Cima', cat: 'Parte de cima', rest: 90, roundRest: 120, rate: 6,
    desc: 'Peito, costas, ombros e braços numa só sessão, com os básicos pesados primeiro.',
    items: [['bench', 'r', 8, 0, 4], ['barrow', 'r', 8, 0, 4], ['ohpress', 'r', 10, 0, 3], ['pulldown', 'r', 10, 0, 3], ['curl', 'r', 12, 0, 2], ['pushdown', 'r', 12, 0, 2]] },
  { id: 'gfull', place: 'gym', mode: 'sets', name: 'Corpo Inteiro', cat: 'Corpo inteiro', rest: 90, roundRest: 120, rate: 7,
    desc: 'Os grandes exercícios compostos numa sessão. Ótimo para dias com pouco tempo ou semanas com menos treinos.',
    items: [['bbsquat', 'r', 8, 0, 3], ['bench', 'r', 8, 0, 3], ['barrow', 'r', 8, 0, 3], ['ohpress', 'r', 10, 0, 3], ['rdl', 'r', 10, 0, 3], ['hangleg', 'r', 12, 0, 3]] },
  { id: 'garms', place: 'gym', mode: 'sets', name: 'Ombros & Braços', cat: 'Ombros & Braços', rest: 75, roundRest: 90, rate: 5,
    desc: 'Ombros redondos e braços cheios: press, elevações laterais, bíceps e tríceps com muito volume.',
    items: [['ohpress', 'r', 10, 0, 4], ['lateralraise', 'r', 15, 0, 4], ['curl', 'r', 12, 0, 3], ['pushdown', 'r', 12, 0, 3], ['dipsbar', 'r', 'MÁX', 0, 3]] },
);
WORKOUTS.forEach(w => { w.place = w.place || 'casa'; WMAP[w.id] = w; });
const CATS_GYM = ['Todos', 'Corpo inteiro', 'Parte de cima', 'Peito & Tríceps', 'Costas & Bíceps', 'Ombros & Braços', 'Pernas'];
const PLAN_GYM = {
  1: { w: 'gpush', focus: 'Empurrar' },
  2: { w: 'gpull', focus: 'Puxar' },
  3: { w: 'glegs', focus: 'Pernas' },
  4: { w: 'mobility', focus: 'Descanso ativo' },
  5: { w: 'gupper', focus: 'Parte de cima' },
  6: { w: 'gfull', focus: 'Corpo inteiro', extra: 'garms' },
  0: { w: 'mobility', focus: 'Descanso ativo' },
};
const BODYWEIGHT = ['pullup', 'dipsbar', 'hangleg'];
