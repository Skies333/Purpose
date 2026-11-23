/* ===== Treinos ===== */
// item: [exercício, 't' (segundos) | 'r' (repetições), quantidade, porLado?]
const WORKOUTS = [
  /* — força / hipertrofia em casa: séries direitas, [exercício, modo, quantidade, porLado, séries, descanso] — */
  { id: 'push', mode: 'sets', name: 'Peito, Ombros & Tríceps', cat: 'Parte de cima', rest: 75, roundRest: 90, rate: 6,
    desc: 'Dia de empurrar a sério. Começa pelo mais pesado (declinadas e arqueiro), passa aos ombros com o pike elevado e acaba nos tríceps perto da falha. Séries direitas e descanso a sério: é assim que se cresce sem pesos.',
    items: [['decline', 'r', 10, 0, 4, 90], ['archer', 'r', 6, 1, 3, 90], ['pikeelev', 'r', 8, 0, 3, 90], ['wide', 'r', 12, 0, 3, 60], ['dips', 'r', 12, 0, 3, 60], ['diamond', 'r', 'MÁX', 0, 2, 60]] },
  { id: 'pull', mode: 'sets', name: 'Costas & Bíceps', cat: 'Parte de cima', rest: 75, roundRest: 90, rate: 6,
    desc: 'Sem barra, as costas são o ponto fraco de quem treina em casa. Aqui puxas tanto como empurras: remadas com uma mochila cheia de livros, puxadas no chão e bíceps no fim. Equilibra os ombros e endireita a postura.',
    items: [['bagrow', 'r', 12, 0, 4, 90], ['bagrow1', 'r', 10, 1, 3, 75], ['wpull', 'r', 12, 0, 3, 60], ['bagcurl', 'r', 12, 0, 3, 60], ['backwidow', 'r', 12, 0, 3, 45], ['superman', 'r', 15, 0, 2, 45]] },
  { id: 'legs', mode: 'sets', name: 'Pernas · Quadríceps', cat: 'Pernas', rest: 75, roundRest: 90, rate: 7,
    desc: 'Sem carga, o segredo está no trabalho a uma perna: búlgaros e subidas à cadeira põem o peso do corpo todo numa perna de cada vez. Acaba com isometria e gémeos.',
    items: [['bulgarian', 'r', 10, 1, 4, 90], ['stepup', 'r', 12, 1, 3, 75], ['squat', 'r', 20, 0, 3, 60], ['slrdl', 'r', 10, 1, 3, 60], ['wallsit', 't', 45, 0, 2, 60], ['calf', 'r', 20, 0, 3, 45]] },
  { id: 'legs2', mode: 'sets', name: 'Posteriores & Glúteos', cat: 'Pernas', rest: 75, roundRest: 90, rate: 7,
    desc: 'O segundo dia de pernas, focado na parte de trás: glúteos e isquiotibiais. Protege os joelhos, dá forma às pernas e ajuda no sprint. O nordic curl é dos melhores exercícios que existem, com ou sem ginásio.',
    items: [['sofathrust', 'r', 15, 0, 4, 75], ['nordic', 'r', 5, 0, 3, 120], ['slidercurl', 'r', 10, 0, 3, 60], ['pistolbox', 'r', 8, 1, 3, 75], ['cossack', 'r', 8, 1, 2, 60], ['bridge1', 'r', 12, 1, 2, 45]] },
  { id: 'upper', mode: 'sets', name: 'Parte de Cima Completa', cat: 'Parte de cima', rest: 75, roundRest: 90, rate: 6,
    desc: 'Segunda sessão da semana para o tronco, com variantes diferentes das de segunda e quarta. Alterna empurrar e puxar para descansares um lado enquanto trabalhas o outro.',
    items: [['pseudoplanche', 'r', 8, 0, 3, 90], ['bagrow', 'r', 12, 0, 3, 90], ['pike', 'r', 10, 0, 3, 75], ['bagrow1', 'r', 10, 1, 3, 75], ['sphinx', 'r', 10, 0, 3, 60], ['bagcurl', 'r', 'MÁX', 0, 2, 60]] },
  { id: 'arms', mode: 'sets', name: 'Ombros & Braços', cat: 'Parte de cima', rest: 60, roundRest: 75, rate: 5,
    desc: 'Sessão extra para ombros cheios e braços. Faz num dia mais leve ou no lugar de um treino quando queres foco nos braços.',
    items: [['pikeelev', 'r', 8, 0, 3, 90], ['bagcurl', 'r', 12, 0, 3, 60], ['diamond', 'r', 12, 0, 3, 60], ['bagrow', 'r', 12, 0, 3, 60], ['sphinx', 'r', 10, 0, 3, 60], ['yraise', 'r', 12, 0, 3, 45]] },
  /* — condicionamento: circuitos por voltas, [exercício, 't' (segundos) | 'r' (repetições), quantidade, porLado?] — */
  { id: 'brutal', name: 'Corpo Inteiro Brutal', cat: 'Corpo inteiro', rounds: 4, rest: 20, roundRest: 75, rate: 10,
    desc: 'Circuito de corpo inteiro para dias com energia e 40 minutos. Força e cardio misturados, quase sem pausas. É condicionamento: complementa os dias de força, não os substitui.',
    items: [['burpee', 't', 40], ['pushup', 'r', 15], ['jumpsquat', 't', 40], ['bagrow', 'r', 12], ['jumplunge', 't', 30], ['pike', 'r', 10], ['climbers', 't', 40], ['hollow', 't', 30]] },
  { id: 'power', name: 'Potência Atlética', cat: 'Corpo inteiro', rounds: 4, rest: 40, roundRest: 90, rate: 9,
    desc: 'Saltos e explosão para ficares mais rápido e atlético. Qualidade acima de cansaço: cada repetição a 100 %, com descanso completo.',
    items: [['plyopush', 'r', 8], ['tuckjump', 'r', 8], ['jumplunge', 'r', 12], ['skater', 'r', 12], ['bearcrawl', 't', 30]] },
  { id: 'express', name: 'Expresso 15 min', cat: 'Corpo inteiro', rounds: 3, rest: 15, roundRest: 45, rate: 9,
    desc: 'Pouco tempo? Corpo inteiro em 15 minutos para não falhar o dia. Mais vale isto do que nada.',
    items: [['pushup', 'r', 12], ['squat', 'r', 20], ['bagrow', 'r', 12], ['climbers', 't', 30], ['plank', 't', 40]] },
  { id: 'core', name: 'Core de Aço', cat: 'Core', rounds: 3, rest: 20, roundRest: 60, rate: 6,
    desc: 'Trabalha as quatro funções do core: dobrar (V-ups), rodar (bicicleta), resistir à rotação (toques no ombro, prancha lateral) e resistir à extensão (dead bug, hollow). Os abdominais aparecem com a alimentação; a força faz-se aqui.',
    items: [['deadbug', 'r', 12], ['vup', 'r', 12], ['sideplank', 't', 30, 1], ['bicycle', 'r', 20], ['shouldertaps', 'r', 20], ['hollow', 't', 30]] },
  { id: 'hiit', name: 'HIIT Queima Total', cat: 'HIIT', rounds: 3, rest: 20, roundRest: 60, rate: 12,
    desc: '40 s a fundo, 20 s de descanso. Queima calorias e melhora o cardio sem roubar músculo. Duas vezes por semana chega; mais do que isso atrapalha a recuperação das pernas.',
    items: [['burpee', 't', 40], ['skater', 't', 40], ['highknees', 't', 40], ['squatthrust', 't', 40], ['jumplunge', 't', 40], ['climbers', 't', 40]] },
  { id: 'tabata', name: 'Tabata 8 min', cat: 'HIIT', rounds: 8, rest: 10, roundRest: 10, rate: 13,
    desc: 'O protocolo Tabata: 20 s no máximo, 10 s de pausa, 8 voltas. Curto e brutal. Ótimo como final de um treino de força ou num dia sem tempo.',
    items: [['jumpsquat', 't', 20], ['climbers', 't', 20]] },
  { id: 'legsx', name: 'Pernas Explosivas', cat: 'Pernas', rounds: 4, rest: 30, roundRest: 75, rate: 10,
    desc: 'Potência e resistência nas pernas com saltos, afundos laterais e sumo. Bom como segundo estímulo de pernas numa semana com pouco tempo.',
    items: [['jumpsquat', 't', 30], ['lateral', 'r', 16], ['jumplunge', 't', 30], ['sumo', 'r', 20], ['skater', 't', 30], ['calf', 'r', 30]] },
  { id: 'mobility', name: 'Mobilidade & Recuperação', cat: 'Mobilidade', rounds: 1, rest: 10, roundRest: 20, rate: 3,
    desc: 'Sessão leve para os dias de descanso. Solta ancas, ombros e coluna: treinas melhor amanhã e afastas lesões. Também serve depois de um treino, se tiveres tempo.',
    items: [['catcow', 't', 40], ['wgs', 't', 30, 1], ['hipflex', 't', 30, 1], ['squathold', 't', 45], ['hamstretch', 't', 40], ['dislocate', 'r', 12], ['dog', 't', 40], ['child', 't', 45]] },
];
const WMAP = Object.fromEntries(WORKOUTS.map(w => [w.id, w]));
const CATS = ['Todos', 'Corpo inteiro', 'Parte de cima', 'Pernas', 'Core', 'HIIT', 'Mobilidade'];

const LEVELS = [
  { id: 'int', label: 'Intermédio', k: .75, dr: -1, rk: 1.25 },
  { id: 'av', label: 'Avançado', k: 1, dr: 0, rk: 1 },
  { id: 'br', label: 'Brutal', k: 1.25, dr: 1, rk: .8 },
];

// Plano semanal (0 = domingo): empurrar / puxar / pernas 2× por semana, cardio e mobilidade pelo meio
const PLAN = {
  1: { w: 'push', focus: 'Empurrar' },
  2: { w: 'legs', focus: 'Pernas · quadríceps' },
  3: { w: 'pull', focus: 'Puxar + core', extra: 'core' },
  4: { w: 'hiit', focus: 'Cardio + mobilidade', extra: 'mobility' },
  5: { w: 'upper', focus: 'Parte de cima' },
  6: { w: 'legs2', focus: 'Posteriores + core', extra: 'core' },
  0: { w: 'mobility', focus: 'Descanso ativo' },
};
const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const DAYS_S = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

// Aquecimento e alongamento automáticos: [exercício, segundos, porLado?]
const WARMUP = [['jacks', 30], ['armcircles', 30], ['catcow', 30], ['squat', 30], ['wgs', 40, 1]];
const COOLDOWN = [['child', 30], ['cobra', 25], ['hamstretch', 30], ['hipflex', 40, 1]];
const PUSH_EX = ['pushup', 'wide', 'diamond', 'decline', 'pike', 'archer', 'pseudoplanche', 'plyopush', 'sphinx', 'pikeelev'];
const LEG_EX = ['squat', 'sumo', 'bulgarian', 'lunges', 'lateral', 'stepup', 'pistolbox', 'cossack', 'jumplunge'];

/* ===== Ginásio ===== */
// item: [exercício, 'r', reps, porLado, séries, descanso (s)] — compostos pesados primeiro com mais descanso, isolamento no fim
WORKOUTS.push(
  { id: 'gpush', place: 'gym', mode: 'sets', name: 'Peito, Ombros & Tríceps', cat: 'Peito & Tríceps', rest: 90, roundRest: 120, rate: 6,
    desc: 'Empurrar pesado primeiro (supino entre 6 e 8 reps), depois volume no peito de cima e nos ombros, isolamento no fim. Faz 2 séries leves de aquecimento antes do supino.',
    items: [['bench', 'r', 6, 0, 4, 150], ['incline', 'r', 10, 0, 3, 120], ['ohpress', 'r', 10, 0, 3, 90], ['cablefly', 'r', 12, 0, 3, 60], ['lateralraise', 'r', 15, 0, 4, 45], ['ohtri', 'r', 12, 0, 3, 60]] },
  { id: 'gpull', place: 'gym', mode: 'sets', name: 'Costas & Bíceps', cat: 'Costas & Bíceps', rest: 90, roundRest: 120, rate: 6,
    desc: 'Costas largas e grossas: um puxar vertical (elevações, puxada), um horizontal (remadas) e face pulls para ombros saudáveis. Bíceps no fim, já pré-cansados.',
    items: [['pullup', 'r', 'MÁX', 0, 3, 120], ['barrow', 'r', 8, 0, 4, 120], ['pulldown', 'r', 10, 0, 3, 90], ['cablerow', 'r', 12, 0, 3, 90], ['facepull', 'r', 15, 0, 3, 60], ['curl', 'r', 10, 0, 3, 60], ['hammer', 'r', 12, 0, 2, 60]] },
  { id: 'glegs', place: 'gym', mode: 'sets', name: 'Pernas · Quadríceps', cat: 'Pernas', rest: 120, roundRest: 120, rate: 7,
    desc: 'O dia mais duro da semana. Agachamento pesado primeiro, depois volume na leg press e no búlgaro. O leg curl entra para os posteriores não ficarem para trás.',
    items: [['bbsquat', 'r', 6, 0, 4, 180], ['legpress', 'r', 10, 0, 3, 120], ['bulgdb', 'r', 10, 1, 3, 90], ['legext', 'r', 12, 0, 3, 60], ['legcurl', 'r', 12, 0, 3, 60], ['calfdb', 'r', 15, 0, 4, 45]] },
  { id: 'glegs2', place: 'gym', mode: 'sets', name: 'Posteriores & Glúteos', cat: 'Pernas', rest: 90, roundRest: 120, rate: 7,
    desc: 'Segundo dia de pernas, focado na cadeia posterior: peso morto romeno, hip thrust e leg curl. Glúteos e isquiotibiais fortes protegem os joelhos e a lombar.',
    items: [['rdl', 'r', 8, 0, 4, 150], ['hipthrust', 'r', 10, 0, 3, 120], ['legcurl', 'r', 12, 0, 3, 75], ['goblet', 'r', 12, 0, 3, 90], ['dblunge', 'r', 12, 1, 2, 75], ['calfdb', 'r', 15, 0, 3, 45], ['cablecrunch', 'r', 15, 0, 3, 45]] },
  { id: 'gupper', place: 'gym', mode: 'sets', name: 'Parte de Cima', cat: 'Parte de cima', rest: 90, roundRest: 120, rate: 6,
    desc: 'O segundo estímulo da semana para o tronco, com variantes diferentes das de segunda e terça: inclinado, elevações supinadas, remada unilateral. Menos séries por exercício, mais variedade.',
    items: [['incline', 'r', 8, 0, 4, 120], ['chinup', 'r', 'MÁX', 0, 3, 120], ['ohpress', 'r', 8, 0, 3, 120], ['dbrow', 'r', 10, 1, 3, 90], ['dipsbar', 'r', 'MÁX', 0, 2, 90], ['lateralraise', 'r', 15, 0, 3, 45], ['facepull', 'r', 15, 0, 2, 45]] },
  { id: 'gfull', place: 'gym', mode: 'sets', name: 'Corpo Inteiro', cat: 'Corpo inteiro', rest: 90, roundRest: 120, rate: 7,
    desc: 'Os grandes compostos numa só sessão, com peso morto. Ideal para semanas com só 3 dias de ginásio (segunda, quarta e sexta) ou para compensar um treino falhado.',
    items: [['deadlift', 'r', 5, 0, 3, 180], ['bench', 'r', 8, 0, 3, 120], ['pulldown', 'r', 10, 0, 3, 90], ['goblet', 'r', 12, 0, 3, 90], ['ohpress', 'r', 10, 0, 2, 90], ['abwheel', 'r', 10, 0, 3, 60]] },
  { id: 'garms', place: 'gym', mode: 'sets', name: 'Ombros & Braços', cat: 'Ombros & Braços', rest: 60, roundRest: 90, rate: 5,
    desc: 'Ombros redondos e braços cheios: press, elevações laterais, face pulls, e bíceps e tríceps em todos os ângulos. Treino extra para quando há tempo.',
    items: [['ohpress', 'r', 10, 0, 3, 90], ['lateralraise', 'r', 15, 0, 4, 45], ['facepull', 'r', 15, 0, 3, 45], ['curl', 'r', 10, 0, 3, 60], ['ohtri', 'r', 12, 0, 3, 60], ['hammer', 'r', 12, 0, 3, 60], ['pushdown', 'r', 15, 0, 3, 45]] },
  { id: 'gcore', place: 'gym', mode: 'sets', name: 'Core no Ginásio', cat: 'Core', rest: 45, roundRest: 60, rate: 5,
    desc: 'Core com carga, como qualquer outro músculo: abdominal na polia e elevações suspenso para o reto abdominal, roda e prancha lateral para estabilidade.',
    items: [['hangleg', 'r', 12, 0, 3, 60], ['cablecrunch', 'r', 15, 0, 3, 45], ['abwheel', 'r', 10, 0, 3, 60], ['sideplank', 't', 30, 1, 2, 30]] },
);
WORKOUTS.forEach(w => { w.place = w.place || 'casa'; WMAP[w.id] = w; });
const CATS_GYM = ['Todos', 'Corpo inteiro', 'Parte de cima', 'Peito & Tríceps', 'Costas & Bíceps', 'Ombros & Braços', 'Pernas', 'Core'];
const PLAN_GYM = {
  1: { w: 'gpush', focus: 'Empurrar' },
  2: { w: 'gpull', focus: 'Puxar' },
  3: { w: 'glegs', focus: 'Pernas · quadríceps' },
  4: { w: 'mobility', focus: 'Descanso ativo' },
  5: { w: 'gupper', focus: 'Parte de cima + core', extra: 'gcore' },
  6: { w: 'glegs2', focus: 'Posteriores & glúteos' },
  0: { w: 'mobility', focus: 'Descanso ativo' },
};
/* material que precisas em casa */
Object.entries({ row: 'mesa robusta', rowsup: 'mesa robusta', dips: 'cadeira', decline: 'cadeira', bulgarian: 'cadeira', wallsit: 'parede' }).forEach(([k, v]) => { EX[k].kit = v; });
const BODYWEIGHT = ['pullup', 'chinup', 'dipsbar', 'hangleg', 'abwheel'];
