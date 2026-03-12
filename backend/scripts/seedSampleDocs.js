import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { sequelize, User, Document } from '../models/index.js';

dotenv.config();

const SAMPLE_USER = {
  firstName: 'Demo',
  middleName: 'Ops',
  lastName: 'Admin',
  suffix: '',
  email: 'demo.admin@tesla.com',
  password: 'DemoPass123!',
  role: 'admin'
};

// ── Text content for each document type ──────────────────────────────────

const MN_TEXT_1 = `MANUFACTURING NOTICE - MN-2024-0047
LINE SHUTDOWN: BATTERY MODULE ASSEMBLY LINE 4

EFFECTIVE DATE: March 15, 2024
PRIORITY: HIGH
AFFECTED LINES: Line 4, Line 4A (Sub-assembly)
DURATION: 72 hours (estimated)

1. NOTICE SUMMARY
Battery Module Assembly Line 4 will undergo a planned shutdown for equipment upgrade and recalibration. All production schedules for Line 4 and sub-assembly Line 4A will be suspended during this period.

2. REASON FOR SHUTDOWN
- Installation of new automated cell insertion robot (Model: ABB IRB 6700)
- Upgrade of conveyor control system firmware to v4.2.1
- Replacement of worn alignment fixtures (stations 7, 12, 15)
- Calibration of torque stations to updated specifications

3. IMPACT ASSESSMENT
3.1 Production Impact
- Estimated lost output: 450 battery modules
- Affected vehicle programs: Model S, Model X
- Buffer stock available: 380 modules (approximately 2.5 days)

3.2 Staffing Impact
- Line 4 operators to be reassigned to Line 2 and Line 6
- Maintenance team to support installation (12 technicians)
- Quality engineers required for post-installation validation

4. MITIGATION PLAN
- Pre-build 200 additional modules on Lines 2 and 6 prior to shutdown
- Schedule overtime shifts on Lines 2 and 6 during shutdown period
- Expedite supplier deliveries for cell inventory buildup
- Cross-train Line 4 operators on Line 2/6 procedures

5. POST-SHUTDOWN VALIDATION
- Full equipment checkout and safety inspection
- Production trial run: 50 modules at reduced speed
- Quality validation: first 100 modules undergo enhanced inspection
- Full production release upon quality engineering approval

6. COMMUNICATION PLAN
- Daily status updates via email to all stakeholders
- Escalation contact: Manufacturing Director (ext. 4501)
- Updates posted on factory floor digital boards

DISTRIBUTION LIST
- All Line 4 operators and supervisors
- Production Planning department
- Quality Engineering department
- Maintenance and Facilities team
- Supply Chain management

ISSUED BY: Manufacturing Engineering
APPROVED BY: Plant Manager
DOCUMENT ID: MN-2024-0047`;

const MN_TEXT_2 = `MANUFACTURING NOTICE - MN-2024-0063
MATERIAL CHANGE: THERMAL INTERFACE MATERIAL UPDATE

EFFECTIVE DATE: April 1, 2024
PRIORITY: MEDIUM
AFFECTED LINES: All battery assembly lines

1. NOTICE SUMMARY
Effective April 1, 2024, the thermal interface material (TIM) used in battery module assembly will change from Supplier A (Part# TIM-3045) to Supplier B (Part# TIM-7820). This change has been validated through engineering testing and approved by the Materials Review Board.

2. CHANGE DETAILS
2.1 Old Material
- Supplier: ThermalTech Inc.
- Part Number: TIM-3045
- Thermal Conductivity: 3.5 W/mK
- Application Method: Manual dispensing

2.2 New Material
- Supplier: CoolFlow Materials
- Part Number: TIM-7820
- Thermal Conductivity: 5.2 W/mK (48% improvement)
- Application Method: Automated dispensing (compatible with existing equipment)

3. REASON FOR CHANGE
- Improved thermal performance for next-generation battery cells
- Better long-term reliability (validated through 2000-hour accelerated aging)
- Cost reduction of 12% per module
- Supplier diversification strategy

4. PROCESS CHANGES
- Dispensing volume: Reduced from 3.2ml to 2.8ml per cell interface
- Cure time: Reduced from 45 minutes to 30 minutes at 65C
- Shelf life: 12 months (same as current material)
- Storage: Room temperature, no refrigeration required

5. TRAINING REQUIREMENTS
- All assembly operators: 30-minute online training module
- Maintenance technicians: 1-hour hands-on session for dispenser calibration
- Quality inspectors: Updated inspection criteria briefing
- Training completion deadline: March 28, 2024

6. QUALITY VALIDATION
- First Article Inspection (FAI) required for first 50 modules
- Enhanced thermal testing for first production week
- Standard inspection criteria apply after validation period

ISSUED BY: Materials Engineering
APPROVED BY: VP Manufacturing`;

const MI_TEXT_1 = `MANUFACTURING INSTRUCTIONS - MI-BP-0234
BATTERY PACK FINAL ASSEMBLY PROCEDURE

REVISION: 3.2.0
EFFECTIVE DATE: February 15, 2024
CLASSIFICATION: Standard Operating Procedure

1. PURPOSE
This document provides step-by-step instructions for the final assembly of battery packs for Model 3 and Model Y vehicles. All operators must follow these instructions exactly as written.

2. REQUIRED TOOLS AND EQUIPMENT
- Torque wrench (calibrated): 10-50 Nm range
- Insulated socket set (1000V rated)
- ESD wrist strap and grounding mat
- Thermal paste applicator (pneumatic)
- Digital multimeter (Fluke 87V or equivalent)
- Safety glasses with side shields
- High-voltage gloves (Class 0, tested within 6 months)
- Torque verification tool (digital)

3. PRE-ASSEMBLY CHECKLIST
Before starting assembly:
[ ] Verify all battery modules passed incoming inspection
[ ] Check module voltage balance (max deviation: 50mV between modules)
[ ] Confirm coolant system has been pressure tested (15 psi, 30 min hold)
[ ] Verify BMS (Battery Management System) firmware version 5.4.2 or later
[ ] Ensure all tools are calibrated and within certification date
[ ] Put on required PPE (safety glasses, HV gloves, ESD strap)

4. ASSEMBLY SEQUENCE

Step 1: Module Installation
4.1.1 Position battery pack housing on assembly fixture
4.1.2 Apply thermal interface material to module mounting surfaces
       - Coverage: 100% of contact area, no gaps
       - Thickness: 0.5mm ± 0.1mm
4.1.3 Lower Module 1 (front-left) into position using overhead crane
4.1.4 Secure with 8x M8 bolts, torque to 25 Nm ± 2 Nm
4.1.5 Repeat for Modules 2-16 in sequence shown in diagram BP-ASM-001

Step 2: Electrical Connections
4.2.1 Connect high-voltage bus bars between modules
       - Use new hardware for each assembly (do not reuse bolts)
       - Apply anti-seize compound to threads
       - Torque: 12 Nm ± 1 Nm in star pattern
4.2.2 Connect BMS harness to each module
       - Verify connector click (audible confirmation)
       - Gently tug to confirm seated
4.2.3 Route harness through designated channels
       - Maintain minimum 25mm clearance from HV components

Step 3: Coolant System
4.3.1 Connect coolant inlet and outlet manifolds
4.3.2 Torque coolant fittings to 15 Nm ± 1 Nm
4.3.3 Fill coolant system with 8.5L of G48 coolant mix (50/50)
4.3.4 Run coolant pump for 5 minutes to purge air
4.3.5 Top off coolant to fill line

Step 4: Final Closure
4.4.1 Apply sealing compound to pack housing perimeter
       - Continuous bead, 5mm diameter, no gaps
4.4.2 Position pack lid using alignment pins
4.4.3 Install 42x M6 perimeter bolts
       - Torque sequence: star pattern, two passes
       - First pass: 5 Nm
       - Final pass: 10 Nm ± 0.5 Nm

5. POST-ASSEMBLY TESTING
- Pack voltage measurement (within 2V of nominal)
- Insulation resistance test (> 500 MOhm at 500V DC)
- Coolant leak test (15 psi, 10 minute hold, zero pressure drop)
- BMS communication check (all 16 modules responding)
- Thermal sensor validation (all 48 sensors within 2C of ambient)

6. DOCUMENTATION
- Record all torque values in assembly log
- Document pack serial number and module serial numbers
- Log test results in MES (Manufacturing Execution System)
- Apply QC sticker after all tests pass

REVISION HISTORY
v3.0.0 - Updated for new module design (Oct 2023)
v3.1.0 - Added coolant purge procedure (Dec 2023)
v3.2.0 - Updated torque specifications per engineering change (Feb 2024)`;

const MI_TEXT_2 = `MANUFACTURING INSTRUCTIONS - MI-GA-0089
GENERAL ASSEMBLY: FRONT FASCIA INSTALLATION

REVISION: 2.0.1
EFFECTIVE DATE: January 2024
WORK STATION: GA-Station 14

1. PURPOSE
Instructions for installing the front fascia assembly on Model 3/Y vehicles at General Assembly Station 14.

2. CYCLE TIME
- Standard cycle time: 85 seconds
- Critical path operations: Connector attachment (25 seconds)

3. REQUIRED MATERIALS
- Front fascia assembly (verify part number matches vehicle variant)
- 6x push-pin fasteners (Part# FP-2234)
- 4x M6 bolts with captive washers (Part# BW-6640)
- 2x headlamp alignment pins (Part# HA-1120)
- Wiring harness connector lubricant

4. INSTALLATION PROCEDURE

Step 1: Preparation (15 seconds)
- Verify fascia variant matches vehicle build sheet
- Inspect fascia for shipping damage (scratches, cracks, paint defects)
- Remove protective film from headlamp openings
- Pre-position fascia on installation cart at correct height

Step 2: Wiring Connection (25 seconds)
- Locate front sensor harness connector (yellow tag)
- Apply connector lubricant to male pins
- Connect parking sensor harness (4-pin connector)
- Connect fog lamp harness (2-pin connector, both sides)
- Connect front camera harness (8-pin connector)
- Verify all connectors fully seated (push until click)

Step 3: Fascia Positioning (20 seconds)
- Align headlamp alignment pins with body mounting holes
- Guide fascia onto front rail mounting tabs (both sides simultaneously)
- Push fascia firmly against body until all clips engage
- Verify flush fit at fender-to-fascia gap (specification: 3mm ± 1mm)

Step 4: Fastening (25 seconds)
- Install 4x M6 bolts at underbody attachment points
- Torque: 8 Nm ± 1 Nm
- Install 6x push-pin fasteners at wheel arch liner interface
- Confirm push-pins fully seated (flush with surface)

5. QUALITY CHECKPOINTS
After installation, verify:
[ ] All gaps even and within specification (3mm ± 1mm)
[ ] Fascia flush with fenders (no step greater than 1mm)
[ ] All electrical connectors fully seated
[ ] No visible scratches or damage to painted surfaces
[ ] All fasteners installed and torqued
[ ] Headlamp fitment aligned (verify with gap gauge)

6. COMMON ISSUES AND SOLUTIONS
Issue: Gap too wide on one side
Solution: Loosen bolts, reposition, re-torque

Issue: Connector won't seat fully
Solution: Check for bent pins, clean connector, reapply lubricant

Issue: Push-pin won't engage
Solution: Verify hole alignment, check for debris in mounting hole

APPROVED BY: Manufacturing Engineering Manager`;

const QI_TEXT_1 = `QUALITY INSTRUCTIONS - QI-INS-0156
INCOMING INSPECTION: BATTERY CELL RECEIVING

REVISION: 4.1.0
EFFECTIVE DATE: March 2024
INSPECTION LEVEL: Level II (AQL 1.0)

1. PURPOSE
This Quality Instruction defines the incoming inspection requirements for battery cells received from approved suppliers. All incoming lots must be inspected and released before use in production.

2. SCOPE
Applies to all cylindrical battery cells (2170 and 4680 format) received at the Gigafactory incoming inspection area.

3. SAMPLING PLAN
3.1 Lot Size and Sample Size
- Lot size 1-150: Sample 8 cells
- Lot size 151-500: Sample 13 cells
- Lot size 501-1200: Sample 20 cells
- Lot size 1201-3200: Sample 32 cells
- Lot size 3200+: Sample 50 cells

3.2 Acceptance Criteria
- Zero critical defects allowed
- Maximum 1 major defect per sample
- Maximum 2 minor defects per sample

4. VISUAL INSPECTION
4.1 External Appearance
Inspect each sample cell for:
- Dents or deformation (reject if > 0.3mm depth)
- Corrosion or discoloration on terminals
- Electrolyte leakage (any visible leakage = reject entire lot)
- Label legibility and correct orientation
- Protective cap presence and condition

4.2 Dimensional Verification
Using calibrated digital calipers:
- 2170 cells: Diameter 21.0mm ± 0.2mm, Height 70.0mm ± 0.3mm
- 4680 cells: Diameter 46.0mm ± 0.3mm, Height 80.0mm ± 0.4mm
- Terminal height: Within specification per drawing

5. ELECTRICAL TESTING
5.1 Open Circuit Voltage (OCV)
- Measurement: Digital multimeter (4.5 digit minimum)
- 2170 cells: 3.60V to 3.70V
- 4680 cells: 3.60V to 3.70V
- Reject if voltage outside range

5.2 Internal Resistance (IR)
- Measurement: AC impedance at 1kHz
- 2170 cells: < 25 mOhm
- 4680 cells: < 15 mOhm
- Reject if resistance exceeds limit

5.3 Weight Verification
- Use precision scale (0.01g resolution)
- 2170 cells: 68g ± 2g
- 4680 cells: 355g ± 8g
- Weight outliers indicate potential internal defects

6. ENVIRONMENTAL TESTING (Monthly lot validation)
- Thermal cycling: -20C to +60C, 100 cycles
- Vibration test: Per IEC 62660-2
- Crush test: Per UN 38.3 T6
- Short circuit test: Per IEC 62660-2

7. DOCUMENTATION REQUIREMENTS
For each inspected lot:
- Record lot number, supplier, date received
- Document all measurements and test results
- Photograph any defects found
- Complete inspection report in QMS
- Apply lot status label (Green=Accept, Red=Reject, Yellow=Hold)

8. NON-CONFORMING MATERIAL
- Segregate rejected cells in designated quarantine area
- Issue Non-Conformance Report (NCR) within 24 hours
- Notify supplier quality engineer within 48 hours
- Disposition options: Return to supplier, Sort (100%), Scrap
- Track corrective actions in supplier portal

REVISION HISTORY
v4.0.0 - Added 4680 cell specifications (Jan 2024)
v4.1.0 - Updated sampling plan per new AQL requirements (Mar 2024)`;

const QI_TEXT_2 = `QUALITY INSTRUCTIONS - QI-PRO-0078
IN-PROCESS INSPECTION: WELD QUALITY VERIFICATION

REVISION: 2.3.0
EFFECTIVE DATE: February 2024
APPLICABLE STATIONS: Welding Stations W1 through W8

1. PURPOSE
Define inspection criteria and methods for verifying weld quality during battery module assembly. This instruction applies to all ultrasonic and laser welding operations.

2. INSPECTION FREQUENCY
- Visual inspection: Every unit (100%)
- Dimensional check: Every 10th unit
- Destructive testing: 3 samples per shift per station
- Process audit: Weekly per station

3. ULTRASONIC WELD INSPECTION

3.1 Visual Criteria
Accept:
- Uniform weld pattern with consistent indentation
- No cracks, voids, or porosity visible under 10x magnification
- Flash (excess material) < 0.5mm beyond weld zone
- Consistent color (no discoloration indicating overheating)

Reject:
- Any crack extending from weld zone
- Incomplete fusion (visible gap at interface)
- Burn-through or excessive thinning
- Misalignment > 0.3mm from nominal position

3.2 Strength Testing (Destructive)
- Pull test: Minimum 150N for tab-to-busbar welds
- Peel test: Minimum 80N/25mm for foil welds
- Shear test: Minimum 200N for structural welds
- Document all test results with station and operator ID

4. LASER WELD INSPECTION

4.1 Visual Criteria
Accept:
- Continuous weld bead with uniform width (±0.2mm)
- Smooth surface with no spatter beyond 2mm from weld
- Consistent penetration depth (verify on cross-section samples)
- No undercut greater than 10% of material thickness

Reject:
- Porosity visible on surface (any size)
- Crack of any length in weld or heat-affected zone
- Incomplete penetration (< 80% of joint thickness)
- Excessive spatter indicating process instability

4.2 Dimensional Verification
- Weld width: As specified on drawing ± 0.2mm
- Weld position: Within 0.3mm of nominal
- Penetration depth: 80-100% of thinner material (verify on cross-section)

5. PROCESS MONITORING
- Monitor weld energy/power in real-time
- Set alarm limits at ± 10% of nominal parameters
- Log all out-of-limit events
- Quarantine affected units for additional inspection

6. CORRECTIVE ACTIONS
When defects are found:
1. Stop production at affected station
2. Quarantine last 50 units for re-inspection
3. Notify process engineer and quality supervisor
4. Identify root cause (tooling wear, parameter drift, material variation)
5. Implement correction and verify with 10 consecutive good units
6. Document in corrective action system

APPROVED BY: Quality Director`;

const QAN_TEXT_1 = `QUALITY ALERT NOTICE - QAN-2024-0019
CRITICAL: TORQUE SPECIFICATION NON-CONFORMANCE

ALERT LEVEL: RED (Immediate Action Required)
ISSUED: March 8, 2024, 14:30 PST
VALID UNTIL: Resolved and closed by Quality Engineering

1. PROBLEM DESCRIPTION
During routine quality audit of Battery Pack Assembly Line 2, it was discovered that torque values on bus bar connections at Station 5 have been consistently below specification for an estimated 4-hour production window (10:00 to 14:00, March 8, 2024).

Root cause: Torque tool calibration drift. Tool ID# TW-2234 was found to be reading 18% low compared to master standard.

2. AFFECTED PRODUCT
- Product: Battery Pack Assembly (Model 3/Y)
- Serial number range: BP-240308-0045 through BP-240308-0082 (estimated 37 units)
- Station: Line 2, Station 5 (bus bar torque)
- Specification: 12 Nm ± 1 Nm
- Actual measured: 9.8 Nm average (range: 9.2 to 10.4 Nm)

3. RISK ASSESSMENT
- Safety risk: MEDIUM - Under-torqued connections can increase electrical resistance
- Potential consequences: Localized heating, accelerated degradation, potential connection failure
- Customer impact: Possible if not contained (reduced battery performance, potential safety event)

4. IMMEDIATE CONTAINMENT ACTIONS
[ ] STOP production at Line 2, Station 5 (COMPLETED - 14:35)
[ ] Quarantine all 37 affected units (COMPLETED - 14:45)
[ ] Replace torque tool TW-2234 with calibrated spare (COMPLETED - 14:40)
[ ] Verify replacement tool calibration against master standard
[ ] Notify Plant Manager and Quality Director
[ ] Issue shipping hold for any affected units already sent to vehicle assembly

5. DISPOSITION OF AFFECTED UNITS
All 37 units must be:
1. Returned to rework station
2. Bus bar connections loosened and re-torqued with verified tool
3. Torque values documented for each connection (24 per pack)
4. Units re-inspected by quality engineer before release
5. Rework documented in MES with reference to this QAN

6. CORRECTIVE ACTIONS
Short-term (within 24 hours):
- All torque tools on Line 2 to be verified against master standard
- Increase torque audit frequency from hourly to every 30 minutes
- Add visual indicator (color coding) for recently calibrated tools

Long-term (within 2 weeks):
- Implement wireless torque monitoring system with real-time alerts
- Review calibration frequency for all torque tools (currently quarterly)
- Add redundant torque verification step at downstream station

7. DISTRIBUTION
- All Line 2 supervisors and operators
- Quality Engineering team
- Manufacturing Engineering team
- Plant Manager
- Supply Chain (for shipping hold)

ISSUED BY: Quality Engineering
QAN OWNER: Senior Quality Engineer
CLOSURE REQUIRES: Quality Director approval`;

const QAN_TEXT_2 = `QUALITY ALERT NOTICE - QAN-2024-0025
WARNING: SUPPLIER MATERIAL DEVIATION - COOLANT HOSE

ALERT LEVEL: YELLOW (Elevated Monitoring Required)
ISSUED: March 12, 2024
VALID UNTIL: Supplier corrective action verified

1. PROBLEM DESCRIPTION
Incoming inspection identified dimensional variation in coolant hoses received from FlexHose Corp (Lot# FH-2024-0892). Inner diameter measurements on sample of 20 hoses showed 3 units outside specification.

2. DEVIATION DETAILS
- Part: Coolant Hose Assembly (Part# CH-4420)
- Specification: Inner diameter 19.0mm ± 0.3mm
- Lot size: 2,400 hoses
- Sample size: 20
- Out-of-spec units: 3 (measured at 19.5mm, 19.6mm, 19.4mm)
- Defect rate in sample: 15%

3. RISK ASSESSMENT
- Safety risk: LOW - Oversized hoses may not seal properly on barb fittings
- Potential consequence: Coolant leak during thermal cycling
- Production impact: Current inventory sufficient for 3 days while lot is sorted

4. CONTAINMENT ACTIONS
[ ] Quarantine entire lot FH-2024-0892
[ ] 100% inspection of quarantined lot (measure inner diameter)
[ ] Notify supplier quality representative
[ ] Verify last 3 received lots are within specification (spot check 50 per lot)
[ ] Release conforming hoses only after individual measurement verification

5. SUPPLIER NOTIFICATION
- Formal notification sent to FlexHose Corp quality manager
- 8D report requested within 10 business days
- Supplier on-site audit scheduled for March 20, 2024
- Incoming inspection level increased to Level III for next 5 lots

6. INTERIM MEASURES
- All coolant hose lots from this supplier: 100% dimensional inspection
- Assembly line operators: Perform visual and tactile check for loose fit
- Quality gate added: Coolant system pressure test hold time increased from 10 to 20 minutes

ISSUED BY: Supplier Quality Engineering
ESCALATION: Quality Director if additional non-conforming lots received`;

const VA_TEXT_1 = `VISUAL AIDE - VA-EL-0034
BATTERY MODULE CONNECTOR IDENTIFICATION GUIDE

REVISION: 1.5.0
EFFECTIVE DATE: January 2024

1. PURPOSE
This visual aide provides a reference guide for identifying and correctly routing all electrical connectors in the battery module assembly. Post this document at assembly stations for operator reference.

2. CONNECTOR COLOR CODE SYSTEM

HIGH VOLTAGE CONNECTORS (ORANGE)
- All high-voltage connections use orange-colored connectors and cables
- Voltage range: 60V to 400V DC
- ALWAYS verify lockout/tagout before handling
- Minimum PPE: Class 0 HV gloves + safety glasses

SIGNAL CONNECTORS (BLACK)
- Battery Management System (BMS) signal connections
- Low voltage (0-12V)
- Standard ESD precautions required

TEMPERATURE SENSOR CONNECTORS (BLUE)
- Thermistor connections for cell temperature monitoring
- 2-pin connectors, keyed for correct orientation
- Do not force - if resistance felt, check alignment

COOLANT SYSTEM CONNECTORS (GREEN)
- Coolant temperature and flow sensors
- Quick-disconnect fittings with locking clips
- Verify O-ring presence before connecting

3. CONNECTOR ROUTING MAP

Module Position | HV Connector | BMS Connector | Temp Sensors
Front-Left     | Port A1       | Port B1       | T1, T2, T3
Front-Right    | Port A2       | Port B2       | T4, T5, T6
Center-Left    | Port A3       | Port B3       | T7, T8, T9
Center-Right   | Port A4       | Port B4       | T10, T11, T12
Rear-Left      | Port A5       | Port B5       | T13, T14, T15
Rear-Right     | Port A6       | Port B6       | T16, T17, T18

4. CRITICAL ROUTING RULES
- NEVER route signal cables alongside HV cables
- Maintain minimum 50mm separation between HV and signal harnesses
- Use designated cable channels only
- Secure all cables with tie-wraps at 150mm intervals
- No cables should rest on sharp edges or moving components

5. VERIFICATION CHECKLIST
After routing all connections:
[ ] All HV connectors locked (orange lever in closed position)
[ ] All BMS connectors clicked (audible confirmation)
[ ] All temperature sensors connected (verify in diagnostic software)
[ ] Cable routing follows designated channels
[ ] Minimum separation distances maintained
[ ] All tie-wraps installed at required intervals
[ ] No pinched or stressed cables

6. REFERENCE IMAGES
[See posted wall chart VA-EL-0034-POSTER for full-size routing diagram]
[See digital version in Document Finder for zoom capability]

POSTED AT: Line 2 Station 3, Line 2 Station 4, Line 4 Station 3, Line 4 Station 4
REVIEWED BY: Electrical Engineering, Manufacturing Engineering, Safety`;

const VA_TEXT_2 = `VISUAL AIDE - VA-SA-0012
PPE REQUIREMENTS BY WORK ZONE

REVISION: 2.0.0
EFFECTIVE DATE: February 2024

1. PURPOSE
Quick reference guide for Personal Protective Equipment (PPE) requirements in each factory work zone. This visual aide must be posted at all zone entry points.

2. ZONE CLASSIFICATIONS AND REQUIRED PPE

ZONE A - GENERAL ASSEMBLY (GREEN ZONE)
Required PPE:
- Safety glasses with side shields
- Steel-toe safety shoes
- High-visibility vest
- Hearing protection (if noise > 85dB)

ZONE B - BATTERY ASSEMBLY (YELLOW ZONE)
Required PPE:
- Safety glasses with side shields
- Steel-toe safety shoes
- ESD wrist strap (connected to ground)
- ESD-safe clothing (no synthetic fabrics)
- High-visibility vest

ZONE C - HIGH VOLTAGE AREA (ORANGE ZONE)
Required PPE - ALL items from Zone B PLUS:
- Class 0 high-voltage gloves (tested within 6 months)
- Leather protector gloves over HV gloves
- Arc-flash rated face shield (if applicable)
- Flame-resistant clothing

ZONE D - CHEMICAL HANDLING (RED ZONE)
Required PPE:
- Chemical splash goggles
- Chemical-resistant gloves (type per MSDS)
- Chemical-resistant apron
- Respiratory protection (if required by MSDS)
- Steel-toe chemical-resistant boots

ZONE E - WELDING AREA (BLUE ZONE)
Required PPE:
- Auto-darkening welding helmet (shade 10-13)
- Flame-resistant welding jacket
- Welding gloves (leather, gauntlet style)
- Steel-toe boots with metatarsal guard
- Hearing protection

3. PPE INSPECTION REQUIREMENTS
- Inspect all PPE before each use
- HV gloves: Visual + air inflation test before each use
- Report damaged PPE immediately - do not use
- Replace HV gloves every 6 months or after any damage

4. EMERGENCY EQUIPMENT LOCATIONS
- Eye wash stations: Every zone entrance
- Emergency showers: Zones C and D
- First aid kits: Every 50 meters along main aisle
- AED locations: Break rooms, main office, each zone entrance
- Fire extinguishers: Every 20 meters (ABC type in general areas, CO2 in electrical areas)

5. VISITOR REQUIREMENTS
All visitors must wear minimum Zone A PPE at all times.
Visitors are NOT permitted in Zones C or D without escort and additional training.

POSTED AT: All zone entry points, break rooms, visitor reception
APPROVED BY: Environmental Health & Safety Manager`;

const PCA_TEXT_1 = `PROCESS CHANGE APPROVAL - PCA-2024-0008
WELD PARAMETER OPTIMIZATION: ULTRASONIC CELL WELDING

STATUS: APPROVED
CHANGE TYPE: Process Parameter Modification
RISK LEVEL: Medium
EFFECTIVE DATE: April 15, 2024

1. CHANGE DESCRIPTION
Modification of ultrasonic welding parameters at battery cell tab welding stations (W1-W4) to improve weld strength consistency and reduce scrap rate.

2. CURRENT STATE
- Weld energy: 450J ± 20J
- Weld time: 0.35 seconds
- Amplitude: 35 microns
- Force: 200N
- Current scrap rate: 2.3% (target: < 1.5%)
- Current Cpk: 1.15

3. PROPOSED STATE
- Weld energy: 480J ± 15J (increased energy, tighter tolerance)
- Weld time: 0.32 seconds (reduced)
- Amplitude: 38 microns (increased)
- Force: 220N (increased)
- Expected scrap rate: < 0.8%
- Expected Cpk: > 1.67

4. JUSTIFICATION
4.1 Problem Statement
Current weld parameters produce acceptable but inconsistent results. Process capability (Cpk 1.15) is below the 1.33 target. Approximately 2.3% of welds require rework, impacting cycle time and cost.

4.2 Root Cause Analysis
- Energy level at lower bound creates marginal welds during material lot variations
- Longer weld time increases heat input, causing occasional thermal damage
- Current force is insufficient for consistent coupling during high-speed operation

4.3 Expected Benefits
- 65% reduction in scrap rate (2.3% to 0.8%)
- Improved process capability (Cpk 1.15 to 1.67)
- Annual cost savings: estimated $340,000
- Reduced rework time: 15 minutes/shift average

5. VALIDATION PLAN
5.1 Pre-Production Validation
- DOE (Design of Experiments): 32 runs with 4 factors, 2 levels
- Pull test validation: 200 samples at new parameters
- Cross-section analysis: 20 samples for penetration depth verification
- Thermal analysis: IR camera monitoring during welding

5.2 Production Validation
- 500-unit pilot run on Station W1
- 100% pull test for first 100 units
- Statistical process control monitoring for full pilot run
- Compare results against current production baseline

6. RISK ASSESSMENT
Risk: Increased force may accelerate sonotrode wear
Mitigation: Reduce sonotrode replacement interval from 50,000 to 40,000 welds

Risk: Higher energy may cause occasional thermal damage
Mitigation: IR monitoring with automatic stop at 120C surface temperature

Risk: Tighter tolerance may increase false rejects
Mitigation: Upgrade energy measurement system from ±5J to ±2J resolution

7. APPROVAL SIGNATURES
Manufacturing Engineering: APPROVED (March 5, 2024)
Quality Engineering: APPROVED (March 7, 2024)
Process Engineering: APPROVED (March 6, 2024)
Plant Manager: APPROVED (March 10, 2024)

8. IMPLEMENTATION TIMELINE
Week 1: Update weld recipes in PLC (all 4 stations)
Week 2: Station W1 pilot production
Week 3: Validate pilot results, adjust if needed
Week 4: Roll out to stations W2-W4
Week 5: Full production release with monitoring

CHANGE OWNER: Process Engineering Manager
DOCUMENT ID: PCA-2024-0008`;

const PCA_TEXT_2 = `PROCESS CHANGE APPROVAL - PCA-2024-0015
LINE SPEED INCREASE: GENERAL ASSEMBLY LINE 1

STATUS: PENDING VALIDATION
CHANGE TYPE: Process Speed Modification
RISK LEVEL: High
TARGET EFFECTIVE DATE: May 1, 2024

1. CHANGE DESCRIPTION
Increase General Assembly Line 1 line speed from 52 JPH (Jobs Per Hour) to 58 JPH to meet increased production targets for Q2 2024.

2. CURRENT STATE
- Line speed: 52 JPH
- Takt time: 69.2 seconds
- Operator count: 48 per shift
- Quality performance: 97.5% FTQ (First Time Quality)
- Safety incidents (YTD): 2 recordable

3. PROPOSED STATE
- Line speed: 58 JPH (+11.5%)
- Takt time: 62.1 seconds (-7.1 seconds)
- Operator count: 52 per shift (+4 operators)
- Target quality: Maintain > 97% FTQ
- Safety target: Zero additional incidents

4. JUSTIFICATION
- Q2 production target increased by 12% per business planning
- Customer demand exceeds current capacity
- Adding second shift not feasible (facility constraint)
- Line speed increase is most cost-effective option

5. WORK CONTENT ANALYSIS
Stations requiring rebalance (takt time reduction):
- Station 14 (Front Fascia): Currently 67s, need to reduce to 61s
  Action: Split connector attachment to new sub-station 14A
- Station 22 (Dashboard Install): Currently 68s, need to reduce to 61s
  Action: Add powered assist tool, reduce manual handling
- Station 31 (Seat Install): Currently 66s, need to reduce to 61s
  Action: Pre-stage seats on automated cart delivery system
- Station 38 (Wheel Install): Currently 65s, need to reduce to 61s
  Action: Upgrade to 4-spindle simultaneous torque system

6. STAFFING REQUIREMENTS
New positions required:
- 2 operators for Station 14A (new sub-station)
- 1 utility operator for material delivery
- 1 quality auditor for increased inspection rate
Training: All Line 1 operators require updated work instructions and hands-on training

7. EQUIPMENT CHANGES
- Station 14: Install additional connector tooling
- Station 22: New powered assist arm (procurement lead time: 6 weeks)
- Station 31: Automated cart delivery system (procurement lead time: 8 weeks)
- Station 38: 4-spindle torque system (procurement lead time: 4 weeks)
- Conveyor system: Speed controller reprogramming

8. RISK ASSESSMENT
Risk: Quality degradation due to reduced cycle time
Mitigation: Additional quality gates, increased audit frequency

Risk: Ergonomic issues from faster pace
Mitigation: Ergonomic assessment of all modified stations, powered assist tools

Risk: Material supply may not support higher rate
Mitigation: 2-week buffer stock build, supplier notification 6 weeks prior

9. VALIDATION PLAN
- Week 1-2: Equipment installation and commissioning
- Week 3: Operator training on modified stations
- Week 4: Trial run at 55 JPH (intermediate speed)
- Week 5: Full speed trial at 58 JPH
- Week 6: Validate quality, safety, and efficiency metrics
- Week 7: Full production release (if all metrics met)

10. APPROVAL STATUS
Manufacturing Engineering: APPROVED (March 1, 2024)
Quality Engineering: PENDING (awaiting validation plan results)
Safety: APPROVED WITH CONDITIONS (ergonomic assessment required)
Plant Manager: PENDING (awaiting Quality approval)
Finance: APPROVED (ROI validated)

CHANGE OWNER: General Assembly Manager
DOCUMENT ID: PCA-2024-0015`;

// ── Reusable Cloudinary URLs for downloadable files ──────────────────

const CLOUDINARY_DOCX_1 = 'https://res.cloudinary.com/dtr1tnutd/raw/upload/v1763998236/cwmeq1s3yjy2cg4c7csr.docx';
const CLOUDINARY_PDF_1 = 'https://res.cloudinary.com/dtr1tnutd/raw/upload/test_document_3_gtadth.pdf';
const CLOUDINARY_DOCX_2 = 'https://res.cloudinary.com/dtr1tnutd/raw/upload/v1763998602/hwv8b6bqll7ydgfecmhd.docx';

const SAMPLES = [
  // ── MN: Manufacturing Notices ──
  {
    title: 'Line Shutdown Notice - Battery Module Line 4',
    description: 'Planned shutdown for equipment upgrade and recalibration on Line 4.',
    documentType: 'MN',
    category: 'Powertrain',
    tags: ['battery', 'shutdown', 'maintenance', 'line-4'],
    version: '1.0.0',
    fileUrl: CLOUDINARY_PDF_1,
    filePublicId: 'mn_line_shutdown_001',
    textContent: MN_TEXT_1
  },
  {
    title: 'Material Change Notice - Thermal Interface',
    description: 'Thermal interface material supplier change notification and process updates.',
    documentType: 'MN',
    category: 'Materials',
    tags: ['material-change', 'thermal', 'supplier'],
    version: '1.0.0',
    fileUrl: CLOUDINARY_DOCX_1,
    filePublicId: 'mn_material_change_002',
    textContent: MN_TEXT_2
  },

  // ── MI: Manufacturing Instructions ──
  {
    title: 'Battery Pack Final Assembly Procedure',
    description: 'Step-by-step instructions for Model 3/Y battery pack final assembly.',
    documentType: 'MI',
    category: 'Powertrain',
    tags: ['battery', 'assembly', 'torque', 'procedure'],
    version: '3.2.0',
    fileUrl: CLOUDINARY_DOCX_2,
    filePublicId: 'mi_battery_assembly_001',
    textContent: MI_TEXT_1
  },
  {
    title: 'Front Fascia Installation Instructions',
    description: 'General assembly instructions for front fascia installation at Station 14.',
    documentType: 'MI',
    category: 'Body',
    tags: ['general-assembly', 'fascia', 'installation'],
    version: '2.0.1',
    fileUrl: CLOUDINARY_PDF_1,
    filePublicId: 'mi_fascia_install_002',
    textContent: MI_TEXT_2
  },

  // ── QI: Quality Instructions ──
  {
    title: 'Battery Cell Incoming Inspection',
    description: 'Incoming inspection requirements for 2170 and 4680 battery cells.',
    documentType: 'QI',
    category: 'Incoming Quality',
    tags: ['inspection', 'battery-cell', 'incoming', 'AQL'],
    version: '4.1.0',
    fileUrl: CLOUDINARY_PDF_1,
    filePublicId: 'qi_cell_inspection_001',
    textContent: QI_TEXT_1
  },
  {
    title: 'Weld Quality Verification Procedure',
    description: 'In-process inspection criteria for ultrasonic and laser welds.',
    documentType: 'QI',
    category: 'Welding',
    tags: ['welding', 'inspection', 'ultrasonic', 'laser'],
    version: '2.3.0',
    fileUrl: CLOUDINARY_DOCX_1,
    filePublicId: 'qi_weld_quality_002',
    textContent: QI_TEXT_2
  },

  // ── QAN: Quality Alert Notices ──
  {
    title: 'CRITICAL: Torque Specification Non-Conformance',
    description: 'Red alert for torque tool calibration drift on Line 2 bus bar connections.',
    documentType: 'QAN',
    category: 'Powertrain',
    tags: ['alert', 'torque', 'calibration', 'critical'],
    version: '1.0.0',
    fileUrl: CLOUDINARY_PDF_1,
    filePublicId: 'qan_torque_alert_001',
    textContent: QAN_TEXT_1
  },
  {
    title: 'WARNING: Coolant Hose Material Deviation',
    description: 'Yellow alert for dimensional variation in incoming coolant hose lot.',
    documentType: 'QAN',
    category: 'Supplier Quality',
    tags: ['alert', 'supplier', 'coolant', 'deviation'],
    version: '1.0.0',
    fileUrl: CLOUDINARY_DOCX_2,
    filePublicId: 'qan_coolant_hose_002',
    textContent: QAN_TEXT_2
  },

  // ── VA: Visual Aides ──
  {
    title: 'Battery Module Connector ID Guide',
    description: 'Color-coded connector identification and routing reference for assembly.',
    documentType: 'VA',
    category: 'Electrical',
    tags: ['visual-aide', 'connector', 'routing', 'color-code'],
    version: '1.5.0',
    fileUrl: CLOUDINARY_DOCX_1,
    filePublicId: 'va_connector_guide_001',
    textContent: VA_TEXT_1
  },
  {
    title: 'PPE Requirements by Work Zone',
    description: 'Quick reference for PPE requirements in each factory work zone.',
    documentType: 'VA',
    category: 'Safety',
    tags: ['visual-aide', 'ppe', 'safety', 'zones'],
    version: '2.0.0',
    fileUrl: CLOUDINARY_PDF_1,
    filePublicId: 'va_ppe_guide_002',
    textContent: VA_TEXT_2
  },

  // ── PCA: Process Change Approvals ──
  {
    title: 'Weld Parameter Optimization - Ultrasonic',
    description: 'Approved process change for ultrasonic welding parameter optimization.',
    documentType: 'PCA',
    category: 'Welding',
    tags: ['process-change', 'welding', 'optimization', 'approved'],
    version: '1.0.0',
    fileUrl: CLOUDINARY_DOCX_2,
    filePublicId: 'pca_weld_params_001',
    textContent: PCA_TEXT_1
  },
  {
    title: 'Line Speed Increase - GA Line 1',
    description: 'Process change request to increase GA Line 1 from 52 to 58 JPH.',
    documentType: 'PCA',
    category: 'General Assembly',
    tags: ['process-change', 'line-speed', 'capacity', 'pending'],
    version: '1.0.0',
    fileUrl: CLOUDINARY_PDF_1,
    filePublicId: 'pca_line_speed_002',
    textContent: PCA_TEXT_2
  }
];

const extensionToMime = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

const detectMime = (url) => {
  const match = url.match(/\.([a-z0-9]+)(?:\?|$)/i);
  if (!match) return 'application/octet-stream';
  return extensionToMime[match[1].toLowerCase()] || 'application/octet-stream';
};

const fetchSize = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const len = response.headers.get('content-length');
    return len ? parseInt(len, 10) : 0;
  } catch (error) {
    console.warn('Unable to fetch size for', url, error.message);
    return 0;
  }
};

const main = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  console.log('Database schema synced');

  let user = await User.findOne({ where: { email: SAMPLE_USER.email }, paranoid: false });
  if (!user) {
    user = await User.create(SAMPLE_USER);
    console.log('Created demo admin user demo.admin@tesla.com (password: DemoPass123!)');
  } else {
    console.log('Demo admin user already exists');
  }

  // Fetch file sizes once per unique URL
  const uniqueUrls = [...new Set(SAMPLES.map(s => s.fileUrl))];
  const sizeMap = {};
  for (const url of uniqueUrls) {
    sizeMap[url] = await fetchSize(url);
  }

  let created = 0;
  let updated = 0;

  for (const sample of SAMPLES) {
    const payload = {
      ...sample,
      fileType: detectMime(sample.fileUrl),
      fileSize: sizeMap[sample.fileUrl] || 0,
      createdBy: user.id
    };

    const existing = await Document.findOne({ where: { title: sample.title }, paranoid: false });
    if (existing) {
      await existing.update(payload);
      updated++;
      console.log(`  Updated: ${sample.title}`);
    } else {
      await Document.create(payload);
      created++;
      console.log(`  Created: ${sample.title}`);
    }
  }

  await sequelize.close();
  console.log(`\nSeeding complete: ${created} created, ${updated} updated (${SAMPLES.length} total)`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
