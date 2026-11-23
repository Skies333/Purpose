/* ===== Treinos ===== */
// item: [exercício, 't' (segundos) | 'r' (repetições), quantidade, porLado?]
const WORKOUTS = [
  /* — força / hipertrofia em casa: séries direitas, [exercício, modo, quantidade, porLado, séries, descanso] — */
  { id: 'push', mode: 'sets', name: 'Peito, Ombros & Tríceps', cat: 'Parte de cima', rest: 75, roundRest: 90, rate: 6,
    desc: 'Dia de empurrar a sério. Começa pelo mais pesado (declinadas e arqueiro), passa aos ombros com o pike elevado e acaba nos tríceps perto da falha. Séries direitas e descanso a sério: é assim que se cresce sem pesos.',
    items: [['decline', 'r', 10, 0, 4, 90], ['archer', 'r', 6, 1, 3, 90], ['pikeelev', 'r', 8, 0, 3, 90], ['wide', 'r', 12, 0, 3, 60], ['dips', 'r', 12, 0, 3, 60], ['diamond', 'r', 'MÁX', 0, 2, 60], ['hollow', 't', 30, 0, 2, 30]] },
  { id: 'pull', mode: 'sets', name: 'Costas & Bíceps', cat: 'Parte de cima', rest: 75, roundRest: 90, rate: 6,
    desc: 'Sem barra, as costas são o ponto fraco de quem treina em casa. Aqui puxas tanto como empurras: remadas com uma mochila cheia de livros, puxadas no chão e bíceps no fim. Equilibra os ombros e endireita a postura.',
    items: [['bagrow', 'r', 12, 0, 4, 90], ['bagrow1', 'r', 10, 1, 3, 75], ['wpull', 'r', 12, 0, 3, 60], ['bagcurl', 'r', 12, 0, 3, 60], ['backwidow', 'r', 12, 0, 3, 45], ['superman', 'r', 15, 0, 2, 45], ['deadbug', 'r', 12, 0, 2, 30]] },
  { id: 'legs', mode: 'sets', name: 'Pernas · Quadríceps', cat: 'Pernas', rest: 75, roundRest: 90, rate: 7,
    desc: 'Sem carga, o segredo está no trabalho a uma perna: búlgaros e subidas à cadeira põem o peso do corpo todo numa perna de cada vez. Acaba com isometria e gémeos.',
    items: [['bulgarian', 'r', 10, 1, 4, 90], ['stepup', 'r', 12, 1, 3, 75], ['squat', 'r', 20, 0, 3, 60], ['slrdl', 'r', 10, 1, 3, 60], ['wallsit', 't', 45, 0, 2, 60], ['calf', 'r', 20, 0, 3, 45], ['sideplank', 't', 30, 1, 2, 30]] },
  { id: 'legs2', mode: 'sets', name: 'Posteriores & Glúteos', cat: 'Pernas', rest: 75, roundRest: 90, rate: 7,
    desc: 'O segundo dia de pernas, focado na parte de trás: glúteos e isquiotibiais. Protege os joelhos, dá forma às pernas e ajuda no sprint. O nordic curl é dos melhores exercícios que existem, com ou sem ginásio.',
    items: [['sofathrust', 'r', 15, 0, 4, 75], ['nordic', 'r', 5, 0, 3, 120], ['slidercurl', 'r', 10, 0, 3, 60], ['pistolbox', 'r', 8, 1, 3, 75], ['cossack', 'r', 8, 1, 2, 60], ['bridge1', 'r', 12, 1, 2, 45], ['vup', 'r', 12, 0, 2, 45]] },
  { id: 'upper', mode: 'sets', name: 'Parte de Cima B', cat: 'Parte de cima', rest: 75, roundRest: 90, rate: 6,
    desc: 'Segunda sessão da semana para o tronco, com variantes diferentes: pseudo-planche, pike, remada unilateral e esfinge. Alterna empurrar e puxar para descansares um lado enquanto trabalhas o outro.',
    items: [['pseudoplanche', 'r', 8, 0, 3, 90], ['bagrow', 'r', 12, 0, 3, 90], ['pike', 'r', 10, 0, 3, 75], ['bagrow1', 'r', 10, 1, 3, 75], ['sphinx', 'r', 10, 0, 3, 60], ['bagcurl', 'r', 'MÁX', 0, 2, 60], ['bicycle', 'r', 20, 0, 2, 30]] },
  /* corpo inteiro (para 1–3 treinos por semana): cada sessão trabalha pernas, empurrar, puxar e core */
  { id: 'fullA', mode: 'sets', name: 'Corpo Inteiro A', cat: 'Corpo inteiro', rest: 75, roundRest: 90, rate: 7,
    desc: 'Sessão completa de força: pernas a uma perna, empurrar, puxar, glúteos, ombros e core. Pensada para quem treina 2 ou 3 vezes por semana e quer trabalhar tudo em cada treino.',
    items: [['bulgarian', 'r', 10, 1, 3, 90], ['decline', 'r', 10, 0, 3, 90], ['bagrow', 'r', 12, 0, 3, 90], ['sofathrust', 'r', 15, 0, 3, 75], ['pikeelev', 'r', 8, 0, 2, 75], ['deadbug', 'r', 12, 0, 2, 45]] },
  { id: 'fullB', mode: 'sets', name: 'Corpo Inteiro B', cat: 'Corpo inteiro', rest: 75, roundRest: 90, rate: 7,
    desc: 'Mesmos músculos do treino A com exercícios diferentes: subidas, remada unilateral, arqueiro e nordic curl. Alternar A e B dá variedade sem perder a progressão.',
    items: [['stepup', 'r', 12, 1, 3, 75], ['archer', 'r', 6, 1, 3, 90], ['bagrow1', 'r', 10, 1, 3, 75], ['nordic', 'r', 5, 0, 3, 120], ['dips', 'r', 12, 0, 2, 60], ['sideplank', 't', 30, 1, 2, 30]] },
  { id: 'fullC', mode: 'sets', name: 'Corpo Inteiro C', cat: 'Corpo inteiro', rest: 75, roundRest: 90, rate: 7,
    desc: 'O terceiro treino da semana de corpo inteiro: pistol, pseudo-planche, puxadas e peso morto a uma perna, com bíceps e abdominais no fim.',
    items: [['pistolbox', 'r', 8, 1, 3, 75], ['pseudoplanche', 'r', 8, 0, 3, 90], ['wpull', 'r', 12, 0, 3, 60], ['slrdl', 'r', 10, 1, 3, 60], ['bagcurl', 'r', 12, 0, 2, 60], ['vup', 'r', 12, 0, 2, 45]] },
  { id: 'upperA', mode: 'sets', name: 'Parte de Cima A', cat: 'Parte de cima', rest: 75, roundRest: 90, rate: 6,
    desc: 'Tronco completo com os exercícios mais pesados: declinadas, pike elevado e dips a empurrar, remadas e puxadas a puxar. Alterna com a Parte de Cima B.',
    items: [['decline', 'r', 10, 0, 4, 90], ['bagrow', 'r', 12, 0, 4, 90], ['pikeelev', 'r', 8, 0, 3, 90], ['wpull', 'r', 12, 0, 3, 60], ['dips', 'r', 12, 0, 3, 60], ['bagcurl', 'r', 12, 0, 3, 60], ['shouldertaps', 'r', 20, 0, 2, 30]] },
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

// Planos semanais por número de treinos (0 = domingo). Dias sem treino = descanso.
const PLANS = {
  1: { 3: { w: 'fullA', focus: 'Corpo inteiro' } },
  2: { 1: { w: 'fullA', focus: 'Corpo inteiro' }, 4: { w: 'fullB', focus: 'Corpo inteiro' } },
  3: { 1: { w: 'fullA', focus: 'Corpo inteiro' }, 3: { w: 'fullB', focus: 'Corpo inteiro' }, 5: { w: 'fullC', focus: 'Corpo inteiro' } },
  4: { 1: { w: 'upperA', focus: 'Parte de cima' }, 2: { w: 'legs', focus: 'Pernas · quadríceps' }, 4: { w: 'upper', focus: 'Parte de cima' }, 5: { w: 'legs2', focus: 'Posteriores + core', extra: 'core' } },
  5: { 1: { w: 'push', focus: 'Empurrar' }, 2: { w: 'pull', focus: 'Puxar + core', extra: 'core' }, 3: { w: 'legs', focus: 'Pernas · quadríceps' }, 5: { w: 'upper', focus: 'Parte de cima' }, 6: { w: 'legs2', focus: 'Posteriores + core', extra: 'core' } },
  6: { 1: { w: 'push', focus: 'Empurrar' }, 2: { w: 'legs', focus: 'Pernas · quadríceps' }, 3: { w: 'pull', focus: 'Puxar + core', extra: 'core' }, 4: { w: 'hiit', focus: 'Cardio + mobilidade', extra: 'mobility' },
       5: { w: 'upper', focus: 'Parte de cima' }, 6: { w: 'legs2', focus: 'Posteriores + core', extra: 'core' }, 0: { w: 'mobility', focus: 'Descanso ativo' } },
};
const PLAN = PLANS[6];
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
    items: [['bench', 'r', 6, 0, 4, 150], ['incline', 'r', 10, 0, 3, 120], ['ohpress', 'r', 10, 0, 3, 90], ['cablefly', 'r', 12, 0, 3, 60], ['lateralraise', 'r', 15, 0, 4, 45], ['ohtri', 'r', 12, 0, 3, 60], ['cablecrunch', 'r', 15, 0, 2, 45]] },
  { id: 'gpull', place: 'gym', mode: 'sets', name: 'Costas & Bíceps', cat: 'Costas & Bíceps', rest: 90, roundRest: 120, rate: 6,
    desc: 'Costas largas e grossas: um puxar vertical (elevações, puxada), um horizontal (remadas) e face pulls para ombros saudáveis. Bíceps no fim, já pré-cansados.',
    items: [['pullup', 'r', 'MÁX', 0, 3, 120], ['barrow', 'r', 8, 0, 4, 120], ['pulldown', 'r', 10, 0, 3, 90], ['cablerow', 'r', 12, 0, 3, 90], ['facepull', 'r', 15, 0, 3, 60], ['curl', 'r', 10, 0, 3, 60], ['hammer', 'r', 12, 0, 2, 60], ['hangleg', 'r', 12, 0, 3, 60]] },
  { id: 'glegs', place: 'gym', mode: 'sets', name: 'Pernas · Quadríceps', cat: 'Pernas', rest: 120, roundRest: 120, rate: 7,
    desc: 'O dia mais duro da semana. Agachamento pesado primeiro, depois volume na leg press e no búlgaro. O leg curl entra para os posteriores não ficarem para trás.',
    items: [['bbsquat', 'r', 6, 0, 4, 180], ['legpress', 'r', 10, 0, 3, 120], ['bulgdb', 'r', 10, 1, 3, 90], ['legext', 'r', 12, 0, 3, 60], ['legcurl', 'r', 12, 0, 3, 60], ['calfdb', 'r', 15, 0, 4, 45], ['abwheel', 'r', 10, 0, 3, 60]] },
  { id: 'glegs2', place: 'gym', mode: 'sets', name: 'Posteriores & Glúteos', cat: 'Pernas', rest: 90, roundRest: 120, rate: 7,
    desc: 'Segundo dia de pernas, focado na cadeia posterior: peso morto romeno, hip thrust e leg curl. Glúteos e isquiotibiais fortes protegem os joelhos e a lombar.',
    items: [['rdl', 'r', 8, 0, 4, 150], ['hipthrust', 'r', 10, 0, 3, 120], ['legcurl', 'r', 12, 0, 3, 75], ['goblet', 'r', 12, 0, 3, 90], ['dblunge', 'r', 12, 1, 2, 75], ['calfdb', 'r', 15, 0, 3, 45], ['cablecrunch', 'r', 15, 0, 3, 45]] },
  { id: 'gupper', place: 'gym', mode: 'sets', name: 'Parte de Cima B', cat: 'Parte de cima', rest: 90, roundRest: 120, rate: 6,
    desc: 'O segundo estímulo da semana para o tronco, com variantes diferentes: inclinado, elevações supinadas, remada unilateral e dips. Menos séries por exercício, mais variedade.',
    items: [['incline', 'r', 8, 0, 4, 120], ['chinup', 'r', 'MÁX', 0, 3, 120], ['ohpress', 'r', 8, 0, 3, 120], ['dbrow', 'r', 10, 1, 3, 90], ['dipsbar', 'r', 'MÁX', 0, 2, 90], ['lateralraise', 'r', 15, 0, 3, 45], ['facepull', 'r', 15, 0, 2, 45]] },
  { id: 'gfull', place: 'gym', mode: 'sets', name: 'Corpo Inteiro A', cat: 'Corpo inteiro', rest: 90, roundRest: 120, rate: 7,
    desc: 'Agachamento, supino e remada pesados, mais ombros, posteriores e core. O treino A de um plano de 2 ou 3 dias: trabalha tudo, com os básicos primeiro.',
    items: [['bbsquat', 'r', 6, 0, 3, 180], ['bench', 'r', 8, 0, 3, 150], ['barrow', 'r', 8, 0, 3, 120], ['lateralraise', 'r', 15, 0, 3, 45], ['legcurl', 'r', 12, 0, 2, 60], ['abwheel', 'r', 10, 0, 2, 60]] },
  { id: 'gfullB', place: 'gym', mode: 'sets', name: 'Corpo Inteiro B', cat: 'Corpo inteiro', rest: 90, roundRest: 120, rate: 7,
    desc: 'Peso morto, press de ombros e elevações como base, com leg press, inclinado e face pulls a completar. Alterna com o treino A.',
    items: [['deadlift', 'r', 5, 0, 3, 180], ['ohpress', 'r', 8, 0, 3, 120], ['pullup', 'r', 'MÁX', 0, 3, 120], ['legpress', 'r', 10, 0, 3, 120], ['incline', 'r', 10, 0, 2, 90], ['facepull', 'r', 15, 0, 2, 45], ['hangleg', 'r', 12, 0, 2, 60]] },
  { id: 'gfullC', place: 'gym', mode: 'sets', name: 'Corpo Inteiro C', cat: 'Corpo inteiro', rest: 90, roundRest: 120, rate: 7,
    desc: 'O terceiro dia de corpo inteiro: búlgaro e romeno para as pernas, inclinado e remada sentada para o tronco, braços e abdominal no fim.',
    items: [['bulgdb', 'r', 10, 1, 3, 90], ['incline', 'r', 10, 0, 3, 120], ['cablerow', 'r', 12, 0, 3, 90], ['rdl', 'r', 10, 0, 3, 120], ['ohtri', 'r', 12, 0, 2, 60], ['hammer', 'r', 12, 0, 2, 60], ['cablecrunch', 'r', 15, 0, 2, 45]] },
  { id: 'gupperA', place: 'gym', mode: 'sets', name: 'Parte de Cima A', cat: 'Parte de cima', rest: 90, roundRest: 120, rate: 6,
    desc: 'Tronco pesado: supino e remada com barra primeiro, depois ombros, puxada e braços. Alterna com a Parte de Cima B num plano de 4 dias.',
    items: [['bench', 'r', 6, 0, 4, 150], ['barrow', 'r', 8, 0, 4, 120], ['ohpress', 'r', 10, 0, 3, 90], ['pulldown', 'r', 10, 0, 3, 90], ['lateralraise', 'r', 15, 0, 3, 45], ['curl', 'r', 10, 0, 2, 60], ['pushdown', 'r', 12, 0, 2, 60], ['cablecrunch', 'r', 15, 0, 3, 45]] },
  { id: 'garms', place: 'gym', mode: 'sets', name: 'Ombros & Braços', cat: 'Ombros & Braços', rest: 60, roundRest: 90, rate: 5,
    desc: 'Ombros redondos e braços cheios: press, elevações laterais, face pulls, e bíceps e tríceps em todos os ângulos. Treino extra para quando há tempo.',
    items: [['ohpress', 'r', 10, 0, 3, 90], ['lateralraise', 'r', 15, 0, 4, 45], ['facepull', 'r', 15, 0, 3, 45], ['curl', 'r', 10, 0, 3, 60], ['ohtri', 'r', 12, 0, 3, 60], ['hammer', 'r', 12, 0, 3, 60], ['pushdown', 'r', 15, 0, 3, 45]] },
  { id: 'gcore', place: 'gym', mode: 'sets', name: 'Core no Ginásio', cat: 'Core', rest: 45, roundRest: 60, rate: 5,
    desc: 'Core com carga, como qualquer outro músculo: abdominal na polia e elevações suspenso para o reto abdominal, roda e prancha lateral para estabilidade.',
    items: [['hangleg', 'r', 12, 0, 3, 60], ['cablecrunch', 'r', 15, 0, 3, 45], ['abwheel', 'r', 10, 0, 3, 60], ['sideplank', 't', 30, 1, 2, 30]] },
);
WORKOUTS.forEach(w => { w.place = w.place || 'casa'; WMAP[w.id] = w; });
const CATS_GYM = ['Todos', 'Corpo inteiro', 'Parte de cima', 'Peito & Tríceps', 'Costas & Bíceps', 'Ombros & Braços', 'Pernas', 'Core'];
const PLANS_GYM = {
  1: { 3: { w: 'gfull', focus: 'Corpo inteiro' } },
  2: { 1: { w: 'gfull', focus: 'Corpo inteiro' }, 4: { w: 'gfullB', focus: 'Corpo inteiro' } },
  3: { 1: { w: 'gfull', focus: 'Corpo inteiro' }, 3: { w: 'gfullB', focus: 'Corpo inteiro' }, 5: { w: 'gfullC', focus: 'Corpo inteiro' } },
  4: { 1: { w: 'gupperA', focus: 'Parte de cima' }, 2: { w: 'glegs', focus: 'Pernas · quadríceps' }, 4: { w: 'gupper', focus: 'Parte de cima + core', extra: 'gcore' }, 5: { w: 'glegs2', focus: 'Posteriores & glúteos' } },
  5: { 1: { w: 'gpush', focus: 'Empurrar' }, 2: { w: 'gpull', focus: 'Puxar' }, 3: { w: 'glegs', focus: 'Pernas · quadríceps' }, 5: { w: 'gupper', focus: 'Parte de cima + core', extra: 'gcore' }, 6: { w: 'glegs2', focus: 'Posteriores & glúteos' } },
  6: { 1: { w: 'gpush', focus: 'Empurrar' }, 2: { w: 'gpull', focus: 'Puxar' }, 3: { w: 'glegs', focus: 'Pernas · quadríceps' }, 4: { w: 'garms', focus: 'Ombros & braços' },
       5: { w: 'gupper', focus: 'Parte de cima + core', extra: 'gcore' }, 6: { w: 'glegs2', focus: 'Posteriores & glúteos' } },
};
const PLAN_GYM = PLANS_GYM[5];
/* como cada frequência está organizada (mostrado no plano) */
const PLAN_WHY = {
  1: 'Um treino de corpo inteiro. Mantém a forma, mas para progredir a sério tenta pelo menos 2.',
  2: 'Corpo inteiro A e B, com 2–3 dias de descanso entre eles. O mínimo para continuar a progredir.',
  3: 'Corpo inteiro 3× por semana, com um dia de descanso entre treinos. Cada músculo é treinado 3 vezes: o mais eficiente para quem tem pouco tempo.',
  4: 'Parte de cima e pernas, 2× cada. O melhor equilíbrio entre volume e descanso.',
  5: 'Empurrar, puxar e pernas, depois parte de cima e posteriores: cada músculo 2× por semana, com descanso a meio.',
  6: 'Divisão completa para quem quer treinar quase todos os dias: cada músculo 2× por semana, mais cardio e mobilidade.',
  7: 'Os 6 treinos da semana mais mobilidade ao domingo. Lembra-te: é no descanso que o músculo cresce.',
};

/* material que precisas em casa */
Object.entries({ row: 'mesa robusta', rowsup: 'mesa robusta', dips: 'cadeira', decline: 'cadeira', bulgarian: 'cadeira', wallsit: 'parede' }).forEach(([k, v]) => { EX[k].kit = v; });
const BODYWEIGHT = ['pullup', 'chinup', 'dipsbar', 'hangleg', 'abwheel'];
