// Content for /training, taken from the AUTO-CAN Solutions Technical Training
// Roadmap deck. Keep this file faithful to that curriculum: anything the deck
// does not define (specific board models, AI hardware) is left out rather than
// guessed.

export const trainingIntro = {
  eyebrow: 'Technical Training Roadmap',
  lead:
    'A structured, modular and evaluation-gated program across three domains — Automotive Embedded, Software (Linux & Android) and Artificial Intelligence — with dedicated Developer and Tester tracks in each.',
}

export const trainingDomains = [
  {
    no: '01',
    id: 'automotive',
    title: 'Automotive Embedded',
    topics: ['CAN', 'UDS', 'CAN TP', 'CANoe', 'CAPL', 'LIN & BLE (optional)', 'AUTOSAR', 'Embedded C'],
  },
  {
    no: '02',
    id: 'software',
    title: 'Software (Linux & Android)',
    topics: ['Linux Internals', 'Drivers', 'BSP', 'Middleware', 'IVI', 'AOSP', 'AAOS', 'Projection'],
  },
  {
    no: '03',
    id: 'ai',
    title: 'Artificial Intelligence',
    topics: ['AI Fundamentals', 'LLMs', 'RAG', 'Prompt Engineering', 'SDK', 'Model Evaluation'],
  },
]

export const learningStages = [
  { stage: 'Stage 1', title: 'Foundation / Common Modules' },
  { stage: 'Stage 2', title: 'Track Specialization' },
  { stage: 'Stage 3', title: 'Practical Hands-on' },
  { stage: 'Stage 4', title: 'Module Interview' },
  { stage: 'Stage 5', title: 'Comprehensive Interview' },
]

export const gatingRule =
  'A trainee progresses only after clearing the module-level technical interview and its practical evaluation.'

/* ── Domain 01 — Automotive Embedded ─────────────────────────────── */

export const automotive = {
  foundation: [
    { module: 'CAN', purpose: 'In-vehicle serial bus communication', used: 'ECU-to-ECU networking' },
    { module: 'LIN', optional: true, purpose: 'Low-cost single-master sub-bus', used: 'Body & comfort electronics' },
    { module: 'CAN TP', purpose: 'Transport layer for multi-frame data', used: 'Segmented diagnostic transfer' },
    { module: 'UDS', purpose: 'Unified Diagnostic Services protocol', used: 'Diagnostics, flashing, service tools' },
    { module: 'CANoe', purpose: 'Simulation, analysis & test environment', used: 'Bus analysis, ECU simulation' },
    { module: 'CAPL', purpose: 'Test & simulation scripting language', used: 'Automated test node behaviour' },
    { module: 'BLE', optional: true, purpose: 'Short-range wireless connectivity', used: 'Wireless / connectivity features' },
  ],
  teachingPattern: ['Purpose', 'Architecture', 'Where it is used', 'Automotive use cases', 'Skills expected', 'Interview topics'],
  developer: {
    summary: ['Entry: Embedded C', 'Common modules (CAN / LIN / UDS / CAN TP)', 'AUTOSAR', 'Peripheral driver implementation', 'Board bring-up & debugging', 'Code reviews'],
    sequence: ['Embedded C', 'Common Modules', 'AUTOSAR', 'Driver Practicals'],
    peripherals: ['GPIO', 'UART', 'SPI', 'I2C', 'ADC', 'Timer', 'Interrupts'],
    workflow: [
      { stage: 'Board bring-up', activity: 'Toolchain setup, clock/pin configuration, first boot validation' },
      { stage: 'Driver implementation', activity: 'Register-level initialisation, read/write API, error handling' },
      { stage: 'Debugging', activity: 'Breakpoints, register inspection, signal-level verification' },
      { stage: 'Code review', activity: 'Peer review against coding standards before sign-off' },
      { stage: 'Evaluation', activity: 'Practical assignment + technical interview per module' },
    ],
  },
  tester: {
    summary: ['Modular, per-module progression', 'CANoe · CAPL · UDS focus', 'Requirement-based testing', 'IBM DOORS traceability', 'Python automation', 'Bug identification & validation'],
    lifecycle: ['Requirement Analysis', 'Test Case Preparation', 'Execution (CANoe / CAPL)', 'Log Analysis', 'Bug Reporting', 'Regression Testing'],
    focus: [
      { area: 'CANoe', text: 'Bus simulation, message analysis, test environment execution' },
      { area: 'CAPL', text: 'Scripted test nodes and automated test sequences' },
      { area: 'UDS', text: 'Diagnostic service request/response validation' },
      { area: 'Requirement-based testing', text: 'Test cases derived and traced from requirements' },
      { area: 'IBM DOORS', text: 'Requirement management and traceability' },
      { area: 'Python Automation', text: 'Automated execution and reporting' },
      { area: 'Bug identification', text: 'Defect detection, debugging, validation, regression' },
    ],
    gate: 'Technical interview + practical evaluation after every module; collective interview after all mandatory modules.',
  },
  practicals: [
    { title: 'Driver Implementation', text: 'Peripheral drivers written and executed on evaluation boards — GPIO, UART, SPI, I2C, ADC, Timer, Interrupts.' },
    { title: 'Communication Testing', text: 'Verification of bus communication behaviour across CAN and LIN interfaces.' },
    { title: 'CAN Message Analysis', text: 'Frame-level inspection, trace capture and message interpretation using CANoe.' },
    { title: 'Diagnostic Testing', text: 'UDS service execution and CAN TP multi-frame diagnostic validation.' },
    { title: 'Debugging Methodology', text: 'Structured fault isolation — observe, reproduce, isolate, correct, re-verify.' },
    { title: 'Evaluation', text: 'Practical assignment assessed alongside the module technical interview.' },
  ],
}

/* ── Domain 02 — Software (Linux & Android) ──────────────────────── */

export const linux = {
  sequence: ['Operating Systems', 'Linux Architecture', 'Linux Boot Process', 'Kernel Boot Process', 'Device Drivers (Raspberry Pi)'],
  developer: [
    { area: 'Linux Device Drivers', text: 'Driver architecture, kernel module development' },
    { area: 'Kernel Development', text: 'Kernel build, configuration and boot flow' },
    { area: 'Flashing Software', text: 'Image flashing onto target hardware' },
    { area: 'Middleware — Bluetooth', text: 'Embedded peripheral middleware integration' },
    { area: 'Middleware — Wi-Fi', text: 'Wireless connectivity stack' },
    { area: 'Middleware — CAN', text: 'CAN interface on Linux' },
    { area: 'Middleware — Ethernet / Networking', text: 'Network configuration and peripheral integration' },
    { area: 'BSP Concepts', text: 'Board support package and platform bring-up' },
    { area: 'Infotainment (IVI)', text: 'In-Vehicle Infotainment on embedded Linux — audio, connectivity and media middleware' },
  ],
  hardware: 'Raspberry Pi · i.MX8MP Phyboard Pollux',
  tester: {
    focus: ['Robot Framework', 'Python Automation', 'Manual Testing'],
    tools: ['SSH', 'grep', 'dmesg', 'journalctl', 'System Logs'],
    duties: [
      { area: 'Test Execution', text: 'Manual and automated execution of test scenarios' },
      { area: 'Automation', text: 'Robot Framework and Python-based automated suites' },
      { area: 'Log Collection', text: 'Capturing dmesg, journalctl and system logs from target' },
      { area: 'Bug Reporting', text: 'Structured defect reporting with reproducible steps' },
      { area: 'Root Cause Analysis', text: 'Log-driven fault isolation to identify the originating defect' },
    ],
  },
}

export const android = {
  stack: [
    { layer: 'Applications', text: 'End-user and system applications' },
    { layer: 'Framework', text: 'System services, Binder IPC, AIDL interfaces' },
    { layer: 'Android Runtime', text: 'Runtime and core libraries' },
    { layer: 'Native Libraries', text: 'Native C/C++ library layer' },
    { layer: 'HAL', text: 'Hardware Abstraction Layer' },
    { layer: 'Kernel', text: 'Linux kernel and device drivers' },
  ],
  path: ['Java (prerequisite)', 'Android Studio', 'XML', 'App Development', 'Embedded Android / AOSP', 'Infotainment (IVI)', 'AAOS', 'Android Auto', 'Android Projection'],
  concepts: ['AOSP', 'HAL', 'Binder', 'AIDL', 'System Services', 'Boot Sequence'],
  hardware: 'i.MX8MP Phyboard Pollux',
  tester: {
    focus: ['Robot Framework', 'Python Automation', 'Manual Testing', 'ADB'],
    duties: [
      { area: 'Logcat Analysis', text: 'Runtime log inspection to trace faults and system behaviour' },
      { area: 'Shell Debugging', text: 'ADB shell-based inspection and on-device debugging' },
      { area: 'Device Validation', text: 'Verification of device behaviour on target hardware' },
      { area: 'Functional Testing', text: 'Feature-level validation against requirements' },
      { area: 'Automation Framework', text: 'Robot Framework and Python-driven automated test suites' },
      { area: 'Bug Reporting', text: 'Defect logging with logs, steps and evidence' },
    ],
  },
}

export const ivi = {
  linux: ['Embedded Linux IVI middleware', 'Bluetooth · Wi-Fi connectivity stack', 'Audio and media routing', 'CAN / Ethernet integration', 'Peripheral and display bring-up'],
  android: ['Embedded Android IVI stack', 'HAL and system services for IVI', 'Android Automotive OS (AAOS)', 'Android Auto & Projection', 'Head-unit application layer'],
}

/* ── Domain 03 — Artificial Intelligence ─────────────────────────── */

export const ai = {
  foundation: [
    { module: 'AI Fundamentals', purpose: 'Base concepts of AI systems', skills: 'Core AI terminology and principles' },
    { module: 'Large Language Models', purpose: 'Understanding LLM behaviour', skills: 'Model capabilities and limitations' },
    { module: 'Retrieval-Augmented Generation', purpose: 'Grounding models on external data', skills: 'Retrieval pipelines and context injection' },
    { module: 'Prompt Engineering', purpose: 'Directing model output effectively', skills: 'Prompt design and refinement' },
    { module: 'AI Ecosystem', purpose: 'Landscape of AI tooling and platforms', skills: 'Ecosystem awareness' },
    { module: 'Model Evaluation', purpose: 'Assessing model quality', skills: 'Evaluation criteria and methodology' },
  ],
  teachingPattern: ['Purpose', 'Industry usage', 'Concepts', 'Skills acquired'],
  developer: ['SDK flashing', 'AI software setup', 'SDK usage', 'AI application development', 'CRM-related software understanding', 'AI interview preparation'],
  tester: ['Automation', 'Test tool development (Python-based)', 'Manual testing', 'Hardware testing', 'AI model validation', 'Performance testing & bug identification'],
  testerNote: 'AI testers are expected to develop their own testing tools for automation.',
}

/* ── Cross-domain ────────────────────────────────────────────────── */

export const evaluationGates = [
  { no: '01', title: 'Module-wise Assessment', text: 'Assessment conducted at the end of each module.' },
  { no: '02', title: 'Practical Assignment', text: 'Hands-on implementation or execution task on target hardware / tooling.' },
  { no: '03', title: 'Technical Interview', text: 'Technical interview conducted after each module.' },
  { no: '04', title: 'Comprehensive Interview', text: 'Collective interview covering all completed modules once every required module is finished.' },
]

export const hardwareMap = [
  { domain: 'Automotive Embedded', platform: 'Evaluation Boards', use: 'Peripheral driver implementation, communication & diagnostic testing' },
  { domain: 'Linux', platform: 'Raspberry Pi', use: 'Device drivers, kernel development, flashing' },
  { domain: 'Linux', platform: 'i.MX8MP Phyboard Pollux', use: 'BSP, middleware and peripheral integration' },
  { domain: 'Android', platform: 'i.MX8MP Phyboard Pollux', use: 'Embedded Android, AOSP, HAL, AAOS' },
  { domain: 'Artificial Intelligence', platform: 'AI evaluation hardware', use: 'Hardware testing and validation' },
]

export const toolMap = [
  { track: 'Automotive — Developer', tools: 'Embedded C toolchain, AUTOSAR, evaluation board debuggers' },
  { track: 'Automotive — Tester', tools: 'CANoe, CAPL, UDS tooling, IBM DOORS, Python' },
  { track: 'Linux — Developer', tools: 'Linux kernel toolchain, flashing tools, BSP tooling' },
  { track: 'Linux — Tester', tools: 'Robot Framework, Python, SSH, grep, dmesg, journalctl' },
  { track: 'Android — Developer', tools: 'Android Studio, XML, AOSP build system' },
  { track: 'Android — Tester', tools: 'Robot Framework, Python, ADB, Logcat' },
  { track: 'AI — Developer', tools: 'AI SDK, AI software setup / deployment tooling' },
  { track: 'AI — Tester', tools: 'Python-based custom test tools, automation frameworks' },
]

export const roadmaps = [
  { domain: 'Automotive', steps: ['Embedded C', 'CAN', 'CAN TP', 'UDS', 'CANoe', 'CAPL', 'LIN', 'BLE', 'AUTOSAR / Testing', 'Practicals'], optional: ['LIN', 'BLE'] },
  { domain: 'Linux', steps: ['OS', 'Linux Architecture', 'Boot Process', 'Kernel Boot', 'Device Drivers', 'Middleware', 'Networking', 'IVI / Infotainment'] },
  { domain: 'Android', steps: ['Java', 'Android Studio', 'XML', 'App Dev', 'Embedded Android', 'IVI', 'AAOS', 'Android Auto', 'Projection'] },
  { domain: 'AI', steps: ['AI Fundamentals', 'LLMs', 'RAG', 'Prompt Engineering', 'AI Ecosystem', 'Model Evaluation', 'Track Specialization'] },
]
