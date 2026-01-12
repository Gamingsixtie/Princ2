import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

type Sectie = {
  id: string;
  titel: string;
  icon: string;
  inhoud: SubSectie[];
};

type SubSectie = {
  titel: string;
  inhoud: string;
};

const studiegidsData: Sectie[] = [
  {
    id: 'overzichten',
    titel: 'Visuele Overzichten',
    icon: '📊',
    inhoud: [
      {
        titel: 'PRINCE2 Procesmodel',
        inhoud: `┌─────────────────────────────────────────┐
│           STUREN (DP)                   │
│    Stuurgroep - loopt door hele project │
└──────────────────┬──────────────────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
┌───────┐    ┌──────────┐    ┌─────────┐
│  SU   │───▶│    IP    │───▶│   CS    │
│Opstart│    │ Initiatie│    │Beheersen│
└───────┘    └──────────┘    └────┬────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
               ┌────────┐   ┌────────┐    ┌────────┐
               │   MP   │   │   SB   │    │   CP   │
               │Product │   │Fase-   │    │Afsluiten│
               │oplever │   │overgang│    └────────┘
               └────────┘   └────────┘

LEGENDE:
SU = Opstarten    IP = Initiëren    DP = Sturen
CS = Beheersen    MP = Productoplevering
SB = Faseovergang CP = Afsluiten`
      },
      {
        titel: 'Organisatiestructuur',
        inhoud: `┌─────────────────────────────────────────┐
│        BEDRIJFS-/PROGRAMMANIVEAU        │
│         (Projectmandaat komt hier)       │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│            STUURGROEP (DP)              │
├─────────────┬───────────┬───────────────┤
│ Opdracht-   │  Senior   │    Senior     │
│ gever       │  User(s)  │  Supplier(s)  │
│ (Business)  │(Gebruiker)│ (Leverancier) │
└──────┬──────┴─────┬─────┴───────┬───────┘
       │            │             │
       │     Projectborging       │
       │                          │
       └──────────┬───────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         PROJECTMANAGER (CS)             │
│    + Projectondersteuning (optioneel)   │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         TEAMMANAGER(S) (MP)             │
│           + Teamleden                    │
└─────────────────────────────────────────┘`
      },
      {
        titel: 'Rollen Verantwoordelijkheden Matrix',
        inhoud: `ROL                  │ VERANTWOORDELIJK VOOR
─────────────────────┼──────────────────────────────
Opdrachtgever        │ • Eindverantwoordelijk project
                     │ • Eigenaar Business Case
                     │ • Voorzitter Stuurgroep
─────────────────────┼──────────────────────────────
Senior User          │ • Gebruikersbelangen
                     │ • Benefits realisatie
                     │ • Gebruikersacceptatie
─────────────────────┼──────────────────────────────
Senior Supplier      │ • Leveranciersbelangen
                     │ • Technische integriteit
                     │ • Resources beschikbaar
─────────────────────┼──────────────────────────────
Projectmanager       │ • Dagelijks management
                     │ • Plannen & rapporteren
                     │ • Risico's & issues beheren
─────────────────────┼──────────────────────────────
Teammanager          │ • Producten opleveren
                     │ • Team aansturen
                     │ • Checkpointrapporten
─────────────────────┼──────────────────────────────
Projectborging       │ • Onafhankelijke controle
                     │ • Namens Stuurgroep
                     │ • NIET onafhankelijk v. project`
      },
      {
        titel: 'Managementproducten Overzicht',
        inhoud: `BASELINE PRODUCTEN (onder wijzigingsbeheer):
┌────────────────────┬──────────────────────────┐
│ Product            │ Gemaakt in proces        │
├────────────────────┼──────────────────────────┤
│ Business Case      │ SU (outline) → IP (vol)  │
│ Projectplan        │ IP                       │
│ Faseplan           │ IP + SB                  │
│ Afwijkingsplan     │ CS/SB (indien nodig)     │
│ Productbeschrijving│ Per product              │
└────────────────────┴──────────────────────────┘

REGISTERS (doorlopend bijgehouden):
┌────────────────────┬──────────────────────────┐
│ Risicoregister     │ Alle risico's + reacties │
│ Issueregister      │ Alle issues + status     │
│ Kwaliteitsregister │ Alle kwaliteitscheck     │
│ Config-itemrecord  │ Versies producten        │
└────────────────────┴──────────────────────────┘

RAPPORTEN:
┌────────────────────┬───────────┬─────────────┐
│ Rapport            │ Van → Aan │ Wanneer     │
├────────────────────┼───────────┼─────────────┤
│ Checkpoint         │ TM → PM   │ Periodiek   │
│ Hoofdpunten        │ PM → SG   │ Periodiek   │
│ Afwijking          │ PM → SG   │ Bij issue   │
│ Fase-eind          │ PM → SG   │ Einde fase  │
│ Project-eind       │ PM → SG   │ Einde proj  │
└────────────────────┴───────────┴─────────────┘`
      },
      {
        titel: 'Risicoreacties Overzicht',
        inhoud: `REACTIES OP BEDREIGINGEN (negatief):
┌───────────────┬────────────────────────────────┐
│ Reactie       │ Beschrijving                   │
├───────────────┼────────────────────────────────┤
│ VERMIJDEN     │ Elimineer de bedreiging        │
│ VERMINDEREN   │ Verklein kans of impact        │
│ OVERDRAGEN    │ Geef aan derde partij          │
│ DELEN         │ Verdeel met partner            │
│ ACCEPTEREN    │ Doe niets, neem risico         │
│ VOORBEREIDEN  │ Plan B (contingency)           │
└───────────────┴────────────────────────────────┘

REACTIES OP KANSEN (positief):
┌───────────────┬────────────────────────────────┐
│ Reactie       │ Beschrijving                   │
├───────────────┼────────────────────────────────┤
│ EXPLOITEREN   │ Benut kans volledig            │
│ VERGROTEN     │ Vergroot waarschijnlijkheid    │
│ DELEN         │ Deel met partner               │
│ AFWIJZEN      │ Doe niets met kans             │
└───────────────┴────────────────────────────────┘`
      },
      {
        titel: 'Processtroom per Fase',
        inhoud: `PRE-PROJECT:
  Projectmandaat → [SU Opstarten] → Projectvoorstel

INITIATIEFASE:
  Projectvoorstel → [IP Initiëren] → PID
                    [DP Autoriseren project]

LEVERINGSFASE(S):
  ┌──────────────────────────────────────────┐
  │ [CS Beheersen] ←→ [MP Productoplevering] │
  │      ↓                                    │
  │ Werkpakketten → Producten                │
  │      ↓                                    │
  │ Hoofdpuntenrapport → Stuurgroep          │
  └──────────────────────────────────────────┘

  Einde fase: [SB Faseovergang]
              ↓
              [DP Autoriseren volgende fase]

LAATSTE FASE:
  [CP Afsluiten] → Projecteindrapport
                   [DP Autoriseren afsluiting]`
      }
    ]
  },
  {
    id: 'concepten',
    titel: 'Kernconcepten',
    icon: '🎯',
    inhoud: [
      {
        titel: 'Wat is een Project?',
        inhoud: `Een tijdelijke organisatie opgezet om een of meer bedrijfsproducten op te leveren volgens een overeengekomen business case.

5 KENMERKEN VAN EEN PROJECT:
• Verandering - Projecten voeren veranderingen door
• Tijdelijk - Gedefinieerd begin en einde
• Multidisciplinair - Teams van verschillende afdelingen
• Uniek - Elk project verschilt (team, klant, product, locatie)
• Onzekerheid - Risicovoller dan dagelijkse bedrijfsvoering

EXAMENVRAAG: "Welk kenmerk heeft betrekking op teams van verschillende organisaties?"
ANTWOORD: Multidisciplinair`
      },
      {
        titel: '5 Geintegreerde Elementen',
        inhoud: `PRINCE2 bestaat uit 5 elementen:

1. PRINCIPES (7) - Verplichte richtlijnen, niet onderhandelbaar
2. MENSEN - Centraal in de methode
3. PRACTICES (7) - Aspecten van projectmanagement
4. PROCESSEN (7) - De projectlevenscyclus
5. PROJECTCONTEXT - Hoe PRINCE2 wordt toegepast

EXAMENVRAAG: "Welke uitspraak beschrijft de projectcontext?"
ANTWOORD: Het beinvloedt hoe principes, practices en processen worden toegepast`
      },
      {
        titel: '7 Prestatieaspecten (Toleranties)',
        inhoud: `Toleranties worden gesteld voor deze 7 aspecten:

1. BENEFITS - Waarom doen we dit? Rechtvaardigt investering
2. KOSTEN - Moet betaalbaar zijn
3. TIJD - Wanneer klaar?
4. KWALITEIT - Geschikt voor het doel
5. SCOPE - Wat gaat het project opleveren?
6. DUURZAAMHEID - Impact op omgeving
7. RISICO - Hoeveel risico is acceptabel?

BELANGRIJK: Bij "toleranties" denk aan Manage by Exception principe!`
      },
      {
        titel: 'Opleveringsaanpakken',
        inhoud: `3 AANPAKKEN:

LINEAIR-SEQUENTIEEL:
• Elke stap sequentieel
• Product pas aan einde beschikbaar
• Traditionele "waterval" aanpak

ITERATIEF-INCREMENTEEL:
• Herhaalt: requirements → ontwerp → coderen → testen
• Gedurende hele project
• Agile/Scrum valt hieronder

HYBRIDE:
• Combinatie van beide

EXAMENVRAAG: "Welke aanpak herhaalt requirements, ontwerpen, coderen en testen?"
ANTWOORD: Iteratief-incrementeel`
      }
    ]
  },
  {
    id: 'principes',
    titel: '7 Principes',
    icon: '⭐',
    inhoud: [
      {
        titel: 'Overzicht 7 Principes',
        inhoud: `De 7 principes zijn VERPLICHT - niet onderhandelbaar!

1. Voortdurende zakelijke rechtvaardiging
2. Leren van ervaringen
3. Rollen, verantwoordelijkheden en relaties
4. Managen per fase
5. Manage by exception
6. Focussen op producten
7. Op maat maken

EZELSBRUGGETJE: "Voort Leren Rollen Maakt Managing Focus Op"

Als een project NIET aan alle principes voldoet, is het GEEN PRINCE2 project!`
      },
      {
        titel: '1. Voortdurende Zakelijke Rechtvaardiging',
        inhoud: `KERNBOODSCHAP: Project moet wenselijk, levensvatbaar en haalbaar blijven.

HERKENNEN IN EXAMENVRAAG:
• "benefits opwegen tegen kosten"
• "project voortijdig afsluiten"
• "externe omgeving gewijzigd"
• "wenselijk, levensvatbaar, haalbaar"
• "investering nog rendabel"

VOORBEELD: "Stuurgroep besluit project te stoppen omdat markt is veranderd"
→ Voortdurende zakelijke rechtvaardiging

GEKOPPELD AAN: Business Case`
      },
      {
        titel: '2. Leren van Ervaringen',
        inhoud: `KERNBOODSCHAP: Actief zoeken, registreren en implementeren van verbeteringen.

HERKENNEN IN EXAMENVRAAG:
• "ervaringen uitwisselen"
• "feedback stakeholders"
• "retrospective"
• "leerpunten identificeren"
• "lessons learned"
• "workshop ervaringen delen"

3 MOMENTEN:
• Start project - leren van eerdere projecten
• Tijdens project - leren en verbeteren
• Einde project - vastleggen voor toekomst

GEKOPPELD AAN: Lessenlogboek`
      },
      {
        titel: '3. Rollen, Verantwoordelijkheden en Relaties',
        inhoud: `KERNBOODSCHAP: Gedefinieerde rollen waarbij bedrijfs-, gebruikers- en leveranciersbelangen vertegenwoordigd zijn.

HERKENNEN IN EXAMENVRAAG:
• "contract overeenkomen"
• "wie is verantwoordelijk"
• "rollen toewijzen"
• "externe partij aanstellen"

3 BELANGENGROEPEN IN STUURGROEP:
1. Business (Opdrachtgever)
2. Gebruiker (Senior User)
3. Leverancier (Senior Supplier)

GEKOPPELD AAN: Organisatiestructuur`
      },
      {
        titel: '4. Managen per Fase',
        inhoud: `KERNBOODSCHAP: Project wordt fase voor fase gepland, bewaakt en beheerst.

MINIMAAL 2 FASEN:
1. Initiatiefase (altijd!)
2. Minimaal 1 leveringsfase

HERKENNEN IN EXAMENVRAAG:
• "fasen"
• "faseovergang"
• "minimaal twee fasen"
• "go/no-go beslissing"

VOORDELEN:
• Beslismomenten voor stuurgroep
• Gedetailleerde planning voor korte termijn
• Beheersbare stukken werk`
      },
      {
        titel: '5. Manage by Exception',
        inhoud: `KERNBOODSCHAP: Grenzen aan gedelegeerde bevoegdheden door toleranties.

HERKENNEN IN EXAMENVRAAG:
• "toleranties vaststellen"
• "maximaal X% over budget"
• "delegeren bevoegdheden"
• "mate van vertrouwen"
• "escaleren naar stuurgroep"

TOLERANTIES VOOR 7 ASPECTEN:
Benefits, Kosten, Tijd, Kwaliteit, Scope, Duurzaamheid, Risico

BIJ OVERSCHRIJDING: Escaleren naar hogere laag!

VOORBEELD: "PM mag max 10% over budget zonder stuurgroep te raadplegen"
→ Manage by exception`
      },
      {
        titel: '6. Focussen op Producten',
        inhoud: `KERNBOODSCHAP: Focus op definieren en opleveren van producten.

4 SOORTEN PRODUCTEN:
1. Managementproducten - Voor projectmanagement (business case, plannen)
2. Specialistische producten - Wat gebruiker nodig heeft
3. Projectproduct - Totale output van project
4. Externe producten - Buiten beheersing project

PRODUCTGERICHTE PLANNING:
• Productdecompositiestructuur (PBS)
• Productstroomschema (PFD)
• Productbeschrijvingen

GEKOPPELD AAN: Kwaliteitsmanagement`
      },
      {
        titel: '7. Op Maat Maken',
        inhoud: `KERNBOODSCHAP: PRINCE2 aanpassen aan projectcontext.

OP MAAT MAKEN VOOR:
• Omgeving
• Omvang
• Complexiteit
• Belang
• Opleveringsmethode
• Teambekwaamheid
• Risiconiveau

VASTGELEGD IN: Projectinitiatiedocumentatie (PID)

VOORBEELDEN:
• Managementproducten combineren
• Rollen combineren (niet PM en Opdrachtgever!)
• Processen verkorten

EXAMENVRAAG: "Waar wordt op maat maken vastgelegd?"
ANTWOORD: PID`
      }
    ]
  },
  {
    id: 'mensen',
    titel: 'Mensen & Rollen',
    icon: '👥',
    inhoud: [
      {
        titel: 'Belangrijke Definities',
        inhoud: `LEIDERSCHAP vs MANAGEMENT:
• Leiderschap - Motiveren door overtuigen, beinvloeden, co-creeren
• Management - Sturen van uitvoering volgens afspraken

ANDERE TERMEN:
• Samenwerking - Mensen werken samen voor doelstellingen
• Co-creatie - Samenwerken met beinvloeders
• Cultuur - Gedeelde houdingen, waarden en doelen

ECOSYSTEMEN:
• Organisatorisch ecosysteem - Interne + externe relaties organisatie
• Projectecosysteem - Onderdelen betrokken bij/beinvloed door project`
      },
      {
        titel: '4 Organisatielagen',
        inhoud: `1. BEDRIJFSLAAG (Corporate/Programme)
   • Stelt projectmandaat op
   • Benoemt opdrachtgever

2. STUURGROEP (Directing)
   • Opdrachtgever + Senior User + Senior Supplier
   • Beslist over project
   • Proces: Sturen van een Project

3. PROJECTMANAGER (Managing)
   • Dagelijks management
   • Proces: Beheersen van een Fase

4. TEAMLAAG (Delivering)
   • Teammanager + teamleden
   • Producten opleveren
   • Proces: Managen Productoplevering`
      },
      {
        titel: 'Stuurgroep (Project Board)',
        inhoud: `DE STUURGROEP BESTAAT UIT:

1. PROJECTOPDRACHTGEVER (Executive)
   • Eigenaar business case
   • EINDVERANTWOORDELIJK voor project
   • Vertegenwoordigt bedrijfsbelang
   • Er is altijd maar 1 opdrachtgever!

2. SENIOR USER(S)
   • Vertegenwoordigt gebruikersbelang
   • Commitment gebruikersgemeenschap
   • Verantwoordelijk voor realisatie benefits
   • Kunnen meerdere zijn

3. SENIOR SUPPLIER(S)
   • Vertegenwoordigt leveranciersbelang
   • Technische integriteit projectproducten
   • Kunnen meerdere zijn (intern/extern)

EXAMENVRAAG: "Wie is eindverantwoordelijk voor het project?"
ANTWOORD: Projectopdrachtgever`
      },
      {
        titel: 'Projectmanager',
        inhoud: `VERANTWOORDELIJKHEDEN:
• Dagelijks management van project
• Plannen en bewaken voortgang
• Rapporteren aan stuurgroep
• Managen risico's en issues
• Aansturen teammanagers

BEVOEGDHEDEN:
• Binnen toleranties zelfstandig beslissen
• Bij (dreigende) overschrijding: escaleren!

MAG NIET:
• Gecombineerd worden met opdrachtgever
• Project goedkeuren (dat doet stuurgroep)

RAPPORTEERT VIA:
• Hoofdpuntenrapport (periodiek)
• Fase-eindrapport (per fase)`
      },
      {
        titel: 'Teammanager',
        inhoud: `VERANTWOORDELIJKHEDEN:
• Producten opleveren volgens werkpakket
• Aansturen teamleden
• Rapporteren aan projectmanager

RAPPORTEERT VIA:
• Checkpointrapport (periodiek aan PM)

WERKPAKKET BEVAT:
• Te maken producten
• Technieken en standaarden
• Rapportage-eisen
• Toleranties

OPTIONELE ROL:
• PM kan werk direct aan team geven
• Dan geen teammanager nodig`
      },
      {
        titel: 'Projectborging',
        inhoud: `WAT IS PROJECTBORGING?
• Onafhankelijke monitoring namens stuurgroep
• NIET onafhankelijk van project (wel van PM)
• Kan door stuurgroepleden zelf of gedelegeerd

3 SOORTEN BORGING:
1. Bedrijfsborging (namens opdrachtgever)
2. Gebruikersborging (namens senior user)
3. Leveranciersborging (namens senior supplier)

VERSCHIL MET KWALITEITSBORGING:
• Kwaliteitsborging = onafhankelijk van projectteam
• Projectborging = onafhankelijk van PM, niet van project

EXAMENVRAAG: "Projectborging is onafhankelijk van..."
ANTWOORD: De projectmanager (NIET van het project!)`
      },
      {
        titel: 'Projectondersteuning',
        inhoud: `TAKEN:
• Administratieve ondersteuning PM
• Beheer configuratie-items
• Bijhouden registers en logboeken
• Opstellen/bijwerken documenten

OPTIONELE ROL:
• PM kan dit zelf doen
• Of Project Management Office (PMO)

NIET VERPLICHT maar zeer nuttig bij:
• Grote projecten
• Complexe administratie
• Meerdere projecten`
      }
    ]
  },
  {
    id: 'businesscase',
    titel: 'Business Case',
    icon: '💼',
    inhoud: [
      {
        titel: 'Doel Business Case',
        inhoud: `DOEL: Projectopdrachtgever in staat stellen te beslissen of project wordt voortgezet.

KERNVRAAG: Is het project wenselijk, levensvatbaar en haalbaar?

WENSELIJK = Opweegt tegen kosten en risico's
LEVENSVATBAAR = Benefits kunnen gerealiseerd worden
HAALBAAR = Technisch en praktisch mogelijk

WANNEER:
• Outline BC bij Opstarten
• Volledige BC bij Initiatie
• Review bij elke faseovergang
• Bevestigen bij Afsluiten`
      },
      {
        titel: 'Outputs, Outcomes, Benefits',
        inhoud: `OUTPUT:
• Tastbaar of ontastbaar product
• Direct resultaat van projectwerk
• Voorbeeld: Nieuwe website

OUTCOME (Eindresultaat):
• Meetbare verbetering na gebruik output
• Voorbeeld: Meer online bestellingen

BENEFIT (Baat):
• Meetbare verbetering gedefinieerd in business case
• Positief effect
• Voorbeeld: 20% meer omzet

DIS-BENEFIT (Nadeel):
• Meetbare daling als negatief ervaren
• Voorbeeld: Meer klachten helpdesk

EXAMENVRAAG: "Wat is een meetbare verbetering als gevolg van een outcome?"
ANTWOORD: Benefit`
      },
      {
        titel: 'Business Case Techniek - 4 Stappen',
        inhoud: `1. ONTWIKKELEN
   • Projectmandaat reviewen
   • Outline business case maken
   • Wanneer: Opstarten

2. CONTROLEREN
   • Beoordelen bij faseovergang
   • Nog steeds wenselijk/levensvatbaar/haalbaar?
   • Wanneer: Elke faseovergang

3. ONDERHOUDEN
   • Impact risico's en issues beoordelen
   • Business case bijwerken indien nodig
   • Wanneer: Doorlopend

4. BEVESTIGEN
   • Zijn benefits gerealiseerd?
   • Na afsluiting project
   • Wanneer: Afsluiten + Benefits reviews`
      },
      {
        titel: 'Inhoud Business Case',
        inhoud: `EEN BUSINESS CASE BEVAT:

• Redenen - Waarom dit project?
• Opties - Welke alternatieven zijn er?
• Verwachte benefits - Wat levert het op?
• Verwachte dis-benefits - Nadelen
• Tijdschaal - Wanneer benefits?
• Kosten - Investering + doorlopend
• Risico's - Belangrijkste risico's
• Investeringsbeoordeling - ROI, terugverdientijd

EIGENAAR: Projectopdrachtgever

EXAMENVRAAG: "Wie is eigenaar van de business case?"
ANTWOORD: Projectopdrachtgever`
      }
    ]
  },
  {
    id: 'plannen',
    titel: 'Plannen',
    icon: '📅',
    inhoud: [
      {
        titel: '3 Planniveaus',
        inhoud: `1. PROJECTPLAN
   • Plan op hoofdlijnen
   • Laag detailniveau
   • Hele projectduur
   • Gemaakt in: Initiatie

2. FASEPLAN
   • Voldoende detail voor dagelijkse beheersing PM
   • Per fase
   • Gemaakt in: Initiatie + Faseovergang

3. TEAMPLAN (optioneel)
   • Voor teammanager
   • Detailniveau voor productoplevering

AFWIJKINGSPLAN:
• Vervangt huidig fase- of projectplan
• Bij tolerantieoverschrijding
• Bevat herstelacties`
      },
      {
        titel: 'Planningstechniek - 7 Stappen',
        inhoud: `1. PRODUCTEN DEFINIEREN EN ANALYSEREN
   • Productdecompositiestructuur (PBS)
   • Productbeschrijvingen
   • Productstroomschema (afhankelijkheden!)

2. WERKPAKKETTEN ORGANISEREN
   • Werk groeperen
   • Toewijzen aan teams

3. SCHATTINGEN MAKEN
   • Resources identificeren
   • Inspanning schatten
   • Apparatuur identificeren

4. TIJDSCHEMA MAKEN
   • Activiteiten plannen
   • Afhankelijkheden opnemen
   • Kritiek pad bepalen

5. RISICO'S ANALYSEREN
   • Risico's voor plan identificeren
   • Maatregelen opnemen

6. BEGROTING OPSTELLEN
   • Kosten berekenen
   • Wijzigingsbudget opnemen

7. PLAN DOCUMENTEREN
   • Alles samenvoegen
   • Goedkeuring vragen`
      },
      {
        titel: 'Product-Based Planning',
        inhoud: `3 DOCUMENTEN:

1. PRODUCTDECOMPOSITIESTRUCTUUR (PBS)
   • Hierarchie van producten
   • Wat moet er gemaakt worden?
   • Boom-structuur

2. PRODUCTSTROOMSCHEMA (PFD)
   • Volgorde van producten
   • Afhankelijkheden zichtbaar
   • Welke producten eerst?

3. PRODUCTBESCHRIJVINGEN
   • Per product
   • Bevat: doel, samenstelling, kwaliteitscriteria
   • Wie keurt goed?

EXAMENVRAAG: "Welk document toont de volgorde waarin producten gemaakt moeten worden?"
ANTWOORD: Productstroomschema`
      }
    ]
  },
  {
    id: 'kwaliteit',
    titel: 'Kwaliteit',
    icon: '✅',
    inhoud: [
      {
        titel: 'Kwaliteitsdefinities',
        inhoud: `KWALITEIT: De mate waarin producten geschikt zijn voor het doel.

KWALITEITSCRITERIA:
• Meetbare definities van attributen
• Hoe meten we of product goed is?
• In productbeschrijving

ACCEPTATIECRITERIA:
• Prioriteitenlijst voor projectproduct
• Wanneer accepteert klant het?
• In projectproductbeschrijving

KWALITEITSTOLERANTIES:
• Toegestane afwijking van criteria
• Voorbeeld: ±5% van specificatie`
      },
      {
        titel: 'Kwaliteitsmanagementproducten',
        inhoud: `1. KWALITEITSMANAGEMENTAANPAK
   • Richtlijnen over kwaliteitstechnieken
   • Hoe gaan we kwaliteit borgen?

2. PROJECTPRODUCTBESCHRIJVING
   • Acceptatiecriteria projectproduct
   • Wanneer is project "af"?

3. PRODUCTBESCHRIJVINGEN
   • Kwaliteitsspecificaties per product
   • Kwaliteitscriteria + methode

4. KWALITEITSREGISTER
   • Overzicht alle kwaliteitsactiviteiten
   • Wanneer worden outputs getest?

5. PRODUCTSTATUSOVERZICHT
   • Status van alle producten
   • Waar staan we?`
      },
      {
        titel: 'Borging vs Beheersing',
        inhoud: `KWALITEITSBORGING (Quality Assurance):
• Onafhankelijk van projectteam
• Deel van kwaliteitsmanagementsysteem organisatie
• Controleert of methoden worden gevolgd

KWALITEITSBEHEERSING (Quality Control):
• Testen en inspecties
• Producten voldoen aan criteria?
• Door projectteam zelf

PROJECTBORGING:
• Onafhankelijk van PM
• NIET onafhankelijk van project
• Namens stuurgroep

EXAMENVRAAG: "Wat is onafhankelijk van het projectteam?"
ANTWOORD: Kwaliteitsborging`
      },
      {
        titel: 'Kwaliteitstechniek - 4 Stappen',
        inhoud: `1. GEBRUIKERSINPUTS VERZAMELEN
   • Klantverwachtingen documenteren
   • Acceptatiecriteria vastleggen
   • Kwaliteitsspecificaties bepalen

2. KWALITEITSMANAGEMENTAANPAK BESCHRIJVEN
   • Hoe borgen we kwaliteit?
   • Welke technieken gebruiken?
   • Wie doet wat?

3. KWALITEIT BEHEERSEN
   • Producten testen
   • Inspecties uitvoeren
   • Resultaten vastleggen in register

4. PRODUCTEN ACCEPTEREN
   • Formele goedkeuring
   • Eigenaarschap overdragen
   • Kwaliteitsrecords bijwerken`
      }
    ]
  },
  {
    id: 'risico',
    titel: 'Risico',
    icon: '⚠️',
    inhoud: [
      {
        titel: 'Risicodefinities',
        inhoud: `RISICO: Onzekere gebeurtenis die effect zou hebben op doelstellingen.

BEDREIGING: Risico met negatief effect
KANS: Risico met positief effect

RISICO-EIGENAAR:
• Verantwoordelijk voor adequaat reageren
• Meestal iemand van stuurgroep

RISICO-ACTIEHOUDER:
• Voert acties uit namens eigenaar
• Kan iemand anders zijn

NABIJHEID:
• Wanneer kan risico optreden?
• Urgent = binnenkort`
      },
      {
        titel: 'Reacties op BEDREIGINGEN (6)',
        inhoud: `6 REACTIES OP BEDREIGINGEN:

1. VERMIJDEN
   • Bedreiging volledig elimineren
   • Voorbeeld: Scope aanpassen

2. VERMINDEREN
   • Waarschijnlijkheid of impact verkleinen
   • Voorbeeld: Extra testen

3. OVERDRAGEN
   • Derde partij draagt risico
   • Voorbeeld: Verzekering

4. DELEN
   • Risico verdelen met partner
   • Voorbeeld: Joint venture

5. ACCEPTEREN
   • Niets doen, risico nemen
   • Bij lage impact/waarschijnlijkheid

6. VOORBEREIDEN (Contingency)
   • Plan B klaar hebben
   • Als risico optreedt

EZELSBRUGGETJE: "Vermijd Verminderen, Over-Deel Acceptatie, Voorbereid"`
      },
      {
        titel: 'Reacties op KANSEN (4)',
        inhoud: `4 REACTIES OP KANSEN:

1. EXPLOITEREN
   • Kans volledig benutten
   • Actief najagen

2. VERGROTEN
   • Waarschijnlijkheid vergroten
   • Meer kans dat het gebeurt

3. DELEN
   • Kans delen met partner
   • Beiden profiteren

4. AFWIJZEN
   • Niets doen met kans
   • Niet actief nastreven

EXAMENVRAAG: "Welke risicoreactie vergroot de waarschijnlijkheid van een positief risico?"
ANTWOORD: Vergroten`
      },
      {
        titel: 'Risicotechniek - 4 Stappen',
        inhoud: `1. IDENTIFICEREN
   • Context en doelstellingen begrijpen
   • Bedreigingen en kansen identificeren
   • Risicoregister opstellen

2. BEOORDELEN
   • Waarschijnlijkheid analyseren
   • Impact bepalen
   • Prioriteren (hoog/midden/laag)

3. PLANNEN
   • Risicoreacties kiezen
   • Maatregelen definieren
   • Eigenaar en actiehouder toewijzen

4. IMPLEMENTEREN
   • Maatregelen uitvoeren
   • Risico's bewaken
   • Register bijwerken

RISICOREGISTER bevat:
• Risico-ID, beschrijving
• Waarschijnlijkheid, impact
• Nabijheid, eigenaar
• Reactie, status`
      },
      {
        titel: 'Cognitieve Bias',
        inhoud: `VERLIESAVERSIE:
• Liever houden wat je hebt
• Dan iets nieuws krijgen van gelijke waarde
• Risico: Te conservatief beslissen

OPTIMISMEBIAS:
• Neerwaartse risico's onderschatten
• "Het zal wel meevallen"
• Risico: Te weinig buffers

EXAMENVRAAG: "Welke bias zorgt dat men negatieve risico's onderschat?"
ANTWOORD: Optimismebias

TEGENMAATREGELEN:
• Onafhankelijke review
• Historische data gebruiken
• Devil's advocate aanwijzen`
      }
    ]
  },
  {
    id: 'issues',
    titel: 'Issues & Wijziging',
    icon: '🔄',
    inhoud: [
      {
        titel: 'Issue Definities',
        inhoud: `ISSUE: Relevante gebeurtenis waar PM rekening mee moet houden.

3 SOORTEN ISSUES:

1. WIJZIGINGSVERZOEK (RFC)
   • Voorstel voor wijziging van baseline
   • Scope, product, plan wijzigen
   • Moet formeel beoordeeld worden

2. AFWIJKING VAN SPECIFICATIE
   • Iets dat verstrekt had moeten zijn
   • Maar niet voldoet aan spec
   • Voorbeeld: Bug in software

3. PROBLEEM/BEZORGDHEID
   • Overige issues
   • Niet 1 of 2

BASELINE: Goedgekeurde versie waarop wijzigingsbeheer van toepassing is`
      },
      {
        titel: 'Configuratiebeheer',
        inhoud: `DOEL: Producten identificeren, volgen en beschermen.

5 ACTIVITEITEN:

1. PLANNING
   • Hoe gaan we config beheren?

2. IDENTIFICATIE
   • Elk item unieke ID
   • Versiebeheer

3. BEHEERSING
   • Wijzigingen via procedure
   • Baseline beschermen

4. STATUSADMINISTRATIE
   • Waar is product?
   • Welke versie?

5. VERIFICATIE
   • Klopt administratie met werkelijkheid?

CONFIGURATIE-ITEM:
• Product onder configuratiebeheer
• Voorbeeld: Document, component, versie`
      },
      {
        titel: 'Issue & Wijzigingstechniek - 4 Stappen',
        inhoud: `1. ISSUES VERZAMELEN
   • Identificeren en vastleggen
   • In issueregister

2. ISSUES BEOORDELEN
   • Impact op scope, benefits, kosten bepalen
   • Ernst en prioriteit vaststellen

3. BESLISSEN OVER WIJZIGINGEN
   • Wie beslist? (Wijzigingsbevoegdheid)
   • Goedkeuren / Afwijzen / Uitstellen

4. WIJZIGINGEN IMPLEMENTEREN
   • Met wijzigingsbudget
   • Producten aanpassen
   • Register bijwerken

WIJZIGINGSBUDGET:
• Geld gereserveerd voor goedgekeurde wijzigingen
• Beheerd door stuurgroep

WIJZIGINGSBEVOEGDHEID:
• Wie mag wijzigingen goedkeuren?
• Stuurgroep of gedelegeerd`
      }
    ]
  },
  {
    id: 'voortgang',
    titel: 'Voortgang',
    icon: '📈',
    inhoud: [
      {
        titel: 'Rapportages',
        inhoud: `4 BELANGRIJKE RAPPORTEN:

1. CHECKPOINTRAPPORT
   • Van: Teammanager
   • Aan: Projectmanager
   • Frequentie: Periodiek (bijv. wekelijks)
   • Inhoud: Status werkpakket

2. HOOFDPUNTENRAPPORT (Highlight)
   • Van: Projectmanager
   • Aan: Stuurgroep
   • Frequentie: Periodiek (bijv. maandelijks)
   • Inhoud: Voortgang fase

3. FASE-EINDRAPPORT
   • Van: Projectmanager
   • Aan: Stuurgroep
   • Wanneer: Einde van fase
   • Doel: Beslissing faseovergang

4. PROJECTEINDRAPPORT
   • Van: Projectmanager
   • Aan: Stuurgroep
   • Wanneer: Einde project
   • Inhoud: Projectprestaties beoordelen`
      },
      {
        titel: 'Afwijking (Exception)',
        inhoud: `DEFINITIE: Prognose dat tolerantieniveaus overschreden zullen worden.

BIJ AFWIJKING:

1. AFWIJKINGSRAPPORT opstellen
   • Beschrijving situatie
   • Impact analyse
   • Opties met aanbeveling

2. ESCALEREN naar stuurgroep
   • Stuurgroep beslist

3. Eventueel AFWIJKINGSPLAN maken
   • Vervangt huidig faseplan
   • Beschrijft herstelacties

ESCALATIELADDER:
Team → PM → Stuurgroep → Corporate/Programme

EXAMENVRAAG: "Wat moet PM doen bij dreigende tolerantieoverschrijding?"
ANTWOORD: Afwijkingsrapport opstellen en escaleren`
      },
      {
        titel: 'Beheersinstrumenten',
        inhoud: `TIJDGEDREVEN BEHEERSMIDDELEN:
• Op vaste intervallen
• Periodieke rapporten
• Hoofdpuntenrapport (bijv. maandelijks)
• Checkpointrapport (bijv. wekelijks)

GEBEURTENISGEDREVEN BEHEERSMIDDELEN:
• Bij specifieke gebeurtenissen
• Afwijkingsrapport
• Fase-eindrapport

REGISTERS EN LOGBOEKEN:
• Risicoregister - Alle risico's
• Issueregister - Alle issues
• Kwaliteitsregister - Alle kwaliteitsactiviteiten
• Lessenlogboek - Leerpunten
• Dagelijks logboek - PM's notities

EXAMENVRAAG: "Welk rapport is gebeurtenisgedreven?"
ANTWOORD: Afwijkingsrapport / Fase-eindrapport`
      }
    ]
  },
  {
    id: 'processen',
    titel: '7 Processen',
    icon: '🔄',
    inhoud: [
      {
        titel: 'Procesoverzicht',
        inhoud: `7 PROCESSEN IN VOLGORDE:

1. OPSTARTEN (SU) - Starting Up
   • Pre-project, is dit een project waard?

2. STUREN (DP) - Directing
   • Door stuurgroep, loopt door hele project

3. INITIEREN (IP) - Initiating
   • Solide fundamenten leggen

4. BEHEERSEN FASE (CS) - Controlling
   • Dagelijks werk PM

5. PRODUCTOPLEVERING (MP) - Managing Product Delivery
   • Teammanagers leveren

6. FASEOVERGANG (SB) - Managing Stage Boundary
   • Naar volgende fase

7. AFSLUITEN (CP) - Closing
   • Beheerst einde

EZELSBRUGGETJE: "Op Sturen In Beheersen Product Fase Af"`
      },
      {
        titel: '1. Opstarten van een Project (SU)',
        inhoud: `DOEL: Beoordelen of project waarschijnlijk waardevol is.

TRIGGER: Projectmandaat van bedrijf/programma

OUTPUTS:
• Projectvoorstel (Projectbrief)
• Outline Business Case
• Projectopdrachtgever + PM benoemd
• Faseplanning initiatiefase

ACTIVITEITEN:
• Projectopdracht formuleren
• Aanpak kiezen
• Projectmanagementteam ontwerpen
• Projectvoorstel samenstellen

WIE: Projectmanager + Opdrachtgever

EINDIGT MET: Beslissing stuurgroep om te initieren`
      },
      {
        titel: '2. Sturen van een Project (DP)',
        inhoud: `DOEL: Stuurgroep eindverantwoordelijkheid laten behouden.

LOOPT: Door hele project heen!

ACTIVITEITEN:
• Autoriseren initiatie
• Autoriseren project
• Autoriseren fase/afwijkingsplan
• Ad-hoc sturing geven
• Autoriseren projectafsluiting

WIE: Stuurgroep (NIET projectmanager!)

BELANGRIJKE BESLUITEN:
• Go/no-go bij elke fase
• Goedkeuren afwijkingen
• Afsluiting autoriseren

EXAMENVRAAG: "Wie autoriseert de start van een fase?"
ANTWOORD: Stuurgroep (via proces Sturen)`
      },
      {
        titel: '3. Initieren van een Project (IP)',
        inhoud: `DOEL: Solide fundamenten leggen voor project.

OUTPUTS:
• Projectinitiatiedocumentatie (PID)
• Volledige Business Case
• Alle strategieen/aanpakken
• Projectplan
• Baten review plan

PID BEVAT:
• Business Case
• Projectplan
• Alle managementaanpakken
• Projectbesturing
• Op maat maken

EINDIGT MET: Beslissing stuurgroep om project te starten

EXAMENVRAAG: "Wanneer wordt de volledige business case gemaakt?"
ANTWOORD: Tijdens Initieren`
      },
      {
        titel: '4. Beheersen van een Fase (CS)',
        inhoud: `DOEL: Het werk van de fase managen.

ACTIVITEITEN:
• Werkpakketten autoriseren
• Voortgang bewaken
• Issues en risico's behandelen
• Rapporten opstellen
• Corrigerende maatregelen nemen

WIE: Projectmanager

OUTPUTS:
• Werkpakketten
• Checkpointrapporten (ontvangen)
• Hoofdpuntenrapporten
• Afwijkingsrapporten (indien nodig)

BELANGRIJKE PRINCIPES:
• Manage by exception
• Geen onbeheerste veranderingen
• Producten voldoen aan kwaliteitscriteria`
      },
      {
        titel: '5. Managen Productoplevering (MP)',
        inhoud: `DOEL: Schakel tussen PM en teammanagers.

ACTIVITEITEN:
1. Werkpakket ACCEPTEREN
   • TM ontvangt werk van PM

2. Werkpakket UITVOEREN
   • Producten maken
   • Kwaliteitscontrole

3. Werkpakket OPLEVEREN
   • Goedgekeurde producten terug naar PM

WIE: Teammanager

RAPPORTEN:
• Checkpointrapporten naar PM

EXAMENVRAAG: "Wie accepteert een werkpakket?"
ANTWOORD: Teammanager`
      },
      {
        titel: '6. Managen van een Faseovergang (SB)',
        inhoud: `DOEL: Stuurgroep voorzien van informatie voor beslissing over volgende fase.

WANNEER:
• Einde van elke fase (behalve laatste)
• Bij dreigende tolerantieoverschrijding

OUTPUTS:
• Bijgewerkt projectplan
• Plan volgende fase
• Bijgewerkte business case
• Fase-eindrapport

ALLEEN IN DIT PROCES:
• Vervanging voor faseplan voorbereiden

WIE: Projectmanager

EXAMENVRAAG: "Waar wordt het plan voor de volgende fase gemaakt?"
ANTWOORD: Managen van een faseovergang`
      },
      {
        titel: '7. Afsluiten van een Project (CP)',
        inhoud: `DOEL: Beheerst einde van het project.

OOK BIJ VOORTIJDIGE AFSLUITING!

ACTIVITEITEN:
• Beoordelen of doelstellingen behaald
• Acceptatie projectproduct bevestigen
• Benefits reviews plannen
• Aanbevelingen formuleren
• Projecteindrapport opstellen

OUTPUTS:
• Projecteindrapport
• Leerpuntenrapport
• Benefits review plan (bijgewerkt)

WIE: Projectmanager (met goedkeuring stuurgroep)

EXAMENVRAAG: "Wanneer wordt een leerpuntenrapport opgesteld?"
ANTWOORD: Bij Afsluiten van een Project`
      }
    ]
  },
  {
    id: 'producten',
    titel: 'Managementproducten',
    icon: '📋',
    inhoud: [
      {
        titel: 'Baselines (goedgekeurd)',
        inhoud: `BASELINE PRODUCTEN (onder wijzigingsbeheer):

1. BUSINESS CASE
   • Rechtvaardiging project
   • Eigenaar: Opdrachtgever

2. PROJECTPLAN
   • Overzicht hele project
   • Hoe en wanneer doelen bereikt?

3. FASEPLAN
   • Detail voor huidige fase
   • Dagelijkse beheersing PM

4. AFWIJKINGSPLAN
   • Vervangt fase/projectplan
   • Bij tolerantieoverschrijding

5. PRODUCTBESCHRIJVINGEN
   • Specificaties per product
   • Kwaliteitscriteria`
      },
      {
        titel: 'Registers',
        inhoud: `4 REGISTERS:

1. RISICOREGISTER
   • Alle risico's
   • Waarschijnlijkheid, impact, reactie, eigenaar
   • Bijgehouden door: PM

2. ISSUEREGISTER
   • Alle issues
   • Type, ernst, status
   • Bijgehouden door: PM

3. KWALITEITSREGISTER
   • Alle kwaliteitsactiviteiten
   • Resultaten tests/reviews
   • Bijgehouden door: PM/Projectondersteuning

4. CONFIGURATIE-ITEMRECORD
   • Status configuratie-items
   • Versies, locatie
   • Bijgehouden door: Projectondersteuning`
      },
      {
        titel: 'Logboeken',
        inhoud: `2 LOGBOEKEN:

1. DAGELIJKS LOGBOEK
   • PM's persoonlijke notities
   • Acties, beslissingen, problemen
   • Informeel register

2. LESSENLOGBOEK
   • Leerpunten
   • Gedurende hele project
   • Basis voor leerpuntenrapport

VERSCHIL REGISTER vs LOGBOEK:
• Register = formeel, specifiek doel
• Logboek = informeler, verzameling notities`
      },
      {
        titel: 'Rapporten',
        inhoud: `6 RAPPORTEN:

1. CHECKPOINTRAPPORT
   • TM → PM
   • Status werkpakket

2. HOOFDPUNTENRAPPORT
   • PM → Stuurgroep
   • Periodieke voortgang

3. AFWIJKINGSRAPPORT
   • PM → Stuurgroep
   • Bij tolerantieoverschrijding

4. FASE-EINDRAPPORT
   • PM → Stuurgroep
   • Prestaties fase

5. PROJECTEINDRAPPORT
   • PM → Stuurgroep
   • Prestaties project

6. LEERPUNTENRAPPORT
   • PM → Organisatie
   • Alle leerpunten`
      },
      {
        titel: 'Aanpakken/Strategieen',
        inhoud: `5 MANAGEMENTAANPAKKEN:

1. COMMUNICATIEMANAGEMENTAANPAK
   • Wie krijgt welke info?
   • Hoe en wanneer?

2. KWALITEITSMANAGEMENTAANPAK
   • Kwaliteitsnormen
   • Hoe borgen we kwaliteit?

3. RISICOMANAGEMENTAANPAK
   • Hoe identificeren/beoordelen?
   • Rollen en verantwoordelijkheden

4. ISSUE- EN WIJZIGINGSMANAGEMENTAANPAK
   • Wijzigingsprocedure
   • Wijzigingsbevoegdheid

5. CONFIGURATIEMANAGEMENTAANPAK
   • Versiebeheer
   • Baseline-beheer

ALLEMAAL ONDERDEEL VAN: PID`
      }
    ]
  },
  {
    id: 'examenstrategie',
    titel: 'Examenstrategie',
    icon: '🎓',
    inhoud: [
      {
        titel: 'Examenformat',
        inhoud: `PRINCE2 FOUNDATION EXAMEN:

• 60 meerkeuzevragen
• 60 minuten tijd
• 55% nodig om te slagen = 33/60 vragen
• Geen negatieve punten
• Gesloten boek

VRAAGTYPEN:
• Definitievragen - Wat is X?
• Scenariovragen - In situatie X, wat doe je?
• Ontbrekend woord - Vul het juiste woord in
• TWEE doelstellingen - Welke 2 zijn correct?

TIP: Altijd alle vragen beantwoorden!`
      },
      {
        titel: 'Herkennen Principes',
        inhoud: `BIJ WELKE PRINCIPE HOORT HET?

"business case, wenselijk, levensvatbaar"
→ Voortdurende zakelijke rechtvaardiging

"lessons learned, ervaringen, feedback"
→ Leren van ervaringen

"rollen, verantwoordelijkheden, contract"
→ Rollen, verantwoordelijkheden en relaties

"fasen, faseovergang, faseplan"
→ Managen per fase

"toleranties, delegeren, escaleren"
→ Manage by exception

"producten, PBS, productbeschrijving"
→ Focussen op producten

"aanpassen, PID, combineren"
→ Op maat maken`
      },
      {
        titel: 'Herkennen Rollen',
        inhoud: `WIE IS VERANTWOORDELIJK?

"Eindverantwoordelijk voor project"
→ Projectopdrachtgever

"Eigenaar business case"
→ Projectopdrachtgever

"Realiseert benefits"
→ Senior User

"Technische integriteit"
→ Senior Supplier

"Dagelijks management"
→ Projectmanager

"Levert producten op"
→ Teammanager

"Onafhankelijk van PM, niet van project"
→ Projectborging`
      },
      {
        titel: 'Herkennen Processen',
        inhoud: `WANNEER WELK PROCES?

"Beoordelen of project waard is"
→ Opstarten (SU)

"PID samenstellen"
→ Initieren (IP)

"Stuurgroep autoriseert"
→ Sturen (DP)

"Dagelijkse beheersing PM"
→ Beheersen fase (CS)

"Teammanager levert op"
→ Productoplevering (MP)

"Plan volgende fase maken"
→ Faseovergang (SB)

"Project beheerst afsluiten"
→ Afsluiten (CP)`
      },
      {
        titel: 'Veelgemaakte Fouten',
        inhoud: `VERMIJD DEZE FOUTEN:

1. Projectborging is NIET onafhankelijk van project
   • Wel onafhankelijk van PM

2. Opdrachtgever en PM mogen NIET gecombineerd worden
   • Andere rollen wel

3. Stuurgroep beslist, PM voert uit
   • PM autoriseert geen fases

4. Afwijkingsplan vervangt faseplan
   • Niet een extra plan

5. Minimaal 2 fasen nodig
   • Initiatiefase + min 1 leveringsfase

6. Business Case is van opdrachtgever
   • Niet van PM

7. Lessenlogboek loopt hele project
   • Leerpuntenrapport aan einde`
      }
    ]
  }
];

export default function StudiegidsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedSectie, setSelectedSectie] = useState<Sectie | null>(null);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  // Handle incoming section parameter from leerschema
  useEffect(() => {
    if (params.sectie) {
      const sectieNaam = params.sectie as string;
      const gevondenSectie = studiegidsData.find(s =>
        s.titel.toLowerCase().includes(sectieNaam.toLowerCase()) ||
        s.id.toLowerCase().includes(sectieNaam.toLowerCase())
      );
      if (gevondenSectie) {
        setSelectedSectie(gevondenSectie);
      }
    }
  }, [params.sectie]);

  const handleSectiePress = (sectie: Sectie) => {
    setSelectedSectie(sectie);
    setExpandedItem(null);
  };

  const handleBack = () => {
    if (selectedSectie) {
      setSelectedSectie(null);
    } else {
      router.back();
    }
  };

  const toggleItem = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>
              {selectedSectie ? '← Terug' : '← Home'}
            </Text>
          </Pressable>
          <Text style={styles.headerTitle}>
            {selectedSectie ? selectedSectie.titel : 'Studiegids'}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {!selectedSectie ? (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.introText}>
              Complete PRINCE2 Foundation examenstof. Leer de 7-7-7 structuur en alle examenvragen-types.
            </Text>

            <View style={styles.sectieGrid}>
              {studiegidsData.map((sectie) => (
                <Pressable
                  key={sectie.id}
                  style={({ pressed }) => [
                    styles.sectieCard,
                    pressed && styles.sectieCardPressed,
                  ]}
                  onPress={() => handleSectiePress(sectie)}
                >
                  <Text style={styles.sectieIcon}>{sectie.icon}</Text>
                  <Text style={styles.sectieTitel}>{sectie.titel}</Text>
                  <Text style={styles.sectieCount}>
                    {sectie.inhoud.length} items
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.quickRef}>
              <Text style={styles.quickRefTitle}>7-7-7 Structuur</Text>
              <Text style={styles.quickRefSubtitle}>7 Principes:</Text>
              <Text style={styles.quickRefText}>1. Voortdurende zakelijke rechtvaardiging</Text>
              <Text style={styles.quickRefText}>2. Leren van ervaringen</Text>
              <Text style={styles.quickRefText}>3. Rollen, verantwoordelijkheden en relaties</Text>
              <Text style={styles.quickRefText}>4. Managen per fase</Text>
              <Text style={styles.quickRefText}>5. Manage by exception</Text>
              <Text style={styles.quickRefText}>6. Focussen op producten</Text>
              <Text style={styles.quickRefText}>7. Op maat maken</Text>

              <Text style={[styles.quickRefSubtitle, { marginTop: 12 }]}>7 Practices:</Text>
              <Text style={styles.quickRefText}>Business Case, Organisatie, Plannen, Kwaliteit, Risico, Issues, Voortgang</Text>

              <Text style={[styles.quickRefSubtitle, { marginTop: 12 }]}>7 Processen:</Text>
              <Text style={styles.quickRefText}>SU (Opstarten), DP (Sturen), IP (Initieren), CS (Beheersen), MP (Productoplevering), SB (Faseovergang), CP (Afsluiten)</Text>
            </View>
          </ScrollView>
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.itemsList}>
              {selectedSectie.inhoud.map((item, index) => (
                <Pressable
                  key={index}
                  style={styles.itemCard}
                  onPress={() => toggleItem(index)}
                >
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitel}>{item.titel}</Text>
                    <Text style={styles.expandIcon}>
                      {expandedItem === index ? '−' : '+'}
                    </Text>
                  </View>
                  {expandedItem === index && (
                    <Text style={styles.itemInhoud}>{item.inhoud}</Text>
                  )}
                </Pressable>
              ))}
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>
                Let op vetgedrukte termen en examenvraag-voorbeelden. Deze komen vaak terug op het echte examen!
              </Text>
            </View>
          </ScrollView>
        )}
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
    backgroundColor: '#7c3aed',
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  introText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 22,
  },
  sectieGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  sectieCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectieCardPressed: {
    backgroundColor: '#f9fafb',
  },
  sectieIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  sectieTitel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  sectieCount: {
    fontSize: 12,
    color: '#9ca3af',
  },
  quickRef: {
    backgroundColor: '#ede9fe',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  quickRefTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5b21b6',
    marginBottom: 12,
  },
  quickRefSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c3aed',
    marginBottom: 4,
  },
  quickRefText: {
    fontSize: 13,
    color: '#6d28d9',
    lineHeight: 20,
  },
  itemsList: {
    paddingTop: 16,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    paddingRight: 8,
  },
  expandIcon: {
    fontSize: 20,
    color: '#7c3aed',
    fontWeight: 'bold',
  },
  itemInhoud: {
    marginTop: 12,
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#ede9fe',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#5b21b6',
    lineHeight: 20,
  },
});
