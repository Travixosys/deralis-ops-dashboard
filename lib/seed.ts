import type {
  ActivityEntry,
  Client,
  DailyActivity,
  Job,
  JobStatus,
  JobType,
  Priority,
  TeamMember,
} from "./types";
import { STATUS_LABEL, TYPE_LABEL } from "./labels";

// Every name, site and figure below is fictional sample data for the demo.

export const CLIENTS: Client[] = [
  { id: "client-001", name: "Foncière Méridienne", short: "MER", industry: "Immobilier commercial" },
  { id: "client-002", name: "Laboratoires Solaris", short: "SOL", industry: "Laboratoire pharmaceutique" },
  { id: "client-003", name: "Crestline Logistique", short: "CRE", industry: "Entrepôts et distribution" },
  { id: "client-004", name: "Clinique du Port", short: "CLP", industry: "Santé" },
  { id: "client-005", name: "Atlas Gestion Privée", short: "ATL", industry: "Gestion de patrimoine" },
];

// Phone numbers sit in the range ARCEP reserves for fiction (06 39 98 xx xx).
export const TEAM: TeamMember[] = [
  { id: "tm-001", name: "Karim Benali", role: "Agent de rondes confirmé", initials: "KB", availability: "on_duty", phone: "06 39 98 01 01" },
  { id: "tm-002", name: "Aïcha Diallo", role: "Agente de contrôle d'accès", initials: "AD", availability: "on_duty", phone: "06 39 98 01 02" },
  { id: "tm-003", name: "Jérôme Okafor", role: "Chef d'équipe intervention", initials: "JO", availability: "on_duty", phone: "06 39 98 01 03" },
  { id: "tm-004", name: "Sofia Martins", role: "Agente d'escorte et d'accueil", initials: "SM", availability: "on_duty", phone: "06 39 98 01 04" },
  { id: "tm-005", name: "Didier Lambert", role: "Chef de poste", initials: "DL", availability: "on_break", phone: "06 39 98 01 05" },
  { id: "tm-006", name: "Inès Moreau", role: "Agente de rondes", initials: "IM", availability: "on_duty", phone: "06 39 98 01 06" },
  { id: "tm-007", name: "Thomas Brunet", role: "Opérateur PC sécurité", initials: "TB", availability: "off_duty", phone: "06 39 98 01 07" },
  { id: "tm-008", name: "Élise Vasseur", role: "Superviseure terrain", initials: "EV", availability: "on_duty", phone: "06 39 98 01 08" },
];

export const SUPERVISOR = "Élise Vasseur";

/** The incident the guided journey starts from. */
export const SEED_INCIDENT_ID = "job-024";

type JobSeed = {
  id: string;
  client: string;
  type: JobType;
  assignee: string;
  status: JobStatus;
  location: string;
  /** Hours from now. Seeding relative to the visit keeps statuses coherent at any time of day. */
  start: number;
  end: number;
  priority: Priority;
  notes: string;
  /** Hours from now when the mission was created. */
  created: number;
};

const JOB_SEEDS: JobSeed[] = [
  // Planifiées
  { id: "job-001", client: "client-001", type: "patrol", assignee: "tm-001", status: "pending", location: "Tour Méridienne, hall et parking niveau -2", start: 3, end: 7, priority: "medium", notes: "Ronde du soir : hall, parkings -1 et -2, accès toiture.", created: -30 },
  { id: "job-002", client: "client-002", type: "access", assignee: "tm-002", status: "pending", location: "Campus Solaris, bâtiment C, aile laboratoires", start: 17, end: 25, priority: "high", notes: "Vérification des lecteurs biométriques de la nouvelle aile. Tests de badges avec le service informatique.", created: -28 },
  { id: "job-003", client: "client-003", type: "post", assignee: "tm-005", status: "pending", location: "Entrepôt Crestline 7, portail principal", start: 16, end: 28, priority: "medium", notes: "Poste de 12 h au portail. Contrôle des bons de livraison avec le planning de quai.", created: -26 },
  { id: "job-004", client: "client-004", type: "escort", assignee: "tm-004", status: "pending", location: "Clinique du Port, aile est, couloir pharmacie", start: 5, end: 6.5, priority: "high", notes: "Escorte d'une livraison de médicaments du quai à la réserve sécurisée. Double signature exigée.", created: -9 },
  { id: "job-005", client: "client-005", type: "patrol", assignee: "tm-006", status: "pending", location: "Siège Atlas, étage direction (12e)", start: 28, end: 32, priority: "low", notes: "Ronde après fermeture. Contrôle des scellés de la salle serveurs et des fenêtres.", created: -7 },
  { id: "job-006", client: "client-001", type: "alarm", assignee: "tm-003", status: "pending", location: "Centre commercial Méridienne, cellule 14", start: 7, end: 11, priority: "medium", notes: "Astreinte levée de doute sur le centre commercial pour la nuit.", created: -5 },
  { id: "job-008", client: "client-003", type: "patrol", assignee: "tm-006", status: "pending", location: "Entrepôt Crestline 7, quais et clôture", start: 4, end: 12, priority: "high", notes: "Ronde périmétrique de nuit, angles morts vidéo compris. Signaler toute clôture endommagée.", created: -20 },
  { id: "job-014", client: "client-002", type: "access", assignee: "tm-007", status: "pending", location: "Campus Solaris, bâtiment A, salle serveurs", start: 20, end: 28, priority: "critical", notes: "Contrôle d'accès renforcé pendant la migration des serveurs. Chaque entrée et sortie consignée.", created: -22 },

  // En cours
  { id: "job-007", client: "client-002", type: "post", assignee: "tm-005", status: "in_progress", location: "Campus Solaris, accueil principal", start: -6, end: 4, priority: "medium", notes: "Poste d'accueil : badges visiteurs et registre des véhicules.", created: -50 },
  { id: "job-009", client: "client-004", type: "access", assignee: "tm-002", status: "in_progress", location: "Clinique du Port, aile nord, entrée du personnel", start: -5, end: 5, priority: "medium", notes: "Vérification des badges du personnel. Vigilance sur les entrées en talonnage.", created: -30 },
  { id: "job-011", client: "client-003", type: "post", assignee: "tm-008", status: "in_progress", location: "Crestline, centre de distribution, PC vidéo", start: -4, end: 4, priority: "high", notes: "Surveillance des caméras et coordination des rondes. Toute anomalie consignée immédiatement.", created: -48 },
  { id: "job-013", client: "client-004", type: "alarm", assignee: "tm-003", status: "in_progress", location: "Clinique du Port, aile sud, urgences", start: -3, end: 5, priority: "high", notes: "Couverture levée de doute du service des urgences. Intervention prioritaire.", created: -27 },

  // Incident ouvert
  { id: SEED_INCIDENT_ID, client: "client-001", type: "patrol", assignee: "tm-001", status: "incident", location: "Centre commercial Méridienne, issue de secours arrière", start: -7, end: 1, priority: "critical", notes: "Issue de secours arrière trouvée forcée en début de ronde. Zone sécurisée, images vidéo en cours d'analyse, police prévenue.", created: -32 },

  // Terminées
  { id: "job-010", client: "client-001", type: "escort", assignee: "tm-004", status: "completed", location: "Tour Méridienne, étages 8 à 12", start: -8, end: -5, priority: "medium", notes: "Accompagnement d'une visite client VIP. Terminé sans incident.", created: -33 },
  { id: "job-012", client: "client-005", type: "patrol", assignee: "tm-006", status: "completed", location: "Siège Atlas, tous étages", start: -9, end: -2, priority: "medium", notes: "Ronde de jour terminée. Salles de réunion et accueil visiteurs contrôlés.", created: -32 },
  { id: "job-015", client: "client-001", type: "patrol", assignee: "tm-001", status: "completed", location: "Centre commercial Méridienne, périmètre complet", start: -32, end: -24, priority: "medium", notes: "Ronde du matin terminée. Aucun incident, tous les accès fermés.", created: -80 },
  { id: "job-016", client: "client-002", type: "escort", assignee: "tm-004", status: "completed", location: "Campus Solaris, bâtiment B, direction", start: -28, end: -26, priority: "high", notes: "Escorte d'un administrateur du parking à la direction. Sans incident.", created: -76 },
  { id: "job-017", client: "client-003", type: "alarm", assignee: "tm-003", status: "completed", location: "Entrepôt Crestline 3, zone B", start: -37, end: -35.5, priority: "high", notes: "Fausse alarme due à un capteur défectueux en zone B. Capteur réarmé, maintenance prévenue.", created: -37 },
  { id: "job-018", client: "client-004", type: "post", assignee: "tm-005", status: "completed", location: "Clinique du Port, entrée principale", start: -33, end: -21, priority: "medium", notes: "Poste de 12 h terminé. 247 visiteurs enregistrés, 3 refus d'accès (pièce d'identité absente).", created: -84 },
  { id: "job-019", client: "client-005", type: "access", assignee: "tm-002", status: "completed", location: "Siège Atlas, salle informatique", start: -55, end: -46, priority: "high", notes: "Audit des accès de la salle informatique. 2 badges expirés désactivés.", created: -100 },
  { id: "job-020", client: "client-001", type: "post", assignee: "tm-008", status: "completed", location: "Tour Méridienne, parking niveau -1", start: -45, end: -33, priority: "low", notes: "Surveillance de nuit du parking. Aucun incident, comptage des véhicules rapproché en fin de poste.", created: -96 },
  { id: "job-021", client: "client-003", type: "patrol", assignee: "tm-006", status: "completed", location: "Crestline, centre de distribution, site complet", start: -43, end: -35, priority: "medium", notes: "Ronde de nuit terminée. Éclairage défaillant en zone D, ticket de maintenance ouvert.", created: -98 },
  { id: "job-022", client: "client-002", type: "alarm", assignee: "tm-003", status: "completed", location: "Campus Solaris, bâtiment A, laboratoire", start: -40, end: -38.5, priority: "critical", notes: "Alarme intrusion au laboratoire. Agent sur place en 4 min. Cause : chercheur sorti sans badger. Levée de doute négative.", created: -40 },
  { id: "job-023", client: "client-004", type: "escort", assignee: "tm-004", status: "completed", location: "Clinique du Port, aile ouest, maternité", start: -27, end: -25.5, priority: "low", notes: "Accompagnement d'un transfert de patiente vers la sortie. Sans incident.", created: -50 },
];

/** Rounds to the quarter hour so seeded times read like a real planning. */
function at(now: number, hours: number): string {
  const quarter = 15 * 60 * 1000;
  return new Date(Math.round((now + hours * 3_600_000) / quarter) * quarter).toISOString();
}

export function memberName(id: string): string {
  return TEAM.find((m) => m.id === id)?.name ?? "";
}

export function clientById(id: string): Client {
  return CLIENTS.find((c) => c.id === id) ?? CLIENTS[0];
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export interface SeedState {
  seededAt: string;
  jobs: Job[];
  team: TeamMember[];
  activity: ActivityEntry[];
  daily: DailyActivity[];
}

export function createSeed(nowMs: number = Date.now()): SeedState {
  const jobs: Job[] = JOB_SEEDS.map((s) => ({
    id: s.id,
    reference: `SEC-2026-${1000 + Number(s.id.slice(4))}`,
    clientId: s.client,
    type: s.type,
    assigneeId: s.assignee,
    status: s.status,
    location: s.location,
    scheduledStart: at(nowMs, s.start),
    scheduledEnd: at(nowMs, s.end),
    priority: s.priority,
    notes: s.notes,
    createdAt: at(nowMs, s.created),
  }));

  const activity: ActivityEntry[] = [];
  let n = 1;
  const push = (e: Omit<ActivityEntry, "id">) => activity.push({ ...e, id: `seed-${n++}` });

  for (const s of JOB_SEEDS) {
    const job = jobs.find((j) => j.id === s.id)!;
    const who = memberName(s.assignee);
    push({ jobId: s.id, timestamp: at(nowMs, s.created), type: "created", description: `Mission créée : ${TYPE_LABEL[s.type].toLowerCase()}, ${s.location}`, actor: "Système" });
    push({ jobId: s.id, timestamp: at(nowMs, s.created + 0.5), type: "assignee_changed", description: `Affectée à ${who}`, actor: SUPERVISOR });
    if (s.status === "in_progress" || s.status === "completed" || s.status === "incident") {
      push({ jobId: s.id, timestamp: job.scheduledStart, type: "status_change", description: `${STATUS_LABEL.pending} → ${STATUS_LABEL.in_progress}`, actor: who, from: "pending", to: "in_progress" });
    }
    if (s.status === "completed") {
      push({ jobId: s.id, timestamp: job.scheduledEnd, type: "status_change", description: `${STATUS_LABEL.in_progress} → ${STATUS_LABEL.completed}`, actor: who, from: "in_progress", to: "completed" });
      push({ jobId: s.id, timestamp: at(nowMs, s.end + 0.25), type: "note_added", description: "Rapport de fin de mission déposé.", actor: who });
    }
    if (s.status === "incident") {
      push({ jobId: s.id, timestamp: at(nowMs, -6.25), type: "status_change", description: `${STATUS_LABEL.in_progress} → ${STATUS_LABEL.incident}`, actor: who, from: "in_progress", to: "incident" });
      push({ jobId: s.id, timestamp: at(nowMs, -6), type: "priority_changed", description: "Priorité relevée de Haute à Critique", actor: SUPERVISOR });
      push({ jobId: s.id, timestamp: at(nowMs, -5.5), type: "note_added", description: "Zone sécurisée, police prévenue. Analyse des images vidéo en cours. Karim est sur place depuis le début de sa vacation.", actor: who });
    }
  }

  const daily: DailyActivity[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(nowMs);
    d.setDate(d.getDate() - i);
    daily.push({
      date: d.toISOString().slice(0, 10),
      completed: 5 + Math.floor(seededRandom(i) * 8),
      incidents: seededRandom(i + 200) > 0.75 ? 1 : 0,
    });
  }

  return {
    seededAt: new Date(nowMs).toISOString(),
    jobs,
    team: TEAM.map((m) => ({ ...m })),
    activity,
    daily,
  };
}

/** Client requests that arrive when the visitor presses "Recevoir une demande client". */
export const REQUEST_TEMPLATES: {
  client: string;
  type: JobType;
  location: string;
  inHours: number;
  duration: number;
  priority: Priority;
  notes: string;
}[] = [
  { client: "client-003", type: "alarm", location: "Entrepôt Crestline 5, porte est", inHours: 0.75, duration: 2, priority: "high", notes: "Demande du client : alarme intrusion déclenchée à la porte est, levée de doute demandée dès que possible." },
  { client: "client-005", type: "escort", location: "Siège Atlas, parking visiteurs", inHours: 2, duration: 1.5, priority: "medium", notes: "Demande du client : accompagnement d'un transport de documents confidentiels jusqu'au coffre." },
  { client: "client-002", type: "post", location: "Campus Solaris, bâtiment D, accueil", inHours: 18, duration: 8, priority: "medium", notes: "Demande du client : renfort à l'accueil pour un audit réglementaire d'une journée." },
];

/** What an agent reports when the visitor simulates an incident, by mission type. */
export const INCIDENT_NOTES: Record<JobType, string> = {
  patrol: "Clôture endommagée découverte pendant la ronde. Zone balisée, photos transmises au client.",
  access: "Tentative d'entrée sans badge valide, personne retenue à l'accueil en attendant le responsable du site.",
  alarm: "Nouvelle alarme sur la même zone pendant l'intervention. Doute non levé, renfort demandé.",
  escort: "Itinéraire bloqué par un véhicule non autorisé. Escorte immobilisée, client informé.",
  post: "Colis abandonné signalé près du poste. Périmètre de sécurité installé, en attente de consignes.",
};
