/* ===== Programa de treino =====
   Regras do programa (como um treinador o faria):
   1. Cada treino de força é específico da sua zona (empurrar, puxar, pernas, parte de cima, corpo inteiro). Nada de abdominais "colados" no fim.
   2. O core tem sessões próprias (Core A, Core B, Core com Carga), curtas, marcadas no plano 2× por semana.
   3. Cada músculo é treinado 2× por semana (3× nos planos de corpo inteiro), com 10–20 séries semanais nos músculos grandes.
   4. Compostos pesados primeiro, com mais descanso; isolamento no fim, com menos.
   5. Variantes A/B: a mesma zona treinada duas vezes na semana com exercícios ou faixas de repetições diferentes.
   item de força: [exercício, 'r' | 't', quantidade, porLado, séries, descanso (s)]
   item de circuito: [exercício, 't' (segundos) | 'r' (repetições), quantidade, porLado?] */
const WORKOUTS = [
  /* ——— EM CASA · força ——— */
  { id: 'push', mode: 'sets', name: 'Empurrar A · Peito', cat: 'Parte de cima', rest: 75, roundRest: 90, rate: 6,
    desc: 'Peito, ombros e tríceps com foco no peito. Declinadas e arqueiro primeiro, que são as mais pesadas, pike elevado para os ombros e tríceps no fim. Séries direitas com descanso a sério: é assim que se cresce sem pesos.',
    items: [['decline', 'r', 10, 0, 4, 90], ['archer', 'r', 6, 1, 3, 90], ['pikeelev', 'r', 8, 0, 3, 90], ['wide', 'r', 12, 0, 3, 60], ['bottleraise', 'r', 20, 0, 3, 45], ['sphinx', 'r', 10, 0, 3, 60]] },
  { id: 'pushB', mode: 'sets', name: 'Empurrar B · Ombros', cat: 'Parte de cima', rest: 75, roundRest: 90, rate: 6,
    desc: 'O segundo dia de empurrar da semana, com foco nos ombros e nos tríceps: pseudo-planche, pike, flexões explosivas e elevações laterais com garrafas. Variantes diferentes do dia A para o músculo continuar a ser desafiado.',
    items: [['pikeelev', 'r', 8, 0, 4, 90], ['pseudoplanche', 'r', 8, 0, 3, 90], ['plyopush', 'r', 6, 0, 3, 90], ['bottleraise', 'r', 20, 0, 4, 45], ['diamond', 'r', 12, 0, 3, 60], ['pushup', 'r', 'MÁX', 0, 2, 60]] },
  { id: 'pull', mode: 'sets', name: 'Puxar A · Costas', cat: 'Parte de cima', rest: 75, roundRest: 90, rate: 6,
    desc: 'Costas e bíceps com uma mochila cheia de livros: remada pesada primeiro, depois unilateral, puxadas no chão para os dorsais e trabalho de costas superiores. Equilibra o volume de flexões e endireita a postura.',
    items: [['bagrow', 'r', 12, 0, 4, 90], ['bagrow1', 'r', 10, 1, 3, 75], ['wpull', 'r', 12, 0, 3, 60], ['backwidow', 'r', 12, 0, 3, 45], ['bagcurl', 'r', 12, 0, 3, 60], ['superman', 'r', 15, 0, 2, 45]] },
  { id: 'pullB', mode: 'sets', name: 'Puxar B · Costas & Bíceps', cat: 'Parte de cima', rest: 75, roundRest: 90, rate: 6,
    desc: 'O segundo dia de puxar: unilateral primeiro e mais pesado, remada com mais repetições, elevações em Y para as omoplatas e mais volume de bíceps.',
    items: [['bagrow1', 'r', 10, 1, 4, 90], ['bagrow', 'r', 15, 0, 3, 75], ['wpull', 'r', 15, 0, 3, 60], ['yraise', 'r', 12, 0, 3, 45], ['bagcurl', 'r', 10, 0, 4, 60], ['backwidow', 'r', 12, 0, 2, 45]] },
  { id: 'legs', mode: 'sets', name: 'Pernas A · Quadríceps', cat: 'Pernas', rest: 75, roundRest: 90, rate: 7,
    desc: 'Sem carga, o segredo está no trabalho a uma perna: búlgaros e subidas à cadeira põem o peso do corpo todo numa perna de cada vez. Peso morto a uma perna para os posteriores e gémeos no fim.',
    items: [['bulgarian', 'r', 10, 1, 4, 90], ['stepup', 'r', 12, 1, 3, 75], ['squat', 'r', 20, 0, 3, 60], ['slrdl', 'r', 10, 1, 3, 60], ['wallsit', 't', 45, 0, 2, 60], ['calf', 'r', 20, 0, 3, 45]] },
  { id: 'legs2', mode: 'sets', name: 'Pernas B · Posteriores & Glúteos', cat: 'Pernas', rest: 75, roundRest: 90, rate: 7,
    desc: 'O segundo dia de pernas, focado na parte de trás: glúteos e isquiotibiais. Protege os joelhos, dá forma às pernas e ajuda no sprint. O nordic curl é dos melhores exercícios que existem, com ou sem ginásio.',
    items: [['sofathrust', 'r', 15, 0, 4, 75], ['nordic', 'r', 5, 0, 3, 120], ['pistolbox', 'r', 8, 1, 3, 75], ['slidercurl', 'r', 10, 0, 3, 60], ['cossack', 'r', 8, 1, 2, 60], ['calf', 'r', 20, 0, 3, 45]] },
  { id: 'upperA', mode: 'sets', name: 'Parte de Cima A', cat: 'Parte de cima', rest: 75, roundRest: 90, rate: 6,
    desc: 'Tronco completo, versão pesada: declinadas e pike elevado a empurrar, remadas a puxar, braços no fim. Alterna empurrar e puxar para descansares um lado enquanto trabalhas o outro.',
    items: [['decline', 'r', 10, 0, 4, 90], ['bagrow', 'r', 12, 0, 4, 90], ['pikeelev', 'r', 8, 0, 3, 90], ['bagrow1', 'r', 10, 1, 3, 75], ['diamond', 'r', 12, 0, 3, 60], ['bagcurl', 'r', 12, 0, 3, 60]] },
  { id: 'upper', mode: 'sets', name: 'Parte de Cima B', cat: 'Parte de cima', rest: 75, roundRest: 90, rate: 6,
    desc: 'O segundo dia de tronco, com variantes diferentes do A: pseudo-planche, arqueiro, puxadas no chão, pike e elevações laterais. Mais repetições, mais ombro.',
    items: [['pseudoplanche', 'r', 8, 0, 4, 90], ['bagrow', 'r', 15, 0, 3, 75], ['archer', 'r', 6, 1, 3, 90], ['wpull', 'r', 12, 0, 3, 60], ['pike', 'r', 10, 0, 3, 75], ['bottleraise', 'r', 20, 0, 3, 45]] },
  { id: 'fullA', mode: 'sets', name: 'Corpo Inteiro A', cat: 'Corpo inteiro', rest: 75, roundRest: 90, rate: 7,
    desc: 'Para quem treina 1 a 3 vezes por semana: um exercício por grande movimento (perna, anca, empurrar, puxar, ombros) e braços no fim. Treina tudo em cada sessão.',
    items: [['bulgarian', 'r', 10, 1, 3, 90], ['decline', 'r', 10, 0, 3, 90], ['bagrow', 'r', 12, 0, 3, 90], ['sofathrust', 'r', 15, 0, 3, 75], ['pikeelev', 'r', 8, 0, 2, 75], ['bagcurl', 'r', 12, 0, 2, 60]] },
  { id: 'fullB', mode: 'sets', name: 'Corpo Inteiro B', cat: 'Corpo inteiro', rest: 75, roundRest: 90, rate: 7,
    desc: 'Os mesmos movimentos do A com exercícios diferentes: subidas, arqueiro, remada unilateral e nordic curl. Alternar A, B e C dá variedade sem perder a progressão.',
    items: [['stepup', 'r', 12, 1, 3, 75], ['archer', 'r', 6, 1, 3, 90], ['bagrow1', 'r', 10, 1, 3, 75], ['nordic', 'r', 5, 0, 3, 120], ['bottleraise', 'r', 20, 0, 2, 45], ['diamond', 'r', 12, 0, 2, 60]] },
  { id: 'fullC', mode: 'sets', name: 'Corpo Inteiro C', cat: 'Corpo inteiro', rest: 75, roundRest: 90, rate: 7,
    desc: 'O terceiro dia de corpo inteiro: pistol, pseudo-planche, puxadas no chão e peso morto a uma perna, com remada leve e gémeos no fim.',
    items: [['pistolbox', 'r', 8, 1, 3, 75], ['pseudoplanche', 'r', 8, 0, 3, 90], ['wpull', 'r', 12, 0, 3, 60], ['slrdl', 'r', 10, 1, 3, 60], ['bagrow', 'r', 15, 0, 2, 60], ['calf', 'r', 20, 0, 2, 45]] },
  { id: 'arms', mode: 'sets', name: 'Ombros & Braços', cat: 'Parte de cima', rest: 60, roundRest: 75, rate: 5,
    desc: 'Treino extra para ombros cheios e braços. Faz num dia livre ou no lugar de um treino quando queres foco nos braços; não faz parte dos planos.',
    items: [['pikeelev', 'r', 8, 0, 3, 90], ['bottleraise', 'r', 20, 0, 4, 45], ['bagcurl', 'r', 12, 0, 3, 60], ['diamond', 'r', 12, 0, 3, 60], ['sphinx', 'r', 10, 0, 3, 60], ['yraise', 'r', 12, 0, 3, 45]] },
  /* ——— CORE: sessões próprias, curtas (~10 min), para juntar ao treino do dia ——— */
  { id: 'core', mode: 'sets', name: 'Core A · Força', cat: 'Core', rest: 30, roundRest: 45, rate: 5,
    desc: 'Abdominais e core profundo: V-ups para dobrar, dead bug para resistir à extensão, prancha lateral para os oblíquos. 7 séries, uns 10 minutos, logo a seguir ao treino do dia.',
    items: [['vup', 'r', 12, 0, 3, 45], ['deadbug', 'r', 12, 0, 2, 30], ['sideplank', 't', 30, 1, 2, 30]] },
  { id: 'coreB', mode: 'sets', name: 'Core B · Estabilidade', cat: 'Core', rest: 30, roundRest: 45, rate: 5,
    desc: 'Abdominal inferior, rotação e estabilidade: elevação de pernas, bicicleta e bird dog. O que protege a lombar e dá cintura firme. 7 séries, uns 10 minutos.',
    items: [['legraise', 'r', 15, 0, 3, 45], ['bicycle', 'r', 20, 0, 2, 30], ['birddog', 'r', 10, 1, 2, 30]] },
  /* ——— condicionamento (circuitos por voltas) ——— */
  { id: 'brutal', name: 'Corpo Inteiro Brutal', cat: 'Corpo inteiro', rounds: 4, rest: 20, roundRest: 75, rate: 10,
    desc: 'Circuito de corpo inteiro para dias com energia e 40 minutos. Força e cardio misturados, quase sem pausas. É condicionamento: complementa os treinos de força, não os substitui.',
    items: [['burpee', 't', 40], ['pushup', 'r', 15], ['jumpsquat', 't', 40], ['bagrow', 'r', 12], ['jumplunge', 't', 30], ['pike', 'r', 10], ['climbers', 't', 40], ['hollow', 't', 30]] },
  { id: 'power', name: 'Potência Atlética', cat: 'Corpo inteiro', rounds: 4, rest: 40, roundRest: 90, rate: 9,
    desc: 'Saltos e explosão para ficares mais rápido e atlético. Qualidade acima de cansaço: cada repetição a 100 %, com descanso completo.',
    items: [['plyopush', 'r', 8], ['tuckjump', 'r', 8], ['jumplunge', 'r', 12], ['skater', 'r', 12], ['bearcrawl', 't', 30]] },
  { id: 'express', name: 'Expresso 15 min', cat: 'Corpo inteiro', rounds: 3, rest: 15, roundRest: 45, rate: 9,
    desc: 'Pouco tempo? Corpo inteiro em 15 minutos para não falhar o dia. Mais vale isto do que nada.',
    items: [['pushup', 'r', 12], ['squat', 'r', 20], ['bagrow', 'r', 12], ['climbers', 't', 30], ['plank', 't', 40]] },
  { id: 'hiit', name: 'HIIT Queima Total', cat: 'HIIT', rounds: 3, rest: 20, roundRest: 60, rate: 12,
    desc: '40 s a fundo, 20 s de descanso. Queima calorias e melhora o cardio sem roubar músculo. No máximo 2 vezes por semana e nunca na véspera de pernas.',
    items: [['burpee', 't', 40], ['skater', 't', 40], ['highknees', 't', 40], ['squatthrust', 't', 40], ['jumplunge', 't', 40], ['climbers', 't', 40]] },
  { id: 'tabata', name: 'Tabata 8 min', cat: 'HIIT', rounds: 8, rest: 10, roundRest: 10, rate: 13,
    desc: 'O protocolo Tabata: 20 s no máximo, 10 s de pausa, 8 voltas. Curto e brutal: o final certo para um treino de tronco quando queres definir.',
    items: [['jumpsquat', 't', 20], ['climbers', 't', 20]] },
  { id: 'legsx', name: 'Pernas Explosivas', cat: 'Pernas', rounds: 4, rest: 30, roundRest: 75, rate: 10,
    desc: 'Potência e resistência nas pernas com saltos, afundos laterais e sumo. Circuito de condicionamento: não substitui os dias de pernas de força.',
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

/* Planos semanais por número de treinos (0 = domingo). Dias sem treino = descanso (com mobilidade opcional).
   "extra" é uma sessão curta feita a seguir ao treino do dia (core ou cardio). */
const PLANS = {
  1: { 3: { w: 'fullA', focus: 'Corpo inteiro + core', extra: 'core' } },
  2: { 1: { w: 'fullA', focus: 'Corpo inteiro + core', extra: 'core' }, 4: { w: 'fullB', focus: 'Corpo inteiro + core', extra: 'coreB' } },
  3: { 1: { w: 'fullA', focus: 'Corpo inteiro + core', extra: 'core' }, 3: { w: 'fullB', focus: 'Corpo inteiro + cardio', extra: 'tabata' }, 5: { w: 'fullC', focus: 'Corpo inteiro + core', extra: 'coreB' } },
  4: { 1: { w: 'upperA', focus: 'Parte de cima' }, 2: { w: 'legs', focus: 'Pernas + core', extra: 'core' },
       4: { w: 'upper', focus: 'Parte de cima + cardio', extra: 'tabata' }, 5: { w: 'legs2', focus: 'Pernas + core', extra: 'coreB' } },
  5: { 1: { w: 'push', focus: 'Empurrar + cardio', extra: 'tabata' }, 2: { w: 'pull', focus: 'Puxar + core', extra: 'core' }, 3: { w: 'legs', focus: 'Pernas' },
       5: { w: 'upper', focus: 'Parte de cima + core', extra: 'coreB' }, 6: { w: 'legs2', focus: 'Pernas' } },
  6: { 1: { w: 'push', focus: 'Empurrar + cardio', extra: 'tabata' }, 2: { w: 'pull', focus: 'Puxar + core', extra: 'core' }, 3: { w: 'legs', focus: 'Pernas' },
       4: { w: 'pushB', focus: 'Empurrar' }, 5: { w: 'pullB', focus: 'Puxar + core', extra: 'coreB' }, 6: { w: 'legs2', focus: 'Pernas' } },
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
WORKOUTS.push(
  { id: 'gpush', place: 'gym', mode: 'sets', name: 'Empurrar A · Peito', cat: 'Peito & Tríceps', rest: 90, roundRest: 120, rate: 6,
    desc: 'Supino pesado entre 6 e 8 reps, depois inclinado e crossover para o peito, press e elevações laterais para os ombros, tríceps no fim. Faz 2 séries leves de aquecimento antes do supino.',
    items: [['bench', 'r', 6, 0, 4, 150], ['incline', 'r', 10, 0, 3, 120], ['cablefly', 'r', 12, 0, 3, 60], ['ohpress', 'r', 10, 0, 3, 90], ['lateralraise', 'r', 15, 0, 3, 45], ['ohtri', 'r', 12, 0, 3, 60]] },
  { id: 'gpush2', place: 'gym', mode: 'sets', name: 'Empurrar B · Ombros', cat: 'Peito & Tríceps', rest: 90, roundRest: 120, rate: 6,
    desc: 'O segundo dia de empurrar, com foco nos ombros: press pesado primeiro, dips e inclinado para o peito, muito volume de elevações laterais e tríceps na polia.',
    items: [['ohpress', 'r', 8, 0, 4, 120], ['dipsbar', 'r', 'MÁX', 0, 3, 90], ['incline', 'r', 12, 0, 3, 90], ['lateralraise', 'r', 15, 0, 4, 45], ['cablefly', 'r', 15, 0, 2, 60], ['pushdown', 'r', 12, 0, 3, 60]] },
  { id: 'gpull', place: 'gym', mode: 'sets', name: 'Puxar A · Largura', cat: 'Costas & Bíceps', rest: 90, roundRest: 120, rate: 6,
    desc: 'Costas largas: elevações e puxada (puxar vertical), remada com barra para a espessura, face pulls para ombros saudáveis. Bíceps no fim.',
    items: [['pullup', 'r', 'MÁX', 0, 3, 120], ['barrow', 'r', 8, 0, 4, 120], ['pulldown', 'r', 10, 0, 3, 90], ['cablerow', 'r', 12, 0, 3, 90], ['facepull', 'r', 15, 0, 3, 45], ['curl', 'r', 10, 0, 3, 60]] },
  { id: 'gpull2', place: 'gym', mode: 'sets', name: 'Puxar B · Espessura', cat: 'Costas & Bíceps', rest: 90, roundRest: 120, rate: 6,
    desc: 'O segundo dia de puxar: remada unilateral pesada primeiro, elevações supinadas, remada sentada e puxada com mais reps. Curl martelo para braços mais grossos.',
    items: [['dbrow', 'r', 10, 1, 4, 90], ['chinup', 'r', 'MÁX', 0, 3, 120], ['cablerow', 'r', 10, 0, 3, 90], ['pulldown', 'r', 12, 0, 3, 75], ['facepull', 'r', 15, 0, 3, 45], ['hammer', 'r', 12, 0, 3, 60]] },
  { id: 'glegs', place: 'gym', mode: 'sets', name: 'Pernas A · Quadríceps', cat: 'Pernas', rest: 120, roundRest: 120, rate: 7,
    desc: 'O dia mais duro da semana. Agachamento pesado primeiro, depois volume na leg press e no búlgaro. O leg curl entra para os posteriores não ficarem para trás.',
    items: [['bbsquat', 'r', 6, 0, 4, 180], ['legpress', 'r', 10, 0, 3, 120], ['bulgdb', 'r', 10, 1, 3, 90], ['legext', 'r', 12, 0, 3, 60], ['legcurl', 'r', 12, 0, 3, 60], ['calfdb', 'r', 15, 0, 4, 45]] },
  { id: 'glegs2', place: 'gym', mode: 'sets', name: 'Pernas B · Posteriores', cat: 'Pernas', rest: 90, roundRest: 120, rate: 7,
    desc: 'Segundo dia de pernas, focado na cadeia posterior: peso morto romeno, hip thrust e leg curl, com goblet e afundos para os quadríceps. Protege os joelhos e a lombar.',
    items: [['rdl', 'r', 8, 0, 4, 150], ['hipthrust', 'r', 10, 0, 3, 120], ['legcurl', 'r', 12, 0, 3, 75], ['goblet', 'r', 12, 0, 3, 90], ['dblunge', 'r', 12, 1, 2, 75], ['calfdb', 'r', 15, 0, 3, 45]] },
  { id: 'gupperA', place: 'gym', mode: 'sets', name: 'Parte de Cima A', cat: 'Parte de cima', rest: 90, roundRest: 120, rate: 6,
    desc: 'Tronco pesado: supino e remada com barra primeiro, depois press, puxada e braços. Alterna com a Parte de Cima B num plano de 4 dias.',
    items: [['bench', 'r', 6, 0, 4, 150], ['barrow', 'r', 8, 0, 4, 120], ['ohpress', 'r', 10, 0, 3, 90], ['pulldown', 'r', 10, 0, 3, 90], ['lateralraise', 'r', 15, 0, 3, 45], ['curl', 'r', 10, 0, 2, 60], ['pushdown', 'r', 12, 0, 2, 60]] },
  { id: 'gupper', place: 'gym', mode: 'sets', name: 'Parte de Cima B', cat: 'Parte de cima', rest: 90, roundRest: 120, rate: 6,
    desc: 'O segundo dia de tronco, com variantes diferentes do A: inclinado, elevações supinadas, remada unilateral, crossover, face pulls e braços. Mais reps, mais ombro.',
    items: [['incline', 'r', 8, 0, 4, 120], ['chinup', 'r', 'MÁX', 0, 3, 120], ['dbrow', 'r', 10, 1, 3, 90], ['cablefly', 'r', 12, 0, 3, 60], ['lateralraise', 'r', 15, 0, 3, 45], ['facepull', 'r', 15, 0, 2, 45], ['hammer', 'r', 12, 0, 2, 60], ['pushdown', 'r', 12, 0, 2, 60]] },
  { id: 'gfull', place: 'gym', mode: 'sets', name: 'Corpo Inteiro A', cat: 'Corpo inteiro', rest: 90, roundRest: 120, rate: 7,
    desc: 'Agachamento, supino e remada pesados, mais ombros, posteriores e bíceps. O treino A dos planos de 1 a 3 dias: os básicos primeiro, tudo numa sessão.',
    items: [['bbsquat', 'r', 6, 0, 3, 180], ['bench', 'r', 8, 0, 3, 150], ['barrow', 'r', 8, 0, 3, 120], ['lateralraise', 'r', 15, 0, 3, 45], ['legcurl', 'r', 12, 0, 2, 60], ['curl', 'r', 12, 0, 2, 60]] },
  { id: 'gfullB', place: 'gym', mode: 'sets', name: 'Corpo Inteiro B', cat: 'Corpo inteiro', rest: 90, roundRest: 120, rate: 7,
    desc: 'Peso morto, press de ombros e elevações como base, com leg press, crossover e face pulls a completar. Alterna com os treinos A e C.',
    items: [['deadlift', 'r', 5, 0, 3, 180], ['ohpress', 'r', 8, 0, 3, 120], ['pullup', 'r', 'MÁX', 0, 3, 120], ['legpress', 'r', 10, 0, 3, 120], ['cablefly', 'r', 12, 0, 2, 60], ['facepull', 'r', 15, 0, 2, 45]] },
  { id: 'gfullC', place: 'gym', mode: 'sets', name: 'Corpo Inteiro C', cat: 'Corpo inteiro', rest: 90, roundRest: 120, rate: 7,
    desc: 'O terceiro dia de corpo inteiro: búlgaro e romeno para as pernas, inclinado e remada sentada para o tronco, tríceps e curl martelo no fim.',
    items: [['bulgdb', 'r', 10, 1, 3, 90], ['incline', 'r', 10, 0, 3, 120], ['cablerow', 'r', 12, 0, 3, 90], ['rdl', 'r', 10, 0, 3, 120], ['ohtri', 'r', 12, 0, 2, 60], ['hammer', 'r', 12, 0, 2, 60]] },
  { id: 'garms', place: 'gym', mode: 'sets', name: 'Ombros & Braços', cat: 'Ombros & Braços', rest: 60, roundRest: 90, rate: 5,
    desc: 'Treino extra para ombros redondos e braços cheios: press, elevações laterais, face pulls, e bíceps e tríceps em todos os ângulos. Não faz parte dos planos.',
    items: [['ohpress', 'r', 10, 0, 3, 90], ['lateralraise', 'r', 15, 0, 4, 45], ['facepull', 'r', 15, 0, 3, 45], ['curl', 'r', 10, 0, 3, 60], ['ohtri', 'r', 12, 0, 3, 60], ['hammer', 'r', 12, 0, 3, 60], ['pushdown', 'r', 15, 0, 3, 45]] },
  { id: 'gcore', place: 'gym', mode: 'sets', name: 'Core com Carga', cat: 'Core', rest: 45, roundRest: 60, rate: 5,
    desc: 'Core com carga, como qualquer outro músculo: elevação de pernas suspenso e abdominal na polia para o reto abdominal, roda para a estabilidade. 8 séries, uns 12 minutos.',
    items: [['hangleg', 'r', 12, 0, 3, 60], ['cablecrunch', 'r', 15, 0, 3, 45], ['abwheel', 'r', 10, 0, 2, 60]] },
);
WORKOUTS.forEach(w => { w.place = w.place || 'casa'; WMAP[w.id] = w; });
const CATS_GYM = ['Todos', 'Corpo inteiro', 'Parte de cima', 'Peito & Tríceps', 'Costas & Bíceps', 'Ombros & Braços', 'Pernas', 'Core'];
const PLANS_GYM = {
  1: { 3: { w: 'gfull', focus: 'Corpo inteiro + core', extra: 'gcore' } },
  2: { 1: { w: 'gfull', focus: 'Corpo inteiro + core', extra: 'gcore' }, 4: { w: 'gfullB', focus: 'Corpo inteiro + core', extra: 'coreB' } },
  3: { 1: { w: 'gfull', focus: 'Corpo inteiro + core', extra: 'gcore' }, 3: { w: 'gfullB', focus: 'Corpo inteiro' }, 5: { w: 'gfullC', focus: 'Corpo inteiro + core', extra: 'coreB' } },
  4: { 1: { w: 'gupperA', focus: 'Parte de cima' }, 2: { w: 'glegs', focus: 'Pernas + core', extra: 'gcore' },
       4: { w: 'gupper', focus: 'Parte de cima' }, 5: { w: 'glegs2', focus: 'Pernas + core', extra: 'coreB' } },
  5: { 1: { w: 'gpush', focus: 'Empurrar' }, 2: { w: 'gpull', focus: 'Puxar + core', extra: 'gcore' }, 3: { w: 'glegs', focus: 'Pernas' },
       5: { w: 'gupper', focus: 'Parte de cima + core', extra: 'coreB' }, 6: { w: 'glegs2', focus: 'Pernas' } },
  6: { 1: { w: 'gpush', focus: 'Empurrar' }, 2: { w: 'gpull', focus: 'Puxar + core', extra: 'gcore' }, 3: { w: 'glegs', focus: 'Pernas' },
       4: { w: 'gpush2', focus: 'Empurrar' }, 5: { w: 'gpull2', focus: 'Puxar + core', extra: 'coreB' }, 6: { w: 'glegs2', focus: 'Pernas' } },
};
const PLAN_GYM = PLANS_GYM[5];
/* como cada frequência está organizada (mostrado no plano) */
const PLAN_WHY = {
  1: 'Um treino de corpo inteiro com core. Mantém a forma; para evoluir a sério, tenta pelo menos 2 por semana.',
  2: 'Corpo inteiro A e B, com 2–3 dias de descanso entre eles. Cada músculo é treinado 2× por semana e o core tem uma sessão própria em cada dia.',
  3: 'Corpo inteiro A, B e C em dias alternados: cada músculo 3× por semana, o mais eficiente para quem tem pouco tempo. Core 2× por semana e um Tabata a meio para o condicionamento.',
  4: 'Parte de cima e pernas, duas vezes cada (A e B). Cada músculo 2× por semana com dois dias de descanso. Core depois das pernas e um Tabata curto a seguir à parte de cima.',
  5: 'Empurrar, puxar e pernas, depois parte de cima e pernas outra vez: cada músculo 2× por semana, com descanso a meio. Core 2× por semana.',
  6: 'Empurrar, puxar e pernas duas vezes (A e B), o clássico PPL de 6 dias: cada músculo 2× por semana com variantes diferentes. Core 2× por semana.',
  7: 'O plano de 6 dias mais mobilidade ao domingo. Lembra-te: é no descanso que o músculo cresce.',
};
const PLAN_WHY_GYM = {
  1: 'Um treino de corpo inteiro com core. Mantém a forma; para evoluir a sério, tenta pelo menos 2 por semana.',
  2: 'Corpo inteiro A e B, com 2–3 dias de descanso entre eles. Cada músculo é treinado 2× por semana e o core tem uma sessão própria em cada dia.',
  3: 'Corpo inteiro A, B e C em dias alternados: agachamento, peso morto e búlgaro a rodar, cada músculo 3× por semana. Core 2× por semana.',
  4: 'Parte de cima e pernas, duas vezes cada (A e B): o plano de 4 dias mais usado por treinadores. Cada músculo 2× por semana, core depois das pernas.',
  5: 'Empurrar, puxar e pernas, depois parte de cima e pernas outra vez: cada músculo 2× por semana, com descanso a meio. Core 2× por semana.',
  6: 'Empurrar, puxar e pernas duas vezes (A e B), o clássico PPL de 6 dias: cada músculo 2× por semana com variantes diferentes. Core 2× por semana.',
  7: 'O plano de 6 dias mais mobilidade ao domingo. Lembra-te: é no descanso que o músculo cresce.',
};
/* material que precisas em casa */
Object.entries({ row: 'mesa robusta', rowsup: 'mesa robusta', dips: 'cadeira', decline: 'cadeira', bulgarian: 'cadeira', wallsit: 'parede' }).forEach(([k, v]) => { EX[k].kit = v; });
const BODYWEIGHT = ['pullup', 'chinup', 'dipsbar', 'hangleg', 'abwheel'];
