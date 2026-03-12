import { Router } from 'express';
import { User, Document } from '../models/index.js';

const router = Router();

// Sample PDF URL that's publicly accessible (small placeholder)
const PDF_URL = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
const DOCX_URL = 'https://calibre-ebook.com/downloads/demos/demo.docx';

const SAMPLES = [
  // ── MN: Manufacturing Notices ──
  {
    title: 'Line Shutdown Notice - Battery Module Line 4',
    description: 'Planned shutdown for equipment upgrade and recalibration on Line 4.',
    documentType: 'MN',
    category: 'Powertrain',
    tags: ['battery', 'shutdown', 'maintenance', 'line-4'],
    version: '1.0.0',
    fileUrl: PDF_URL,
    filePublicId: 'seed_mn_001',
    fileType: 'application/pdf',
    fileSize: 13264,
    textContent: `MANUFACTURING NOTICE - MN-2024-0047\nLINE SHUTDOWN: BATTERY MODULE ASSEMBLY LINE 4\n\nEFFECTIVE DATE: March 15, 2024\nPRIORITY: HIGH\nAFFECTED LINES: Line 4, Line 4A (Sub-assembly)\nDURATION: 72 hours (estimated)\n\n1. NOTICE SUMMARY\nBattery Module Assembly Line 4 will undergo a planned shutdown for equipment upgrade and recalibration.\n\n2. REASON FOR SHUTDOWN\n- Installation of new automated cell insertion robot (Model: ABB IRB 6700)\n- Upgrade of conveyor control system firmware to v4.2.1\n- Replacement of worn alignment fixtures (stations 7, 12, 15)\n- Calibration of torque stations to updated specifications\n\n3. IMPACT ASSESSMENT\n3.1 Production Impact\n- Estimated lost output: 450 battery modules\n- Affected vehicle programs: Model S, Model X\n- Buffer stock available: 380 modules (approximately 2.5 days)\n\n4. MITIGATION PLAN\n- Pre-build 200 additional modules on Lines 2 and 6 prior to shutdown\n- Expedite supplier deliveries for buffer replenishment\n- Cross-train Line 4 operators on Lines 2 and 6 procedures\n\nAPPROVED BY: Manufacturing Engineering Director`
  },
  {
    title: 'Material Change Notice - Thermal Interface',
    description: 'Thermal interface material supplier change notification and process updates.',
    documentType: 'MN',
    category: 'Materials',
    tags: ['material-change', 'thermal', 'supplier'],
    version: '1.0.0',
    fileUrl: DOCX_URL,
    filePublicId: 'seed_mn_002',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 18432,
    textContent: `MANUFACTURING NOTICE - MN-2024-0052\nMATERIAL CHANGE: THERMAL INTERFACE COMPOUND\n\nEFFECTIVE DATE: April 1, 2024\nPRIORITY: MEDIUM\n\n1. CHANGE DESCRIPTION\nThermal interface material (TIM) for battery module cooling plates will transition from Supplier A (Henkel BERGQUIST TGP 3500) to Supplier B (Dow DOWSIL TC-4525).\n\n2. REASON FOR CHANGE\n- Supplier A price increase of 23% effective Q2 2024\n- Dow product offers equivalent thermal conductivity (3.5 W/mK)\n- Better availability and shorter lead times\n\n3. VALIDATION STATUS\n- Thermal cycling test: PASSED (500 cycles, -40C to +85C)\n- Adhesion test: PASSED (>15 psi pull strength)\n- Production trial (50 units): PASSED\n\n4. ACTION REQUIRED\n- Update BOM for affected part numbers\n- Retrain operators on new application procedure\n- Update incoming inspection criteria\n\nAPPROVED BY: Materials Engineering Manager`
  },
  {
    title: 'Shift Schedule Change - Stamping Plant',
    description: 'Updated shift rotation schedule for stamping plant effective April 2024.',
    documentType: 'MN',
    category: 'Operations',
    tags: ['shift-change', 'stamping', 'schedule'],
    version: '1.0.0',
    fileUrl: PDF_URL,
    filePublicId: 'seed_mn_003',
    fileType: 'application/pdf',
    fileSize: 11200,
    textContent: `MANUFACTURING NOTICE - MN-2024-0071\nSHIFT SCHEDULE CHANGE: STAMPING PLANT\n\nEFFECTIVE: April 8, 2024\nPRIORITY: MEDIUM\nAFFECTED DEPARTMENTS: Stamping, Die Maintenance, Material Handling\n\n1. SCHEDULE CHANGE\nStamping Plant transitions from 2-shift (12hr) to 3-shift (8hr) rotation.\n\nShift A: 06:00 - 14:00\nShift B: 14:00 - 22:00\nShift C: 22:00 - 06:00\n\n2. REASON\n- Reduce overtime costs by 30%\n- Improve employee work-life balance\n- Better maintenance windows between shifts\n\n3. STAFFING\n- 45 additional operators to be hired\n- All current staff retain positions with shift preference survey\n\nAPPROVED BY: Plant Operations Director`
  },
  {
    title: 'New Equipment Installation - CNC Mill Bay 7',
    description: 'Notice for new 5-axis CNC milling center installation in Bay 7.',
    documentType: 'MN',
    category: 'Equipment',
    tags: ['equipment', 'cnc', 'installation', 'bay-7'],
    version: '1.0.0',
    fileUrl: DOCX_URL,
    filePublicId: 'seed_mn_004',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 22016,
    textContent: `MANUFACTURING NOTICE - MN-2024-0085\nNEW EQUIPMENT: 5-AXIS CNC MILLING CENTER - BAY 7\n\nEFFECTIVE: April 15, 2024\nPRIORITY: HIGH\n\n1. EQUIPMENT DETAILS\nMachine: DMG MORI DMU 80 eVo 5-axis\nLocation: Machining Bay 7, Position 7C\nCapacity: Titanium/Aluminum structural components\n\n2. INSTALLATION TIMELINE\nWeek 1: Foundation and utility prep\nWeek 2: Machine delivery and positioning\nWeek 3: Electrical/pneumatic hookup\nWeek 4: Commissioning and validation\n\n3. BAY 7 ACCESS RESTRICTIONS\n- Restricted access during installation\n- Hard hat and safety glasses required\n- Crane operations scheduled daily 06:00-10:00\n\nAPPROVED BY: Manufacturing Engineering Director`
  },
  {
    title: 'Production Ramp-Up Plan - Cybertruck Line',
    description: 'Phase 2 ramp-up timeline and milestones for Cybertruck production.',
    documentType: 'MN',
    category: 'Production Planning',
    tags: ['ramp-up', 'cybertruck', 'capacity', 'milestones'],
    version: '2.0.0',
    fileUrl: PDF_URL,
    filePublicId: 'seed_mn_005',
    fileType: 'application/pdf',
    fileSize: 25600,
    textContent: `MANUFACTURING NOTICE - MN-2024-0092\nPRODUCTION RAMP-UP: CYBERTRUCK LINE - PHASE 2\n\nEFFECTIVE: May 1, 2024\nPRIORITY: CRITICAL\n\n1. RAMP-UP TARGETS\nCurrent rate: 1,250 units/week\nPhase 2 target: 2,500 units/week\nTarget date: July 31, 2024\n\n2. KEY MILESTONES\n- May 1: Second shift startup on Body-in-White\n- May 15: Paint booth capacity expansion online\n- June 1: GA Line 2 commissioning\n- June 15: Full 2-line operation\n- July 1: Rate verification runs\n- July 31: Sustained 2,500/week\n\n3. RESOURCE REQUIREMENTS\n- 800 additional production operators\n- 120 additional maintenance technicians\n- Capital equipment: $45M approved\n\nAPPROVED BY: VP Manufacturing`
  },

  // ── MI: Manufacturing Instructions ──
  {
    title: 'Battery Pack Final Assembly Procedure',
    description: 'Step-by-step instructions for Model 3/Y battery pack final assembly.',
    documentType: 'MI',
    category: 'Powertrain',
    tags: ['battery', 'assembly', 'torque', 'procedure'],
    version: '3.2.0',
    fileUrl: DOCX_URL,
    filePublicId: 'seed_mi_001',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 34816,
    textContent: `MANUFACTURING INSTRUCTIONS - MI-BP-0234\nBATTERY PACK FINAL ASSEMBLY\n\nModel: 3/Y Long Range\nRevision: 3.2\nStation: BP-FA-01 through BP-FA-08\n\n1. SCOPE\nThis instruction covers the final assembly of the 82 kWh battery pack.\n\n2. REQUIRED TOOLS\n- Torque wrench 10-50 Nm (calibrated)\n- Insulated gloves (Class 0, 1000V rated)\n- Thermal paste applicator (pneumatic)\n- Connector crimping tool\n\n3. ASSEMBLY SEQUENCE\nStep 1: Place lower tray on fixture\nStep 2: Apply thermal interface material (TIM) - 0.5mm uniform thickness\nStep 3: Install module group A (front)\nStep 4: Torque module bolts to 25 Nm ± 2 Nm (star pattern)\nStep 5: Connect HV bus bars\nStep 6: Install module group B (rear)\nStep 7: Complete HV connections\nStep 8: Install BMS harness\nStep 9: Seal and leak test\nStep 10: Final electrical verification\n\n4. CRITICAL CHECKS\n- All torque values logged electronically\n- HV isolation test: >500 MOhm\n- Coolant leak test: 2 bar, 60 seconds, 0 drop\n\nAPPROVED BY: Battery Engineering Manager`
  },
  {
    title: 'Front Fascia Installation Instructions',
    description: 'General assembly instructions for front fascia installation at Station 14.',
    documentType: 'MI',
    category: 'Body',
    tags: ['general-assembly', 'fascia', 'installation'],
    version: '2.0.1',
    fileUrl: PDF_URL,
    filePublicId: 'seed_mi_002',
    fileType: 'application/pdf',
    fileSize: 28672,
    textContent: `MANUFACTURING INSTRUCTIONS - MI-GA-0089\nFRONT FASCIA INSTALLATION\n\nStation: GA-14\nModel: All (S/3/X/Y)\nCycle Time: 90 seconds\n\n1. PRE-INSTALLATION\n- Verify fascia part number matches build sheet\n- Inspect for shipping damage (scratches, cracks)\n- Confirm all mounting clips are present (12 total)\n\n2. INSTALLATION PROCEDURE\nStep 1: Position fascia on alignment pins (2 upper)\nStep 2: Engage center clips (push until click - 3 clips)\nStep 3: Engage side clips (push until click - 4 clips per side)\nStep 4: Install 4x M6 bolts, lower mounting (8 Nm)\nStep 5: Verify all gaps using go/no-go gauge\n\n3. QUALITY CHECKS\n- Gap spec: 3.5mm ± 0.5mm (both sides)\n- Flush spec: 0mm ± 1.0mm\n- All clips fully seated\n- No visible damage or marks\n\nAPPROVED BY: General Assembly Engineering`
  },
  {
    title: 'Drive Unit Assembly Procedure',
    description: 'Complete assembly procedure for front and rear drive unit installation.',
    documentType: 'MI',
    category: 'Powertrain',
    tags: ['drive-unit', 'assembly', 'motor', 'procedure'],
    version: '1.4.0',
    fileUrl: DOCX_URL,
    filePublicId: 'seed_mi_003',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 31744,
    textContent: `MANUFACTURING INSTRUCTIONS - MI-DU-0145\nDRIVE UNIT ASSEMBLY - FRONT & REAR\n\nStation: DU-ASM-01 through DU-ASM-06\nRevision: 1.4\n\n1. SCOPE\nAssembly of permanent magnet synchronous motor with integrated inverter and reduction gear.\n\n2. ASSEMBLY SEQUENCE\nStep 1: Rotor insertion into stator housing (press fit, 2.5 ton)\nStep 2: Install front bearing (preload: 150N ± 20N)\nStep 3: Install rear bearing and seal\nStep 4: Bolt reduction gear housing (45 Nm, cross pattern)\nStep 5: Install differential assembly\nStep 6: Fill gear oil (0.8L Dexron ATF)\nStep 7: Install inverter module\nStep 8: Connect 3-phase bus bars (35 Nm)\nStep 9: Install resolver and wiring\nStep 10: End-of-line test\n\n3. CRITICAL PARAMETERS\n- Rotor air gap: 0.7mm ± 0.05mm\n- Gear backlash: 0.08-0.15mm\n- Oil fill: 0.8L ± 0.02L\n\nAPPROVED BY: Powertrain Engineering`
  },
  {
    title: 'Paint Booth Operation Manual',
    description: 'Standard operating procedure for automated paint booth Lines 1-3.',
    documentType: 'MI',
    category: 'Paint',
    tags: ['paint', 'booth', 'operation', 'automation'],
    version: '3.0.0',
    fileUrl: PDF_URL,
    filePublicId: 'seed_mi_004',
    fileType: 'application/pdf',
    fileSize: 42880,
    textContent: `MANUFACTURING INSTRUCTIONS - MI-PT-0067\nPAINT BOOTH OPERATION - LINES 1-3\n\nRevision: 3.0\nArea: Paint Shop\n\n1. STARTUP PROCEDURE\nStep 1: Verify air handling unit status (temp: 23°C ± 1°C, humidity: 65% ± 5%)\nStep 2: Start paint circulation system (15 min warmup)\nStep 3: Run bell cup test spray (verify fan pattern)\nStep 4: Confirm robot programs loaded for current color\nStep 5: Run first article inspection\n\n2. OPERATING PARAMETERS\n- Booth air velocity: 0.3 m/s ± 0.05 m/s (downdraft)\n- Paint temperature: 22°C ± 2°C\n- Atomizer speed: 40,000-60,000 RPM\n- Film build target: 15-20 microns (basecoat), 40-50 microns (clearcoat)\n\n3. COLOR CHANGE PROCEDURE\n- Purge time: 90 seconds minimum\n- Verify color with spectrophotometer (Delta E < 0.5)\n- First 3 bodies require additional inspection\n\nAPPROVED BY: Paint Engineering Manager`
  },
  {
    title: 'Wiring Harness Installation Guide',
    description: 'Step-by-step instructions for main body wiring harness routing and connection.',
    documentType: 'MI',
    category: 'Electrical',
    tags: ['wiring', 'harness', 'installation', 'routing'],
    version: '2.1.0',
    fileUrl: DOCX_URL,
    filePublicId: 'seed_mi_005',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 26624,
    textContent: `MANUFACTURING INSTRUCTIONS - MI-EL-0198\nMAIN BODY WIRING HARNESS INSTALLATION\n\nStation: GA-06, GA-07\nModel: Model Y\nRevision: 2.1\n\n1. HARNESS ROUTING\nStep 1: Feed main trunk through A-pillar grommet\nStep 2: Route dashboard branch along firewall\nStep 3: Secure with clips every 150mm (push-pin type)\nStep 4: Route door branches through B-pillar\nStep 5: Connect ground points (4x M6, 8 Nm)\n\n2. CONNECTOR MATING\n- All connectors: Push until audible click\n- Verify CPA (Connector Position Assurance) locks engaged\n- No forced mating - if resistance felt, check alignment\n\n3. CRITICAL ROUTING RULES\n- Minimum bend radius: 25mm\n- No contact with sharp edges\n- Maintain 50mm clearance from exhaust/heat sources\n- All clips must be fully seated\n\n4. VERIFICATION\n- Electrical continuity test (automated, Station GA-08)\n- Visual routing inspection\n- Connector TPA/CPA check\n\nAPPROVED BY: Electrical Engineering`
  },

  // ── QI: Quality Instructions ──
  {
    title: 'Battery Cell Incoming Inspection',
    description: 'Incoming inspection requirements for 2170 and 4680 battery cells.',
    documentType: 'QI',
    category: 'Incoming Quality',
    tags: ['inspection', 'battery-cell', 'incoming', 'AQL'],
    version: '4.1.0',
    fileUrl: PDF_URL,
    filePublicId: 'seed_qi_001',
    fileType: 'application/pdf',
    fileSize: 19456,
    textContent: `QUALITY INSTRUCTIONS - QI-IQ-0112\nINCOMING INSPECTION: BATTERY CELLS (2170/4680)\n\nRevision: 4.1\nFrequency: Every incoming lot\nAQL: 0.065 (Level II, Normal)\n\n1. SAMPLE SIZE\nLot size 1,001-3,000: Sample 125 cells\nLot size 3,001-10,000: Sample 200 cells\nLot size >10,000: Sample 315 cells\n\n2. DIMENSIONAL CHECKS\n2170 cells:\n- Diameter: 21.0mm ± 0.15mm\n- Height: 70.0mm ± 0.20mm\n- Weight: 69g ± 1.5g\n\n4680 cells:\n- Diameter: 46.0mm ± 0.20mm\n- Height: 80.0mm ± 0.25mm\n\n3. ELECTRICAL TESTS\n- Open circuit voltage: 3.6V-4.2V\n- Internal resistance: <15 mOhm (2170), <2 mOhm (4680)\n- Capacity: Within 2% of nominal\n\n4. VISUAL INSPECTION\nReject: dents, rust, leaking, swelling, label damage\n\nAPPROVED BY: Quality Director`
  },
  {
    title: 'Weld Quality Verification Procedure',
    description: 'In-process inspection criteria for ultrasonic and laser welds.',
    documentType: 'QI',
    category: 'Welding',
    tags: ['welding', 'inspection', 'ultrasonic', 'laser'],
    version: '2.3.0',
    fileUrl: DOCX_URL,
    filePublicId: 'seed_qi_002',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 23552,
    textContent: `QUALITY INSTRUCTIONS - QI-WQ-0078\nWELD QUALITY VERIFICATION\n\nRevision: 2.3\nScope: All ultrasonic and laser welds\n\n1. ULTRASONIC WELD INSPECTION\nFrequency: Every 50th unit + start of shift\n\nAccept criteria:\n- Pull strength: >8N per wire (destructive, sample)\n- Weld nugget area: >80% of contact area\n- No cracks or voids visible at 10x magnification\n\nReject criteria:\n- Incomplete fusion\n- Cold weld (dull/grainy surface)\n- Wire damage beyond weld zone\n\n2. LASER WELD INSPECTION\nAccept:\n- Continuous bead, uniform width (±0.2mm)\n- No spatter beyond 2mm from weld\n- Consistent penetration depth\n\nReject:\n- Porosity visible on surface\n- Any crack in weld or HAZ\n- Incomplete penetration (<80%)\n\n3. CORRECTIVE ACTIONS\n1. Stop production at affected station\n2. Quarantine last 50 units\n3. Notify process engineer\n4. Root cause analysis\n5. Verify with 10 consecutive good units\n\nAPPROVED BY: Quality Director`
  },
  {
    title: 'Paint Quality Inspection Standards',
    description: 'Color match, orange peel, and defect classification for all paint operations.',
    documentType: 'QI',
    category: 'Paint',
    tags: ['paint', 'inspection', 'color-match', 'defect'],
    version: '5.0.0',
    fileUrl: PDF_URL,
    filePublicId: 'seed_qi_003',
    fileType: 'application/pdf',
    fileSize: 38912,
    textContent: `QUALITY INSTRUCTIONS - QI-PT-0234\nPAINT QUALITY INSPECTION STANDARDS\n\nRevision: 5.0\nScope: All exterior painted surfaces\n\n1. COLOR VERIFICATION\n- Spectrophotometer reading: Delta E < 0.5 vs master panel\n- Gloss reading: 85-95 GU at 20 degrees\n- Orange peel: Rating 7 or better (BYK-Gardner scale)\n\n2. DEFECT CLASSIFICATION\nClass A (Customer visible):\n- Zero defects allowed on hood, roof, doors, fenders\n- Maximum 1 inclusion <0.3mm (repairable)\n\nClass B (Less visible):\n- Maximum 2 defects per panel\n- Runs/sags: Not acceptable\n\n3. INSPECTION LIGHTING\n- 2000 lux minimum\n- Multiple angles (0, 30, 60, 90 degrees)\n- Use highlight roller for metallic colors\n\n4. FILM BUILD VERIFICATION\n- E-coat: 18-25 microns\n- Primer: 30-40 microns\n- Basecoat: 15-20 microns\n- Clearcoat: 40-50 microns\n- Total: 103-135 microns\n\nAPPROVED BY: Paint Quality Manager`
  },
  {
    title: 'Final Vehicle Audit Checklist',
    description: 'Comprehensive end-of-line audit checklist for all vehicle programs.',
    documentType: 'QI',
    category: 'Final Quality',
    tags: ['audit', 'final-inspection', 'checklist', 'vehicle'],
    version: '3.1.0',
    fileUrl: DOCX_URL,
    filePublicId: 'seed_qi_004',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 45056,
    textContent: `QUALITY INSTRUCTIONS - QI-FA-0089\nFINAL VEHICLE AUDIT CHECKLIST\n\nRevision: 3.1\nScope: All vehicle programs\nFrequency: 5 vehicles per shift per line\n\n1. EXTERIOR AUDIT (120 points)\n- Panel gaps: All within spec (±0.5mm)\n- Paint quality: No defects Class A surfaces\n- Trim alignment: Flush ±1mm\n- Glass bonding: No voids, proper bead\n- Lighting function: All operational\n- Wheel torque: Verified (175 Nm)\n\n2. INTERIOR AUDIT (100 points)\n- Seat operation: Power adjust, heating, memory\n- Dashboard: No rattles, proper fit\n- Infotainment: Boot test, touch response\n- Climate: Heating/cooling function\n- Sunroof: Open/close, no noise\n\n3. DYNAMIC AUDIT (80 points)\n- Brake test: ABS function, pedal feel\n- Steering: No pull, proper assist\n- Suspension: No noise over bumps\n- Acceleration: 0-60 within spec\n- Charging: AC and DC verified\n\n4. SCORING\n- Target: >285 out of 300\n- Release: >270\n- Hold: <270 (requires Quality Director approval)\n\nAPPROVED BY: Quality Engineering Director`
  },
  {
    title: 'Supplier Part Validation (PPAP) Procedure',
    description: 'PPAP submission requirements and validation criteria for new supplier parts.',
    documentType: 'QI',
    category: 'Supplier Quality',
    tags: ['ppap', 'supplier', 'validation', 'incoming'],
    version: '2.0.0',
    fileUrl: PDF_URL,
    filePublicId: 'seed_qi_005',
    fileType: 'application/pdf',
    fileSize: 29696,
    textContent: `QUALITY INSTRUCTIONS - QI-SQ-0156\nSUPPLIER PART VALIDATION (PPAP)\n\nRevision: 2.0\nScope: All new production parts from external suppliers\n\n1. PPAP LEVEL REQUIREMENTS\nLevel 1: Warrant only\nLevel 2: Warrant + limited samples\nLevel 3: Warrant + full documentation (DEFAULT)\nLevel 4: Warrant + additional requirements\nLevel 5: Full documentation + on-site review\n\n2. REQUIRED DOCUMENTS (Level 3)\n- Design records and engineering change docs\n- Process flow diagram\n- PFMEA\n- Control plan\n- MSA (Measurement System Analysis)\n- Dimensional results (minimum 30 pieces)\n- Material/performance test results\n- Initial process study (Cpk >1.67)\n- Part submission warrant (PSW)\n\n3. ACCEPTANCE CRITERIA\n- All dimensions within specification\n- Cpk > 1.33 (minimum), target > 1.67\n- Material certifications match specifications\n- Appearance approval (if applicable)\n\nAPPROVED BY: Supplier Quality Director`
  },

  // ── QAN: Quality Alert Notices ──
  {
    title: 'CRITICAL: Torque Specification Non-Conformance',
    description: 'Red alert for torque tool calibration drift on Line 2 bus bar connections.',
    documentType: 'QAN',
    category: 'Powertrain',
    tags: ['alert', 'torque', 'calibration', 'critical'],
    version: '1.0.0',
    fileUrl: PDF_URL,
    filePublicId: 'seed_qan_001',
    fileType: 'application/pdf',
    fileSize: 15360,
    textContent: `QUALITY ALERT NOTICE - QAN-2024-0019\nCRITICAL: TORQUE SPECIFICATION NON-CONFORMANCE\n\nALERT LEVEL: RED (Immediate Action Required)\nISSUED: March 8, 2024\n\n1. PROBLEM DESCRIPTION\nTorque tool #TQ-L2-007 on Battery Line 2 found to be under-torquing HV bus bar connections. Calibration check revealed 18% low reading.\n\n2. AFFECTED PRODUCTION\n- Date range: March 1-8, 2024\n- Estimated units: 340 battery packs\n- Serial range: BP-240301-001 through BP-240308-340\n\n3. IMMEDIATE ACTIONS\n- Tool quarantined and sent for recalibration\n- All 340 packs placed on HOLD\n- 100% re-torque verification in progress\n- Backup tool deployed (verified calibration)\n\n4. CONTAINMENT\n- No affected packs have shipped to customers\n- Vehicle assembly notified to hold affected VINs\n- Re-torque team deployed (target: 48hr completion)\n\nISSUED BY: Quality Engineering\nESCALATED TO: VP Quality`
  },
  {
    title: 'WARNING: Coolant Hose Material Deviation',
    description: 'Yellow alert for dimensional variation in incoming coolant hose lot.',
    documentType: 'QAN',
    category: 'Supplier Quality',
    tags: ['alert', 'supplier', 'coolant', 'deviation'],
    version: '1.0.0',
    fileUrl: DOCX_URL,
    filePublicId: 'seed_qan_002',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 12288,
    textContent: `QUALITY ALERT NOTICE - QAN-2024-0023\nWARNING: COOLANT HOSE MATERIAL DEVIATION\n\nALERT LEVEL: YELLOW\nISSUED: March 12, 2024\n\n1. PROBLEM DESCRIPTION\nIncoming lot of coolant hoses (P/N: TM3-COL-0042) from Supplier Continental shows inner diameter at upper tolerance limit.\n\n2. DETAILS\n- Specification: ID 19.0mm ± 0.5mm\n- Measured: 19.4-19.5mm (within spec but marginal)\n- Lot size: 5,000 pieces\n- Lot number: CON-240310-A\n\n3. RISK ASSESSMENT\n- Clamp sealing may be marginal\n- Higher leak risk under thermal cycling\n- No immediate safety concern\n\n4. DISPOSITION\n- Lot accepted with deviation (use-as-is)\n- Increased leak test pressure: 3 bar (vs standard 2 bar)\n- Supplier corrective action requested (CAR-2024-0045)\n- Next 3 lots to receive tightened inspection\n\nISSUED BY: Supplier Quality Engineer`
  },
  {
    title: 'ALERT: Paint Defect Cluster - Line 2 Booth',
    description: 'Orange alert for elevated paint defect rate in Line 2 spray booth.',
    documentType: 'QAN',
    category: 'Paint',
    tags: ['alert', 'paint', 'defect', 'cluster'],
    version: '1.0.0',
    fileUrl: PDF_URL,
    filePublicId: 'seed_qan_003',
    fileType: 'application/pdf',
    fileSize: 14336,
    textContent: `QUALITY ALERT NOTICE - QAN-2024-0031\nALERT: PAINT DEFECT CLUSTER - LINE 2 BOOTH\n\nALERT LEVEL: ORANGE\nISSUED: March 15, 2024\n\n1. PROBLEM\nLine 2 paint booth showing 3x normal defect rate for inclusions (dirt/fiber in clearcoat). 12 defects found in last 50 bodies vs normal rate of 2-3.\n\n2. ROOT CAUSE INVESTIGATION\n- Air filter differential pressure: Normal\n- Booth air velocity: 0.28 m/s (spec: 0.30 ± 0.05) - MARGINAL\n- Operator gown inspection: 2 operators with worn cuff seals\n- Paint supply filtration: Normal\n\n3. ACTIONS\n- Replace booth air filters (scheduled for tonight)\n- Replace 2 operator gowns immediately\n- Deep clean booth during maintenance window\n- Increased body inspection rate: 100% for next shift\n\nISSUED BY: Paint Quality Engineer`
  },
  {
    title: 'CRITICAL: Fastener Lot Recall - Supplier XM',
    description: 'Red alert for non-conforming fastener lot requiring immediate containment.',
    documentType: 'QAN',
    category: 'Supplier Quality',
    tags: ['alert', 'fastener', 'recall', 'critical', 'containment'],
    version: '1.0.0',
    fileUrl: DOCX_URL,
    filePublicId: 'seed_qan_004',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 16384,
    textContent: `QUALITY ALERT NOTICE - QAN-2024-0038\nCRITICAL: FASTENER LOT RECALL\n\nALERT LEVEL: RED (Immediate Action)\nISSUED: March 20, 2024\n\n1. PROBLEM\nSupplier XM Fasteners notified that lot XM-240312 of M8x1.25 flange bolts (P/N: FB-M8-GR10.9) may have incorrect heat treatment.\n\n2. RISK\n- Bolts may not meet Grade 10.9 tensile strength\n- Used in suspension mounting (safety-critical)\n- Potential failure under load\n\n3. AFFECTED SCOPE\n- Lot received: March 12, 2024\n- Quantity: 15,000 pieces\n- ~4,000 already consumed in production\n\n4. CONTAINMENT ACTIONS\n- STOP: All remaining stock quarantined\n- HOLD: ~200 vehicles in production with suspect bolts\n- TEST: Destructive testing of retained samples (results in 24hrs)\n- SORT: If test fails, 100% replacement on all affected vehicles\n\nISSUED BY: Supplier Quality Director\nESCALATED TO: VP Quality & VP Manufacturing`
  },
  {
    title: 'WARNING: Software Calibration Error - ABS Module',
    description: 'Yellow alert for incorrect calibration data in ABS control module batch.',
    documentType: 'QAN',
    category: 'Electronics',
    tags: ['alert', 'software', 'calibration', 'abs', 'module'],
    version: '1.0.0',
    fileUrl: PDF_URL,
    filePublicId: 'seed_qan_005',
    fileType: 'application/pdf',
    fileSize: 13312,
    textContent: `QUALITY ALERT NOTICE - QAN-2024-0042\nWARNING: SOFTWARE CALIBRATION ERROR - ABS MODULE\n\nALERT LEVEL: YELLOW\nISSUED: March 25, 2024\n\n1. PROBLEM\nBatch of ABS control modules (Continental MK-C1) flashed with incorrect calibration file. Rear brake bias 3% higher than specification.\n\n2. DETAILS\n- Correct cal file: TM3_ABS_v4.2.1\n- Installed cal file: TM3_ABS_v4.1.8 (previous version)\n- Affected: ~120 modules\n- Date range: March 22-24\n\n3. IMPACT\n- Slightly longer stopping distance in rear-heavy load condition\n- No immediate safety issue at normal loads\n- Does not meet engineering specification\n\n4. CORRECTIVE ACTION\n- Flash correct calibration at end-of-line (2 min per vehicle)\n- Supplier corrective action: Flash station validation added\n- Verify all vehicles in yard before shipping\n\nISSUED BY: Electronics Quality Engineer`
  },

  // ── VA: Visual Aides ──
  {
    title: 'Battery Module Connector ID Guide',
    description: 'Color-coded connector identification and routing reference for assembly.',
    documentType: 'VA',
    category: 'Electrical',
    tags: ['visual-aide', 'connector', 'routing', 'color-code'],
    version: '1.5.0',
    fileUrl: DOCX_URL,
    filePublicId: 'seed_va_001',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 21504,
    textContent: `VISUAL AIDE - VA-EL-0034\nBATTERY MODULE CONNECTOR IDENTIFICATION GUIDE\n\nVersion: 1.5\nPosted at: Stations BP-FA-03, BP-FA-04\n\nCONNECTOR COLOR CODE:\n\n🔴 RED - High Voltage (>60V DC)\n   - HV+ bus bar (orange cable, 35mm²)\n   - HV- bus bar (orange cable, 35mm²)\n   ⚠️ DANGER: De-energize before handling\n\n🔵 BLUE - Cell Monitoring\n   - Cell voltage sense (24-pin)\n   - Temperature sensors (8-pin)\n   - BMS communication (4-pin CAN)\n\n🟢 GREEN - Cooling System\n   - Coolant inlet (quick-connect, 19mm)\n   - Coolant outlet (quick-connect, 19mm)\n   - Temperature sensor (2-pin)\n\n🟡 YELLOW - Safety Circuits\n   - Pyro disconnect (2-pin, keyed)\n   - Interlock loop (4-pin)\n   - Crash sensor (2-pin)\n   ⚠️ Do not test with multimeter\n\n⚪ WHITE - Low Voltage\n   - 12V supply (2-pin)\n   - Ground (ring terminal, M6)\n\nIMPORTANT: Always mate connectors by color group. Never cross-connect between groups.\n\nAPPROVED BY: Electrical Engineering`
  },
  {
    title: 'PPE Requirements by Work Zone',
    description: 'Quick reference for PPE requirements in each factory work zone.',
    documentType: 'VA',
    category: 'Safety',
    tags: ['visual-aide', 'ppe', 'safety', 'zones'],
    version: '2.0.0',
    fileUrl: PDF_URL,
    filePublicId: 'seed_va_002',
    fileType: 'application/pdf',
    fileSize: 17408,
    textContent: `VISUAL AIDE - VA-SF-0012\nPPE REQUIREMENTS BY WORK ZONE\n\nVersion: 2.0\nPosted at: All zone entry points\n\n🟢 GREEN ZONE - General Assembly\n   Required: Safety glasses, steel-toe shoes\n   Optional: Hearing protection\n\n🟡 YELLOW ZONE - Welding/Paint\n   Required: Safety glasses, steel-toe shoes, hearing protection, fire-resistant clothing\n   Paint area: Respirator (supplied air in booth)\n\n🔴 RED ZONE - High Voltage / Battery\n   Required: Insulated gloves (Class 0), face shield, steel-toe shoes, arc flash suit (when energized)\n   Additional: Voltage detector, rescue hook nearby\n\n🔵 BLUE ZONE - Machining\n   Required: Safety glasses (side shields), steel-toe shoes, hearing protection\n   No loose clothing, jewelry, or long sleeves\n\n⚪ WHITE ZONE - Cleanroom (Battery Cell)\n   Required: Full bunny suit, shoe covers, hairnet, nitrile gloves\n   No personal items, phones require approved case\n\nALL ZONES: Hard hat required when overhead work in progress (indicated by flashing amber light)\n\nAPPROVED BY: EHS Director`
  },
  {
    title: 'Torque Sequence Diagram - Subframe Assembly',
    description: 'Visual guide for correct bolt torque sequence on front subframe.',
    documentType: 'VA',
    category: 'Body',
    tags: ['visual-aide', 'torque', 'sequence', 'subframe'],
    version: '1.2.0',
    fileUrl: DOCX_URL,
    filePublicId: 'seed_va_003',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 24576,
    textContent: `VISUAL AIDE - VA-TQ-0045\nTORQUE SEQUENCE: FRONT SUBFRAME ASSEMBLY\n\nVersion: 1.2\nStation: CH-03 (Chassis Line)\n\nSUBFRAME MOUNTING BOLTS (8 total)\nBolt spec: M14x1.5, Grade 10.9\nTorque: 120 Nm + 90° angle\n\nSEQUENCE (follow numbered order):\n\n    [FRONT OF VEHICLE]\n         ↓\n    ①─────────②\n    |  SUBFRAME  |\n    ③─────────④\n    |           |\n    ⑤─────────⑥\n    |  SUBFRAME  |\n    ⑦─────────⑧\n         ↓\n    [REAR OF VEHICLE]\n\nPASS 1: Hand-start all 8 bolts (snug only)\nPASS 2: Torque to 60 Nm in sequence ①→⑧\nPASS 3: Final torque 120 Nm in sequence ①→⑧\nPASS 4: Angle torque +90° in sequence ①→⑧\n\n⚠️ CRITICAL: Do NOT skip sequence steps.\nFull torque without pre-torque causes frame distortion.\n\nAPPROVED BY: Chassis Engineering`
  },
  {
    title: 'Fluid Fill Point Identification Chart',
    description: 'Location and color-coded identification of all fluid fill points on vehicle.',
    documentType: 'VA',
    category: 'General Assembly',
    tags: ['visual-aide', 'fluid-fill', 'identification', 'chart'],
    version: '1.0.0',
    fileUrl: PDF_URL,
    filePublicId: 'seed_va_004',
    fileType: 'application/pdf',
    fileSize: 20480,
    textContent: `VISUAL AIDE - VA-FL-0023\nFLUID FILL POINT IDENTIFICATION\n\nVersion: 1.0\nStation: FF-01 (Fluid Fill Station)\n\nFLUID FILL POINTS - MODEL Y:\n\n1. BATTERY COOLANT (BLUE cap)\n   Location: Front left, under hood\n   Fluid: G48 ethylene glycol 50/50\n   Volume: 8.5L ± 0.1L\n   Fill method: Vacuum fill\n\n2. FRONT DRIVE UNIT OIL (GREEN cap)\n   Location: Front axle, drain/fill plug\n   Fluid: Pentosin ATF 9\n   Volume: 0.8L ± 0.02L\n\n3. REAR DRIVE UNIT OIL (GREEN cap)\n   Location: Rear axle, drain/fill plug\n   Fluid: Pentosin ATF 9\n   Volume: 0.8L ± 0.02L\n\n4. BRAKE FLUID (YELLOW cap)\n   Location: Firewall, driver side\n   Fluid: DOT 4 (Ate Typ 200)\n   Fill to: MAX line on reservoir\n   Method: Vacuum bleed + fill\n\n5. WASHER FLUID (WHITE cap)\n   Location: Front right, under hood\n   Fluid: -30°C rated washer fluid\n   Volume: 4.5L (fill to neck)\n\nAPPROVED BY: General Assembly Engineering`
  },
  {
    title: 'Diagnostic Error Code Quick Reference',
    description: 'Visual quick-reference card for common DTC codes and resolution steps.',
    documentType: 'VA',
    category: 'Electronics',
    tags: ['visual-aide', 'diagnostic', 'dtc', 'error-codes'],
    version: '3.0.0',
    fileUrl: DOCX_URL,
    filePublicId: 'seed_va_005',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 27648,
    textContent: `VISUAL AIDE - VA-DG-0056\nDIAGNOSTIC ERROR CODES - QUICK REFERENCE\n\nVersion: 3.0\nPosted at: End-of-Line Test Stations\n\nCOMMON DTCs AND RESOLUTION:\n\n🔴 P0A00 - Motor Electronics Coolant Temp High\n   → Check coolant level, verify pump operation\n   → If persists: Replace temp sensor\n\n🔴 P0A1F - Battery Energy Control Module\n   → Reflash BMS firmware\n   → Check 12V supply voltage (>11.5V)\n\n🟡 U0100 - Lost Communication with ECM\n   → Check CAN bus connections\n   → Verify gateway module firmware version\n\n🟡 U0073 - Control Module Communication Bus Off\n   → Inspect CAN H/L for shorts\n   → Check termination resistors (60 ohm each end)\n\n🔵 B1A49 - Interior Humidity Sensor\n   → Replace sensor (5 min job)\n   → Clear code and verify\n\n🔵 C0035 - Left Front Wheel Speed Sensor\n   → Check sensor air gap (0.5-1.5mm)\n   → Inspect tone ring for damage\n   → Replace sensor if >2mm gap\n\nESCALATION: If DTC not listed or recurs after fix, escalate to Engineering via JIRA ticket.\n\nAPPROVED BY: Diagnostics Engineering`
  },

  // ── PCA: Process Change Approvals ──
  {
    title: 'Weld Parameter Optimization - Ultrasonic',
    description: 'Approved process change for ultrasonic welding parameter optimization.',
    documentType: 'PCA',
    category: 'Welding',
    tags: ['process-change', 'welding', 'optimization', 'approved'],
    version: '1.0.0',
    fileUrl: DOCX_URL,
    filePublicId: 'seed_pca_001',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 20480,
    textContent: `PROCESS CHANGE APPROVAL - PCA-2024-0015\nULTRASONIC WELDING PARAMETER OPTIMIZATION\n\nSTATUS: APPROVED\nEFFECTIVE: March 1, 2024\n\n1. CHANGE DESCRIPTION\nOptimize ultrasonic welding parameters for cell-to-busbar connections to improve weld consistency and reduce cycle time.\n\n2. CURRENT → NEW PARAMETERS\nAmplitude: 30μm → 28μm\nForce: 600N → 650N\nWeld time: 400ms → 350ms\nEnergy: 250J → 230J\n\n3. VALIDATION RESULTS\n- Pull strength: 12.5N avg (spec >8N) ✓\n- Cross-section analysis: Full nugget formation ✓\n- Cpk improvement: 1.45 → 1.82 ✓\n- Cycle time reduction: 50ms per weld ✓\n- 500-unit production trial: 0 defects ✓\n\n4. APPROVALS\nProcess Engineering: APPROVED\nQuality Engineering: APPROVED\nManufacturing: APPROVED\nPlant Manager: APPROVED\n\nCHANGE OWNER: Welding Process Engineering`
  },
  {
    title: 'Line Speed Increase - GA Line 1',
    description: 'Process change request to increase GA Line 1 from 52 to 58 JPH.',
    documentType: 'PCA',
    category: 'General Assembly',
    tags: ['process-change', 'line-speed', 'capacity', 'pending'],
    version: '1.0.0',
    fileUrl: PDF_URL,
    filePublicId: 'seed_pca_002',
    fileType: 'application/pdf',
    fileSize: 18432,
    textContent: `PROCESS CHANGE APPROVAL - PCA-2024-0018\nLINE SPEED INCREASE: GA LINE 1\n\nSTATUS: APPROVED WITH CONDITIONS\nEFFECTIVE: March 15, 2024\n\n1. CHANGE DESCRIPTION\nIncrease General Assembly Line 1 line speed from 52 JPH to 58 JPH (11.5% increase).\n\n2. JUSTIFICATION\n- Q2 demand increase requires additional 30 units/shift\n- Line balancing study shows capacity exists\n- No additional headcount needed\n\n3. RISK ASSESSMENT\nStation GA-14 (Fascia): Tight at 58 JPH - operator assist added\nStation GA-22 (Fluid Fill): OK with automated fill upgrade\nStation GA-31 (Final QC): Additional inspector for first 2 weeks\n\n4. CONDITIONS\n- 2-week trial period with daily quality review\n- Revert to 52 JPH if defect rate increases >10%\n- Station GA-14 automation upgrade by April 1\n\n5. APPROVALS\nProcess Engineering: APPROVED\nQuality: APPROVED (with conditions)\nManufacturing: APPROVED\nPlant Manager: APPROVED\n\nCHANGE OWNER: GA Process Engineering`
  },
  {
    title: 'New Structural Adhesive Introduction',
    description: 'Approval for new structural adhesive replacing spot welds on rear quarter panel.',
    documentType: 'PCA',
    category: 'Body',
    tags: ['process-change', 'adhesive', 'structural', 'approved'],
    version: '1.0.0',
    fileUrl: DOCX_URL,
    filePublicId: 'seed_pca_003',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 22528,
    textContent: `PROCESS CHANGE APPROVAL - PCA-2024-0022\nNEW STRUCTURAL ADHESIVE - REAR QUARTER PANEL\n\nSTATUS: APPROVED\nEFFECTIVE: April 1, 2024\n\n1. CHANGE\nReplace 8 spot welds with structural adhesive (Henkel Teroson EP 5065) on rear quarter panel-to-body joint.\n\n2. BENEFITS\n- Improved NVH (reduces road noise 2.5 dB)\n- Better corrosion protection at joint\n- More uniform stress distribution\n- 15% weight savings at joint\n\n3. VALIDATION\n- Peel strength: 45 N/mm (spec >25 N/mm) ✓\n- Shear strength: 28 MPa (spec >20 MPa) ✓\n- Fatigue test: 1M cycles, no failure ✓\n- Corrosion test: 6000hr salt spray, no degradation ✓\n- Crash test: Passed FMVSS 214, IIHS side impact ✓\n\n4. APPROVALS\nBody Engineering: APPROVED\nQuality: APPROVED\nSafety: APPROVED\nManufacturing: APPROVED\n\nCHANGE OWNER: Body Engineering`
  },
  {
    title: 'Automated Vision Inspection Deployment',
    description: 'Process change to add AI-powered vision inspection at end-of-line station.',
    documentType: 'PCA',
    category: 'Quality',
    tags: ['process-change', 'vision', 'inspection', 'automation'],
    version: '1.0.0',
    fileUrl: PDF_URL,
    filePublicId: 'seed_pca_004',
    fileType: 'application/pdf',
    fileSize: 25600,
    textContent: `PROCESS CHANGE APPROVAL - PCA-2024-0029\nAUTOMATED VISION INSPECTION - EOL STATION\n\nSTATUS: APPROVED\nEFFECTIVE: April 15, 2024\n\n1. CHANGE\nDeploy AI-powered vision inspection system (Cognex ViDi) at end-of-line to supplement human inspectors.\n\n2. SYSTEM SPECIFICATIONS\n- 12x 20MP cameras (4 per zone: left, right, top)\n- Processing: NVIDIA A100 GPU server\n- Inspection time: <3 seconds per vehicle\n- Defect detection: Paint, gaps, trim, badges, glass\n\n3. PERFORMANCE (Validation Data)\n- Detection rate: 98.7% (vs human 94.2%)\n- False positive rate: 1.2% (acceptable)\n- Cycle time impact: None (parallel inspection)\n\n4. IMPLEMENTATION\n- Phase 1: Shadow mode (2 weeks) - AI inspects, humans verify\n- Phase 2: AI flags, human confirms (2 weeks)\n- Phase 3: AI primary, human audit (5 per shift)\n\n5. APPROVALS\nQuality Engineering: APPROVED\nIT/Infrastructure: APPROVED\nManufacturing: APPROVED\n\nCHANGE OWNER: Quality Automation Engineering`
  },
  {
    title: 'Packaging Method Change - Battery Modules',
    description: 'Updated packaging and shipping method for battery modules to reduce damage.',
    documentType: 'PCA',
    category: 'Logistics',
    tags: ['process-change', 'packaging', 'battery', 'shipping'],
    version: '1.0.0',
    fileUrl: DOCX_URL,
    filePublicId: 'seed_pca_005',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 15360,
    textContent: `PROCESS CHANGE APPROVAL - PCA-2024-0035\nPACKAGING METHOD: BATTERY MODULES\n\nSTATUS: APPROVED\nEFFECTIVE: May 1, 2024\n\n1. CHANGE\nReplace current cardboard dunnage with reusable molded foam inserts for battery module shipping between Cell Plant and Pack Assembly.\n\n2. PROBLEM\n- Current: 2.1% shipping damage rate\n- Root cause: Cardboard deforms under repeated use\n- Cost of damage: ~$180K/month\n\n3. NEW PACKAGING\n- Custom molded EPP foam inserts (reusable 200+ cycles)\n- Returnable steel containers (replace disposable cardboard)\n- Shock indicators on each container\n- GPS tracking for container management\n\n4. EXPECTED RESULTS\n- Target damage rate: <0.1%\n- ROI: 8 months (foam inserts + containers)\n- Waste reduction: 15 tons cardboard/month eliminated\n\n5. APPROVALS\nLogistics: APPROVED\nQuality: APPROVED\nFinance: APPROVED\nSustainability: APPROVED\n\nCHANGE OWNER: Logistics and Packaging Engineering`
  }
];

// POST /api/seed - Admin-only endpoint to populate sample documents
router.post('/', async (req, res) => {
  try {
    // Find an admin user to assign as owner
    let user = await User.findOne({ where: { role: 'admin' } });
    if (!user) {
      return res.status(400).json({ message: 'No admin user found. Register an admin first.' });
    }

    let created = 0;
    let skipped = 0;

    for (const sample of SAMPLES) {
      const existing = await Document.findOne({ where: { title: sample.title } });
      if (existing) {
        skipped++;
        continue;
      }

      await Document.create({
        ...sample,
        createdBy: user.id
      });
      created++;
    }

    res.json({
      success: true,
      message: `Seeding complete: ${created} created, ${skipped} already existed`,
      total: SAMPLES.length,
      created,
      skipped
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: 'Seeding failed: ' + error.message });
  }
});

export default router;
