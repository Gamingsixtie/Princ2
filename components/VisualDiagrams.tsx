import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// Process Model Diagram
export function ProcesModelDiagram() {
  return (
    <View style={styles.diagramContainer}>
      {/* Sturen DP - Top bar */}
      <View style={styles.dpBar}>
        <Text style={styles.dpBarText}>STUREN (DP)</Text>
        <Text style={styles.dpBarSubtext}>Stuurgroep - loopt door hele project</Text>
      </View>

      {/* Main process flow */}
      <View style={styles.processFlow}>
        {/* Pre-project */}
        <View style={styles.processColumn}>
          <View style={[styles.processBox, styles.processBoxBlue]}>
            <Text style={styles.processCode}>SU</Text>
            <Text style={styles.processName}>Opstarten</Text>
          </View>
          <View style={styles.arrowRight} />
        </View>

        {/* Initiation */}
        <View style={styles.processColumn}>
          <View style={[styles.processBox, styles.processBoxPurple]}>
            <Text style={styles.processCode}>IP</Text>
            <Text style={styles.processName}>Initiatie</Text>
          </View>
          <View style={styles.arrowRight} />
        </View>

        {/* Controlling Stage */}
        <View style={styles.processColumn}>
          <View style={[styles.processBox, styles.processBoxGreen]}>
            <Text style={styles.processCode}>CS</Text>
            <Text style={styles.processName}>Beheersen</Text>
          </View>
          <View style={styles.arrowDown} />
        </View>
      </View>

      {/* Second row */}
      <View style={styles.secondRow}>
        <View style={[styles.processBox, styles.processBoxOrange]}>
          <Text style={styles.processCode}>MP</Text>
          <Text style={styles.processName}>Product-oplevering</Text>
        </View>

        <View style={[styles.processBox, styles.processBoxYellow]}>
          <Text style={styles.processCode}>SB</Text>
          <Text style={styles.processName}>Fase-overgang</Text>
        </View>

        <View style={[styles.processBox, styles.processBoxRed]}>
          <Text style={styles.processCode}>CP</Text>
          <Text style={styles.processName}>Afsluiten</Text>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>LEGENDE - 7 PRINCE2 Processen:</Text>
        <View style={styles.legendGrid}>
          <View style={styles.legendCard}>
            <View style={[styles.legendDot, { backgroundColor: '#7c3aed' }]} />
            <View style={styles.legendTextContainer}>
              <Text style={styles.legendCode}>DP</Text>
              <Text style={styles.legendFull}>Directing a Project</Text>
              <Text style={styles.legendDutch}>Sturen van een Project</Text>
            </View>
          </View>
          <View style={styles.legendCard}>
            <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
            <View style={styles.legendTextContainer}>
              <Text style={styles.legendCode}>SU</Text>
              <Text style={styles.legendFull}>Starting Up a Project</Text>
              <Text style={styles.legendDutch}>Opstarten van een Project</Text>
            </View>
          </View>
          <View style={styles.legendCard}>
            <View style={[styles.legendDot, { backgroundColor: '#8b5cf6' }]} />
            <View style={styles.legendTextContainer}>
              <Text style={styles.legendCode}>IP</Text>
              <Text style={styles.legendFull}>Initiating a Project</Text>
              <Text style={styles.legendDutch}>Initiëren van een Project</Text>
            </View>
          </View>
          <View style={styles.legendCard}>
            <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
            <View style={styles.legendTextContainer}>
              <Text style={styles.legendCode}>CS</Text>
              <Text style={styles.legendFull}>Controlling a Stage</Text>
              <Text style={styles.legendDutch}>Beheersen van een Fase</Text>
            </View>
          </View>
          <View style={styles.legendCard}>
            <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
            <View style={styles.legendTextContainer}>
              <Text style={styles.legendCode}>MP</Text>
              <Text style={styles.legendFull}>Managing Product Delivery</Text>
              <Text style={styles.legendDutch}>Managen Productoplevering</Text>
            </View>
          </View>
          <View style={styles.legendCard}>
            <View style={[styles.legendDot, { backgroundColor: '#eab308' }]} />
            <View style={styles.legendTextContainer}>
              <Text style={styles.legendCode}>SB</Text>
              <Text style={styles.legendFull}>Managing a Stage Boundary</Text>
              <Text style={styles.legendDutch}>Managen Faseovergang</Text>
            </View>
          </View>
          <View style={styles.legendCard}>
            <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
            <View style={styles.legendTextContainer}>
              <Text style={styles.legendCode}>CP</Text>
              <Text style={styles.legendFull}>Closing a Project</Text>
              <Text style={styles.legendDutch}>Afsluiten van een Project</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// Organization Structure Diagram
export function OrganisatieStructuurDiagram() {
  return (
    <View style={styles.diagramContainer}>
      {/* Corporate level */}
      <View style={[styles.orgBox, styles.orgBoxGray]}>
        <Text style={styles.orgTitle}>Bedrijfs-/Programmaniveau</Text>
        <Text style={styles.orgSubtext}>Projectmandaat</Text>
      </View>

      <View style={styles.verticalLine} />

      {/* Project Board */}
      <View style={[styles.orgBox, styles.orgBoxPurple]}>
        <Text style={styles.orgTitle}>STUURGROEP</Text>
        <View style={styles.boardMembers}>
          <View style={styles.boardMember}>
            <Text style={styles.boardMemberIcon}>👔</Text>
            <Text style={styles.boardMemberTitle}>Opdrachtgever</Text>
            <Text style={styles.boardMemberRole}>Business</Text>
          </View>
          <View style={styles.boardMember}>
            <Text style={styles.boardMemberIcon}>👤</Text>
            <Text style={styles.boardMemberTitle}>Senior User</Text>
            <Text style={styles.boardMemberRole}>Gebruiker</Text>
          </View>
          <View style={styles.boardMember}>
            <Text style={styles.boardMemberIcon}>🔧</Text>
            <Text style={styles.boardMemberTitle}>Senior Supplier</Text>
            <Text style={styles.boardMemberRole}>Leverancier</Text>
          </View>
        </View>
        <View style={styles.assuranceTag}>
          <Text style={styles.assuranceText}>+ Projectborging</Text>
        </View>
      </View>

      <View style={styles.verticalLine} />

      {/* Project Manager */}
      <View style={[styles.orgBox, styles.orgBoxBlue]}>
        <Text style={styles.orgTitle}>PROJECTMANAGER</Text>
        <Text style={styles.orgSubtext}>+ Projectondersteuning (optioneel)</Text>
      </View>

      <View style={styles.verticalLine} />

      {/* Team Manager */}
      <View style={[styles.orgBox, styles.orgBoxGreen]}>
        <Text style={styles.orgTitle}>TEAMMANAGER(S)</Text>
        <Text style={styles.orgSubtext}>+ Teamleden</Text>
      </View>
    </View>
  );
}

// Roles Matrix Diagram
export function RollenMatrixDiagram() {
  const roles = [
    {
      rol: 'Opdrachtgever',
      icon: '👔',
      color: '#7c3aed',
      taken: ['Eindverantwoordelijk project', 'Eigenaar Business Case', 'Voorzitter Stuurgroep']
    },
    {
      rol: 'Senior User',
      icon: '👤',
      color: '#3b82f6',
      taken: ['Gebruikersbelangen', 'Benefits realisatie', 'Gebruikersacceptatie']
    },
    {
      rol: 'Senior Supplier',
      icon: '🔧',
      color: '#10b981',
      taken: ['Leveranciersbelangen', 'Technische integriteit', 'Resources beschikbaar']
    },
    {
      rol: 'Projectmanager',
      icon: '📋',
      color: '#f59e0b',
      taken: ['Dagelijks management', 'Plannen & rapporteren', 'Risico\'s & issues']
    },
    {
      rol: 'Teammanager',
      icon: '👷',
      color: '#ef4444',
      taken: ['Producten opleveren', 'Team aansturen', 'Checkpointrapporten']
    },
    {
      rol: 'Projectborging',
      icon: '🔍',
      color: '#6b7280',
      taken: ['Onafhankelijke controle', 'Namens Stuurgroep', 'NIET onafhankelijk v. project']
    },
  ];

  return (
    <View style={styles.diagramContainer}>
      {roles.map((role, index) => (
        <View key={index} style={[styles.roleCard, { borderLeftColor: role.color }]}>
          <View style={styles.roleHeader}>
            <Text style={styles.roleIcon}>{role.icon}</Text>
            <Text style={[styles.roleName, { color: role.color }]}>{role.rol}</Text>
          </View>
          <View style={styles.roleTaken}>
            {role.taken.map((taak, i) => (
              <View key={i} style={styles.taakItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.taakText}>{taak}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

// Management Products Diagram
export function ManagementProductenDiagram() {
  return (
    <View style={styles.diagramContainer}>
      {/* Baselines */}
      <View style={styles.productSection}>
        <View style={[styles.productHeader, { backgroundColor: '#7c3aed' }]}>
          <Text style={styles.productHeaderText}>BASELINE PRODUCTEN</Text>
          <Text style={styles.productHeaderSub}>Onder wijzigingsbeheer</Text>
        </View>
        <View style={styles.productGrid}>
          <ProductCard name="Business Case" process="SU → IP" icon="💼" />
          <ProductCard name="Projectplan" process="IP" icon="📅" />
          <ProductCard name="Faseplan" process="IP + SB" icon="📆" />
          <ProductCard name="Afwijkingsplan" process="CS/SB" icon="⚡" />
          <ProductCard name="Productbeschrijving" process="Per product" icon="📝" />
        </View>
      </View>

      {/* Registers */}
      <View style={styles.productSection}>
        <View style={[styles.productHeader, { backgroundColor: '#3b82f6' }]}>
          <Text style={styles.productHeaderText}>REGISTERS</Text>
          <Text style={styles.productHeaderSub}>Doorlopend bijgehouden</Text>
        </View>
        <View style={styles.productGrid}>
          <ProductCard name="Risicoregister" detail="Alle risico's" icon="⚠️" />
          <ProductCard name="Issueregister" detail="Alle issues" icon="🔄" />
          <ProductCard name="Kwaliteitsregister" detail="Kwaliteitschecks" icon="✅" />
          <ProductCard name="Config-itemrecord" detail="Versies" icon="📁" />
        </View>
      </View>

      {/* Reports */}
      <View style={styles.productSection}>
        <View style={[styles.productHeader, { backgroundColor: '#10b981' }]}>
          <Text style={styles.productHeaderText}>RAPPORTEN</Text>
          <Text style={styles.productHeaderSub}>Communicatie</Text>
        </View>
        <View style={styles.reportTable}>
          <View style={styles.reportRow}>
            <Text style={styles.reportName}>Checkpoint</Text>
            <Text style={styles.reportFlow}>TM → PM</Text>
            <Text style={styles.reportWhen}>Periodiek</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={styles.reportName}>Hoofdpunten</Text>
            <Text style={styles.reportFlow}>PM → SG</Text>
            <Text style={styles.reportWhen}>Periodiek</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={styles.reportName}>Afwijking</Text>
            <Text style={styles.reportFlow}>PM → SG</Text>
            <Text style={styles.reportWhen}>Bij issue</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={styles.reportName}>Fase-eind</Text>
            <Text style={styles.reportFlow}>PM → SG</Text>
            <Text style={styles.reportWhen}>Einde fase</Text>
          </View>
          <View style={[styles.reportRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.reportName}>Project-eind</Text>
            <Text style={styles.reportFlow}>PM → SG</Text>
            <Text style={styles.reportWhen}>Einde project</Text>
          </View>
        </View>
        {/* Report abbreviations legend */}
        <View style={styles.abbrevLegend}>
          <Text style={styles.abbrevTitle}>Afkortingen:</Text>
          <View style={styles.abbrevRow}>
            <Text style={styles.abbrevItem}>TM = Teammanager</Text>
            <Text style={styles.abbrevItem}>PM = Projectmanager</Text>
            <Text style={styles.abbrevItem}>SG = Stuurgroep</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function ProductCard({ name, process, detail, icon }: { name: string; process?: string; detail?: string; icon: string }) {
  return (
    <View style={styles.productCard}>
      <Text style={styles.productIcon}>{icon}</Text>
      <Text style={styles.productName}>{name}</Text>
      <Text style={styles.productDetail}>{process || detail}</Text>
    </View>
  );
}

// Risk Responses Diagram
export function RisicoreactiesDiagram() {
  return (
    <View style={styles.diagramContainer}>
      {/* Threats */}
      <View style={styles.riskSection}>
        <View style={[styles.riskHeader, { backgroundColor: '#ef4444' }]}>
          <Text style={styles.riskHeaderIcon}>⚠️</Text>
          <Text style={styles.riskHeaderText}>BEDREIGINGEN (Negatief)</Text>
        </View>
        <View style={styles.riskGrid}>
          <RiskCard
            name="VERMIJDEN"
            desc="Elimineer de bedreiging"
            color="#ef4444"
          />
          <RiskCard
            name="VERMINDEREN"
            desc="Verklein kans of impact"
            color="#f97316"
          />
          <RiskCard
            name="OVERDRAGEN"
            desc="Geef aan derde partij"
            color="#eab308"
          />
          <RiskCard
            name="DELEN"
            desc="Verdeel met partner"
            color="#84cc16"
          />
          <RiskCard
            name="ACCEPTEREN"
            desc="Doe niets, neem risico"
            color="#6b7280"
          />
          <RiskCard
            name="VOORBEREIDEN"
            desc="Plan B (contingency)"
            color="#8b5cf6"
          />
        </View>
      </View>

      {/* Opportunities */}
      <View style={styles.riskSection}>
        <View style={[styles.riskHeader, { backgroundColor: '#10b981' }]}>
          <Text style={styles.riskHeaderIcon}>✨</Text>
          <Text style={styles.riskHeaderText}>KANSEN (Positief)</Text>
        </View>
        <View style={styles.riskGrid}>
          <RiskCard
            name="EXPLOITEREN"
            desc="Benut kans volledig"
            color="#10b981"
          />
          <RiskCard
            name="VERGROTEN"
            desc="Vergroot kans"
            color="#14b8a6"
          />
          <RiskCard
            name="DELEN"
            desc="Deel met partner"
            color="#06b6d4"
          />
          <RiskCard
            name="AFWIJZEN"
            desc="Doe niets met kans"
            color="#6b7280"
          />
        </View>
      </View>
    </View>
  );
}

function RiskCard({ name, desc, color }: { name: string; desc: string; color: string }) {
  return (
    <View style={[styles.riskCard, { borderLeftColor: color }]}>
      <Text style={[styles.riskName, { color }]}>{name}</Text>
      <Text style={styles.riskDesc}>{desc}</Text>
    </View>
  );
}

// Process Flow per Phase Diagram
export function ProcesStroomDiagram() {
  return (
    <View style={styles.diagramContainer}>
      {/* Pre-project */}
      <PhaseBlock
        phase="PRE-PROJECT"
        color="#3b82f6"
        steps={[
          { input: 'Projectmandaat', process: 'SU Opstarten', output: 'Projectvoorstel' }
        ]}
      />

      {/* Initiation */}
      <PhaseBlock
        phase="INITIATIEFASE"
        color="#7c3aed"
        steps={[
          { input: 'Projectvoorstel', process: 'IP Initiatie', output: 'PID' },
          { input: '', process: 'DP Autoriseren', output: 'Project start' }
        ]}
      />

      {/* Delivery */}
      <PhaseBlock
        phase="LEVERINGSFASE(S)"
        color="#10b981"
        steps={[
          { input: 'Werkpakketten', process: 'CS Beheersen', output: 'Voortgang' },
          { input: 'Werk', process: 'MP Oplevering', output: 'Producten' },
          { input: 'Einde fase', process: 'SB Faseovergang', output: 'Nieuw faseplan' }
        ]}
      />

      {/* Closing */}
      <PhaseBlock
        phase="LAATSTE FASE"
        color="#ef4444"
        steps={[
          { input: 'Alles afgerond', process: 'CP Afsluiten', output: 'Eindrapport' },
          { input: '', process: 'DP Autoriseren', output: 'Project gesloten' }
        ]}
      />
    </View>
  );
}

function PhaseBlock({ phase, color, steps }: { phase: string; color: string; steps: { input: string; process: string; output: string }[] }) {
  return (
    <View style={styles.phaseBlock}>
      <View style={[styles.phaseHeader, { backgroundColor: color }]}>
        <Text style={styles.phaseTitle}>{phase}</Text>
      </View>
      <View style={styles.phaseContent}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepRow}>
            {step.input ? (
              <View style={styles.stepInput}>
                <Text style={styles.stepText}>{step.input}</Text>
              </View>
            ) : <View style={styles.stepSpacer} />}
            <Text style={styles.stepArrow}>→</Text>
            <View style={[styles.stepProcess, { backgroundColor: color + '20' }]}>
              <Text style={[styles.stepProcessText, { color }]}>{step.process}</Text>
            </View>
            <Text style={styles.stepArrow}>→</Text>
            <View style={styles.stepOutput}>
              <Text style={styles.stepText}>{step.output}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  diagramContainer: {
    padding: 8,
  },

  // Process Model styles
  dpBar: {
    backgroundColor: '#7c3aed',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  dpBarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dpBarSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  processFlow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  processColumn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  processBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  processBoxBlue: { backgroundColor: '#3b82f6' },
  processBoxPurple: { backgroundColor: '#7c3aed' },
  processBoxGreen: { backgroundColor: '#10b981' },
  processBoxOrange: { backgroundColor: '#f59e0b' },
  processBoxYellow: { backgroundColor: '#eab308' },
  processBoxRed: { backgroundColor: '#ef4444' },
  processCode: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  processName: {
    color: 'white',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  arrowRight: {
    width: 20,
    height: 3,
    backgroundColor: '#d1d5db',
    marginHorizontal: 4,
  },
  arrowDown: {
    width: 3,
    height: 20,
    backgroundColor: '#d1d5db',
    position: 'absolute',
    bottom: -25,
    left: '50%',
  },
  secondRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
  },
  legend: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  legendGrid: {
    gap: 8,
  },
  legendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  legendTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  legendCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  legendFull: {
    fontSize: 11,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  legendDutch: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },

  // Organization styles
  orgBox: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  orgBoxGray: { backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb' },
  orgBoxPurple: { backgroundColor: '#ede9fe' },
  orgBoxBlue: { backgroundColor: '#dbeafe' },
  orgBoxGreen: { backgroundColor: '#dcfce7' },
  orgTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  orgSubtext: {
    fontSize: 12,
    color: '#6b7280',
  },
  verticalLine: {
    width: 2,
    height: 24,
    backgroundColor: '#d1d5db',
    alignSelf: 'center',
  },
  boardMembers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
  },
  boardMember: {
    alignItems: 'center',
    flex: 1,
  },
  boardMemberIcon: {
    fontSize: 24,
  },
  boardMemberTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    marginTop: 4,
    textAlign: 'center',
  },
  boardMemberRole: {
    fontSize: 10,
    color: '#6b7280',
  },
  assuranceTag: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(124,58,237,0.2)',
    borderRadius: 12,
  },
  assuranceText: {
    fontSize: 11,
    color: '#7c3aed',
  },

  // Role Matrix styles
  roleCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  roleIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  roleName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  roleTaken: {
    paddingLeft: 4,
  },
  taakItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bullet: {
    color: '#9ca3af',
    marginRight: 8,
  },
  taakText: {
    fontSize: 13,
    color: '#4b5563',
    flex: 1,
  },

  // Product styles
  productSection: {
    marginBottom: 20,
  },
  productHeader: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  productHeaderText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productHeaderSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  productCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    alignItems: 'center',
  },
  productIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  productDetail: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
  reportTable: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  reportRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  reportName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  reportFlow: {
    width: 70,
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  reportWhen: {
    width: 70,
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'right',
  },
  abbrevLegend: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  abbrevTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 6,
  },
  abbrevRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  abbrevItem: {
    fontSize: 11,
    color: '#15803d',
  },

  // Risk styles
  riskSection: {
    marginBottom: 20,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  riskHeaderIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  riskHeaderText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  riskGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  riskCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  riskName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  riskDesc: {
    fontSize: 11,
    color: '#6b7280',
  },

  // Phase Flow styles
  phaseBlock: {
    marginBottom: 16,
  },
  phaseHeader: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  phaseTitle: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  phaseContent: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  stepSpacer: {
    flex: 1,
  },
  stepArrow: {
    marginHorizontal: 6,
    color: '#9ca3af',
    fontSize: 14,
  },
  stepProcess: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  stepProcessText: {
    fontSize: 11,
    fontWeight: '600',
  },
  stepOutput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  stepText: {
    fontSize: 10,
    color: '#374151',
    textAlign: 'center',
  },
});
