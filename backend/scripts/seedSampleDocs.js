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

const SAMPLE_TEXT_CONTENT = `BATTERY PACK ASSEMBLY CHECKLIST - LINE 3

SECTION 1: PRE-ASSEMBLY INSPECTION
1.1 Visual Inspection
- Inspect all battery cells for physical damage, corrosion, or leakage
- Check terminal connections for proper alignment and cleanliness
- Verify cell orientation matches assembly diagram
- Document any anomalies in the quality log

1.2 Electrical Testing
- Measure cell voltage: 3.6V ± 0.1V per cell
- Perform insulation resistance test: minimum 100 MΩ
- Check for short circuits using multimeter
- Record baseline measurements for traceability

1.3 Dimensional Verification
- Verify cell dimensions: 65mm × 20mm × 10mm (±0.5mm tolerance)
- Check spacing between cells: 2mm ± 0.2mm
- Confirm mounting bracket alignment
- Use calibrated calipers for all measurements

SECTION 2: ASSEMBLY SEQUENCE
2.1 Cell Arrangement
Step 1: Position cells in 4S2P configuration
Step 2: Align positive terminals to the right
Step 3: Ensure negative terminals face left
Step 4: Maintain consistent spacing throughout

2.2 Connection Assembly
- Apply thermal paste to all connection points (0.5g per joint)
- Insert connector pins with firm pressure until seated
- Verify no gaps between connector and cell terminal
- Torque specification: 2.5 Nm ± 0.1 Nm

2.3 Insulation Application
- Wrap assembly with 0.5mm insulation tape
- Cover all exposed terminals completely
- Ensure tape overlaps by minimum 10mm
- Use heat gun to set adhesive (60°C for 30 seconds)

SECTION 3: TORQUE SPECIFICATIONS
Critical Fasteners:
- Main connector bolts: 3.2 Nm ± 0.15 Nm
- Ground straps: 2.5 Nm ± 0.1 Nm
- Mounting brackets: 4.0 Nm ± 0.2 Nm
- Safety clips: 1.8 Nm ± 0.1 Nm

Torque Sequence:
1. Tighten bolts in diagonal pattern
2. First pass: 50% of specified torque
3. Second pass: 100% of specified torque
4. Verify final torque with calibrated wrench

SECTION 4: QUALITY CHECKS
4.1 Electrical Verification
- Pack voltage: 14.4V ± 0.2V (4S configuration)
- Resistance measurement: < 5 mΩ
- Insulation resistance: > 100 MΩ
- No voltage imbalance between cells

4.2 Mechanical Inspection
- All fasteners secure and properly torqued
- No visible cracks or damage to cells
- Insulation tape intact and properly applied
- Connector alignment verified

4.3 Documentation
- Record assembly date and time
- Log operator ID and shift number
- Document all measurements and test results
- Photograph assembly for quality records

SECTION 5: SAFETY PROCEDURES
- Always wear ESD protection when handling cells
- Use insulated tools for all assembly work
- Maintain clean work area free of conductive materials
- Follow lockout/tagout procedures before maintenance
- Report any anomalies immediately to supervisor

SECTION 6: TROUBLESHOOTING
Issue: Voltage imbalance between cells
Solution: Check cell connections for corrosion; clean terminals with isopropyl alcohol

Issue: High resistance measurement
Solution: Verify connector seating; apply additional thermal paste if needed

Issue: Insulation tape separation
Solution: Reapply tape with proper overlap; use heat gun to set adhesive

REVISION HISTORY
Version 1.0.0 - Initial release (2024-01-15)
Version 1.1.0 - Added torque sequence details (2024-02-20)
Version 1.2.0 - Updated safety procedures (2024-03-10)

APPROVAL SIGNATURES
Quality Manager: _________________ Date: _________
Manufacturing Lead: _________________ Date: _________
Engineering: _________________ Date: _________`;

const SAMPLE_QUALITY_TEXT = `FINAL QUALITY GATE - PAINT INSPECTION SOP

DOCUMENT CONTROL
Document ID: QG-PAINT-001
Revision: 2.1.0
Effective Date: March 1, 2024
Next Review: September 1, 2024

1. PURPOSE AND SCOPE
This Standard Operating Procedure (SOP) defines the inspection requirements for final clearcoat quality assurance. This procedure applies to all vehicle bodies at the final paint quality gate before delivery.

2. INSPECTION ENVIRONMENT REQUIREMENTS
2.1 Lighting Conditions
- Minimum illumination: 500 lux
- Color temperature: 5000K ± 200K (daylight balanced)
- Eliminate shadows and reflections
- Use standardized inspection booth

2.2 Temperature and Humidity
- Ambient temperature: 20°C to 25°C
- Relative humidity: 40% to 60%
- Allow 15-minute acclimation period before inspection
- Record environmental conditions on inspection form

2.3 Surface Preparation
- Clean inspection area with lint-free cloth
- Remove any dust or debris from vehicle surface
- Allow surface to reach ambient temperature
- Verify no wet spots or moisture present

3. VISUAL INSPECTION PROCEDURE
3.1 Clearcoat Surface Quality
Inspect for the following defects:
- Orange peel texture (acceptable: < 0.5mm deviation)
- Sag or runs (not acceptable)
- Crazing or cracking (not acceptable)
- Dust particles embedded in coating (not acceptable)
- Holograms or swirl marks (acceptable: < 2 per panel)

3.2 Color Consistency
- Compare with approved color standard under controlled lighting
- Acceptable color variation: ΔE < 1.0
- Check for color shift across panels
- Document any color variations

3.3 Gloss Level Measurement
- Use 60° gloss meter for measurement
- Acceptable range: 85 ± 5 gloss units
- Measure minimum 3 points per panel
- Record highest and lowest readings

4. DEFECT CLASSIFICATION
4.1 Critical Defects (Reject)
- Paint runs or sags > 2mm
- Cracking or crazing in clearcoat
- Bare substrate exposed
- Large dust particles (> 1mm)
- Contamination requiring rework

4.2 Major Defects (Conditional)
- Holograms or swirl marks > 3 per panel
- Color variation ΔE > 1.5
- Gloss level outside ± 8 units
- Minor dust particles (0.5-1mm)

4.3 Minor Defects (Accept)
- Gloss variation within ± 5 units
- Holograms or swirl marks < 2 per panel
- Color variation ΔE < 1.0
- Surface cleanliness acceptable

5. MEASUREMENT TECHNIQUES
5.1 Gloss Measurement
- Calibrate meter before each shift
- Measure at 60° angle perpendicular to surface
- Take readings on flat areas, avoiding edges
- Average three measurements per panel

5.2 Color Matching
- Use standardized color comparison booth
- Position vehicle and standard under identical lighting
- View from multiple angles (0°, 45°, 90°)
- Document any color variations

5.3 Surface Texture Assessment
- Use tactile and visual inspection
- Run gloved hand across surface
- Feel for irregularities or rough spots
- Compare with reference standard

6. INSPECTION DOCUMENTATION
6.1 Required Records
- Inspection date and time
- Inspector name and ID
- Vehicle identification number (VIN)
- Panel-by-panel assessment
- Measurement readings (gloss, color)
- Environmental conditions
- Defects identified and location
- Accept/Reject decision

6.2 Defect Reporting
- Document defect location with photos
- Describe defect in detail
- Classify defect severity
- Recommend corrective action
- Route to appropriate department

7. ACCEPTANCE CRITERIA
Vehicle passes final quality gate if:
- No critical defects present
- Maximum 2 major defects (if approved by supervisor)
- All measurements within specification
- Environmental conditions within range
- All documentation complete and accurate

8. REWORK PROCEDURES
8.1 Minor Defects
- Perform light polishing with approved compound
- Re-inspect after rework
- Document rework performed

8.2 Major Defects
- Escalate to paint department supervisor
- Determine if spot repair or full panel repaint required
- Schedule rework in paint booth
- Re-inspect after rework completion

8.3 Critical Defects
- Reject vehicle immediately
- Quarantine vehicle in designated area
- Notify production management
- Determine root cause and corrective action

9. TRAINING AND QUALIFICATION
- All inspectors must complete initial training
- Annual refresher training required
- Maintain color vision certification
- Document training completion

10. REVISION HISTORY
Version 1.0.0 - Initial SOP (January 2023)
Version 2.0.0 - Updated measurement criteria (June 2023)
Version 2.1.0 - Added environmental requirements (March 2024)

APPROVAL AND AUTHORIZATION
Quality Manager: _________________ Date: _________
Plant Manager: _________________ Date: _________
Engineering Director: _________________ Date: _________`;

const SAMPLE_CALIBRATION_TEXT = `DRIVE UNIT CALIBRATION UPDATE - INVERTER CONFIGURATION

DOCUMENT INFORMATION
Title: Drive Unit Calibration Update
Version: 0.9.5
Date: December 2024
Classification: Internal Use Only

EXECUTIVE SUMMARY
This document provides updated calibration procedures for new inverter units in the drive system. These procedures must be followed for all new inverter installations and periodic maintenance calibrations.

1. INVERTER SPECIFICATIONS
1.1 Hardware Specifications
- Model: TM-INV-2024-X
- Input Voltage: 350V - 400V DC
- Maximum Current: 650A
- Operating Temperature: -20°C to +60°C
- Cooling System: Liquid cooled

1.2 Software Version
- Firmware Version: 3.2.1
- Calibration Tool Version: 2.1.0
- Communication Protocol: CAN 2.0B

2. PRE-CALIBRATION CHECKLIST
Before beginning calibration:
☐ Verify inverter hardware is undamaged
☐ Check all connectors are properly seated
☐ Confirm software version matches documentation
☐ Verify test equipment is calibrated
☐ Ensure work area is clean and organized
☐ Document ambient temperature and humidity
☐ Confirm safety interlocks are functional
☐ Review safety procedures with team

3. CALIBRATION PROCEDURE
3.1 Initial Setup
Step 1: Connect diagnostic interface to inverter
Step 2: Launch calibration software on test computer
Step 3: Verify communication with inverter (LED indicator should be green)
Step 4: Load calibration profile for specific inverter model
Step 5: Enter inverter serial number and hardware revision

3.2 Voltage Calibration
Procedure:
1. Set input voltage to 350V using power supply
2. Record ADC reading from calibration software
3. Adjust voltage offset in software until reading matches expected value
4. Repeat at 375V and 400V
5. Verify linearity across voltage range

Acceptance Criteria:
- Voltage error < ±2V across entire range
- Linearity error < 0.5%
- All three calibration points within specification

3.3 Current Calibration
Procedure:
1. Set current to 100A using current source
2. Record ADC reading from calibration software
3. Adjust current offset in software
4. Repeat at 325A, 550A, and 650A
5. Verify linearity across current range

Acceptance Criteria:
- Current error < ±5A across entire range
- Linearity error < 0.3%
- All calibration points within specification

3.4 Temperature Calibration
Procedure:
1. Place inverter in temperature chamber
2. Set temperature to -20°C and wait for stabilization
3. Record temperature sensor reading
4. Adjust temperature offset in software
5. Repeat at 0°C, 25°C, and 60°C
6. Verify temperature compensation

Acceptance Criteria:
- Temperature error < ±2°C
- Sensor response time < 5 minutes
- All calibration points within specification

4. ADVANCED CALIBRATION SETTINGS
4.1 Phase Calibration
- Verify three-phase voltage balance
- Acceptable phase imbalance: < 2%
- Adjust phase offset if necessary
- Record phase angles for documentation

4.2 Frequency Response
- Test frequency response at 50Hz and 60Hz
- Verify response time < 100ms
- Check for oscillations or instability
- Document frequency response curve

4.3 Protection Thresholds
- Overvoltage threshold: 420V
- Undervoltage threshold: 330V
- Overcurrent threshold: 700A
- Temperature alarm: 70°C
- Temperature shutdown: 85°C

5. VERIFICATION AND TESTING
5.1 Functional Testing
- Verify all calibration parameters saved correctly
- Test inverter under simulated load conditions
- Monitor for error codes or warnings
- Verify communication with vehicle systems

5.2 Performance Validation
- Measure efficiency at various load points
- Verify thermal management performance
- Check response time to control commands
- Validate safety shutdown procedures

5.3 Documentation
- Record all calibration values
- Document test results
- Photograph calibration setup
- Save calibration file with timestamp

6. TROUBLESHOOTING GUIDE
Issue: Communication error with inverter
Solution: Check USB connection; verify driver installation; restart calibration software

Issue: Voltage calibration out of range
Solution: Check power supply calibration; verify ADC connections; repeat calibration

Issue: Temperature sensor not responding
Solution: Check sensor connections; verify sensor functionality; replace if faulty

Issue: Current calibration inconsistent
Solution: Check current source calibration; verify shunt resistor connections; repeat procedure

7. POST-CALIBRATION PROCEDURES
7.1 Final Checks
- Verify all calibration parameters are within specification
- Confirm no error codes present
- Test emergency shutdown procedure
- Verify communication with vehicle systems

7.2 Documentation
- Complete calibration certificate
- Record operator name and date
- Document any issues encountered
- Archive calibration file

7.3 Installation
- Carefully remove inverter from test setup
- Verify all connectors are properly secured
- Install thermal interface material if required
- Mount inverter in vehicle per installation guide

8. MAINTENANCE CALIBRATION
Periodic calibration required:
- Every 12 months or 50,000 miles
- After any repair or component replacement
- If performance issues are reported
- Before warranty expiration

9. SAFETY WARNINGS
⚠️ HIGH VOLTAGE - Risk of electrical shock
⚠️ HOT SURFACES - Risk of burn injury
⚠️ MOVING PARTS - Risk of crushing injury

Always follow electrical safety procedures and use appropriate personal protective equipment.

10. REVISION HISTORY
Version 0.8.0 - Initial draft (November 2024)
Version 0.9.0 - Added advanced calibration settings (November 2024)
Version 0.9.5 - Updated temperature ranges and thresholds (December 2024)

NEXT STEPS
- Distribute to all technicians
- Schedule training sessions
- Update service procedures
- Implement in production environment`;

const SAMPLES = [
  {
    title: 'Battery Pack Assembly Checklist',
    description: 'Torque specs and sequential checks for line 3 assemblies.',
    documentType: 'manufacturing',
    category: 'Powertrain',
    tags: ['battery', 'assembly', 'torque'],
    version: '1.0.0',
    fileUrl: 'https://res.cloudinary.com/dtr1tnutd/raw/upload/v1763998236/cwmeq1s3yjy2cg4c7csr.docx',
    filePublicId: 'cwmeq1s3yjy2cg4c7csr',
    textContent: SAMPLE_TEXT_CONTENT
  },
  {
    title: 'Final Quality Gate – Paint',
    description: 'Inspection SOP for final clearcoat QA.',
    documentType: 'quality',
    category: 'Body',
    tags: ['quality', 'paint', 'inspection'],
    version: '2.1.0',
    fileUrl: 'https://res.cloudinary.com/dtr1tnutd/raw/upload/test_document_3_gtadth.pdf',
    filePublicId: 'test_document_3_gtadth',
    textContent: SAMPLE_QUALITY_TEXT
  },
  {
    title: 'Drive Unit Calibration Update',
    description: 'DOCX instructions for calibrating new inverters.',
    documentType: 'manufacturing',
    category: 'Drivetrain',
    tags: ['drive-unit', 'calibration'],
    version: '0.9.5',
    fileUrl: 'https://res.cloudinary.com/dtr1tnutd/raw/upload/v1763998602/hwv8b6bqll7ydgfecmhd.docx',
    filePublicId: 'hwv8b6bqll7ydgfecmhd',
    textContent: SAMPLE_CALIBRATION_TEXT
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
  console.log('Database schema synced with latest User fields');

  let user = await User.findOne({ where: { email: SAMPLE_USER.email }, paranoid: false });
  if (!user) {
    user = await User.create(SAMPLE_USER);
    console.log('Created demo admin user demo.admin@tesla.com (password: DemoPass123!)');
  }

  for (const sample of SAMPLES) {
    const size = await fetchSize(sample.fileUrl);
    const payload = {
      ...sample,
      fileType: detectMime(sample.fileUrl),
      fileSize: size,
      createdBy: user.id
    };

    const existing = await Document.findOne({ where: { title: sample.title }, paranoid: false });
    if (existing) {
      await existing.update(payload);
      console.log('Updated existing sample:', sample.title);
    } else {
      await Document.create(payload);
      console.log('Seeded sample document:', sample.title);
    }
  }

  await sequelize.close();
  console.log('Seeding complete.');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
