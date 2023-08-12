import { CompetenceType, Competences } from '@prisma/client'
import { CandidatureCompetencesByType } from './utils'

/**
 * Retourne les compétences avec leur valeur groupée par leur type
 * @param competences - Les compétences à grouper
 * @returns
 * @example
 * const competences = [
 * {
 *  description: 'React',
 *  type: 'FRONTEND'
 * },
 * {
 *  description: 'VueJS',
 *  type: 'FRONTEND'
 * },
 * {
 *  description: 'Node',
 *  type: 'BACKEND'
 * }]
 *
 * const competencesByType = getCompetencesByType(competences)
 *
 * competencesByType = [
 * {
 *  type: 'FRONTEND',
 *  descriptions: ['React', 'VueJS']
 * },
 * {
 *  type: 'BACKEND',
 *  descriptions: ['Node']
 * }]
 **/
export const getCompetencesByType = (
  competences: Pick<Competences, 'description' | 'type'>[],
): CandidatureCompetencesByType[] => {
  const competencesByType: CandidatureCompetencesByType[] = []

  Object.keys(CompetenceType).forEach((key) => {
    const competenceByType = competences?.filter((c) => c.type === key)
    competencesByType.push({
      type: key as CompetenceType,
      descriptions: competenceByType
        ? competenceByType.map((c) => c.description || '')
        : [''],
    })
  })

  return competencesByType.filter((c) => c.descriptions.length > 0)
}

export const getSelectValue = (competence: CompetenceType): string => {
  return {
    BACKEND: 'BACKEND',
    C_SHARP: 'C#',
    JAVA: 'Java',
    PYTHON: 'Python',
    JAVASCRIPT: 'JavaScript',
    SWIFT: 'Swift',
    KOTLIN: 'Kotlin',
    TYPESCRIPT: 'TypeScript',
    PHP: 'PHP',
    RUBY: 'Ruby',
    GO: 'Go',
    RUST: 'Rust',
    SQL: 'SQL',
    HTML_CSS: 'HTML/CSS',
    REACT: 'React',
    ANGULAR: 'Angular',
    VUE_JS: 'Vue.js',
    DJANGO: 'Django',
    RUBY_ON_RAILS: 'Ruby on Rails',
    EXPRESS_JS: 'Express.js',
    SPRING_BOOT: 'Spring Boot',
    FLUTTER: 'Flutter',
    REACT_NATIVE: 'React Native',
    XAMARIN: 'Xamarin',
    NODE_JS: 'Node.js',
    GRAPHQL: 'GraphQL',
    FIREBASE: 'Firebase',
    DOCKER: 'Docker',
    KUBERNETES: 'Kubernetes',
    GIT: 'Git',
    REDUX: 'Redux',
    MOBX: 'MobX',
    VUEX: 'Vuex',
    MICROSERVICES_ARCHITECTURE: 'Architecture de Microservices',
    SERVERLESS_ARCHITECTURE: 'Architecture Serverless',
    POO: 'Programmation Orientée Objet (POO)',
    PROGRAMMATION_FONCTIONNELLE: 'Programmation Fonctionnelle',
    IA_ML_DEVELOPMENT: 'Développement IA/ML (Python, TensorFlow, PyTorch)',
    BLOCKCHAIN_DEVELOPMENT: 'Développement Blockchain (Solidity, Web3.js)',
    C_PLUS_PLUS: 'C++',
    DART: 'Dart',
    REDUX_SAGA: 'Redux-Saga',
    DEVOPS: 'DevOps',
    JENKINS: 'Jenkins',
    AWS_AMPLIFY: 'AWS Amplify',
    DJANGO_REST_FRAMEWORK: 'Django REST framework',
    FIREBASE_AUTHENTICATION: 'Firebase Authentication',
    PLANIFICATION: 'Planification',
    BUDGETISATION: 'Budgétisation',
    RESSOURCES_HUMAINES: 'Ressources humaines',
    GESTION_PROJET: 'Gestion de projet',
    ANALYSE_DONNEES: 'Analyse des données',
    COMMUNICATION_INTERPERSONNELLE: 'Communication interpersonnelle',
    RESOLUTION_PROBLEMES: 'Résolution de problèmes',
    PRISE_DECISION: 'Prise de décision',
    LEADERSHIP: 'Leadership',
    GESTION_TEMPS: 'Gestion du temps',
    GESTION_CHANGEMENT: 'Gestion du changement',
    CONFLITS: 'Gestion des conflits',
    NEGOCIATION: 'Négociation',
    GESTION_RISQUES: 'Gestion des risques',
    MANAGEMENT: 'Management',
    COORDINATION_EQUIPE: "Coordination d'équipe",
    SUIVI_EVALUATION: 'Suivi et évaluation',
    AGILES: 'Méthodes agiles',
    SCRUM: 'Méthodes Scrum',
    CASCADE: 'Méthodes en cascade',
    PRINCE2: 'Méthodes PRINCE2 (Projects in Controlled Environments)',
    ITERATIVES: 'Méthodes itératives',
    KANBAN: 'Kanban',
    SIX_SIGMA: 'Six Sigma',
    TABLEAUX_BORD: 'Tableaux de bord',
    GESTION_QUALITE: 'Gestion de la qualité',
    MANAGEMENT_PROJET: 'Management de projet',
    PORTEFEUILLE_PROJETS: 'Gestion de portefeuille de projets',
    RESSOURCES: 'Gestion des ressources',
    PERFORMANCE: 'Gestion de la performance',
    ACHATS: 'Gestion des achats',
    FOURNISSEURS: 'Gestion des fournisseurs',
    CONTRATS: 'Gestion des contrats',
    APPROVISIONNEMENTS: 'Gestion des approvisionnements',
    CHAINE_LOGISTIQUE: 'Gestion de la chaîne logistique',
    AUDIT: 'Audit',
    ANALYSE_FINANCIERE: 'Analyse financière',
    STOCKS: 'Gestion des stocks',
    VENTES: 'Gestion des ventes',
    RELATIONS_CLIENTS: 'Gestion des relations clients',
    MARKETING: 'Marketing',
    CAMPAGNES_PUBLICITAIRES: 'Gestion des campagnes publicitaires',
    MEDIAS_SOCIAUX: 'Gestion des médias sociaux',
    RELATIONS_PUBLIQUES: 'Gestion des relations publiques',
    PARTENARIATS: 'Gestion des partenariats',
    RECRUTEMENT: 'Recrutement',
    FORMATION: 'Formation',
    EVALUATION_PERFORMANCES: 'Évaluation des performances',
    ANIMATION_REUNION: 'Animation de réunion',
    ADMINISTRATION_SYSTEME: 'Administration système',
    SECURITE_RESEAU: 'Sécurité réseau',
    ROUTAGE: 'Routage',
    COMMUTATION: 'Commutation',
    PARE_FEUX: 'Pare-feu',
    VLAN: 'VLAN',
    TCP_IP: 'TCP/IP',
    DHCP: 'DHCP',
    DNS: 'DNS',
    VPN: 'VPN',
    SURVEILLANCE_RESEAU: 'Network Monitoring',
    DEPANNAGE_RESEAU: 'Network Troubleshooting',
    RESEAU_CLOUD: 'Cloud Networking',
    CONFIGURATION_PARE_FEUX: 'Firewall Configuration',
    EQUIPEMENTS_CISCO: 'Cisco Devices',
    EQUIPEMENTS_JUNIPER: 'Juniper Devices',
    PROTOCOLES_RESEAU: 'Network Protocols (TCP/IP, UDP, ICMP)',
    WAN: 'WAN',
    WLAN: 'WLAN',
    VIRTUALISATION_RESEAU: 'Network Virtualization',
    CABLAGE_RESEAU: 'Network Cabling',
    SERVEUR: 'Server Management',
    RESEAU_CENTRE_DONNEES: 'Data Center Networking',
    DOCUMENTATION_RESEAU: 'Network Documentation',
    MISE_EN_OEUVRE_SECURITE_RESEAU: 'Network Security Implementation',
    PLANIFICATION_CAPACITE_RESEAU: 'Network Capacity Planning',
    INSTALLATION_MATERIEL_RESEAU: 'Network Hardware Installation',
    DEPANNAGE_RESEAU_REPARATION: 'Network Troubleshooting and Repair',
    CONFIGURATION_RESEAU: 'Network Configuration Management',
    SOLUTIONS_STOCKAGE_RESEAU: 'Network Storage Solutions',
    OUTILS_SURVEILLANCE_RESEAU: 'Network Monitoring Tools (Wireshark, Nagios)',
    AUDIT_SECURITE_RESEAU: 'Network Security Auditing',
    SAUVEGARDE_RESTAURATION_RESEAU: 'Network Backup and Restoration',
    OPTIMISATION_WAN: 'WAN Optimization',
    ARCHITECTURE_RESEAU: 'Network Architecture',
    DEPLOIEMENT_RESEAU: 'Network Deployment',
    DEPLOIEMENT_CENTRE_DONNEES: 'Data Center Deployment',
  }[competence]
}
