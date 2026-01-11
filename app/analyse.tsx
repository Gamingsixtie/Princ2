import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useStatisticsStore, ThemaStats } from '../store/statisticsStore';

// Reasoning techniques used in PRINCE2 exams
const redeneertechnieken = {
  eliminatie: {
    naam: 'Eliminatie',
    beschrijving: 'Sluit eerst de duidelijk foute antwoorden uit',
    icon: '🚫',
    kleur: '#ef4444',
  },
  definitie: {
    naam: 'Definitie herkennen',
    beschrijving: 'Herken de exacte PRINCE2-definitie of term',
    icon: '📖',
    kleur: '#3b82f6',
  },
  rol: {
    naam: 'Rol-verantwoordelijkheid',
    beschrijving: 'Wie is verantwoordelijk voor wat?',
    icon: '👤',
    kleur: '#8b5cf6',
  },
  proces: {
    naam: 'Proces-activiteit',
    beschrijving: 'Welk proces/activiteit hoort wanneer?',
    icon: '⚙️',
    kleur: '#06b6d4',
  },
  scenario: {
    naam: 'Scenario analyse',
    beschrijving: 'Pas de theorie toe op de praktijksituatie',
    icon: '🎯',
    kleur: '#10b981',
  },
  negatief: {
    naam: 'Negatieve vraag',
    beschrijving: 'Let op: vraag naar wat NIET klopt',
    icon: '⚠️',
    kleur: '#f59e0b',
  },
};

// Comprehensive theme information with examples
interface ThemaInfo {
  beschrijving: string;
  kernpunten: string[];
  veelgemaakteFouten: string[];
  verbeterTips: string[];
  voorbeeldVraag: {
    vraag: string;
    opties: { key: string; tekst: string }[];
    correct: string;
    redenering: {
      stappen: string[];
      techniek: keyof typeof redeneertechnieken;
      waaromAndereOptiesFout: { key: string; reden: string }[];
    };
  };
}

const themaInfo: Record<string, ThemaInfo> = {
  'Concepten': {
    beschrijving: 'De fundamentele bouwstenen van PRINCE2: geïntegreerde elementen, prestatieaspecten en tailoring.',
    kernpunten: [
      '4 geïntegreerde elementen: principes, thema\'s, processen, projectomgeving',
      '6 prestatieaspecten: kosten, tijd, kwaliteit, scope, risico, baten',
      'Tailoring: aanpassen aan projectomgeving',
    ],
    veelgemaakteFouten: [
      'Verwarring tussen prestatieaspecten en thema\'s',
      'Vergeten dat tailoring verplicht is, niet optioneel',
      'Niet herkennen van geïntegreerde elementen',
    ],
    verbeterTips: [
      'Maak een schema van de 4 geïntegreerde elementen',
      'Onthoud: prestatieaspecten zijn WAT je beheert, thema\'s zijn HOE',
      'Tailoring = aanpassen, niet weglaten van principes',
    ],
    voorbeeldVraag: {
      vraag: 'Welke van de volgende is GEEN geïntegreerd element van PRINCE2?',
      opties: [
        { key: 'A', tekst: 'Principes' },
        { key: 'B', tekst: 'Thema\'s' },
        { key: 'C', tekst: 'Toleranties' },
        { key: 'D', tekst: 'Processen' },
      ],
      correct: 'C',
      redenering: {
        stappen: [
          'Herken dat dit een NEGATIEVE vraag is (vraagt naar wat GEEN element is)',
          'Ken de 4 geïntegreerde elementen: Principes, Thema\'s, Processen, Projectomgeving',
          'Elimineer A, B, D want die zijn wél geïntegreerde elementen',
          'Toleranties horen bij het thema Voortgang, niet bij geïntegreerde elementen',
        ],
        techniek: 'negatief',
        waaromAndereOptiesFout: [
          { key: 'A', reden: 'Principes is WEL een geïntegreerd element (de 7 principes)' },
          { key: 'B', reden: 'Thema\'s is WEL een geïntegreerd element (de 7 thema\'s)' },
          { key: 'D', reden: 'Processen is WEL een geïntegreerd element (de 7 processen)' },
        ],
      },
    },
  },
  'Principes': {
    beschrijving: 'De 7 leidende principes die de basis vormen voor elk PRINCE2-project.',
    kernpunten: [
      '7 principes: zakelijke rechtvaardiging, leren van ervaring, rollen & verantwoordelijkheden, managen per fase, managen bij uitzondering, productgericht, aanpassen aan projectomgeving',
      'Principes zijn universeel en mogen NIET worden weggelaten',
      'Zonder principes is het geen PRINCE2-project',
    ],
    veelgemaakteFouten: [
      'Denken dat principes optioneel zijn',
      'Verwarren van "managen bij uitzondering" met escalatie',
      'Niet herkennen welk principe in een scenario van toepassing is',
    ],
    verbeterTips: [
      'Leer de 7 principes uit je hoofd met voorbeelden',
      'Managen bij uitzondering = delegeren binnen toleranties',
      'Bij scenario-vragen: welk principe lost het probleem op?',
    ],
    voorbeeldVraag: {
      vraag: 'Een projectmanager rapporteert alleen aan de stuurgroep wanneer toleranties dreigen te worden overschreden. Welk principe past hij toe?',
      opties: [
        { key: 'A', tekst: 'Leren van ervaring' },
        { key: 'B', tekst: 'Managen bij uitzondering' },
        { key: 'C', tekst: 'Productgericht' },
        { key: 'D', tekst: 'Zakelijke rechtvaardiging' },
      ],
      correct: 'B',
      redenering: {
        stappen: [
          'Analyseer het scenario: PM rapporteert alleen bij tolerantie-overschrijding',
          'Dit beschrijft exact "managen bij uitzondering"',
          'Dit principe zorgt voor efficiënt management: alleen escaleren bij problemen',
          'De stuurgroep hoeft niet constant betrokken te zijn zolang alles binnen toleranties blijft',
        ],
        techniek: 'scenario',
        waaromAndereOptiesFout: [
          { key: 'A', reden: 'Leren van ervaring gaat over lessen uit vorige projecten gebruiken' },
          { key: 'C', reden: 'Productgericht gaat over focussen op deliverables, niet over rapportage' },
          { key: 'D', reden: 'Zakelijke rechtvaardiging gaat over de business case, niet over rapportage' },
        ],
      },
    },
  },
  'Mensen': {
    beschrijving: 'De rollen, verantwoordelijkheden en communicatie binnen een PRINCE2-projectorganisatie.',
    kernpunten: [
      'Stuurgroep: Executive, Senior User, Senior Supplier',
      'Projectmanager: dagelijkse leiding',
      'Projectborging vs Projectsupport: controle vs ondersteuning',
      'Teammanager: leidt werkpakketten',
    ],
    veelgemaakteFouten: [
      'Verwarren van projectborging (controle) met projectsupport (administratie)',
      'Niet weten dat Executive de eindverantwoordelijke is',
      'Denken dat de PM lid is van de stuurgroep',
    ],
    verbeterTips: [
      'Executive = eigenaar business case = eindverantwoordelijk',
      'Projectborging = "politie" (controleert namens stuurgroep)',
      'Projectsupport = "secretariaat" (helpt de PM)',
    ],
    voorbeeldVraag: {
      vraag: 'Wie is verantwoordelijk voor het goedkeuren van de Business Case?',
      opties: [
        { key: 'A', tekst: 'De Projectmanager' },
        { key: 'B', tekst: 'De Senior User' },
        { key: 'C', tekst: 'De Executive' },
        { key: 'D', tekst: 'De Senior Supplier' },
      ],
      correct: 'C',
      redenering: {
        stappen: [
          'De vraag gaat over verantwoordelijkheid voor de Business Case',
          'De Business Case rechtvaardiging het project zakelijk',
          'De Executive is eigenaar van de Business Case',
          'Eigenaar = verantwoordelijk voor goedkeuring',
        ],
        techniek: 'rol',
        waaromAndereOptiesFout: [
          { key: 'A', reden: 'De PM beheert het project, maar is niet eindverantwoordelijk voor zakelijke rechtvaardiging' },
          { key: 'B', reden: 'Senior User vertegenwoordigt gebruikersbelangen, niet zakelijke rechtvaardiging' },
          { key: 'D', reden: 'Senior Supplier levert resources, is niet eigenaar van business case' },
        ],
      },
    },
  },
  'Business Case': {
    beschrijving: 'Het thema dat zorgt dat het project zakelijk gerechtvaardigd blijft gedurende de hele levenscyclus.',
    kernpunten: [
      'Output → Eindresultaat → Baten',
      'Business Case wordt constant getoetst',
      'Executive is eigenaar',
      'Batenrealisatie vaak NA projectafsluiting',
    ],
    veelgemaakteFouten: [
      'Verwarren van output (product) met eindresultaat (gebruik) met baten (waarde)',
      'Denken dat business case alleen aan het begin wordt gemaakt',
      'Niet weten dat baten pas na het project gerealiseerd worden',
    ],
    verbeterTips: [
      'Output = WAT je maakt (bijv. training)',
      'Eindresultaat = HOE het gebruikt wordt (bijv. getrainde medewerkers)',
      'Baten = WAARDE die het oplevert (bijv. 20% productiviteitsstijging)',
    ],
    voorbeeldVraag: {
      vraag: 'Wat is het verschil tussen een eindresultaat en een bate?',
      opties: [
        { key: 'A', tekst: 'Een eindresultaat is meetbaar, een bate niet' },
        { key: 'B', tekst: 'Een eindresultaat is het gebruik van outputs, een bate is de meetbare verbetering' },
        { key: 'C', tekst: 'Een eindresultaat komt na een bate' },
        { key: 'D', tekst: 'Er is geen verschil' },
      ],
      correct: 'B',
      redenering: {
        stappen: [
          'Ken de definitieketen: Output → Eindresultaat → Baten',
          'Eindresultaat = de verandering in hoe outputs worden gebruikt',
          'Baten = de meetbare verbetering die daaruit voortvloeit',
          'Voorbeeld: Training (output) → Getraind personeel (eindresultaat) → Hogere productiviteit (bate)',
        ],
        techniek: 'definitie',
        waaromAndereOptiesFout: [
          { key: 'A', reden: 'Beide kunnen meetbaar zijn, dit is niet het verschil' },
          { key: 'C', reden: 'Onjuist: eindresultaat komt VOOR de bate' },
          { key: 'D', reden: 'Er is wel degelijk een belangrijk verschil' },
        ],
      },
    },
  },
  'Organisatie': {
    beschrijving: 'De structuur en rollen die nodig zijn om het project te besturen en uit te voeren.',
    kernpunten: [
      'Stuurgroep = beslissingsbevoegd orgaan',
      '3 belangen: Business, User, Supplier',
      'Projectmanager rapporteert aan stuurgroep',
      'Teammanager rapporteert aan PM',
    ],
    veelgemaakteFouten: [
      'Niet begrijpen van de 3 belangen in de stuurgroep',
      'Denken dat de PM onderdeel is van de stuurgroep',
      'Vergeten dat één persoon meerdere rollen kan hebben',
    ],
    verbeterTips: [
      'Teken de organisatiestructuur uit',
      'Business = geld, User = gebruikers, Supplier = leveranciers',
      'Combineren van rollen mag, maar verantwoordelijkheden blijven gescheiden',
    ],
    voorbeeldVraag: {
      vraag: 'Welke drie belangen moeten vertegenwoordigd zijn in de stuurgroep?',
      opties: [
        { key: 'A', tekst: 'Tijd, Kosten, Kwaliteit' },
        { key: 'B', tekst: 'Business, User, Supplier' },
        { key: 'C', tekst: 'Executive, PM, Teammanager' },
        { key: 'D', tekst: 'Planning, Risico, Kwaliteit' },
      ],
      correct: 'B',
      redenering: {
        stappen: [
          'De vraag gaat over belangen in de stuurgroep',
          'A en D zijn prestatieaspecten, geen belangen',
          'C zijn rollen, geen belangen',
          'De 3 belangen zijn: Business (zakelijk), User (gebruiker), Supplier (leverancier)',
        ],
        techniek: 'eliminatie',
        waaromAndereOptiesFout: [
          { key: 'A', reden: 'Dit zijn prestatieaspecten, geen stakeholderbelangen' },
          { key: 'C', reden: 'Dit zijn rollen, geen belangen' },
          { key: 'D', reden: 'Dit zijn thema\'s/aspecten, geen stakeholderbelangen' },
        ],
      },
    },
  },
  'Kwaliteit': {
    beschrijving: 'Zorgen dat producten voldoen aan de verwachtingen en geschikt zijn voor hun doel.',
    kernpunten: [
      'Kwaliteitsborging (QA) = onafhankelijke controle',
      'Kwaliteitsbeheersing (QC) = testen en reviewen',
      'Productbeschrijving = specificatie van kwaliteit',
      'Kwaliteitscriteria = meetbare acceptatiecriteria',
    ],
    veelgemaakteFouten: [
      'Verwarren QA (proces controleren) met QC (product testen)',
      'Niet weten dat QA door projectborging wordt uitgevoerd',
      'Vergeten dat klant kwaliteitsverwachtingen definieert',
    ],
    verbeterTips: [
      'QA = controleert het PROCES (doen we het goed?)',
      'QC = controleert het PRODUCT (is het product goed?)',
      'Kwaliteitsregister = logboek van alle kwaliteitsactiviteiten',
    ],
    voorbeeldVraag: {
      vraag: 'Wat is het verschil tussen kwaliteitsborging en kwaliteitsbeheersing?',
      opties: [
        { key: 'A', tekst: 'Kwaliteitsborging is testen, kwaliteitsbeheersing is documenteren' },
        { key: 'B', tekst: 'Kwaliteitsborging controleert het proces, kwaliteitsbeheersing controleert het product' },
        { key: 'C', tekst: 'Er is geen verschil' },
        { key: 'D', tekst: 'Kwaliteitsborging is alleen voor softwareprojecten' },
      ],
      correct: 'B',
      redenering: {
        stappen: [
          'Ken de definities van QA en QC',
          'QA (Quality Assurance) = borgt dat het PROCES correct wordt gevolgd',
          'QC (Quality Control) = controleert of het PRODUCT aan eisen voldoet',
          'QA is onafhankelijk, QC wordt door het team uitgevoerd',
        ],
        techniek: 'definitie',
        waaromAndereOptiesFout: [
          { key: 'A', reden: 'Omgekeerd: QC doet het testen, niet QA' },
          { key: 'C', reden: 'Er is een belangrijk verschil tussen proces en product controle' },
          { key: 'D', reden: 'QA geldt voor alle projecten, niet alleen software' },
        ],
      },
    },
  },
  'Plannen': {
    beschrijving: 'Het thema voor het maken en onderhouden van plannen op verschillende niveaus.',
    kernpunten: [
      'Planniveaus: Projectplan, Faseplan, Teamplan',
      'Uitzonderingsplan: vervangt huidig plan bij problemen',
      'Product-gebaseerde planning: eerst WAT, dan HOE',
      'Planning = levend document, wordt bijgewerkt',
    ],
    veelgemaakteFouten: [
      'Niet weten welk plan op welk niveau hoort',
      'Vergeten dat teamplan optioneel is',
      'Denken dat plannen statisch zijn',
    ],
    verbeterTips: [
      'Projectplan = hele project (stuurgroep niveau)',
      'Faseplan = één fase (PM niveau)',
      'Teamplan = werkpakket (teammanager niveau)',
      'Uitzonderingsplan = als toleranties worden overschreden',
    ],
    voorbeeldVraag: {
      vraag: 'Wanneer wordt een Uitzonderingsplan gemaakt?',
      opties: [
        { key: 'A', tekst: 'Aan het begin van elke fase' },
        { key: 'B', tekst: 'Als toleranties worden of dreigen te worden overschreden' },
        { key: 'C', tekst: 'Op verzoek van de teammanager' },
        { key: 'D', tekst: 'Bij elke wijziging in het project' },
      ],
      correct: 'B',
      redenering: {
        stappen: [
          'Een Uitzonderingsplan is een speciaal type plan',
          'Het vervangt het huidige plan wanneer normale voortgang niet meer mogelijk is',
          'Dit gebeurt bij (dreigende) tolerantieoverschrijding',
          'Het wordt gemaakt door de PM en goedgekeurd door de stuurgroep',
        ],
        techniek: 'definitie',
        waaromAndereOptiesFout: [
          { key: 'A', reden: 'Aan het begin van een fase maak je een Faseplan, geen Uitzonderingsplan' },
          { key: 'C', reden: 'De teammanager vraagt geen uitzonderingsplan aan, de PM maakt dit' },
          { key: 'D', reden: 'Wijzigingen leiden niet automatisch tot een uitzonderingsplan' },
        ],
      },
    },
  },
  'Risico': {
    beschrijving: 'Het identificeren, beoordelen en beheersen van onzekerheden die het project kunnen beïnvloeden.',
    kernpunten: [
      'Risico = onzekerheid met impact op doelen',
      'Bedreiging = negatief risico',
      'Kans = positief risico (opportunity)',
      '5 stappen: identificeren, beoordelen, plannen, implementeren, communiceren',
    ],
    veelgemaakteFouten: [
      'Alleen aan bedreigingen denken, niet aan kansen',
      'De 5 stappen door elkaar halen',
      'Niet weten wie risico-eigenaar kan zijn',
    ],
    verbeterTips: [
      'PRINCE2 behandelt ook POSITIEVE risico\'s (kansen)',
      'Leer de reacties: vermijden, reduceren, overdragen, accepteren (bedreigingen)',
      'Kansen: exploiteren, versterken, delen, afwijzen',
    ],
    voorbeeldVraag: {
      vraag: 'Welke risicoreactie is ALLEEN geschikt voor kansen (positieve risico\'s)?',
      opties: [
        { key: 'A', tekst: 'Vermijden' },
        { key: 'B', tekst: 'Exploiteren' },
        { key: 'C', tekst: 'Overdragen' },
        { key: 'D', tekst: 'Accepteren' },
      ],
      correct: 'B',
      redenering: {
        stappen: [
          'Herken dat de vraag specifiek naar KANSEN vraagt',
          'Vermijden, Overdragen, Accepteren zijn reacties voor bedreigingen',
          'Exploiteren is het actief benutten van een kans',
          'Bij exploiteren zorg je dat de kans zeker optreedt',
        ],
        techniek: 'definitie',
        waaromAndereOptiesFout: [
          { key: 'A', reden: 'Vermijden is voor bedreigingen (je vermijdt een negatief risico)' },
          { key: 'C', reden: 'Overdragen geldt voor beide, maar is niet exclusief voor kansen' },
          { key: 'D', reden: 'Accepteren geldt voor beide, is niet exclusief voor kansen' },
        ],
      },
    },
  },
  'Issues': {
    beschrijving: 'Het omgaan met problemen, wijzigingsverzoeken en afwijkingen tijdens het project.',
    kernpunten: [
      '3 typen: Verzoek om wijziging, Afwijking, Probleem/zorg',
      'Wijzigingsautoriteit bepaalt wie mag beslissen',
      'Issueregister = logboek van alle issues',
      'Impact op baseline moet worden beoordeeld',
    ],
    veelgemaakteFouten: [
      'Niet kunnen onderscheiden tussen de 3 issue-typen',
      'Vergeten dat wijzigingen formeel moeten worden beoordeeld',
      'Niet weten wie wijzigingsautoriteit heeft',
    ],
    verbeterTips: [
      'Verzoek om wijziging = klant vraagt iets anders',
      'Afwijking = we leveren anders dan gepland',
      'Probleem/zorg = iets wat aandacht vraagt',
    ],
    voorbeeldVraag: {
      vraag: 'De klant vraagt om een extra functionaliteit toe te voegen. Welk type issue is dit?',
      opties: [
        { key: 'A', tekst: 'Afwijking' },
        { key: 'B', tekst: 'Probleem/zorg' },
        { key: 'C', tekst: 'Verzoek om wijziging' },
        { key: 'D', tekst: 'Risico' },
      ],
      correct: 'C',
      redenering: {
        stappen: [
          'Analyseer wat er gebeurt: klant vraagt iets EXTRA',
          'Dit is geen afwijking (we wijken niet af van het plan)',
          'Dit is geen probleem (er is geen fout)',
          'Dit is een verzoek om de scope te wijzigen = Verzoek om wijziging',
        ],
        techniek: 'scenario',
        waaromAndereOptiesFout: [
          { key: 'A', reden: 'Afwijking is wanneer het product anders is dan de specificatie' },
          { key: 'B', reden: 'Probleem/zorg is een issue dat moet worden opgelost, geen verzoek' },
          { key: 'D', reden: 'Een risico is onzekerheid, dit is een concreet verzoek' },
        ],
      },
    },
  },
  'Voortgang': {
    beschrijving: 'Het bewaken en rapporteren van de projectvoortgang en het nemen van beslissingen.',
    kernpunten: [
      'Toleranties: speelruimte voor afwijkingen',
      '6 prestatieaspecten met toleranties: tijd, kosten, kwaliteit, scope, risico, baten',
      'Rapportages: Highlight Report, Checkpoint Report, End Stage Report',
      'Management by Exception = alleen escaleren bij tolerantieoverschrijding',
    ],
    veelgemaakteFouten: [
      'Niet weten welke rapportage bij welk niveau hoort',
      'Verwarren van toleranties met variatie',
      'Niet begrijpen wanneer te escaleren',
    ],
    verbeterTips: [
      'Highlight Report: PM → Stuurgroep (periodiek)',
      'Checkpoint Report: Teammanager → PM (periodiek)',
      'Tolerantie = vooraf afgesproken speelruimte',
      'Overschrijding tolerantie = escalatie naar hogere niveau',
    ],
    voorbeeldVraag: {
      vraag: 'Welk rapport stuurt de Projectmanager periodiek naar de Stuurgroep?',
      opties: [
        { key: 'A', tekst: 'Checkpoint Report' },
        { key: 'B', tekst: 'Highlight Report' },
        { key: 'C', tekst: 'End Project Report' },
        { key: 'D', tekst: 'Lessons Report' },
      ],
      correct: 'B',
      redenering: {
        stappen: [
          'De vraag gaat over periodieke rapportage van PM aan Stuurgroep',
          'Checkpoint Report gaat van Teammanager naar PM',
          'End Project Report is eenmalig aan het einde',
          'Lessons Report is over geleerde lessen',
          'Highlight Report is de periodieke voortgangsrapportage',
        ],
        techniek: 'rol',
        waaromAndereOptiesFout: [
          { key: 'A', reden: 'Checkpoint Report gaat van Teammanager naar PM, niet van PM naar Stuurgroep' },
          { key: 'C', reden: 'End Project Report is eenmalig bij projectafsluiting' },
          { key: 'D', reden: 'Lessons Report is specifiek voor geleerde lessen, niet voor voortgang' },
        ],
      },
    },
  },
  'Processen': {
    beschrijving: 'De 7 processen die beschrijven wat wanneer moet gebeuren in een PRINCE2-project.',
    kernpunten: [
      '7 processen: SU, IP, DP, CS, MP, SB, CP',
      'Starting Up = voor de echte start (pre-project)',
      'Directing = stuurgroep activiteiten',
      'Managing Stage Boundary = overgang tussen fasen',
    ],
    veelgemaakteFouten: [
      'Niet weten welke activiteiten bij welk proces horen',
      'Verwarren van Starting Up met Initiating',
      'Niet weten wie welk proces uitvoert',
    ],
    verbeterTips: [
      'SU (Starting Up) = is het project de moeite waard om te starten?',
      'IP (Initiating) = hoe gaan we het project uitvoeren?',
      'DP (Directing) = stuurgroep beslist op key momenten',
      'Leer de afkortingen en wat elk proces produceert',
    ],
    voorbeeldVraag: {
      vraag: 'In welk proces wordt het Projectinitiatiedocument (PID) gemaakt?',
      opties: [
        { key: 'A', tekst: 'Starting Up a Project' },
        { key: 'B', tekst: 'Initiating a Project' },
        { key: 'C', tekst: 'Directing a Project' },
        { key: 'D', tekst: 'Managing a Stage Boundary' },
      ],
      correct: 'B',
      redenering: {
        stappen: [
          'Het PID is het belangrijkste product van de initiatiefase',
          'Starting Up maakt de Project Brief, niet het PID',
          'Directing is het stuurgroep-proces, maakt geen documenten',
          'Initiating a Project (IP) creëert het volledige PID',
        ],
        techniek: 'proces',
        waaromAndereOptiesFout: [
          { key: 'A', reden: 'Starting Up maakt de Project Brief als basis voor het PID' },
          { key: 'C', reden: 'Directing a Project is besluitvorming, geen documentcreatie' },
          { key: 'D', reden: 'Managing Stage Boundary is voor fase-overgangen' },
        ],
      },
    },
  },
};

interface ThemaStatsWithPercentage extends ThemaStats {
  percentage: number;
}

export default function AnalyseScreen() {
  const router = useRouter();
  const [expandedThema, setExpandedThema] = useState<string | null>(null);
  const {
    themaStats,
    totaalVragen,
    totaalCorrect,
    laadStatistieken,
    resetStatistieken,
    getZwaksteThemas,
    getSterksteThemas,
  } = useStatisticsStore();

  useEffect(() => {
    laadStatistieken();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleReset = () => {
    resetStatistieken();
  };

  const handleWeetjes = () => {
    router.push('/weetjes');
  };

  const toggleExpand = (thema: string) => {
    setExpandedThema(expandedThema === thema ? null : thema);
  };

  const zwaksteThemas = getZwaksteThemas() as ThemaStatsWithPercentage[];
  const sterksteThemas = getSterksteThemas() as ThemaStatsWithPercentage[];
  const totaalPercentage = totaalVragen > 0 ? Math.round((totaalCorrect / totaalVragen) * 100) : 0;

  // Get all themes with at least 1 question answered
  const alleThemas = Object.values(themaStats)
    .filter(stats => stats.totaalVragen > 0)
    .map(stats => ({
      ...stats,
      percentage: stats.totaalVragen > 0
        ? Math.round((stats.correcteAntwoorden / stats.totaalVragen) * 100)
        : 0,
    }))
    .sort((a, b) => a.percentage - b.percentage);

  // Render the detailed theme analysis card
  const renderThemaDetail = (themaNaam: string) => {
    const info = themaInfo[themaNaam];
    if (!info) return null;
    const techniek = redeneertechnieken[info.voorbeeldVraag.redenering.techniek];

    return (
      <View style={styles.themaDetailCard}>
        {/* Theme description */}
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Wat is {themaNaam}?</Text>
          <Text style={styles.detailText}>{info.beschrijving}</Text>
        </View>

        {/* Key points */}
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Kernpunten</Text>
          {info.kernpunten.map((punt, i) => (
            <View key={i} style={styles.bulletItem}>
              <Text style={styles.bulletIcon}>•</Text>
              <Text style={styles.bulletText}>{punt}</Text>
            </View>
          ))}
        </View>

        {/* Common mistakes */}
        <View style={[styles.detailSection, styles.mistakesSection]}>
          <Text style={styles.detailSectionTitleRed}>Veelgemaakte fouten</Text>
          {info.veelgemaakteFouten.map((fout, i) => (
            <View key={i} style={styles.bulletItem}>
              <Text style={styles.bulletIconRed}>✗</Text>
              <Text style={styles.bulletTextRed}>{fout}</Text>
            </View>
          ))}
        </View>

        {/* Improvement tips */}
        <View style={[styles.detailSection, styles.tipsSection]}>
          <Text style={styles.detailSectionTitleGreen}>Verbeter Tips</Text>
          {info.verbeterTips.map((tip, i) => (
            <View key={i} style={styles.bulletItem}>
              <Text style={styles.bulletIconGreen}>✓</Text>
              <Text style={styles.bulletTextGreen}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Example question with reasoning */}
        <View style={styles.exampleSection}>
          <Text style={styles.exampleTitle}>Voorbeeldvraag + Redenering</Text>

          {/* Technique badge */}
          <View style={[styles.techniekBadge, { backgroundColor: techniek.kleur + '20', borderColor: techniek.kleur }]}>
            <Text style={styles.techniekIcon}>{techniek.icon}</Text>
            <View>
              <Text style={[styles.techniekNaam, { color: techniek.kleur }]}>{techniek.naam}</Text>
              <Text style={styles.techniekDesc}>{techniek.beschrijving}</Text>
            </View>
          </View>

          {/* Question */}
          <View style={styles.exampleQuestion}>
            <Text style={styles.exampleQuestionText}>{info.voorbeeldVraag.vraag}</Text>
          </View>

          {/* Options */}
          <View style={styles.exampleOptions}>
            {info.voorbeeldVraag.opties.map((optie) => (
              <View
                key={optie.key}
                style={[
                  styles.exampleOption,
                  optie.key === info.voorbeeldVraag.correct && styles.exampleOptionCorrect,
                ]}
              >
                <Text style={[
                  styles.exampleOptionKey,
                  optie.key === info.voorbeeldVraag.correct && styles.exampleOptionKeyCorrect,
                ]}>
                  {optie.key}
                </Text>
                <Text style={[
                  styles.exampleOptionText,
                  optie.key === info.voorbeeldVraag.correct && styles.exampleOptionTextCorrect,
                ]}>
                  {optie.tekst}
                </Text>
              </View>
            ))}
          </View>

          {/* Reasoning steps */}
          <View style={styles.reasoningSection}>
            <Text style={styles.reasoningTitle}>Redeneer stappen:</Text>
            {info.voorbeeldVraag.redenering.stappen.map((stap, i) => (
              <View key={i} style={styles.reasoningStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{stap}</Text>
              </View>
            ))}
          </View>

          {/* Why other options are wrong */}
          <View style={styles.wrongOptionsSection}>
            <Text style={styles.wrongOptionsTitle}>Waarom andere opties fout zijn:</Text>
            {info.voorbeeldVraag.redenering.waaromAndereOptiesFout.map((optie) => (
              <View key={optie.key} style={styles.wrongOption}>
                <View style={styles.wrongOptionBadge}>
                  <Text style={styles.wrongOptionKey}>{optie.key}</Text>
                </View>
                <Text style={styles.wrongOptionReden}>{optie.reden}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Home</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Analyse</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {totaalVragen === 0 ? (
            // No data yet
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyTitle}>Nog geen data</Text>
              <Text style={styles.emptyText}>
                Maak eerst een quiz om je voortgang te zien. Na elke vraag wordt je score per thema bijgehouden.
              </Text>
              <Pressable
                style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}
                onPress={() => router.push('/')}
              >
                <Text style={styles.startButtonText}>Start Quiz</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* Overall Stats */}
              <View style={styles.overallCard}>
                <Text style={styles.overallTitle}>Totaal Overzicht</Text>
                <View style={styles.overallStats}>
                  <View style={styles.overallStat}>
                    <Text style={styles.overallNumber}>{totaalVragen}</Text>
                    <Text style={styles.overallLabel}>Vragen</Text>
                  </View>
                  <View style={styles.overallDivider} />
                  <View style={styles.overallStat}>
                    <Text style={styles.overallNumber}>{totaalCorrect}</Text>
                    <Text style={styles.overallLabel}>Correct</Text>
                  </View>
                  <View style={styles.overallDivider} />
                  <View style={styles.overallStat}>
                    <Text style={[
                      styles.overallNumber,
                      totaalPercentage >= 60 ? styles.scoreGood : styles.scoreBad,
                    ]}>
                      {totaalPercentage}%
                    </Text>
                    <Text style={styles.overallLabel}>Score</Text>
                  </View>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={[
                    styles.progressBar,
                    { width: `${totaalPercentage}%` },
                    totaalPercentage >= 60 ? styles.progressGood : styles.progressBad,
                  ]} />
                </View>
                <Text style={styles.progressLabel}>
                  {totaalPercentage >= 60 ? '✅ Voldoende (60% nodig)' : '⚠️ Nog niet voldoende (60% nodig)'}
                </Text>
              </View>

              {/* Weak Themes */}
              {zwaksteThemas.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionIcon}>⚠️</Text>
                    <Text style={styles.sectionTitle}>Aandachtspunten</Text>
                  </View>
                  <Text style={styles.sectionSubtitle}>
                    Tik op een thema voor gedetailleerde uitleg en voorbeeldvragen:
                  </Text>
                  {zwaksteThemas.slice(0, 5).map((thema) => (
                    <View key={thema.thema}>
                      <Pressable
                        onPress={() => toggleExpand(thema.thema)}
                        style={[
                          styles.weakThemaCard,
                          expandedThema === thema.thema && styles.weakThemaCardExpanded,
                        ]}
                      >
                        <View style={styles.themaHeader}>
                          <View style={styles.themaNameRow}>
                            <Text style={styles.themaName}>{thema.thema}</Text>
                            <Text style={styles.expandIndicator}>
                              {expandedThema === thema.thema ? '▼' : '▶'}
                            </Text>
                          </View>
                          <Text style={[
                            styles.themaScore,
                            thema.percentage >= 60 ? styles.scoreGood : styles.scoreBad,
                          ]}>
                            {thema.percentage}%
                          </Text>
                        </View>
                        <View style={styles.themaProgressContainer}>
                          <View style={[
                            styles.themaProgress,
                            { width: `${thema.percentage}%` },
                            thema.percentage >= 60 ? styles.progressGood : styles.progressBad,
                          ]} />
                        </View>
                        <Text style={styles.themaStats}>
                          {thema.correcteAntwoorden}/{thema.totaalVragen} correct
                        </Text>
                      </Pressable>
                      {expandedThema === thema.thema && renderThemaDetail(thema.thema)}
                    </View>
                  ))}
                  <Pressable
                    style={({ pressed }) => [styles.weetjesButton, pressed && styles.weetjesButtonPressed]}
                    onPress={handleWeetjes}
                  >
                    <Text style={styles.weetjesButtonText}>📚 Bekijk Theorie</Text>
                  </Pressable>
                </View>
              )}

              {/* Strong Themes */}
              {sterksteThemas.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionIcon}>⭐</Text>
                    <Text style={styles.sectionTitle}>Sterke Punten</Text>
                  </View>
                  {sterksteThemas.slice(0, 3).map((thema) => (
                    <View key={thema.thema} style={styles.strongThemaCard}>
                      <View style={styles.themaHeader}>
                        <Text style={styles.themaName}>{thema.thema}</Text>
                        <Text style={[styles.themaScore, styles.scoreGood]}>
                          {thema.percentage}%
                        </Text>
                      </View>
                      <Text style={styles.themaStats}>
                        {thema.correcteAntwoorden}/{thema.totaalVragen} correct
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* All Themes */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionIcon}>📊</Text>
                  <Text style={styles.sectionTitle}>Alle Thema's</Text>
                </View>
                {alleThemas.map((thema) => (
                  <View key={thema.thema} style={styles.allThemaCard}>
                    <View style={styles.themaHeader}>
                      <Text style={styles.allThemaName}>{thema.thema}</Text>
                      <Text style={[
                        styles.allThemaScore,
                        thema.percentage >= 60 ? styles.scoreGood : styles.scoreBad,
                      ]}>
                        {thema.percentage}%
                      </Text>
                    </View>
                    <View style={styles.allThemaProgressContainer}>
                      <View style={[
                        styles.allThemaProgress,
                        { width: `${thema.percentage}%` },
                        thema.percentage >= 60 ? styles.progressGood : styles.progressBad,
                      ]} />
                    </View>
                  </View>
                ))}
              </View>

              {/* Reset Button */}
              <Pressable
                style={({ pressed }) => [styles.resetButton, pressed && styles.resetButtonPressed]}
                onPress={handleReset}
              >
                <Text style={styles.resetButtonText}>Statistieken Resetten</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    color: '#2563eb',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  startButtonPressed: {
    backgroundColor: '#1d4ed8',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  overallCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  overallTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  overallStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  overallStat: {
    flex: 1,
    alignItems: 'center',
  },
  overallNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  overallLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  overallDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  progressGood: {
    backgroundColor: '#22c55e',
  },
  progressBad: {
    backgroundColor: '#f59e0b',
  },
  progressLabel: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  scoreGood: {
    color: '#22c55e',
  },
  scoreBad: {
    color: '#f59e0b',
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  weakThemaCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  themaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  themaName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  themaScore: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  themaProgressContainer: {
    height: 8,
    backgroundColor: '#fde68a',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  themaProgress: {
    height: '100%',
    borderRadius: 4,
  },
  themaStats: {
    fontSize: 13,
    color: '#92400e',
  },
  adviesCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  adviesIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  adviesContent: {
    flex: 1,
  },
  adviesText: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 20,
  },
  adviesCategorie: {
    fontSize: 12,
    color: '#2563eb',
    marginTop: 4,
    fontWeight: '500',
  },
  weetjesButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  weetjesButtonPressed: {
    backgroundColor: '#1d4ed8',
  },
  weetjesButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  strongThemaCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  allThemaCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
  },
  allThemaName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  allThemaScore: {
    fontSize: 14,
    fontWeight: '600',
  },
  allThemaProgressContainer: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 8,
  },
  allThemaProgress: {
    height: '100%',
    borderRadius: 3,
  },
  resetButton: {
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginVertical: 24,
  },
  resetButtonPressed: {
    backgroundColor: '#fecaca',
  },
  resetButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  // New styles for expanded theme details
  weakThemaCardExpanded: {
    borderLeftColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  themaNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expandIndicator: {
    fontSize: 10,
    color: '#9ca3af',
    marginLeft: 8,
  },
  themaDetailCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: -6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  detailSection: {
    marginBottom: 16,
  },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  detailSectionTitleRed: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 8,
  },
  detailSectionTitleGreen: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  mistakesSection: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: -4,
  },
  tipsSection: {
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: -4,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  bulletIcon: {
    fontSize: 14,
    color: '#2563eb',
    marginRight: 8,
    width: 16,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
  },
  bulletIconRed: {
    fontSize: 12,
    color: '#dc2626',
    marginRight: 8,
    width: 16,
  },
  bulletTextRed: {
    flex: 1,
    fontSize: 13,
    color: '#991b1b',
    lineHeight: 20,
  },
  bulletIconGreen: {
    fontSize: 12,
    color: '#16a34a',
    marginRight: 8,
    width: 16,
  },
  bulletTextGreen: {
    flex: 1,
    fontSize: 13,
    color: '#166534',
    lineHeight: 20,
  },
  exampleSection: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  exampleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  techniekBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 16,
  },
  techniekIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  techniekNaam: {
    fontSize: 14,
    fontWeight: '600',
  },
  techniekDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  exampleQuestion: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  exampleQuestionText: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 22,
    fontWeight: '500',
  },
  exampleOptions: {
    gap: 8,
    marginBottom: 16,
  },
  exampleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  exampleOptionCorrect: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
    borderWidth: 2,
  },
  exampleOptionKey: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 12,
  },
  exampleOptionKeyCorrect: {
    backgroundColor: '#22c55e',
    color: 'white',
  },
  exampleOptionText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
  },
  exampleOptionTextCorrect: {
    color: '#166534',
    fontWeight: '500',
  },
  reasoningSection: {
    backgroundColor: '#eff6ff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  reasoningTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  reasoningStep: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 20,
  },
  wrongOptionsSection: {
    backgroundColor: '#fef2f2',
    padding: 14,
    borderRadius: 10,
  },
  wrongOptionsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  wrongOption: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  wrongOptionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  wrongOptionKey: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  wrongOptionReden: {
    flex: 1,
    fontSize: 13,
    color: '#991b1b',
    lineHeight: 20,
  },
});
