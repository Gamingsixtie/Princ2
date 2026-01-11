import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

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
    id: 'concepten',
    titel: 'Kernconcepten',
    icon: '🎯',
    inhoud: [
      {
        titel: 'Wat is een Project?',
        inhoud: `Een tijdelijke organisatie die is opgezet met als doel het opleveren van een of meer bedrijfsproducten volgens een overeengekomen business case.

5 Kenmerken van een Project:
• Verandering - Projecten zijn de manier waarop we veranderingen doorvoeren
• Tijdelijk - Heeft een gedefinieerd begin en einde
• Multidisciplinair - Teams van verschillende organisaties/afdelingen werken samen
• Uniek - Elk project verschilt op een bepaalde manier
• Onzekerheid - Projecten zijn risicovoller dan dagelijkse bedrijfsvoering`
      },
      {
        titel: '5 Geintegreerde Elementen',
        inhoud: `PRINCE2 bestaat uit 5 geintegreerde elementen:

1. PRINCIPES (7) - Verplichte richtlijnen
2. MENSEN - Centraal in de methode
3. PRACTICES (7) - Aspecten van projectmanagement
4. PROCESSEN (7) - De projectlevenscyclus
5. PROJECTCONTEXT - Hoe PRINCE2 wordt toegepast`
      },
      {
        titel: '7 Prestatieaspecten',
        inhoud: `Toleranties worden gesteld voor deze 7 aspecten:

• Benefits - Waarom doen we dit?
• Kosten - Moet betaalbaar zijn
• Tijd - Wanneer klaar?
• Kwaliteit - Geschikt voor het doel
• Scope - Wat gaat het project opleveren?
• Duurzaamheid - Impact op omgeving
• Risico - Hoeveel risico is acceptabel?`
      },
      {
        titel: 'Opleveringsaanpakken',
        inhoud: `• Lineair-sequentieel: Elke stap sequentieel, product aan eind beschikbaar
• Iteratief-incrementeel: Herhaalt requirements, ontwerp, coderen, testen
• Hybride: Combinatie van beide`
      }
    ]
  },
  {
    id: 'principes',
    titel: 'De 7 Principes',
    icon: '⭐',
    inhoud: [
      {
        titel: '1. Voortdurende Zakelijke Rechtvaardiging',
        inhoud: `Een project heeft voldoende zakelijke rechtvaardiging nodig om te starten EN door te gaan. Anders moet het worden gestopt.

Examenvraag herkennen:
• "benefits opwegen tegen kosten"
• "project voortijdig afsluiten"
• "externe omgeving gewijzigd"
• "wenselijk, levensvatbaar, haalbaar"`
      },
      {
        titel: '2. Leren van Ervaringen',
        inhoud: `Het projectteam zoekt, registreert en implementeert actief verbeteringen.

Examenvraag herkennen:
• "ervaringen uitwisselen"
• "feedback van stakeholders"
• "retrospective"
• "leerpunten identificeren"`
      },
      {
        titel: '3. Rollen, Verantwoordelijkheden en Relaties',
        inhoud: `Een project heeft gedefinieerde rollen binnen een structuur waarbij bedrijfs-, gebruikers- en leveranciersbelangen zijn vertegenwoordigd.

Examenvraag herkennen:
• "contract overeenkomen"
• "wie is verantwoordelijk"
• "rollen toewijzen"`
      },
      {
        titel: '4. Managen per Fase',
        inhoud: `Een project wordt fase voor fase gepland, bewaakt en beheerst.

Minimaal 2 fasen:
• Initiatiefase
• Minimaal een volgende fase

Examenvraag herkennen:
• "fasen", "faseovergang"
• "minimaal twee fasen"`
      },
      {
        titel: '5. Manage by Exception',
        inhoud: `Een project stelt grenzen aan gedelegeerde bevoegdheden door toleranties te definieren.

Examenvraag herkennen:
• "toleranties vaststellen"
• "maximaal X% over budget"
• "delegeren van bevoegdheden"
• "mate van vertrouwen"`
      },
      {
        titel: '6. Focussen op Producten',
        inhoud: `Een project focust zich op het definieren en opleveren van producten.

4 soorten producten:
• Managementproducten - documenten voor management
• Specialistische producten - wat gebruiker nodig heeft
• Projectproduct - totale output
• Externe producten - buiten beheersing project`
      },
      {
        titel: '7. Op Maat Maken',
        inhoud: `PRINCE2 wordt op maat gemaakt voor omgeving, omvang, complexiteit, belang, opleveringsmethode, teambekwaamheid en risiconiveau.

Op maat maken wordt vastgelegd in:
Projectinitiatiedocumentatie (PID)`
      }
    ]
  },
  {
    id: 'mensen',
    titel: 'Mensen',
    icon: '👥',
    inhoud: [
      {
        titel: 'Belangrijke Definities',
        inhoud: `• Leiderschap - Motiveren door overtuigen, beinvloeden en co-creeren
• Management - Sturen van uitvoering van taken volgens overeengekomen werkwijzen
• Samenwerking - Proces van mensen die samenwerken om doelstellingen te behalen
• Co-creatie - Samenwerken met beinvloeders om werkwijzen te laten adopteren
• Cultuur - Gedeelde houdingen, waarden en doelen`
      },
      {
        titel: 'Ecosystemen',
        inhoud: `• Organisatorisch ecosysteem - Interne elementen van organisatie + externe relaties
• Projectecosysteem - Onderdelen van bedrijf betrokken bij of beinvloed door het project`
      },
      {
        titel: 'Verandermanagementaanpak',
        inhoud: `Beschrijft hoe het bedrijf van de huidige toestand naar de beoogde toestand gaat.

Bevat: huidige, tussentijdse en beoogde toestand`
      }
    ]
  },
  {
    id: 'organisatie',
    titel: 'Practice: Organisatie',
    icon: '🏢',
    inhoud: [
      {
        titel: 'De 4 Organisatielagen',
        inhoud: `1. Bedrijfslaag (Corporate/Programme)
2. Stuurgroep (Directing)
3. Projectmanager (Managing)
4. Teams (Delivering)`
      },
      {
        titel: 'Belangrijke Rollen',
        inhoud: `• Stuurgroep - Bevoegdheid om project te sturen binnen opdracht van bedrijf
• Projectopdrachtgever - Eigenaar business case, eindverantwoordelijk
• Seniorgebruiker - Commitment gebruikersgemeenschap, realisatie benefits
• Seniorleverancier - Technische integriteit projectproducten
• Projectmanager - Dagelijks management project
• Teammanager - Producten opleveren volgens werkpakket
• Projectborging - Onafhankelijk van PM, maar NIET van project`
      },
      {
        titel: 'Techniek Organisatieontwerp - 4 Stappen',
        inhoud: `1. Organisatorisch ecosysteem begrijpen
2. Projectecosysteem ontwerpen
3. Projectecosysteem ontwikkelen (onboarden)
4. Voortdurende wijzigingen managen`
      }
    ]
  },
  {
    id: 'businesscase',
    titel: 'Practice: Business Case',
    icon: '💼',
    inhoud: [
      {
        titel: 'Doel',
        inhoud: `Om de projectopdrachtgever in staat te stellen te beslissen of het project wordt voortgezet.`
      },
      {
        titel: 'Belangrijke Termen',
        inhoud: `• Output - Tastbaar of ontastbaar product
• Eindresultaat (Outcome) - Meetbare verbetering
• Benefit - Meetbare verbetering gedefinieerd in business case
• Dis-benefit - Meetbare daling die als negatief wordt ervaren`
      },
      {
        titel: 'Managementtechniek - 4 Stappen',
        inhoud: `1. Ontwikkelen - Projectmandaat reviewen, outline BC maken
2. Controleren - Beoordelen bij faseovergang
3. Onderhouden - Impact risico's/issues beoordelen
4. Bevestigen - Na afsluiting: benefits gerealiseerd?`
      }
    ]
  },
  {
    id: 'plannen',
    titel: 'Practice: Plannen',
    icon: '📅',
    inhoud: [
      {
        titel: '3 Planniveaus',
        inhoud: `• Projectplan - Plan op hoofdlijnen, laag detail
• Faseplan - Voldoende detail voor dagelijkse beheersing door PM
• Teamplan - Optioneel, voor teammanager

Afwijkingsplan: Vervangt huidig faseplan bij tolerantieoverschrijding`
      },
      {
        titel: 'Planningstechniek - 7 Stappen',
        inhoud: `1. Producten definieren en analyseren (afhankelijkheden!)
2. Werkpakketten organiseren
3. Schattingen maken (apparatuur identificeren)
4. Tijdschema maken
5. Risico's analyseren
6. Begroting opstellen
7. Plan documenteren`
      }
    ]
  },
  {
    id: 'kwaliteit',
    titel: 'Practice: Kwaliteit',
    icon: '✅',
    inhoud: [
      {
        titel: 'Managementproducten',
        inhoud: `• Kwaliteitsmanagementaanpak - Richtlijnen over technieken
• Projectproductbeschrijving - Acceptatiecriteria projectproduct
• Productbeschrijving - Kwaliteitsspecificaties per product
• Kwaliteitsregister - Wanneer outputs getest worden
• Productregister - Status van producten`
      },
      {
        titel: 'Kwaliteitsborging vs Projectborging',
        inhoud: `Kwaliteitsborging:
• Onafhankelijk van projectteam
• Deel van kwaliteitsmanagementsysteem

Projectborging:
• Onafhankelijk van PM
• NIET onafhankelijk van project`
      },
      {
        titel: 'Techniek - 4 Stappen',
        inhoud: `1. Gebruikersinputs verzamelen (kwaliteitsspecificaties)
2. Kwaliteitsmanagementaanpak beschrijven
3. Kwaliteit beheersen (testen)
4. Producten accepteren (eigenaarschap)`
      }
    ]
  },
  {
    id: 'risico',
    titel: 'Practice: Risico',
    icon: '⚠️',
    inhoud: [
      {
        titel: 'Belangrijke Termen',
        inhoud: `• Risico - Onzekere gebeurtenis die effect zou hebben op doelstellingen
• Bedreiging - Risico met negatief effect
• Kans - Risico met positief effect
• Risico-eigenaar - Verantwoordelijk voor adequaat reageren
• Risico-actiehouder - Voert acties uit namens eigenaar`
      },
      {
        titel: 'Cognitieve Bias',
        inhoud: `• Verliesaversie - Liever houden wat je hebt dan iets nieuws krijgen
• Optimismebias - Neerwaartse risico's verdisconteren`
      },
      {
        titel: 'Techniek - 4 Stappen',
        inhoud: `1. Identificeren - Context/doelstellingen, bedreigingen/kansen
2. Beoordelen - Waarschijnlijkheid analyseren, prioriteren
3. Plannen - Maatregelen definieren
4. Implementeren - Maatregelen uitvoeren`
      }
    ]
  },
  {
    id: 'issues',
    titel: 'Practice: Issues',
    icon: '🔄',
    inhoud: [
      {
        titel: 'Belangrijke Termen',
        inhoud: `• Issue - Relevante gebeurtenis waar PM rekening mee moet houden
• Wijzigingsverzoek - Voorstel voor wijziging van baseline
• Afwijking van specificatie - Iets dat verstrekt had moeten zijn
• Baseline - Goedgekeurde versies waarop wijzigingsbeheer van toepassing is`
      },
      {
        titel: 'Techniek - 4 Stappen',
        inhoud: `1. Issues verzamelen - Identificeren en vastleggen
2. Issues beoordelen - Impact op scope, benefits, kosten
3. Beslissen over wijzigingen - Goedkeuren/afwijzen
4. Wijzigingen implementeren - Met wijzigingsbudget`
      }
    ]
  },
  {
    id: 'voortgang',
    titel: 'Practice: Voortgang',
    icon: '📈',
    inhoud: [
      {
        titel: 'Rapporten',
        inhoud: `• Checkpointrapport - TM naar PM (status werkpakket)
• Hoofdpuntenrapport - PM naar Stuurgroep (periodiek)
• Fase-eindrapport - PM naar Stuurgroep (beslissing)
• Projecteindrapport - PM naar Stuurgroep (beoordeling)`
      },
      {
        titel: 'Afwijking (Exception)',
        inhoud: `Definitie: Prognose dat tolerantieniveaus overschreden zullen worden

Bij afwijking:
• Afwijkingsrapport opstellen
• Escaleren naar stuurgroep
• Eventueel afwijkingsplan maken`
      },
      {
        titel: 'Beheersinstrumenten',
        inhoud: `• Tijdgedreven - Periodieke intervallen
• Gebeurtenisgedreven - Bij specifieke gebeurtenissen`
      }
    ]
  },
  {
    id: 'processen',
    titel: 'De 7 Processen',
    icon: '🔄',
    inhoud: [
      {
        titel: '1. Opstarten van een Project',
        inhoud: `Doel: Beoordelen of project waarschijnlijk waardevol is

Output:
• Projectvoorstel
• Outline business case
• Projectopdrachtgever identificeren`
      },
      {
        titel: '2. Sturen van een Project',
        inhoud: `Doel: Eindverantwoordelijkheid stuurgroep behouden

Loopt door hele project heen!

Activiteiten:
• Autoriseren initiatie/project/fase
• Ad-hoc sturing geven
• Autoriseren projectafsluiting`
      },
      {
        titel: '3. Initieren van een Project',
        inhoud: `Doel: Solide fundamenten leggen

Output:
• Projectinitiatiedocumentatie (PID)
• Volledige business case`
      },
      {
        titel: '4. Beheersen van een Fase',
        inhoud: `Doel: Het werk van de fase managen

• Geen onbeheerste veranderingen
• Producten voldoen aan kwaliteitscriteria
• Reageren op risico's en issues`
      },
      {
        titel: '5. Managen Productoplevering',
        inhoud: `Doel: Schakel tussen PM en teammanagers

Activiteiten:
• Werkpakket accepteren
• Werkpakket uitvoeren
• Werkpakket opleveren`
      },
      {
        titel: '6. Managen van een Faseovergang',
        inhoud: `Doel: Stuurgroep voorzien van info voor beslissing

ALLEEN hier: Vervanging voor faseplan voorbereiden

Output:
• Bijgewerkt projectplan
• Plan volgende fase`
      },
      {
        titel: '7. Afsluiten van een Project',
        inhoud: `Doel: Beheerst einde van het project

• Beoordelen of doelstellingen behaald
• Acceptatie projectproduct bevestigen
• Benefits reviews plannen

OOK bij voortijdige afsluiting!`
      }
    ]
  }
];

export default function StudiegidsScreen() {
  const router = useRouter();
  const [selectedSectie, setSelectedSectie] = useState<Sectie | null>(null);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

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
        {/* Header */}
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
          // Section List
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.introText}>
              Complete PRINCE2 Foundation theorie. Leer de 7-7-7 structuur: 7 Principes, 7 Practices, 7 Processen.
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

            {/* Quick Reference */}
            <View style={styles.quickRef}>
              <Text style={styles.quickRefTitle}>7-7-7 Snelle Referentie</Text>
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
              <Text style={styles.quickRefText}>Opstarten, Sturen, Initieren, Beheersen, Productoplevering, Faseovergang, Afsluiten</Text>
            </View>
          </ScrollView>
        ) : (
          // Section Detail
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

            {/* Tip */}
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>
                Tip: Leer deze concepten en herken de sleutelwoorden in examenvragen!
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
