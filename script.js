/**
 * ==============================================================================
 * RIVAS CF - SISTEMA OFICIAL DE ESTADÍSTICAS Y GESTIÓN DE PLANTILLA
 * Proyecto Académico de Ingeniería en Sistemas
 * 
 * Módulos del Sistema:
 * - STORAGE: Persistencia en LocalStorage para Rivas CF
 * - SQUAD DATA: Plantilla oficial completa de Rivas CF y partidos de liga
 * - STATS: Motor de cálculo estadístico del club, desglose de plantilla y OVR
 * - CHART: Motor Canvas de goleadores del primer equipo de Rivas CF
 * - UI: Controlador de vistas, fichas técnicas, inscripción y bajas de jugadores
 * ==============================================================================
 */

// Claves utilizadas en LocalStorage
const STORAGE_KEYS = {
  PLAYERS: 'rivas_cf_players_v1',
  MATCHES: 'rivas_cf_matches_v1',
  INITIALIZED: 'rivas_cf_initialized_v1'
};

const CLUB_NAME = "Rivas CF";

/* ==============================================================================
 * 1. GENERADOR DE AVATARES VECTORIALES (SVG) NATIVOS DE RIVAS CF
 * ============================================================================== */
function generatePlayerAvatar(name, number, position) {
  const cleanName = (name || 'Jugador').replace('(Demo)', '').trim();
  const parts = cleanName.split(' ');
  const initials = parts.length > 1 
    ? (parts[0][0] + parts[1][0]).toUpperCase() 
    : cleanName.substring(0, 2).toUpperCase();

  let bgGradient1 = '#1e293b';
  let bgGradient2 = '#0f172a';
  let accent = '#10b981';

  if (position === 'Delantero') {
    bgGradient1 = '#064e3b';
    bgGradient2 = '#022c22';
    accent = '#10b981';
  } else if (position === 'Centrocampista') {
    bgGradient1 = '#0c4a6e';
    bgGradient2 = '#082f49';
    accent = '#38bdf8';
  } else if (position === 'Defensa') {
    bgGradient1 = '#78350f';
    bgGradient2 = '#451a03';
    accent = '#f59e0b';
  } else if (position === 'Portero') {
    bgGradient1 = '#581c87';
    bgGradient2 = '#3b0764';
    accent = '#a855f7';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      <linearGradient id="g_${number}_${position}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGradient1}" />
        <stop offset="100%" stop-color="${bgGradient2}" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="50" fill="url(#g_${number}_${position})" />
    <circle cx="50" cy="50" r="46" fill="none" stroke="${accent}" stroke-width="2.5" stroke-dasharray="4 2" opacity="0.7"/>
    <text x="50" y="46" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${initials}</text>
    <rect x="34" y="67" width="32" height="18" rx="9" fill="${accent}" />
    <text x="50" y="77" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-weight="900" font-size="11" fill="#000000" text-anchor="middle" dominant-baseline="middle">#${number}</text>
  </svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/* ==============================================================================
 * 2. PLANTILLA OFICIAL DE RIVAS CF (DATOS INICIALES) Y PARTIDOS DE LIGA
 * ============================================================================== */
const INITIAL_RIVAS_SQUAD = [
  // Delanteros
  { id: 'r1', name: "Mateo Fernández", number: 9, position: "Delantero", team: CLUB_NAME, matches: 10, goals: 12, assists: 4, height: 184, nationality: "Argentina 🇦🇷", preferredFoot: "Derecha", isCaptain: false, photo: "" },
  { id: 'r2', name: "Lucas Ramírez", number: 11, position: "Delantero", team: CLUB_NAME, matches: 10, goals: 8, assists: 5, height: 180, nationality: "Colombia 🇨🇴", preferredFoot: "Izquierda", isCaptain: false, photo: "" },
  { id: 'r3', name: "Sebastián Mora", number: 7, position: "Delantero", team: CLUB_NAME, matches: 9, goals: 7, assists: 3, height: 176, nationality: "España 🇪🇸", preferredFoot: "Derecha", isCaptain: false, photo: "" },
  { id: 'r4', name: "Gabriel Soto", number: 17, position: "Delantero", team: CLUB_NAME, matches: 8, goals: 5, assists: 2, height: 174, nationality: "Chile 🇨🇱", preferredFoot: "Izquierda", isCaptain: false, photo: "" },
  { id: 'r5', name: "Carlos Bacca Díaz", number: 19, position: "Delantero", team: CLUB_NAME, matches: 7, goals: 4, assists: 1, height: 182, nationality: "Colombia 🇨🇴", preferredFoot: "Derecha", isCaptain: false, photo: "" },
  { id: 'r6', name: "Emiliano Ruiz", number: 21, position: "Delantero", team: CLUB_NAME, matches: 5, goals: 2, assists: 1, height: 185, nationality: "Uruguay 🇺🇾", preferredFoot: "Derecha", isCaptain: false, photo: "" },

  // Centrocampistas
  { id: 'r7', name: "David Gómez", number: 10, position: "Centrocampista", team: CLUB_NAME, matches: 10, goals: 5, assists: 9, height: 177, nationality: "España 🇪🇸", preferredFoot: "Ambidiestra", isCaptain: true, photo: "" },
  { id: 'r8', name: "Andrés Valenzuela", number: 8, position: "Centrocampista", team: CLUB_NAME, matches: 10, goals: 4, assists: 7, height: 179, nationality: "Colombia 🇨🇴", preferredFoot: "Derecha", isCaptain: false, photo: "" },
  { id: 'r9', name: "Julián Castro", number: 6, position: "Centrocampista", team: CLUB_NAME, matches: 9, goals: 3, assists: 4, height: 175, nationality: "Argentina 🇦🇷", preferredFoot: "Derecha", isCaptain: false, photo: "" },
  { id: 'r10', name: "Nicolás Pardo", number: 14, position: "Centrocampista", team: CLUB_NAME, matches: 8, goals: 2, assists: 3, height: 181, nationality: "Chile 🇨🇱", preferredFoot: "Izquierda", isCaptain: false, photo: "" },
  { id: 'r11', name: "Martín Benítez", number: 16, position: "Centrocampista", team: CLUB_NAME, matches: 7, goals: 1, assists: 2, height: 176, nationality: "España 🇪🇸", preferredFoot: "Derecha", isCaptain: false, photo: "" },
  { id: 'r12', name: "Rodrigo Herrera", number: 20, position: "Centrocampista", team: CLUB_NAME, matches: 6, goals: 1, assists: 1, height: 180, nationality: "México 🇲🇽", preferredFoot: "Derecha", isCaptain: false, photo: "" },

  // Defensas
  { id: 'r13', name: "Sergio Navas Ramos", number: 4, position: "Defensa", team: CLUB_NAME, matches: 10, goals: 2, assists: 1, height: 185, nationality: "España 🇪🇸", preferredFoot: "Derecha", isCaptain: false, photo: "" },
  { id: 'r14', name: "Marcos Benítez", number: 3, position: "Defensa", team: CLUB_NAME, matches: 10, goals: 1, assists: 2, height: 182, nationality: "Argentina 🇦🇷", preferredFoot: "Izquierda", isCaptain: false, photo: "" },
  { id: 'r15', name: "Lucas Quintana", number: 5, position: "Defensa", team: CLUB_NAME, matches: 10, goals: 1, assists: 0, height: 187, nationality: "Uruguay 🇺🇾", preferredFoot: "Derecha", isCaptain: false, photo: "" },
  { id: 'r16', name: "Alejandro Torres", number: 2, position: "Defensa", team: CLUB_NAME, matches: 9, goals: 0, assists: 3, height: 178, nationality: "México 🇲🇽", preferredFoot: "Derecha", isCaptain: false, photo: "" },
  { id: 'r17', name: "Daniel Morales", number: 15, position: "Defensa", team: CLUB_NAME, matches: 7, goals: 0, assists: 1, height: 183, nationality: "España 🇪🇸", preferredFoot: "Izquierda", isCaptain: false, photo: "" },
  { id: 'r18', name: "Hugo Silva", number: 22, position: "Defensa", team: CLUB_NAME, matches: 6, goals: 0, assists: 0, height: 180, nationality: "Colombia 🇨🇴", preferredFoot: "Derecha", isCaptain: false, photo: "" },

  // Porteros
  { id: 'r19', name: "David Soria Morales", number: 1, position: "Portero", team: CLUB_NAME, matches: 10, goals: 0, assists: 0, height: 186, nationality: "España 🇪🇸", preferredFoot: "Ambidiestra", isCaptain: true, photo: "" },
  { id: 'r20', name: "Carlos Conde Ríos", number: 13, position: "Portero", team: CLUB_NAME, matches: 2, goals: 0, assists: 0, height: 189, nationality: "Colombia 🇨🇴", preferredFoot: "Derecha", isCaptain: false, photo: "" }
];

const INITIAL_RIVAS_MATCHES = [
  { id: 'm1', date: '2026-09-05', homeTeam: CLUB_NAME, homeGoals: 3, awayTeam: 'AD Parla', awayGoals: 1 },
  { id: 'm2', date: '2026-09-12', homeTeam: 'CD Móstoles', homeGoals: 1, awayTeam: CLUB_NAME, awayGoals: 2 },
  { id: 'm3', date: '2026-09-19', homeTeam: CLUB_NAME, homeGoals: 2, awayTeam: 'RSD Alcalá', awayGoals: 2 },
  { id: 'm4', date: '2026-09-26', homeTeam: 'Las Rozas CF', homeGoals: 0, awayTeam: CLUB_NAME, awayGoals: 3 },
  { id: 'm5', date: '2026-10-03', homeTeam: CLUB_NAME, homeGoals: 4, awayTeam: 'Pozuelo CF', awayGoals: 2 },
  { id: 'm6', date: '2026-10-10', homeTeam: 'Alcobendas CF', homeGoals: 2, awayTeam: CLUB_NAME, awayGoals: 2 },
  { id: 'm7', date: '2026-10-17', homeTeam: CLUB_NAME, homeGoals: 2, awayTeam: 'San Fernando', awayGoals: 1 },
  { id: 'm8', date: '2026-10-24', homeTeam: 'Rayo Majadahonda B', homeGoals: 3, awayTeam: CLUB_NAME, awayGoals: 2 },
  { id: 'm9', date: '2026-10-31', homeTeam: CLUB_NAME, homeGoals: 3, awayTeam: 'Villaverde CF', awayGoals: 0 },
  { id: 'm10', date: '2026-11-07', homeTeam: 'AD Alcorcón B', homeGoals: 1, awayTeam: CLUB_NAME, awayGoals: 2 }
];

const LEAGUE_RIVALS = [
  "AD Parla",
  "CD Móstoles",
  "RSD Alcalá",
  "Las Rozas CF",
  "Pozuelo CF",
  "Alcobendas CF",
  "San Fernando",
  "Rayo Majadahonda B",
  "Villaverde CF",
  "AD Alcorcón B"
];

/* ==============================================================================
 * 3. SERVICIO DE ALMACENAMIENTO (LOCALSTORAGE)
 * ============================================================================== */
const StorageService = {
  init() {
    try {
      const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
      if (!isInitialized) {
        this.resetToDemo();
      }
    } catch (e) {
      console.warn('LocalStorage restringido, usando memoria volátil:', e);
    }
  },

  getPlayers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error al leer plantilla de LocalStorage:', e);
      return [];
    }
  },

  savePlayers(players) {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    } catch (e) {
      console.error('Error al guardar plantilla en LocalStorage:', e);
    }
  },

  getMatches() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MATCHES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error al leer partidos de LocalStorage:', e);
      return [];
    }
  },

  saveMatches(matches) {
    try {
      localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
    } catch (e) {
      console.error('Error al guardar partidos en LocalStorage:', e);
    }
  },

  resetToDemo() {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(INITIAL_RIVAS_SQUAD));
      localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(INITIAL_RIVAS_MATCHES));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    } catch (e) {
      console.error('Error al restaurar plantilla de Rivas CF:', e);
    }
  }
};

/* ==============================================================================
 * 4. SERVICIO DE ESTADÍSTICAS Y CÁLCULOS DE RIVAS CF
 * ============================================================================== */
const StatsService = {
  /**
   * Cálculo de rendimiento deportivo OVR (50-99) y valor de mercado (€M)
   */
  calculatePlayerPerformance(player) {
    const matches = Number(player.matches) || 0;
    const goals = Number(player.goals) || 0;
    const assists = Number(player.assists) || 0;
    const position = player.position || 'Delantero';
    const isCaptain = Boolean(player.isCaptain);

    let baseScore = 60;
    if (matches > 0) baseScore += Math.min(15, matches * 1.5);

    let offensiveBonus = 0;
    if (position === 'Delantero') {
      offensiveBonus = (goals * 2.2) + (assists * 1.4);
    } else if (position === 'Centrocampista') {
      offensiveBonus = (assists * 2.5) + (goals * 1.8);
    } else if (position === 'Defensa') {
      offensiveBonus = (matches * 1.2) + (goals * 3.0) + (assists * 2.0);
    } else if (position === 'Portero') {
      offensiveBonus = (matches * 1.8);
    }

    if (isCaptain) baseScore += 3;

    let rating = Math.round(baseScore + offensiveBonus);
    rating = Math.max(50, Math.min(99, rating));

    let category = 'En Desarrollo';
    let ratingClass = 'rating-developing';
    if (rating >= 90) {
      category = 'Estrella del Club';
      ratingClass = 'rating-elite';
    } else if (rating >= 80) {
      category = 'Jugador Clave';
      ratingClass = 'rating-pro';
    } else if (rating >= 70) {
      category = 'Titular Confiable';
      ratingClass = 'rating-solid';
    }

    let marketValueMillions = Math.pow(Math.max(0, rating - 48), 1.85) * 0.065 + (goals * 0.9) + (assists * 0.6);
    marketValueMillions = Math.max(0.5, Math.round(marketValueMillions * 10) / 10);

    const goalsPerMatch = matches > 0 ? (goals / matches).toFixed(2) : '0.00';
    const assistsPerMatch = matches > 0 ? (assists / matches).toFixed(2) : '0.00';

    return {
      rating,
      category,
      ratingClass,
      marketValueFormatted: `€ ${marketValueMillions.toFixed(1)}M`,
      marketValueMillions,
      goalsPerMatch,
      assistsPerMatch
    };
  },

  /**
   * Resumen y desglose de la plantilla de Rivas CF
   */
  getSquadBreakdown(players) {
    const total = players.length;
    const goalkeepers = players.filter(p => p.position === 'Portero').length;
    const defenders = players.filter(p => p.position === 'Defensa').length;
    const midfielders = players.filter(p => p.position === 'Centrocampista').length;
    const forwards = players.filter(p => p.position === 'Delantero').length;

    const captains = players.filter(p => p.isCaptain).map(p => p.name);
    const captainLabel = captains.length > 0 ? captains.join(', ') : 'Ninguno';

    return {
      total,
      goalkeepers,
      defenders,
      midfielders,
      forwards,
      captainLabel
    };
  },

  /**
   * Estadísticas consolidadas de Rivas CF en la temporada
   */
  getClubStats(players, matches) {
    const totalPlayers = players.length;
    let rivasMatchesCount = 0;
    let won = 0;
    let drawn = 0;
    let lost = 0;
    let rivasGoals = 0;
    let goalsAgainst = 0;

    matches.forEach(m => {
      const isHome = (m.homeTeam === CLUB_NAME);
      const isAway = (m.awayTeam === CLUB_NAME);

      if (isHome || isAway) {
        rivasMatchesCount++;
        const myGoals = isHome ? Number(m.homeGoals) || 0 : Number(m.awayGoals) || 0;
        const opGoals = isHome ? Number(m.awayGoals) || 0 : Number(m.homeGoals) || 0;

        rivasGoals += myGoals;
        goalsAgainst += opGoals;

        if (myGoals > opGoals) won++;
        else if (myGoals < opGoals) lost++;
        else drawn++;
      }
    });

    const totalAssists = players.reduce((acc, p) => acc + (Number(p.assists) || 0), 0);

    return {
      totalPlayers,
      totalMatches: rivasMatchesCount,
      won,
      drawn,
      lost,
      totalGoals: rivasGoals,
      goalsAgainst,
      totalAssists,
      recordText: `${won}V &bull; ${drawn}E &bull; ${lost}D`
    };
  },

  /**
   * Tabla general de posiciones de la liga donde compite Rivas CF
   */
  calculateStandings(matches) {
    const teamsMap = {};

    const allTeams = new Set([CLUB_NAME, ...LEAGUE_RIVALS]);
    matches.forEach(m => {
      if (m.homeTeam) allTeams.add(m.homeTeam.trim());
      if (m.awayTeam) allTeams.add(m.awayTeam.trim());
    });

    allTeams.forEach(t => {
      teamsMap[t] = {
        name: t,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      };
    });

    matches.forEach(m => {
      const home = teamsMap[m.homeTeam];
      const away = teamsMap[m.awayTeam];
      if (!home || !away) return;

      const hG = Number(m.homeGoals) || 0;
      const aG = Number(m.awayGoals) || 0;

      home.played += 1;
      away.played += 1;
      home.goalsFor += hG;
      home.goalsAgainst += aG;
      away.goalsFor += aG;
      away.goalsAgainst += hG;

      if (hG > aG) {
        home.won += 1;
        home.points += 3;
        away.lost += 1;
      } else if (hG < aG) {
        away.won += 1;
        away.points += 3;
        home.lost += 1;
      } else {
        home.drawn += 1;
        home.points += 1;
        away.drawn += 1;
        away.points += 1;
      }
    });

    const standings = Object.values(teamsMap).map(t => {
      t.goalDifference = t.goalsFor - t.goalsAgainst;
      return t;
    });

    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.name.localeCompare(b.name);
    });

    return standings;
  },

  getTopScorers(players, limit = 5) {
    return [...players]
      .filter(p => (Number(p.goals) || 0) > 0)
      .sort((a, b) => (Number(b.goals) || 0) - (Number(a.goals) || 0))
      .slice(0, limit);
  },

  getTopAssists(players, limit = 5) {
    return [...players]
      .filter(p => (Number(p.assists) || 0) > 0)
      .sort((a, b) => (Number(b.assists) || 0) - (Number(a.assists) || 0))
      .slice(0, limit);
  }
};

/* ==============================================================================
 * 5. MOTOR DE GRÁFICOS CON CANVAS (GOLEADORES DE RIVAS CF)
 * ============================================================================== */
const ChartRenderer = {
  renderGoalsChart(canvasId, players) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 600;
    const height = 260;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Goleadores destacados de Rivas CF
    const data = [...players]
      .filter(p => Number(p.goals) > 0)
      .sort((a, b) => Number(b.goals) - Number(a.goals))
      .slice(0, 6)
      .map(p => ({
        label: `#${p.number} ${p.name.split(' ')[0]}`,
        value: Number(p.goals)
      }));

    if (data.length === 0) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Sin goles registrados en la plantilla de Rivas CF', width / 2, height / 2);
      return;
    }

    const padding = { top: 30, right: 25, bottom: 45, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...data.map(d => d.value), 5);
    const yMax = Math.ceil(maxValue * 1.25);

    // Grid lines
    const gridLines = 4;
    ctx.strokeStyle = '#1e2c44';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= gridLines; i++) {
      const val = Math.round((yMax / gridLines) * i);
      const y = padding.top + chartHeight - (val / yMax) * chartHeight;

      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillText(val.toString(), padding.left - 8, y + 4);
    }

    const barSpacing = chartWidth / data.length;
    const barWidth = Math.min(barSpacing * 0.55, 45);

    data.forEach((item, index) => {
      const x = padding.left + index * barSpacing + (barSpacing - barWidth) / 2;
      const barHeight = (item.value / yMax) * chartHeight;
      const y = padding.top + chartHeight - barHeight;

      const gradient = ctx.createLinearGradient(0, y, 0, padding.top + chartHeight);
      gradient.addColorStop(0, '#10b981');
      gradient.addColorStop(1, '#064e3b');

      ctx.fillStyle = gradient;
      const radius = 5;
      ctx.beginPath();
      ctx.moveTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.lineTo(x + barWidth - radius, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
      ctx.lineTo(x + barWidth, padding.top + chartHeight);
      ctx.lineTo(x, padding.top + chartHeight);
      ctx.closePath();
      ctx.fill();

      // Borde brillante superior
      ctx.strokeStyle = '#00ff87';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + barWidth - radius, y);
      ctx.stroke();

      // Número de goles arriba
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 8);

      // Nombre del jugador abajo
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.fillText(item.label, x + barWidth / 2, height - padding.bottom + 20);
    });
  }
};

/* ==============================================================================
 * 6. GESTOR DE INTERFAZ DE USUARIO (UI CONTROLLER)
 * ============================================================================== */
const UIManager = {
  players: [],
  matches: [],
  standings: [],
  currentTab: 'dashboard',
  pendingConfirmAction: null,
  activeDetailPlayerId: null,

  init() {
    StorageService.init();
    this.loadData();
    this.bindEvents();
    this.renderAll();
    this.setDefaultDate();

    window.addEventListener('resize', () => {
      if (this.currentTab === 'dashboard') {
        ChartRenderer.renderGoalsChart('goalsChart', this.players);
      }
    });
  },

  loadData() {
    this.players = StorageService.getPlayers();
    this.matches = StorageService.getMatches();
    this.standings = StatsService.calculateStandings(this.matches);
  },

  setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    const matchDateInput = document.getElementById('matchDate');
    if (matchDateInput) {
      matchDateInput.value = today;
    }
  },

  getPlayerPhotoUrl(player) {
    if (player.photo && player.photo.trim() !== '') {
      return player.photo;
    }
    return generatePlayerAvatar(player.name, player.number, player.position);
  },

  processImageFile(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 220;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        callback(compressedDataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  bindEvents() {
    // 1. Navegación
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchTab(tab);
      });
    });

    document.querySelectorAll('.view-all-link').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchTab(tab);
      });
    });

    // 2. Menú móvil
    const openSidebarBtn = document.getElementById('openSidebarBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebar = document.getElementById('sidebar');

    if (openSidebarBtn) {
      openSidebarBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('show');
      });
    }

    const closeSidebar = () => {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('show');
    };

    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

    // 3. Botones rápidos
    const headerNewPlayerBtn = document.getElementById('headerNewPlayerBtn');
    if (headerNewPlayerBtn) headerNewPlayerBtn.addEventListener('click', () => this.openPlayerModal());

    const headerNewMatchBtn = document.getElementById('headerNewMatchBtn');
    if (headerNewMatchBtn) {
      headerNewMatchBtn.addEventListener('click', () => {
        this.switchTab('matches');
        const awayInput = document.getElementById('matchAwayTeam');
        if (awayInput) awayInput.focus();
      });
    }

    const addPlayerBtn = document.getElementById('addPlayerBtn');
    if (addPlayerBtn) addPlayerBtn.addEventListener('click', () => this.openPlayerModal());

    const addPlayerFromProfilesBtn = document.getElementById('addPlayerFromProfilesBtn');
    if (addPlayerFromProfilesBtn) addPlayerFromProfilesBtn.addEventListener('click', () => this.openPlayerModal());

    // 4. Subida y limpieza de foto en el formulario
    const photoFileInput = document.getElementById('playerPhotoFile');
    const photoPreviewImg = document.getElementById('photoPreviewImg');
    const photoPreviewFallback = document.getElementById('photoPreviewFallback');
    const photoDataInput = document.getElementById('playerPhotoData');
    const removePhotoBtn = document.getElementById('removePhotoBtn');

    if (photoFileInput) {
      photoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          if (!file.type.startsWith('image/')) {
            this.showToast('Por favor selecciona un archivo de imagen válido.', 'warning');
            return;
          }
          this.processImageFile(file, (dataUrl) => {
            photoDataInput.value = dataUrl;
            photoPreviewImg.src = dataUrl;
            photoPreviewImg.style.display = 'block';
            photoPreviewFallback.style.display = 'none';
            if (removePhotoBtn) removePhotoBtn.style.display = 'inline-block';
            this.showToast('Fotografía cargada y optimizada para Rivas CF.', 'info');
          });
        }
      });
    }

    if (removePhotoBtn) {
      removePhotoBtn.addEventListener('click', () => {
        photoDataInput.value = '';
        photoFileInput.value = '';
        photoPreviewImg.style.display = 'none';
        photoPreviewImg.src = '';
        photoPreviewFallback.style.display = 'block';
        removePhotoBtn.style.display = 'none';
        this.showToast('Fotografía removida (se generará el avatar oficial de Rivas CF).', 'info');
      });
    }

    // 5. Previsualización de Rendimiento en Tiempo Real
    const updateLivePerformance = () => {
      const position = document.getElementById('playerPosition')?.value || 'Delantero';
      const matches = parseInt(document.getElementById('playerMatches')?.value, 10) || 0;
      const goals = parseInt(document.getElementById('playerGoals')?.value, 10) || 0;
      const assists = parseInt(document.getElementById('playerAssists')?.value, 10) || 0;
      const isCaptain = document.getElementById('playerIsCaptain')?.checked || false;

      const perf = StatsService.calculatePlayerPerformance({ position, matches, goals, assists, isCaptain });
      
      const badge = document.getElementById('liveRatingBadge');
      const catText = document.getElementById('liveCategoryText');
      const valText = document.getElementById('liveMarketValueText');

      if (badge) {
        badge.textContent = `${perf.rating} OVR`;
        badge.className = `badge ${perf.ratingClass}`;
      }
      if (catText) catText.textContent = perf.category;
      if (valText) valText.textContent = perf.marketValueFormatted;
    };

    ['playerMatches', 'playerGoals', 'playerAssists', 'playerPosition'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', updateLivePerformance);
        el.addEventListener('change', updateLivePerformance);
      }
    });
    const captainCheck = document.getElementById('playerIsCaptain');
    if (captainCheck) captainCheck.addEventListener('change', updateLivePerformance);

    // 6. Formularios
    const playerForm = document.getElementById('playerForm');
    if (playerForm) {
      playerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSavePlayer();
      });
    }

    const matchForm = document.getElementById('matchForm');
    if (matchForm) {
      matchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveMatch();
      });
    }

    // 7. Filtros y Búsqueda de Plantilla (Tabla)
    const searchInput = document.getElementById('playerSearchInput');
    const posFilter = document.getElementById('playerPositionFilter');
    const captainOnlyCheck = document.getElementById('playerCaptainOnly');
    const sortSelect = document.getElementById('playerSortSelect');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');

    if (searchInput) searchInput.addEventListener('input', () => this.renderPlayersTable());
    if (posFilter) posFilter.addEventListener('change', () => this.renderPlayersTable());
    if (captainOnlyCheck) captainOnlyCheck.addEventListener('change', () => this.renderPlayersTable());
    if (sortSelect) sortSelect.addEventListener('change', () => this.renderPlayersTable());
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        posFilter.value = '';
        if (captainOnlyCheck) captainOnlyCheck.checked = false;
        sortSelect.value = 'goals-desc';
        this.renderPlayersTable();
      });
    }

    // 8. Filtros de Fichas Técnicas
    const profileSearchInput = document.getElementById('profileSearchInput');
    const profilePosFilter = document.getElementById('profilePositionFilter');
    const profileSortSelect = document.getElementById('profileSortSelect');
    const profileCaptainOnly = document.getElementById('profileCaptainOnly');
    const clearProfileFiltersBtn = document.getElementById('clearProfileFiltersBtn');

    if (profileSearchInput) profileSearchInput.addEventListener('input', () => this.renderProfilesGrid());
    if (profilePosFilter) profilePosFilter.addEventListener('change', () => this.renderProfilesGrid());
    if (profileSortSelect) profileSortSelect.addEventListener('change', () => this.renderProfilesGrid());
    if (profileCaptainOnly) profileCaptainOnly.addEventListener('change', () => this.renderProfilesGrid());
    if (clearProfileFiltersBtn) {
      clearProfileFiltersBtn.addEventListener('click', () => {
        profileSearchInput.value = '';
        profilePosFilter.value = '';
        profileSortSelect.value = 'rating-desc';
        profileCaptainOnly.checked = false;
        this.renderProfilesGrid();
      });
    }

    // 9. Modal Detallado: Editar
    const detailEditBtn = document.getElementById('detailEditPlayerBtn');
    if (detailEditBtn) {
      detailEditBtn.addEventListener('click', () => {
        if (this.activeDetailPlayerId) {
          const id = this.activeDetailPlayerId;
          this.closeModal('playerDetailModal');
          setTimeout(() => this.openPlayerModal(id), 150);
        }
      });
    }

    // 10. Modales de cierre
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = e.currentTarget.dataset.modal;
        this.closeModal(modalId);
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) backdrop.classList.remove('show');
      });
    });

    // 11. Modal Confirmación
    const confirmActionBtn = document.getElementById('confirmModalActionBtn');
    if (confirmActionBtn) {
      confirmActionBtn.addEventListener('click', () => {
        if (typeof this.pendingConfirmAction === 'function') {
          this.pendingConfirmAction();
        }
        this.closeModal('confirmModal');
      });
    }

    // 12. Restablecer Plantilla a Datos Iniciales
    const resetDataBtn = document.getElementById('resetDataBtn');
    if (resetDataBtn) {
      resetDataBtn.addEventListener('click', () => {
        this.showConfirmDialog(
          'Restablecer Plantilla Oficial',
          '¿Estás seguro de que deseas restablecer la plantilla oficial de Rivas CF a sus 20 jugadores iniciales y marcadores de temporada?',
          '🔄',
          () => {
            StorageService.resetToDemo();
            this.loadData();
            this.renderAll();
            this.showToast('Plantilla oficial de Rivas CF restaurada correctamente.', 'info');
          }
        );
      });
    }
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.content-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetSection = document.getElementById(`${tabId}Section`);
    if (targetSection) targetSection.classList.add('active');

    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');

    const titles = {
      dashboard: { title: 'Rivas CF \u2022 Panel de Rendimiento', subtitle: 'Estadísticas del club, máximos goleadores e historial de temporada' },
      players: { title: 'Plantilla Oficial \u2022 Rivas CF', subtitle: 'Gestión y control de la plantilla del primer equipo' },
      profiles: { title: 'Fichas Técnicas de Jugadores \u2022 Rivas CF', subtitle: 'Cartas deportivas de scouting, atributos físicos y valoración OVR' },
      matches: { title: 'Partidos del Club \u2022 Rivas CF', subtitle: 'Resultados oficiales e historial de encuentros de la temporada' },
      standings: { title: 'Clasificación de Liga \u2022 Rivas CF', subtitle: 'Tabla oficial del campeonato con Rivas CF en competencia' }
    };

    if (titles[tabId]) {
      pageTitle.textContent = titles[tabId].title;
      pageSubtitle.textContent = titles[tabId].subtitle;
    }

    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');

    if (tabId === 'dashboard') {
      setTimeout(() => ChartRenderer.renderGoalsChart('goalsChart', this.players), 50);
    } else if (tabId === 'profiles') {
      this.renderProfilesGrid();
    }
  },

  renderAll() {
    this.renderKpis();
    this.renderSquadChips();
    this.renderDashboardLists();
    this.renderPlayersTable();
    this.renderProfilesGrid();
    this.renderMatchesList();
    this.renderStandingsTable();
    this.populateTeamsOptions();
    ChartRenderer.renderGoalsChart('goalsChart', this.players);
  },

  // 1. Renderizar Tarjetas KPI de Rivas CF
  renderKpis() {
    const clubStats = StatsService.getClubStats(this.players, this.matches);
    document.getElementById('kpiPlayers').textContent = clubStats.totalPlayers;
    document.getElementById('kpiMatches').textContent = clubStats.totalMatches;
    document.getElementById('kpiGoals').textContent = clubStats.totalGoals;
    document.getElementById('kpiAssists').textContent = clubStats.totalAssists;

    const meta = document.getElementById('kpiMatchesMeta');
    if (meta) meta.innerHTML = clubStats.recordText;
  },

  // 2. Renderizar Chips de Desglose de la Plantilla de Rivas CF
  renderSquadChips() {
    const breakdown = StatsService.getSquadBreakdown(this.players);
    const chipTotal = document.getElementById('chipTotalPlayers');
    const chipGk = document.getElementById('chipGoalkeepers');
    const chipDef = document.getElementById('chipDefenders');
    const chipMid = document.getElementById('chipMidfielders');
    const chipFwd = document.getElementById('chipForwards');
    const chipCap = document.getElementById('chipCaptain');

    if (chipTotal) chipTotal.textContent = breakdown.total;
    if (chipGk) chipGk.textContent = breakdown.goalkeepers;
    if (chipDef) chipDef.textContent = breakdown.defenders;
    if (chipMid) chipMid.textContent = breakdown.midfielders;
    if (chipFwd) chipFwd.textContent = breakdown.forwards;
    if (chipCap) chipCap.textContent = breakdown.captainLabel;
  },

  // 3. Renderizar Listas Rápidas del Dashboard
  renderDashboardLists() {
    // Top Goleadores de Rivas CF
    const scorers = StatsService.getTopScorers(this.players, 5);
    const scorersContainer = document.getElementById('topScorersList');
    if (scorersContainer) {
      if (scorers.length === 0) {
        scorersContainer.innerHTML = '<div class="p-3 text-center text-muted">No hay goles registrados en la plantilla.</div>';
      } else {
        scorersContainer.innerHTML = scorers.map((p, idx) => `
          <div class="stat-item" style="cursor: pointer;" onclick="UIManager.openPlayerDetail('${p.id}')">
            <span class="stat-rank rank-${idx + 1}">${idx + 1}</span>
            <img src="${this.getPlayerPhotoUrl(p)}" class="player-table-thumb" alt="${this.escapeHtml(p.name)}">
            <div class="stat-player-info">
              <div class="stat-player-name">${this.escapeHtml(p.name)} ${p.isCaptain ? '<span class="captain-badge-inline">©</span>' : ''}</div>
              <div class="stat-player-team">#${p.number} &bull; ${p.position} &bull; Rivas CF</div>
            </div>
            <div class="stat-number-box">
              <span class="stat-count">${p.goals}</span>
              <div class="stat-label-small">Goles</div>
            </div>
          </div>
        `).join('');
      }
    }

    // Top Asistidores de Rivas CF
    const assists = StatsService.getTopAssists(this.players, 5);
    const assistsContainer = document.getElementById('topAssistsList');
    if (assistsContainer) {
      if (assists.length === 0) {
        assistsContainer.innerHTML = '<div class="p-3 text-center text-muted">No hay asistencias registradas en la plantilla.</div>';
      } else {
        assistsContainer.innerHTML = assists.map((p, idx) => `
          <div class="stat-item" style="cursor: pointer;" onclick="UIManager.openPlayerDetail('${p.id}')">
            <span class="stat-rank rank-${idx + 1}">${idx + 1}</span>
            <img src="${this.getPlayerPhotoUrl(p)}" class="player-table-thumb" alt="${this.escapeHtml(p.name)}">
            <div class="stat-player-info">
              <div class="stat-player-name">${this.escapeHtml(p.name)} ${p.isCaptain ? '<span class="captain-badge-inline">©</span>' : ''}</div>
              <div class="stat-player-team">#${p.number} &bull; ${p.position} &bull; Rivas CF</div>
            </div>
            <div class="stat-number-box">
              <span class="stat-count">${p.assists}</span>
              <div class="stat-label-small">Asist.</div>
            </div>
          </div>
        `).join('');
      }
    }

    // Últimos Partidos de Rivas CF
    const rivasMatches = this.matches.filter(m => m.homeTeam === CLUB_NAME || m.awayTeam === CLUB_NAME);
    const recent = [...rivasMatches].slice(-4).reverse();
    const recentContainer = document.getElementById('recentMatchesList');
    if (recentContainer) {
      if (recent.length === 0) {
        recentContainer.innerHTML = '<div class="p-3 text-center text-muted">No hay partidos de Rivas CF registrados aún.</div>';
      } else {
        recentContainer.innerHTML = recent.map(m => `
          <div class="match-item-compact">
            <span class="match-compact-date">${m.date}</span>
            <div class="match-compact-teams">
              <span style="${m.homeTeam === CLUB_NAME ? 'color: var(--accent-green-bright); font-weight: 700;' : ''}">${this.escapeHtml(m.homeTeam)}</span>
              <span class="match-compact-score">${m.homeGoals} - ${m.awayGoals}</span>
              <span style="${m.awayTeam === CLUB_NAME ? 'color: var(--accent-green-bright); font-weight: 700;' : ''}">${this.escapeHtml(m.awayTeam)}</span>
            </div>
          </div>
        `).join('');
      }
    }
  },

  // 4. Renderizar Tabla de la Plantilla de Rivas CF (Optimizada con eliminación directa)
  renderPlayersTable() {
    const tbody = document.getElementById('playersTableBody');
    const emptyState = document.getElementById('noPlayersMessage');
    const countLabel = document.getElementById('playerCountLabel');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');

    const search = (document.getElementById('playerSearchInput')?.value || '').toLowerCase().trim();
    const posFilter = document.getElementById('playerPositionFilter')?.value || '';
    const captainOnly = document.getElementById('playerCaptainOnly')?.checked || false;
    const sortBy = document.getElementById('playerSortSelect')?.value || 'goals-desc';

    const hasFilters = search !== '' || posFilter !== '' || captainOnly;
    if (clearFiltersBtn) {
      clearFiltersBtn.style.display = hasFilters ? 'inline-block' : 'none';
    }

    let filtered = this.players.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search) || 
                          (p.nationality && p.nationality.toLowerCase().includes(search));
      const matchPos = posFilter === '' || p.position === posFilter;
      const matchCaptain = !captainOnly || Boolean(p.isCaptain);
      return matchSearch && matchPos && matchCaptain;
    });

    filtered.sort((a, b) => {
      const perfA = StatsService.calculatePlayerPerformance(a);
      const perfB = StatsService.calculatePlayerPerformance(b);

      switch (sortBy) {
        case 'goals-desc':
          return (Number(b.goals) || 0) - (Number(a.goals) || 0);
        case 'assists-desc':
          return (Number(b.assists) || 0) - (Number(a.assists) || 0);
        case 'rating-desc':
          return perfB.rating - perfA.rating;
        case 'number-asc':
          return (Number(a.number) || 0) - (Number(b.number) || 0);
        case 'matches-desc':
          return (Number(b.matches) || 0) - (Number(a.matches) || 0);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    if (countLabel) {
      countLabel.textContent = `Mostrando ${filtered.length} de ${this.players.length} jugadores en la plantilla de Rivas CF`;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    tbody.innerHTML = filtered.map(p => {
      const posClass = `pos-${p.position.toLowerCase()}`;
      const perf = StatsService.calculatePlayerPerformance(p);
      const photoUrl = this.getPlayerPhotoUrl(p);

      return `
        <tr>
          <td><span class="jersey-badge">#${p.number}</span></td>
          <td>
            <div class="player-cell-with-photo">
              <img src="${photoUrl}" class="player-table-thumb" alt="${this.escapeHtml(p.name)}">
              <div>
                <div class="player-name-wrapper">
                  <strong>${this.escapeHtml(p.name)}</strong>
                  ${p.isCaptain ? '<span class="captain-badge-inline" title="Capitán de Rivas CF">© CAPITÁN</span>' : ''}
                </div>
                <small class="text-muted">Rivas CF &bull; ${p.preferredFoot || 'Derecha'}</small>
              </div>
            </div>
          </td>
          <td><span class="badge-pos ${posClass}">${p.position}</span></td>
          <td>${p.height ? p.height + ' cm' : '180 cm'} &bull; ${p.nationality || 'España 🇪🇸'}</td>
          <td class="text-center font-bold">${p.matches}</td>
          <td class="text-center font-bold text-accent-green" style="color: var(--accent-green-bright);">${p.goals}</td>
          <td class="text-center font-bold text-accent-blue" style="color: var(--accent-blue);">${p.assists}</td>
          <td class="text-center">
            <span class="badge-rating ${perf.ratingClass}" title="${perf.category} - ${perf.marketValueFormatted}">
              ${perf.rating} OVR
            </span>
          </td>
          <td class="text-center">
            <div style="display: flex; gap: 0.35rem; justify-content: center;">
              <button class="btn-icon btn-icon-sm" onclick="UIManager.openPlayerDetail('${p.id}')" title="Ver Ficha Técnica Completa">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;"><rect x="3" y="4" width="18" height="16" rx="3"></rect><circle cx="9" cy="10" r="2.5"></circle><path d="M15 8h2"></path><path d="M15 12h2"></path></svg>
              </button>
              <button class="btn-icon btn-icon-sm" onclick="UIManager.openPlayerModal('${p.id}')" title="Editar Jugador">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button class="btn-icon btn-icon-sm btn-icon-danger" onclick="UIManager.confirmDeletePlayer('${p.id}')" title="Dar de Baja / Eliminar de Rivas CF">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  // 5. Renderizar Fichas Técnicas de Rivas CF (Cartas Coleccionables)
  renderProfilesGrid() {
    const grid = document.getElementById('playerProfilesGrid');
    const emptyState = document.getElementById('noProfilesMessage');
    const countLabel = document.getElementById('profileCountLabel');
    const clearBtn = document.getElementById('clearProfileFiltersBtn');

    if (!grid) return;

    const search = (document.getElementById('profileSearchInput')?.value || '').toLowerCase().trim();
    const posFilter = document.getElementById('profilePositionFilter')?.value || '';
    const sortBy = document.getElementById('profileSortSelect')?.value || 'rating-desc';
    const captainOnly = document.getElementById('profileCaptainOnly')?.checked || false;

    const hasFilters = search !== '' || posFilter !== '' || captainOnly;
    if (clearBtn) clearBtn.style.display = hasFilters ? 'inline-block' : 'none';

    let filtered = this.players.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search) || 
                          (p.nationality && p.nationality.toLowerCase().includes(search));
      const matchPos = posFilter === '' || p.position === posFilter;
      const matchCaptain = !captainOnly || Boolean(p.isCaptain);
      return matchSearch && matchPos && matchCaptain;
    });

    filtered.sort((a, b) => {
      const perfA = StatsService.calculatePlayerPerformance(a);
      const perfB = StatsService.calculatePlayerPerformance(b);

      switch (sortBy) {
        case 'rating-desc':
          return perfB.rating - perfA.rating;
        case 'value-desc':
          return perfB.marketValueMillions - perfA.marketValueMillions;
        case 'height-desc':
          return (Number(b.height) || 0) - (Number(a.height) || 0);
        case 'goals-desc':
          return (Number(b.goals) || 0) - (Number(a.goals) || 0);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    if (countLabel) {
      countLabel.textContent = `Mostrando ${filtered.length} de ${this.players.length} fichas oficiales de Rivas CF`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    grid.innerHTML = filtered.map(p => {
      const perf = StatsService.calculatePlayerPerformance(p);
      const photoUrl = this.getPlayerPhotoUrl(p);
      const posClass = `pos-${p.position.toLowerCase()}`;
      const isCaptain = Boolean(p.isCaptain);

      return `
        <div class="player-scout-card ${isCaptain ? 'is-captain-card' : ''}">
          <!-- Barra Superior -->
          <div class="card-top-bar">
            <div class="card-rating-box">
              <span class="card-rating-number ${perf.ratingClass}">${perf.rating}</span>
              <span class="card-rating-label">OVR</span>
            </div>
            <div class="card-badges-group">
              ${isCaptain ? '<span class="card-captain-ribbon">© CAPITÁN</span>' : ''}
              <span class="badge-pos ${posClass}">${p.position}</span>
            </div>
          </div>

          <!-- Foto y Datos -->
          <div class="card-hero-section">
            <div class="card-avatar-wrapper">
              <img src="${photoUrl}" class="card-avatar-img" alt="${this.escapeHtml(p.name)}">
              <span class="card-jersey-floating">#${p.number}</span>
            </div>
            <h4 class="card-player-title">${this.escapeHtml(p.name)}</h4>
            <span class="card-player-team" style="color: var(--accent-green-bright); font-weight: 600;">Rivas CF</span>
          </div>

          <!-- Atributos Físicos -->
          <div class="card-specs-grid">
            <div class="spec-item">
              <span class="spec-label">Nacionalidad</span>
              <span class="spec-value">${p.nationality || 'España 🇪🇸'}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Altura</span>
              <span class="spec-value">${p.height ? p.height + ' cm' : '180 cm'}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Pierna Hábil</span>
              <span class="spec-value">${p.preferredFoot || 'Derecha'}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Valor Mercado</span>
              <span class="spec-value" style="color: var(--accent-green-bright);">${perf.marketValueFormatted}</span>
            </div>
          </div>

          <!-- Rendimiento Deportivo -->
          <div class="card-perf-section">
            <div class="card-perf-row">
              <span class="text-muted">Nivel: <strong style="color: #ffffff;">${perf.category}</strong></span>
              <span class="font-bold">${perf.rating} / 99</span>
            </div>
            <div class="card-perf-bar-bg">
              <div class="card-perf-bar-fill" style="width: ${perf.rating}%;"></div>
            </div>
          </div>

          <!-- Métricas de Temporada -->
          <div class="card-metrics-row">
            <span>PJ: <strong>${p.matches}</strong></span>
            <span>Goles: <strong style="color: var(--accent-green-bright);">${p.goals}</strong></span>
            <span>Asist: <strong style="color: var(--accent-blue);">${p.assists}</strong></span>
            <span>G/PJ: <strong>${perf.goalsPerMatch}</strong></span>
          </div>

          <!-- Botón Ficha -->
          <div class="card-footer-action">
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-secondary" style="flex: 1;" onclick="UIManager.openPlayerDetail('${p.id}')">
                Ficha Técnica
              </button>
              <button class="btn btn-outline-danger" onclick="UIManager.confirmDeletePlayer('${p.id}')" title="Dar de Baja">
                🗑️
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  // 6. Ficha Técnica Detallada en Modal
  openPlayerDetail(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return;

    this.activeDetailPlayerId = playerId;
    const perf = StatsService.calculatePlayerPerformance(player);
    const photoUrl = this.getPlayerPhotoUrl(player);
    const posClass = `pos-${player.position.toLowerCase()}`;
    const modal = document.getElementById('playerDetailModal');
    const modalBody = document.getElementById('playerDetailModalBody');
    const modalTitle = document.getElementById('playerDetailModalTitle');

    if (modalTitle) modalTitle.textContent = `Ficha Técnica: ${player.name} \u2022 Rivas CF`;

    modalBody.innerHTML = `
      <div class="detail-hero-banner">
        <img src="${photoUrl}" class="detail-avatar-large" alt="${this.escapeHtml(player.name)}">
        <div class="detail-hero-info">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span class="jersey-badge">#${player.number}</span>
            <span class="badge-pos ${posClass}">${player.position}</span>
            ${player.isCaptain ? '<span class="card-captain-ribbon">© CAPITÁN</span>' : ''}
          </div>
          <h2 class="detail-hero-name">${this.escapeHtml(player.name)}</h2>
          <div class="detail-hero-meta">
            <span class="badge badge-accent">Rivas CF</span>
            <span class="badge ${perf.ratingClass}">${perf.rating} OVR &bull; ${perf.category}</span>
          </div>
        </div>
      </div>

      <div class="detail-stats-grid">
        <div class="detail-stat-box">
          <div class="detail-stat-val text-accent-green" style="color: var(--accent-green-bright);">${player.goals}</div>
          <div class="detail-stat-lbl">Goles Totales</div>
        </div>
        <div class="detail-stat-box">
          <div class="detail-stat-val text-accent-blue" style="color: var(--accent-blue);">${player.assists}</div>
          <div class="detail-stat-lbl">Asistencias</div>
        </div>
        <div class="detail-stat-box">
          <div class="detail-stat-val">${player.matches}</div>
          <div class="detail-stat-lbl">Partidos Jugados</div>
        </div>
      </div>

      <div class="detail-attributes-list">
        <div class="detail-attr-item">
          <span class="detail-attr-label">Club Oficial</span>
          <span class="detail-attr-val" style="color: var(--accent-green-bright);">Rivas CF</span>
        </div>
        <div class="detail-attr-item">
          <span class="detail-attr-label">Nacionalidad</span>
          <span class="detail-attr-val">${player.nationality || 'España 🇪🇸'}</span>
        </div>
        <div class="detail-attr-item">
          <span class="detail-attr-label">Altura Física</span>
          <span class="detail-attr-val">${player.height ? player.height + ' cm' : '180 cm'}</span>
        </div>
        <div class="detail-attr-item">
          <span class="detail-attr-label">Pierna Hábil</span>
          <span class="detail-attr-val">${player.preferredFoot || 'Derecha'}</span>
        </div>
        <div class="detail-attr-item">
          <span class="detail-attr-label">Valor de Mercado Estimado</span>
          <span class="detail-attr-val" style="color: var(--accent-green-bright);">${perf.marketValueFormatted}</span>
        </div>
        <div class="detail-attr-item">
          <span class="detail-attr-label">Promedio Goles / Partido</span>
          <span class="detail-attr-val">${perf.goalsPerMatch} G/PJ</span>
        </div>
      </div>
    `;

    modal.classList.add('show');
  },

  // 7. Abrir Modal de Inscribir o Editar Jugador en Rivas CF
  openPlayerModal(playerId = null) {
    const modal = document.getElementById('playerModal');
    const modalTitle = document.getElementById('playerModalTitle');
    const idInput = document.getElementById('playerId');
    const photoDataInput = document.getElementById('playerPhotoData');
    const photoFileInput = document.getElementById('playerPhotoFile');
    const photoPreviewImg = document.getElementById('photoPreviewImg');
    const photoPreviewFallback = document.getElementById('photoPreviewFallback');
    const removePhotoBtn = document.getElementById('removePhotoBtn');

    const nameInput = document.getElementById('playerName');
    const numberInput = document.getElementById('playerNumber');
    const posInput = document.getElementById('playerPosition');
    const heightInput = document.getElementById('playerHeight');
    const nationalityInput = document.getElementById('playerNationality');
    const footInput = document.getElementById('playerPreferredFoot');
    const captainCheck = document.getElementById('playerIsCaptain');
    const matchesInput = document.getElementById('playerMatches');
    const goalsInput = document.getElementById('playerGoals');
    const assistsInput = document.getElementById('playerAssists');

    if (photoFileInput) photoFileInput.value = '';

    if (playerId) {
      const player = this.players.find(p => p.id === playerId);
      if (!player) return;

      modalTitle.textContent = 'Editar Jugador de Rivas CF';
      idInput.value = player.id;
      photoDataInput.value = player.photo || '';
      nameInput.value = player.name;
      numberInput.value = player.number;
      posInput.value = player.position;
      heightInput.value = player.height || 180;
      nationalityInput.value = player.nationality || 'España 🇪🇸';
      footInput.value = player.preferredFoot || 'Derecha';
      captainCheck.checked = Boolean(player.isCaptain);
      matchesInput.value = player.matches;
      goalsInput.value = player.goals;
      assistsInput.value = player.assists;

      if (player.photo && player.photo.trim() !== '') {
        photoPreviewImg.src = player.photo;
        photoPreviewImg.style.display = 'block';
        photoPreviewFallback.style.display = 'none';
        if (removePhotoBtn) removePhotoBtn.style.display = 'inline-block';
      } else {
        photoPreviewImg.style.display = 'none';
        photoPreviewFallback.style.display = 'block';
        if (removePhotoBtn) removePhotoBtn.style.display = 'none';
      }
    } else {
      modalTitle.textContent = 'Inscribir Jugador en Rivas CF';
      idInput.value = '';
      photoDataInput.value = '';
      nameInput.value = '';
      numberInput.value = '';
      posInput.value = '';
      heightInput.value = 180;
      nationalityInput.value = 'España 🇪🇸';
      footInput.value = 'Derecha';
      captainCheck.checked = false;
      matchesInput.value = 0;
      goalsInput.value = 0;
      assistsInput.value = 0;

      photoPreviewImg.style.display = 'none';
      photoPreviewFallback.style.display = 'block';
      if (removePhotoBtn) removePhotoBtn.style.display = 'none';
    }

    // Actualizar preview de rendimiento
    const perf = StatsService.calculatePlayerPerformance({
      position: posInput.value || 'Delantero',
      matches: parseInt(matchesInput.value, 10) || 0,
      goals: parseInt(goalsInput.value, 10) || 0,
      assists: parseInt(assistsInput.value, 10) || 0,
      isCaptain: captainCheck.checked
    });
    const liveBadge = document.getElementById('liveRatingBadge');
    const liveCat = document.getElementById('liveCategoryText');
    const liveVal = document.getElementById('liveMarketValueText');
    if (liveBadge) {
      liveBadge.textContent = `${perf.rating} OVR`;
      liveBadge.className = `badge ${perf.ratingClass}`;
    }
    if (liveCat) liveCat.textContent = perf.category;
    if (liveVal) liveVal.textContent = perf.marketValueFormatted;

    modal.classList.add('show');
    nameInput.focus();
  },

  // 8. Guardar Jugador en Rivas CF (Inscripción / Edición)
  handleSavePlayer() {
    const id = document.getElementById('playerId').value;
    const photo = document.getElementById('playerPhotoData').value.trim();
    const name = document.getElementById('playerName').value.trim();
    const number = parseInt(document.getElementById('playerNumber').value, 10);
    const position = document.getElementById('playerPosition').value;
    const height = parseInt(document.getElementById('playerHeight').value, 10) || 180;
    const nationality = document.getElementById('playerNationality').value.trim() || 'España 🇪🇸';
    const preferredFoot = document.getElementById('playerPreferredFoot').value;
    const isCaptain = document.getElementById('playerIsCaptain').checked;
    const matches = parseInt(document.getElementById('playerMatches').value, 10) || 0;
    const goals = parseInt(document.getElementById('playerGoals').value, 10) || 0;
    const assists = parseInt(document.getElementById('playerAssists').value, 10) || 0;

    if (!name || name.length < 2) {
      this.showToast('El nombre del jugador debe tener al menos 2 caracteres.', 'warning');
      return;
    }

    if (isNaN(number) || number < 1 || number > 99) {
      this.showToast('El dorsal de camiseta debe estar entre 1 y 99.', 'warning');
      return;
    }

    // Verificar si el dorsal ya está ocupado por otro jugador en Rivas CF
    const dorsalOccupied = this.players.find(p => p.number === number && p.id !== id);
    if (dorsalOccupied) {
      this.showToast(`El dorsal #${number} ya lo tiene asignado ${dorsalOccupied.name}.`, 'warning');
      return;
    }

    if (!position) {
      this.showToast('Selecciona una posición válida en el campo.', 'warning');
      return;
    }

    if (matches < 0 || goals < 0 || assists < 0) {
      this.showToast('Los valores estadísticos no pueden ser negativos.', 'warning');
      return;
    }

    const playerData = {
      id: id || ('r_' + Date.now()),
      name,
      number,
      position,
      height,
      nationality,
      preferredFoot,
      isCaptain,
      team: CLUB_NAME,
      matches,
      goals,
      assists,
      photo
    };

    if (id) {
      const index = this.players.findIndex(p => p.id === id);
      if (index !== -1) {
        this.players[index] = playerData;
        this.showToast(`Jugador "${name}" (#${number}) actualizado con éxito en Rivas CF.`, 'success');
      }
    } else {
      this.players.unshift(playerData);
      this.showToast(`Jugador "${name}" (#${number}) inscrito exitosamente en la plantilla de Rivas CF.`, 'success');
    }

    StorageService.savePlayers(this.players);
    this.renderAll();
    this.closeModal('playerModal');
  },

  // 9. Eliminar Jugador de Rivas CF (Baja de Plantilla con Confirmación)
  confirmDeletePlayer(id) {
    const player = this.players.find(p => p.id === id);
    if (!player) return;

    this.showConfirmDialog(
      'Dar de Baja a Jugador',
      `¿Estás seguro de que deseas dar de baja a "${player.name}" (#${player.number} \u2022 ${player.position}) de la plantilla oficial de Rivas CF?`,
      '🗑️',
      () => {
        this.players = this.players.filter(p => p.id !== id);
        StorageService.savePlayers(this.players);
        this.renderAll();
        this.showToast(`Jugador "${player.name}" dado de baja de Rivas CF.`, 'info');
      }
    );
  },

  // 10. Partidos
  handleSaveMatch() {
    const date = document.getElementById('matchDate').value;
    const homeTeam = document.getElementById('matchHomeTeam').value.trim();
    const homeGoals = parseInt(document.getElementById('matchHomeGoals').value, 10);
    const awayTeam = document.getElementById('matchAwayTeam').value.trim();
    const awayGoals = parseInt(document.getElementById('matchAwayGoals').value, 10);

    if (!date) {
      this.showToast('Por favor selecciona la fecha del partido.', 'warning');
      return;
    }

    if (!homeTeam || !awayTeam) {
      this.showToast('Debes ingresar el equipo local y el visitante.', 'warning');
      return;
    }

    if (homeTeam.toLowerCase() === awayTeam.toLowerCase()) {
      this.showToast('El equipo local y el visitante no pueden ser el mismo club.', 'error');
      return;
    }

    if (isNaN(homeGoals) || homeGoals < 0 || isNaN(awayGoals) || awayGoals < 0) {
      this.showToast('Los goles no pueden ser números negativos.', 'warning');
      return;
    }

    const newMatch = {
      id: 'm_' + Date.now(),
      date,
      homeTeam,
      homeGoals,
      awayTeam,
      awayGoals
    };

    this.matches.push(newMatch);
    StorageService.saveMatches(this.matches);
    this.standings = StatsService.calculateStandings(this.matches);
    this.renderAll();

    document.getElementById('matchHomeGoals').value = 0;
    document.getElementById('matchAwayGoals').value = 0;
    document.getElementById('matchAwayTeam').value = '';

    this.showToast(`Partido registrado: ${homeTeam} ${homeGoals} - ${awayGoals} ${awayTeam}.`, 'success');
  },

  confirmDeleteMatch(id) {
    const match = this.matches.find(m => m.id === id);
    if (!match) return;

    this.showConfirmDialog(
      'Eliminar Partido',
      `¿Deseas eliminar el resultado entre ${match.homeTeam} y ${match.awayTeam}?`,
      '⚽',
      () => {
        this.matches = this.matches.filter(m => m.id !== id);
        StorageService.saveMatches(this.matches);
        this.standings = StatsService.calculateStandings(this.matches);
        this.renderAll();
        this.showToast('Partido eliminado y estadísticas actualizadas.', 'info');
      }
    );
  },

  renderMatchesList() {
    const container = document.getElementById('matchesContainer');
    const emptyMsg = document.getElementById('noMatchesMessage');
    const countBadge = document.getElementById('matchesCountBadge');

    if (countBadge) countBadge.textContent = `${this.matches.length} partidos de liga`;

    if (this.matches.length === 0) {
      container.innerHTML = '';
      emptyMsg.style.display = 'block';
      return;
    }

    emptyMsg.style.display = 'none';
    const sorted = [...this.matches].reverse();

    container.innerHTML = sorted.map(m => {
      const hGoals = Number(m.homeGoals) || 0;
      const aGoals = Number(m.awayGoals) || 0;
      const isHomeWinner = hGoals > aGoals;
      const isAwayWinner = aGoals > hGoals;

      return `
        <div class="match-card-item">
          <div class="match-card-main">
            <div class="match-card-header">
              <span>📅 ${m.date}</span>
              <span>&bull;</span>
              <span>Competición Oficial</span>
            </div>
            <div class="match-scoreboard">
              <div class="team-name-col ${isHomeWinner ? 'is-winner' : ''}" style="${m.homeTeam === CLUB_NAME ? 'color: var(--accent-green-bright); font-weight: 700;' : ''}">
                ${this.escapeHtml(m.homeTeam)}
              </div>
              <div class="score-display-box">
                <span>${hGoals}</span>
                <span style="color: var(--text-muted);">-</span>
                <span>${aGoals}</span>
              </div>
              <div class="team-name-col text-right ${isAwayWinner ? 'is-winner' : ''}" style="${m.awayTeam === CLUB_NAME ? 'color: var(--accent-green-bright); font-weight: 700;' : ''}">
                ${this.escapeHtml(m.awayTeam)}
              </div>
            </div>
          </div>
          <div>
            <button class="btn-icon btn-icon-danger" onclick="UIManager.confirmDeleteMatch('${m.id}')" title="Eliminar Partido">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 15px; height: 15px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  renderStandingsTable() {
    const tbody = document.getElementById('standingsTableBody');
    const emptyMsg = document.getElementById('noStandingsMessage');

    if (this.standings.length === 0) {
      tbody.innerHTML = '';
      emptyMsg.style.display = 'block';
      return;
    }

    emptyMsg.style.display = 'none';

    tbody.innerHTML = this.standings.map((team, idx) => {
      const rank = idx + 1;
      let rankClass = '';
      if (rank === 1) rankClass = 'top-1';
      else if (rank === 2) rankClass = 'top-2';
      else if (rank === 3) rankClass = 'top-3';

      const dgSign = team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference;
      const isRivas = (team.name === CLUB_NAME);

      return `
        <tr class="${isRivas ? 'standings-rivas-row' : ''}">
          <td class="text-center rank-cell ${rankClass}">${rank}</td>
          <td class="team-cell">
            <strong>${this.escapeHtml(team.name)}</strong>
            ${isRivas ? '<span class="rivas-badge-tag">⭐ RIVAS CF</span>' : ''}
          </td>
          <td class="text-center">${team.played}</td>
          <td class="text-center">${team.won}</td>
          <td class="text-center">${team.drawn}</td>
          <td class="text-center">${team.lost}</td>
          <td class="text-center">${team.goalsFor}</td>
          <td class="text-center">${team.goalsAgainst}</td>
          <td class="text-center font-bold" style="color: ${team.goalDifference > 0 ? 'var(--accent-green-bright)' : team.goalDifference < 0 ? 'var(--accent-red)' : 'var(--text-secondary)'};">${dgSign}</td>
          <td class="text-center pts-col">${team.points}</td>
        </tr>
      `;
    }).join('');
  },

  populateTeamsOptions() {
    const datalist = document.getElementById('teamsDataList');
    if (datalist) {
      const teams = [CLUB_NAME, ...LEAGUE_RIVALS];
      datalist.innerHTML = teams.map(t => `<option value="${this.escapeHtml(t)}">`).join('');
    }
  },

  showConfirmDialog(title, message, icon, onConfirm) {
    const modal = document.getElementById('confirmModal');
    document.getElementById('confirmModalTitle').textContent = title;
    document.getElementById('confirmModalMessage').textContent = message;
    document.getElementById('confirmModalIcon').textContent = icon;
    this.pendingConfirmAction = onConfirm;
    modal.classList.add('show');
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span>${icon}</span>
        <span>${this.escapeHtml(message)}</span>
      </div>
      <button style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.1rem;">&times;</button>
    `;

    toast.querySelector('button').addEventListener('click', () => toast.remove());
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  UIManager.init();
});
