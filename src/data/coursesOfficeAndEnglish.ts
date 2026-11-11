import { InternationalTrainingCourse } from './internationalTrainingsData';
import {
  buildHubTrainingFromCourse,
  normalizeRawSlideCourse
} from './coursesHaccp3And4';
import { HubTraining } from '../types/hub';

export const MICROSOFT_OFFICE_INTRO_COURSE: InternationalTrainingCourse = normalizeRawSlideCourse({
  id: 'cert-2026-microsoft-office-intro',
  code: 'MS-OFFICE',
  title: 'Introduction to Microsoft Office',
  subtitle: 'Practical Workplace Mastery of Microsoft Word, Excel, PowerPoint, Outlook & Cloud Productivity',
  category: 'International Certification',
  level: 'Foundation & Intermediate',
  durationHours: 16,
  totalModules: 5,
  examQuestionsCount: 40,
  passingScorePercent: 60,
  certificateTitle: 'Certified Microsoft Office Workplace Productivity Professional',
  accreditationStandard: 'International Digital Workplace & Office Productivity Competency Standard',
  targetAudience: ['Quality & Production Supervisors', 'Administrative & HR Officers', 'Students & Fresh Graduates', 'Plant & Office Professionals'],
  overview: 'A simple, step-by-step 05-Module slide presentation course teaching practical everyday skills in Microsoft Word (SOPs & Reports), Microsoft Excel (Formulas, Charts & Pivot Tables), Microsoft PowerPoint (Management Presentations), and Microsoft Outlook/OneDrive.',
  learningOutcomes: [
    'Create professional SOPs, reports, tables, and automatic Table of Contents in Microsoft Word',
    'Use essential Microsoft Excel formulas (SUM, AVERAGE, IF, COUNTIF, VLOOKUP/XLOOKUP) and Conditional Formatting',
    'Build Pivot Tables, dynamic charts, and data validation drop-down lists in Excel',
    'Design clean, engaging management presentations using Slide Master in Microsoft PowerPoint',
    'Manage workplace emails, calendar invites, and OneDrive cloud file sharing in Microsoft Outlook'
  ],
  modules: [
    {
      moduleNumber: 1,
      title: 'Module 01: Microsoft Office Fundamentals & Microsoft Word Mastery',
      estimatedMinutes: 50,
      learningObjectives: [
        'Navigate the Microsoft Office Ribbon, Quick Access Toolbar, and Backstage View',
        'Format professional documents, SOPs, and reports using Heading Styles in MS Word',
        'Insert tables, headers/footers, page numbers, and an automatic Table of Contents'
      ],
      summary: 'Covers the Microsoft Office interface, essential keyboard shortcuts, and creating structured SOPs, formal letters, and reports in Microsoft Word.',
      keyTakeaways: [
        'Using built-in Heading Styles (Heading 1, Heading 2) in MS Word allows instant generation of an automatic Table of Contents.',
        'Ctrl + S saves your work, Ctrl + Z undoes mistakes, and Exporting to PDF locks formatting for official distribution.'
      ],
      practiceScenario: 'You need to write a 10-page Standard Operating Procedure (SOP) in MS Word. You add a company logo and Document Control ID in the Header, apply Heading 1 to main sections, insert a 1-click Automatic Table of Contents on page 1, and export the final file as a read-only PDF.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Getting Started with the Microsoft Office Suite',
          subtitle: 'Module 01 • Core Workplace Applications',
          bullets: [
            'Microsoft Office (Microsoft 365) is the global standard software suite for business, manufacturing, healthcare, and education.',
            'Microsoft Word (.docx): Creating SOPs, policies, business letters, audit reports, and manuals.',
            'Microsoft Excel (.xlsx): Calculating data, production logs, budgets, KPI charts, and inventory sheets.',
            'Microsoft PowerPoint (.pptx): Creating training slides and management review presentations.',
            'Microsoft Outlook & OneDrive: Professional email, meeting scheduling, and cloud backup.'
          ],
          Example: 'Writing a monthly quality report in Word, analyzing defect data in Excel, and presenting summary slides in PowerPoint.',
          keyPoint: 'Know each file extension: .docx for Word, .xlsx for Excel, and .pptx for PowerPoint.'
        },
        {
          slideNumber: 2,
          title: 'Essential Time-Saving Keyboard Shortcuts',
          subtitle: 'Module 01 • Working Twice as Fast Across All Office Apps',
          bullets: [
            'Ctrl + C (Copy), Ctrl + X (Cut), and Ctrl + V (Paste).',
            'Ctrl + Z (Undo last mistake) and Ctrl + Y (Redo action).',
            'Ctrl + S (Save document immediately) and Ctrl + P (Print or Save as PDF).',
            'Ctrl + F (Find a word in the document) and Ctrl + A (Select All content).'
          ],
          Example: 'Pressing Ctrl + Z immediately if you accidentally delete a table in Word restores the entire table in one second.',
          keyPoint: 'Press Ctrl + S frequently (or enable AutoSave) so you never lose work during a power outage.'
        },
        {
          slideNumber: 3,
          title: 'Formatting Professional Documents in MS Word',
          subtitle: 'Module 01 • Fonts, Paragraphs & Heading Styles',
          bullets: [
            'Use clean professional fonts (Calibri, Arial, Aptos, or Times New Roman) in size 11 or 12 for body text.',
            'Apply built-in Styles (Heading 1 for main titles, Heading 2 for sub-sections) from the Home tab instead of manual bolding.',
            'Use Format Painter (paintbrush icon) to copy exact formatting from one paragraph and apply it to another.',
            'Use Page Breaks (Ctrl + Enter) to start a new section cleanly on the next page instead of pressing Enter 20 times.'
          ],
          Example: 'Pressing Ctrl + Enter at the end of a cover page so the next section always starts cleanly at the top of Page 2.',
          keyPoint: 'Always use Ctrl + Enter (Page Break) rather than blank Enter lines to keep pages aligned when editing.'
        },
        {
          slideNumber: 4,
          title: 'Tables, Headers/Footers & Automatic Table of Contents',
          subtitle: 'Module 01 • Controlled SOP & Report Layout',
          bullets: [
            'Headers & Footers (Insert Tab): Place company name, SOP Code, Version Number, and "Page X of Y" automatically on every page.',
            'Tables (Insert → Table): Organize schedules, checklists, and specifications cleanly; use "Repeat Header Rows" for multi-page tables.',
            'Automatic Table of Contents (References Tab → Table of Contents): Automatically pulls all Heading 1, 2, and 3 titles with page numbers.',
            'Track Changes & Comments (Review Tab): Allows managers to suggest edits and leave feedback notes without erasing original text.'
          ],
          Example: 'Turning on "Repeat Header Rows" under Table Layout so a 4-page inspection checklist shows column titles at the top of every page.',
          keyPoint: 'Heading Styles + References → Table of Contents creates a professional clickable contents page in 2 seconds.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 2,
      title: 'Module 02: Microsoft Excel Essentials & Everyday Formulas',
      estimatedMinutes: 55,
      learningObjectives: [
        'Understand Workbooks, Worksheets, Rows, Columns, Cells, and Relative vs Absolute ($A$1) references',
        'Write essential Excel formulas: SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, and IF',
        'Use Freeze Panes, Filters, Sorting, and Data Validation Drop-Down Lists'
      ],
      summary: 'Introduces the Excel grid, cell formatting, Absolute vs Relative cell references ($A$1), core mathematical and logical formulas, Freeze Panes, and AutoFilter.',
      keyTakeaways: [
        'Every formula or function in Microsoft Excel MUST begin with an equals sign (=).',
        'Adding dollar signs ($A$1) creates an Absolute Reference that stays locked when you drag a formula down a column.'
      ],
      practiceScenario: 'You build an Exam Score sheet in Excel. In column D, you type `=IF(C2>=60, "PASS", "FAIL")` and double-click the bottom-right fill handle to automatically grade 200 trainees in one second.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Understanding the Microsoft Excel Grid',
          subtitle: 'Module 02 • Workbooks, Sheets, Columns, Rows & Cells',
          bullets: [
            'An Excel file is called a Workbook (.xlsx) and can contain multiple Worksheet tabs at the bottom.',
            'Columns run vertically and are labeled with Letters (A, B, C...); Rows run horizontally and are labeled with Numbers (1, 2, 3...).',
            'A Cell is the intersection of a column and row, identified by its Cell Address (e.g., B5 is Column B, Row 5).',
            'Format numbers properly (Currency, Percentage %, Date, Decimal places) on the Home tab so calculations stay accurate.'
          ],
          Example: 'Selecting a column of efficiency ratios (0.854) and clicking the "%" icon on the Home tab to display "85.4%".',
          keyPoint: 'Keep only one piece of data per cell, and never mix text units (like "25 kg") inside a cell you want to sum mathematically.'
        },
        {
          slideNumber: 2,
          title: 'The Golden Rule of Excel Formulas & Cell References',
          subtitle: 'Module 02 • Relative (A1) vs. Absolute ($A$1) References',
          bullets: [
            'Golden Rule: Every Excel formula MUST start with an equals sign (=), such as `=A2+B2` or `=B2*C2`.',
            'Relative Reference (e.g., `A2`): Automatically shifts to `A3`, `A4`, `A5` when you drag the formula down a column.',
            'Absolute Reference (e.g., `$F$1` — press F4 key): Locks the exact cell so it does NOT move when copied down.',
            'Use the tiny green square at the bottom-right corner of a cell (Fill Handle) to copy a formula down hundreds of rows instantly.'
          ],
          Example: 'Multiplying each product’s price in column B by a single Tax Rate sitting in cell `$H$1` using `=B2*$H$1`.',
          keyPoint: 'Pressing the F4 key while typing a cell address automatically adds dollar signs ($A$1) to lock that cell.'
        },
        {
          slideNumber: 3,
          title: 'Top 7 Essential Excel Functions Every Professional Needs',
          subtitle: 'Module 02 • Built-in Calculation Power',
          bullets: [
            '`=SUM(B2:B50)`: Adds up all numbers in the selected range (Shortcut: Alt + =).',
            '`=AVERAGE(B2:B50)`: Calculates the arithmetic mean of the numbers.',
            '`=MAX(B2:B50)` and `=MIN(B2:B50)`: Finds the highest and lowest values in a list.',
            '`=COUNT(B2:B50)` counts cells with numbers; `=COUNTA(B2:B50)` counts all non-empty cells (including text names).',
            '`=IF(logical_test, "Value if True", "Value if False")`: Makes automatic decisions based on a target limit.'
          ],
          Example: 'Using `=IF(D2>5, "Out of Spec - Hold", "OK")` on a chiller temperature log where the limit is 5°C.',
          keyPoint: 'Remember: COUNT only counts numbers, while COUNTA counts any cell that is not blank (like employee names).'
        },
        {
          slideNumber: 4,
          title: 'Freeze Panes, AutoFilter & Drop-Down Lists',
          subtitle: 'Module 02 • Managing Large Data Tables Cleanly',
          bullets: [
            'Freeze Panes (View Tab → Freeze Top Row): Keeps your column headers visible at the top while scrolling down 1,000 rows.',
            'Sort & Filter (Data Tab → Filter / Ctrl + Shift + L): Adds drop-down arrows to headers to filter by department, date, or status.',
            'Data Validation (Data Tab → Data Validation → List): Creates a clickable drop-down list in a cell (e.g., "Pass, Fail, Pending") to prevent typos.',
            'Remove Duplicates (Data Tab): Cleans duplicate IDs or entries from a table in one click.'
          ],
          Example: 'Using Data Validation to restrict the "Shift" column to a drop-down menu of "Morning, Evening, Night" so nobody types spelling variations.',
          keyPoint: 'Data Validation drop-down lists eliminate human spelling mistakes so your reports and charts stay 100% accurate.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 3,
      title: 'Module 03: Excel Data Analysis — VLOOKUP, Pivot Tables & Charts',
      estimatedMinutes: 55,
      learningObjectives: [
        'Use COUNTIF, SUMIF, and VLOOKUP / XLOOKUP to search and summarize data across tables',
        'Highlight critical numbers automatically using Conditional Formatting',
        'Build a Pivot Table and visual Charts in under 60 seconds'
      ],
      summary: 'Covers advanced everyday analysis in Excel: Conditional Formatting, COUNTIF/SUMIF, VLOOKUP, Pivot Tables, and choosing the right Chart (Column, Line, Pie).',
      keyTakeaways: [
        'VLOOKUP searches for an ID in the leftmost column of a table and returns matching information from a specified column.',
        'Pivot Tables summarize thousands of rows of raw data into clean departmental or monthly totals with drag-and-drop ease—zero formulas needed.'
      ],
      practiceScenario: 'Your manager gives you an Excel sheet with 5,000 rows of daily production batches across 4 lines and asks for total output and waste per line by month. Instead of writing manual formulas, you click Insert → PivotTable, drag "Line" to Rows, "Month" to Columns, and "Output kg" to Values, finishing the report in 30 seconds.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'COUNTIF, SUMIF & VLOOKUP Made Simple',
          subtitle: 'Module 03 • Conditional Totals & Table Lookups',
          bullets: [
            '`=COUNTIF(range, criteria)`: Counts how many cells meet a condition (e.g., `=COUNTIF(E2:E100, "Fail")` counts all failed batches).',
            '`=SUMIF(range, criteria, sum_range)`: Adds numbers only when a condition matches (e.g., total production only for "Line 1").',
            '`=VLOOKUP(lookup_value, table_array, col_index_num, FALSE)`: Looks up an Item Code in column 1 of a master table and pulls its Product Name or Price.',
            'Always put `FALSE` (or `0`) at the end of VLOOKUP when you want an Exact Match for an ID or code.'
          ],
          Example: 'Typing a raw material code in cell A2 and having `=VLOOKUP(A2, MasterList!$A$2:$D$500, 2, FALSE)` automatically fill in the Material Name.',
          keyPoint: 'Always use FALSE (or 0) as the fourth argument in VLOOKUP to guarantee an exact match.'
        },
        {
          slideNumber: 2,
          title: 'Conditional Formatting — Instant Visual Alerts',
          subtitle: 'Module 03 • Making Important Data Stand Out Automatically',
          bullets: [
            'Found on the Home Tab → Conditional Formatting.',
            'Automatically colors cells Red, Yellow, or Green based on their numerical value or text.',
            'Highlight Cells Rules: Color any temperature > 5°C in Red, or any word "Expired" in Red.',
            'Data Bars & Color Scales: Adds visual progress bars directly inside cells to compare performance at a glance.'
          ],
          Example: 'Applying a Conditional Formatting rule on an inventory sheet so any item with stock < 50 units automatically turns bright red.',
          keyPoint: 'Conditional Formatting updates cell colors automatically whenever the number inside the cell changes.'
        },
        {
          slideNumber: 3,
          title: 'Pivot Tables — The Most Powerful Feature in Excel',
          subtitle: 'Module 03 • Summarizing Thousands of Rows in Seconds',
          bullets: [
            'A Pivot Table (Insert Tab → PivotTable) summarizes large tables of data without writing a single formula.',
            'Requires clean source data: Every column must have a header title, and there should be no merged cells or blank header columns.',
            'Four drag-and-drop areas: Filters (top filter), Rows (categories on left), Columns (headers across top), and Values (numbers to Sum/Count/Average).',
            'When source data changes, simply right-click the Pivot Table and click "Refresh" to update all numbers.'
          ],
          Example: 'Dragging "Department" into Rows and "Overtime Hours" into Values to see total overtime per department in 5 seconds.',
          keyPoint: 'Remember to right-click and press "Refresh" on a Pivot Table after adding new rows to your raw data sheet.'
        },
        {
          slideNumber: 4,
          title: 'Creating Clear Management Charts & Graphs',
          subtitle: 'Module 03 • Choosing the Right Chart for Your Data',
          bullets: [
            'Column / Bar Chart: Best for comparing values across categories (e.g., Output of Line A vs. Line B vs. Line C).',
            'Line Chart: Best for showing trends over time (e.g., Monthly Net Efficiency % from January to December).',
            'Pie / Doughnut Chart: Best for showing parts of a 100% whole with few categories (e.g., Breakdown of downtime causes).',
            'Always include a clear Chart Title, Axis Labels, and Data Labels so managers can read the chart immediately.'
          ],
          Example: 'Using a Line Chart with a target horizontal line at 85% to display daily OEE efficiency across a 30-day month.',
          keyPoint: 'Use Line Charts for trends over time, Bar/Column Charts for category comparisons, and Pie Charts only for shares of 100%.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 4,
      title: 'Module 04: Microsoft PowerPoint — Designing Impactful Presentations',
      estimatedMinutes: 45,
      learningObjectives: [
        'Apply the 6×6 Rule and high-contrast visual design for clear presentation slides',
        'Use Slide Master to control fonts, colors, and company logos across all slides at once',
        'Use SmartArt, Alignment tools, Presenter View, and professional slide transitions'
      ],
      summary: 'Covers Microsoft PowerPoint best practices, the 6×6 readability rule, Slide Master customization, SmartArt process diagrams, and delivering confident presentations.',
      keyTakeaways: [
        'Slide Master (View → Slide Master) lets you place a company logo or change fonts once and apply it automatically to every slide in the deck.',
        'Good slides use bullet points (6×6 Rule), high contrast text, and SmartArt graphics rather than walls of tiny paragraphs.'
      ],
      practiceScenario: 'You are preparing a 15-slide Training Deck in PowerPoint. Instead of pasting the company logo onto all 15 slides one by one, you open View → Slide Master, paste the logo on the top-right of the master layout, and close Master View—instantly updating the entire presentation.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Golden Rules of Professional Slide Design',
          subtitle: 'Module 04 • Clarity Over Clutter in PowerPoint',
          bullets: [
            'Slides are visual aids for your audience—never paste a full Word document wall of text onto a slide.',
            'Follow the 6×6 Guide: Aim for a maximum of 5 to 6 bullet points per slide, with concise phrases rather than long paragraphs.',
            'Minimum Font Size: Use at least 24–28 pt for slide titles and 18–20 pt for bullet text so people at the back of the room can read easily.',
            'Maintain high color contrast: Dark text on a clean light background, or white text on a dark navy/slate background.'
          ],
          Example: 'Replacing a 120-word paragraph about HACCP steps with a clean 5-step visual SmartArt arrow diagram.',
          keyPoint: 'Never put yellow text on a white background or dark blue text on a black background—contrast is essential for readability.'
        },
        {
          slideNumber: 2,
          title: 'Using Slide Master for Instant Consistency',
          subtitle: 'Module 04 • View Tab → Slide Master',
          bullets: [
            'Slide Master controls the background template, default fonts, bullet styles, footer, and logo for the entire presentation.',
            'Any change made on the top Master Slide automatically updates all slides in your presentation at once.',
            'Prevents logos or titles from "jumping around" to slightly different positions as you click from slide to slide.',
            'Insert Slide Numbers and Date/Footer cleanly via Insert → Header & Footer.'
          ],
          Example: 'Changing the title font from Times New Roman to Arial on the Slide Master updates all 40 slides in 2 seconds.',
          keyPoint: 'Use Slide Master whenever you want to change a logo, color theme, or font across all slides simultaneously.'
        },
        {
          slideNumber: 3,
          title: 'SmartArt, Charts, Animations & Presenter View',
          subtitle: 'Module 04 • Visual Storytelling & Smooth Delivery',
          bullets: [
            'SmartArt (Insert → SmartArt): Converts plain bullet points into professional Process Flows, Hierarchies (Org Charts), and Cycles in one click.',
            'Align & Distribute (Shape Format → Align): Aligns boxes and images perfectly without dragging them by eye.',
            'Keep Animations & Transitions subtle (e.g., simple "Fade" or "Appear"); avoid distracting spinning or bouncing effects in business meetings.',
            'Shortcuts in Slide Show: Press F5 to start from Slide 1, Shift + F5 to start from Current Slide, and B key to black out the screen during discussion.'
          ],
          Example: 'Using Presenter View on a laptop connected to a projector so you can see your speaker notes and upcoming slide while the audience sees only the full slide.',
          keyPoint: 'Press F5 to launch your presentation from the first slide, and Shift + F5 to launch from the current slide.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 5,
      title: 'Module 05: Microsoft Outlook, OneDrive Cloud & Workplace Cybersecurity',
      estimatedMinutes: 45,
      learningObjectives: [
        'Use To, CC, and BCC correctly and write structured professional emails in MS Outlook',
        'Schedule meetings using Calendar Scheduling Assistant and set Automatic Out-of-Office Replies',
        'Collaborate in real-time using OneDrive/SharePoint and recognize phishing threats'
      ],
      summary: 'Covers Microsoft Outlook email etiquette (To/CC/BCC), Inbox Rules, Calendar Meeting Invites, OneDrive cloud collaboration, version history, and document security.',
      keyTakeaways: [
        'TO is for people who must take action; CC keeps stakeholders informed; BCC hides recipient email addresses for privacy.',
        'Storing files on OneDrive/SharePoint enables AutoSave, Version History recovery, and multi-user co-authoring.'
      ],
      practiceScenario: 'You need to schedule a Management Review meeting with 6 department heads. Instead of sending 10 back-and-forth emails asking "when are you free?", you open Outlook Calendar → New Meeting → Scheduling Assistant to see everyone’s free/busy slots at once and send a single calendar invite.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Professional Email Management in Microsoft Outlook',
          subtitle: 'Module 05 • Using TO, CC, BCC & Clear Subject Lines',
          bullets: [
            'TO Field: For the primary person(s) who are directly responsible for replying or taking action.',
            'CC (Carbon Copy): For managers or colleagues who need to stay informed for visibility, but do not need to reply.',
            'BCC (Blind Carbon Copy): Hides recipient addresses from each other—ideal when emailing a large external supplier/client list.',
            'Always write a specific Subject Line (e.g., "[Action Required] Line 2 Monthly Hygiene Audit Report – Oct 2026" instead of just "Report").'
          ],
          Example: 'Putting the Maintenance Manager in "TO" to fix a chiller and putting the Plant Manager in "CC" for awareness.',
          keyPoint: 'Use "Reply All" carefully—only click Reply All if every single person on the thread genuinely needs to read your response.'
        },
        {
          slideNumber: 2,
          title: 'Outlook Calendar, Scheduling Assistant & Inbox Rules',
          subtitle: 'Module 05 • Organizing Your Workday',
          bullets: [
            'Calendar Invites: Include agenda points, meeting room or MS Teams link, and required attachments directly inside the calendar invite.',
            'Scheduling Assistant: Shows side-by-side free/busy calendars of colleagues so you can pick a time when everyone is available.',
            'Automatic Replies (Out of Office): Automatically notifies senders when you are on annual leave and names your backup contact.',
            'Inbox Rules & Flags: Automatically move automated system alerts into dedicated folders and flag important emails for follow-up.'
          ],
          Example: 'Setting an Automatic Out-of-Office reply before going on vacation that directs urgent quality queries to the Deputy QA Manager.',
          keyPoint: 'Scheduling Assistant eliminates back-and-forth emails by showing when all meeting attendees are free.'
        },
        {
          slideNumber: 3,
          title: 'OneDrive, Co-Authoring & Workplace File Security',
          subtitle: 'Module 05 • Modern Cloud Collaboration',
          bullets: [
            'OneDrive & SharePoint store Office files securely in the cloud with automatic backup.',
            'Real-Time Co-Authoring: Multiple team members can edit the same Excel tracker or Word report simultaneously without creating "Final_v2_v3.xlsx" copies.',
            'Version History: Lets you view and restore an earlier version of a file if someone accidentally overwrites data.',
            'Security Best Practice: Password-protect confidential files (File → Info → Protect Document) and never click suspicious links or unknown `.exe`/macro attachments.'
          ],
          Example: 'Using Version History on OneDrive to restore yesterday’s clean version of an inventory sheet after an accidental deletion.',
          keyPoint: 'Cloud Version History protects shared Excel and Word files from accidental overwrites.'
        }
      ],
      sections: [],
      quiz: []
    }
  ]
});

export const ENGLISH_PROFICIENCY_COURSE: InternationalTrainingCourse = normalizeRawSlideCourse({
  id: 'cert-2026-english-proficiency',
  code: 'ENG-PROF',
  title: 'English Language Proficiency Certificate',
  subtitle: 'Professional Business & Technical English — Grammar, SOP Writing, Email Etiquette, Meetings & Presentations',
  category: 'International Certification',
  level: 'Foundation & Intermediate',
  durationHours: 20,
  totalModules: 5,
  examQuestionsCount: 40,
  passingScorePercent: 60,
  certificateTitle: 'Certified Professional in Workplace & Business English Proficiency',
  accreditationStandard: 'CEFR (Common European Framework of Reference for Languages) B2/C1 Workplace Standard',
  targetAudience: ['Managers & Supervisors', 'Quality & Production Engineers', 'Administrative & HR Staff', 'Students & Job Seekers'],
  overview: 'A clear, practical 05-Module slide presentation course designed to build strong workplace English proficiency—covering Grammar & Tenses, Commonly Confused Words, Professional Email Writing, Technical SOP & Audit Report Writing, and Confident Spoken English for Meetings & Interviews.',
  learningOutcomes: [
    'Use accurate English grammar, subject-verb agreement, articles, prepositions, and tenses in the workplace',
    'Avoid common business English errors (Affect vs Effect, Ensure vs Insure, Principal vs Principle)',
    'Write polite, structured, and persuasive business emails and customer responses',
    'Draft clear Standard Operating Procedures (SOPs), incident reports, and non-conformity statements',
    'Speak confidently during management meetings, audit interviews, and professional presentations'
  ],
  modules: [
    {
      moduleNumber: 1,
      title: 'Module 01: Core Workplace English Grammar & Sentence Structure',
      estimatedMinutes: 50,
      learningObjectives: [
        'Apply Subject-Verb Agreement rules accurately with singular, plural, and collective subjects',
        'Choose the correct Verb Tense (Present Simple, Past Simple, Present Perfect) for workplace reporting',
        'Use Articles (a, an, the) and Prepositions of Time and Place (at, on, in, by) correctly'
      ],
      summary: 'Covers essential workplace English grammar: Subject-Verb Agreement, Present Simple vs Past Simple vs Present Perfect tenses, Articles (a/an/the), and Prepositions.',
      keyTakeaways: [
        'Singular subjects take singular verbs ("The batch requires testing"), while words like "Each", "Everyone", and "Equipment" always take a singular verb.',
        'Use Past Simple for completed actions at a stated past time ("We calibrated the scale yesterday") and Present Perfect for actions with current relevance ("We have completed the audit").'
      ],
      practiceScenario: 'When writing an audit summary, you choose between "Each of the operators have signed" and "Each of the operators has signed". Because "Each" is grammatically singular, you write: "Each of the operators has signed the training record."',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Parts of Speech & Clear Sentence Structure',
          subtitle: 'Module 01 • Building Strong Professional Sentences',
          bullets: [
            'Every complete English sentence requires a Subject (who/what performs the action) and a Verb (the action or state).',
            'Keep workplace sentences clear and direct: Subject + Verb + Object (e.g., "The QA team inspected the raw materials.").',
            'Adjectives describe nouns ("a calibrated thermometer"); Adverbs describe verbs or adjectives ("measured accurately").',
            'Avoid run-on sentences: break long, confusing 40-word chains into two clear 15-word sentences.'
          ],
          Example: 'Correct: "The technician repaired the pump quickly." (Adverb "quickly" describes the verb "repaired").',
          keyPoint: 'Clear professional English favors short, direct sentences (15–20 words) over overly complicated sentences.'
        },
        {
          slideNumber: 2,
          title: 'Subject-Verb Agreement Golden Rules',
          subtitle: 'Module 01 • Avoiding the #1 Workplace Grammar Error',
          bullets: [
            'Singular subject takes a singular verb (ends in -s in present tense): "The supervisor checks the log every hour."',
            'Plural subject takes a plural verb: "The supervisors check the logs every hour."',
            'Words like Each, Every, Everyone, Anybody, Nobody, and One are ALWAYS Singular (e.g., "Everyone in the plant wears safety shoes.").',
            'Uncountable nouns like Information, Equipment, Furniture, Advice, and Feedback are ALWAYS Singular (never say "equipments" or "informations").'
          ],
          Example: 'Correct: "All laboratory equipment IS calibrated monthly." (Incorrect: "All equipments ARE calibrated").',
          keyPoint: 'Words like "Equipment", "Information", and "Training" are uncountable in English—never add an "-s" to them and always use a singular verb.'
        },
        {
          slideNumber: 3,
          title: 'Mastering Workplace Verb Tenses',
          subtitle: 'Module 01 • Present, Past & Present Perfect',
          bullets: [
            'Present Simple: Used for permanent facts, routines, and SOP policies (e.g., "The pasteurizer operates at 72°C.").',
            'Past Simple: Used for finished events at a specific time in the past—yesterday, last week, at 10:00 AM (e.g., "Line 2 stopped at 14:30 yesterday.").',
            'Present Perfect (has/have + past participle): Used for recent actions affecting the present or when no specific past time is stated (e.g., "We have updated the HACCP plan.").',
            'Never use "did" with a past-tense verb: Say "Did you check the batch?" (NOT "Did you checked the batch?").'
          ],
          Example: 'After "did / didn’t", always use the base verb: "The supplier did not send the certificate" (NOT "did not sent").',
          keyPoint: 'After the helper word "Did" or "Didn’t", always keep the main verb in its base present form (Did you go? / It did not work).'
        },
        {
          slideNumber: 4,
          title: 'Articles (A, An, The) & Prepositions (In, On, At, By)',
          subtitle: 'Module 01 • Precision in Daily Communication',
          bullets: [
            'Use "A" before consonant sounds ("a factory", "a university" — sounds like "yoo"); use "An" before vowel sounds ("an audit", "an hour" — silent h).',
            'Use "The" when referring to a specific item both speaker and listener know ("Please sign the audit report on your desk.").',
            'Prepositions of Time: AT for exact clock times ("at 9:00 AM"), ON for days and dates ("on Monday", "on 15th May"), IN for months/years ("in July", "in 2026").',
            'Use "BY" for deadlines ("Please submit the report by Friday 5:00 PM" = no later than Friday).'
          ],
          Example: '"An SOP" (because the letter S is pronounced "ess", starting with a vowel sound) vs. "A standard" (starts with consonant sound "st").',
          keyPoint: 'Choose "A" or "An" based on the starting SOUND of the word, not just the first letter ("an hour", "an SOP", "a uniform").'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 2,
      title: 'Module 02: Business Vocabulary, Tone & Commonly Confused Words',
      estimatedMinutes: 45,
      learningObjectives: [
        'Distinguish between commonly confused English words (Affect/Effect, Ensure/Insure, Accept/Except)',
        'Convert informal or blunt phrasing into polite, professional business English',
        'Use professional action verbs and connectors (However, Therefore, Furthermore)'
      ],
      summary: 'Explains commonly confused words in business writing, upgrading casual phrasing to formal workplace tone, and using transition words for logical flow.',
      keyTakeaways: [
        '"Affect" is usually a Verb (to influence), while "Effect" is usually a Noun (the result/impact).',
        '"Ensure" means to make certain that something happens; "Insure" refers to financial insurance policies; "Assure" means to remove someone’s doubt.'
      ],
      practiceScenario: 'Instead of writing a blunt email saying "You forgot to send the COA, send it now", you use polite business tone: "Could you please share the Certificate of Analysis (COA) for Batch #402 at your earliest convenience so we can release the shipment?"',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Commonly Confused Words in Business English (Part 1)',
          subtitle: 'Module 02 • Choosing the Right Word Every Time',
          bullets: [
            'Affect vs. Effect: Affect = Verb meaning to influence ("High humidity affected the powder."). Effect = Noun meaning the result ("The change had a positive effect.").',
            'Ensure vs. Assure vs. Insure: Ensure = make certain ("Ensure the valve is closed."). Assure = promise a person ("I assure you we will deliver."). Insure = buy an insurance policy.',
            'Accept vs. Except: Accept = receive/agree ("We accept the proposal."). Except = excluding ("All lines are running except Line 3.").',
            'Advice (Noun) vs. Advise (Verb): "Thank you for your advice" vs. "Please advise us on the delivery date."'
          ],
          Example: '"Temperature fluctuations can AFFECT shelf life, and the EFFECT on quality is significant."',
          keyPoint: 'Memory trick for Affect vs. Effect: RAVEN — Remember Affect is a Verb, Effect is a Noun.'
        },
        {
          slideNumber: 2,
          title: 'Commonly Confused Words in Business English (Part 2)',
          subtitle: 'Module 02 • Precision in Reports & Emails',
          bullets: [
            'Principal vs. Principle: Principal = main/head or financial sum ("The principal root cause"). Principle = fundamental rule ("The 7 HACCP principles").',
            'Compliment vs. Complement: Compliment = praise ("The auditor complimented the hygiene team."). Complement = go well together ("These two skills complement each other.").',
            'Stationery vs. Stationary: Stationery = office paper/pens (e for envelope). Stationary = not moving ("Wait until the blade is completely stationary.").',
            'Lose (Verb) vs. Loose (Adjective): "Do not lose the calibration key" vs. "Tighten the loose conveyor belt."'
          ],
          Example: '"Never reach into a machine until all moving parts are completely STATIONARY."',
          keyPoint: 'StationEry with an "E" means Envelopes and pens; StationAry with an "A" means standing still (Parked).'
        },
        {
          slideNumber: 3,
          title: 'Upgrading Informal Words to Professional Workplace Tone',
          subtitle: 'Module 02 • Diplomatic & Courteous Phrasing',
          bullets: [
            'Instead of "I want you to send..." → Write: "Could you please provide..." or "We would appreciate it if you could share..."',
            'Instead of "You made a mistake in the invoice" → Write: "There appears to be a discrepancy in Invoice #104."',
            'Instead of "We can’t do this by Monday" → Write: "To ensure thorough testing, we will be able to deliver the results by Wednesday."',
            'Use connecting words: Therefore / Consequently (result), However / Nevertheless (contrast), Furthermore / In addition (adding points).'
          ],
          Example: 'Focusing on the issue rather than blaming the person ("The attachment appears to be missing" instead of "You forgot the attachment").',
          keyPoint: 'Polite modal verbs ("Could you please...", "Would it be possible to...") build respect and get faster cooperation.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 3,
      title: 'Module 03: Professional Email Writing & Business Correspondence',
      estimatedMinutes: 45,
      learningObjectives: [
        'Structure a professional business email using the 5-part international template',
        'Write clear Subject Lines, Openings, Action Requests, and Sign-offs',
        'Write professional apologies, customer complaint responses, and follow-up emails'
      ],
      summary: 'Teaches the 5-part structure of high-impact business emails, professional greetings and closings, attachment mentions, and responding to customer complaints.',
      keyTakeaways: [
        'Every professional email follows 5 steps: 1) Clear Subject Line, 2) Formal Salutation, 3) Purpose / Context, 4) Specific Action / Deadline, 5) Professional Sign-off.',
        'When matching greetings to closings: "Dear Mr. Khan" pairs with "Sincerely / Best regards"; "Dear Sir or Madam" pairs with "Yours faithfully".'
      ],
      practiceScenario: 'A customer writes to complain about a delayed delivery. You reply using the LAST model: Listen/Acknowledge, Apologize professionally ("We sincerely apologize for the delay"), Solve (state the new confirmed tracking time), and Thank ("Thank you for your patience and continued partnership").',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'The 5-Part Structure of a Professional Email',
          subtitle: 'Module 03 • Writing Emails That Get Read and Answered',
          bullets: [
            '1. Subject Line: Summarize the topic + action required in 5–8 words (e.g., "Approval Request: Q3 Packaging Supplier Audit Schedule").',
            '2. Salutation / Greeting: "Dear Mr. Ahmed," or "Dear Quality Team," or "Hello Sarah,".',
            '3. Opening Sentence: State the purpose immediately ("I am writing to share the results of yesterday’s mock recall exercise.").',
            '4. Body & Call to Action: Use bullet points for key details and state clearly who needs to do what by when.',
            '5. Closing & Signature: "Best regards," / "Kind regards," followed by your full name, job title, and phone number.'
          ],
          Example: 'Putting key questions in a numbered or bulleted list inside the email so the reader answers all three questions instead of just the first one.',
          keyPoint: 'Always put your main purpose in the very first sentence of the email so busy managers understand the message immediately.'
        },
        {
          slideNumber: 2,
          title: 'Useful Phrases for Every Workplace Email',
          subtitle: 'Module 03 • Ready-to-Use Professional Templates',
          bullets: [
            'Referring to Previous Contact: "Further to our telephone conversation this morning..." / "Thank you for your email regarding..."',
            'Mentioning Attachments: "Please find attached the updated production schedule." (Tip: Attach the file BEFORE typing the email so you never forget!).',
            'Making a Polite Request: "Could you please confirm whether the batch has been released by 3:00 PM today?"',
            'Offering Assistance: "Please let me know if you require any further information." / "Please feel free to reach out if you have any questions."'
          ],
          Example: 'Using "Please find attached the monthly KPI report in PDF format" and verifying the attachment is uploaded before clicking Send.',
          keyPoint: 'Avoid outdated, overly stiff phrases like "Please be advised that herewith I attach"—use natural, modern business English.'
        },
        {
          slideNumber: 3,
          title: 'Handling Complaints & Delicate Situations by Email',
          subtitle: 'Module 03 • Turning Problems into Trust',
          bullets: [
            'Never reply in anger or use ALL CAPS (which reads like shouting).',
            'Step 1 — Acknowledge & Thank: "Thank you for bringing this matter to our attention."',
            'Step 2 — Apologize Professionally: "We sincerely apologize for the inconvenience caused by..."',
            'Step 3 — Explain & Resolve: State the root cause briefly and explain the concrete action taken to resolve the issue.'
          ],
          Example: '"We sincerely apologize for the damaged outer cartons in Delivery #882. Replacement cartons have been dispatched via express courier and will arrive by 10:00 AM tomorrow."',
          keyPoint: 'Say "We apologize for the inconvenience" rather than casual excuses—customers value accountability and a concrete solution.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 4,
      title: 'Module 04: Technical Writing — SOPs, Audit Non-Conformities & Incident Reports',
      estimatedMinutes: 50,
      learningObjectives: [
        'Use Imperative Action Verbs (Measure, Verify, Record) when writing Standard Operating Procedures',
        'Choose Appropriately between Active Voice (SOPs/actions) and Passive Voice (laboratory/process descriptions)',
        'Write objective, fact-based Audit Non-Conformity statements and Incident Reports'
      ],
      summary: 'Covers technical English for manufacturing, quality, and operations: writing step-by-step SOPs in imperative active voice, using passive voice in lab reports, and writing objective audit findings.',
      keyTakeaways: [
        'SOP steps should start with a strong Imperative Action Verb ("Calibrate the pH meter", "Record the temperature") so instructions are 100% clear.',
        'Technical and audit reports must be Objective and Fact-Based (stating exact times, measurements, and batch numbers) rather than emotional opinions.'
      ],
      practiceScenario: 'During an internal audit, instead of writing a vague opinion like "The warehouse was very messy and workers were careless", you write an objective non-conformity statement: "During the warehouse inspection on 12 Oct at 10:15 AM, 4 pallets of raw sugar (Lot #S-109) were observed stored directly against the north wall with zero floor clearance, contrary to SOP-WH-04."',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Writing Clear Standard Operating Procedures (SOPs)',
          subtitle: 'Module 04 • Using Imperative Action Verbs',
          bullets: [
            'An SOP must tell the operator exactly what to do, step by step, with zero ambiguity.',
            'Start every procedural step with a direct Action Verb (Imperative mood): "Wear", "Inspect", "Weigh", "Heat", "Verify", "Record".',
            'Avoid vague words like "properly", "sufficiently", "a little bit", or "warm"—always state the exact number and unit.',
            'Write one action per step so operators can follow the sequence easily on the shop floor.'
          ],
          Example: 'Weak SOP: "Heat the milk until it is hot enough." → Strong SOP: "Heat the milk to 72°C (±0.5°C) and hold for 15 seconds."',
          keyPoint: 'Replace vague adjectives ("hot", "clean", "fast") with measurable specifications ("75°C", "<100 RLU", "60 packs/min").'
        },
        {
          slideNumber: 2,
          title: 'Active Voice vs. Passive Voice in Workplace Writing',
          subtitle: 'Module 04 • When to Use Each Style',
          bullets: [
            'Active Voice (Subject performs the action): "The QA Technician tests three samples every hour." → Best for SOPs, action plans, and emails because it clearly shows WHO is responsible.',
            'Passive Voice (Object receives the action: be + past participle): "Three samples are tested every hour." → Useful in laboratory methods or process descriptions where the process itself is the focus.',
            'Danger of overusing Passive Voice in action plans: "Corrective action will be taken" hides WHO will take the action!',
            'In CAPA and meeting minutes, always use Active Voice with a named owner: "The Maintenance Lead will replace the valve by Friday."'
          ],
          Example: 'CAPA Action: "Mr. Bilal (Engineering) will install the stainless-steel mesh guard by 18 November." (Clear owner + clear deadline).',
          keyPoint: 'Always use Active Voice in Action Plans and CAPA logs so responsibility is unmistakably assigned to a specific person.'
        },
        {
          slideNumber: 3,
          title: 'Writing Objective Audit Findings & Incident Reports',
          subtitle: 'Module 04 • Facts, Evidence & Neutral Language',
          bullets: [
            'Technical and audit writing must be 100% objective, factual, and verifiable—never emotional, exaggerated, or personal.',
            'Use the 3-Part Audit Non-Conformity Formula: 1) Requirement (What the standard/SOP says), 2) Failure (What was deficient), 3) Objective Evidence (Exact date, location, batch/equipment ID observed).',
            'Avoid judgmental words like "terrible", "lazy", "obviously", or "always fails".',
            'State exact observations: "At 11:20 AM in Chiller #2, the digital display read 9.4°C against the critical limit of ≤4.0°C."'
          ],
          Example: 'Objective Incident Report: "At 09:05 AM on 4 Nov, a 20 L container of sanitizer tipped off Pallet #4 in Bay B, spilling approximately 3 L onto the floor."',
          keyPoint: 'If a statement cannot be proven with a measurement, document, or timestamped observation, it is an opinion—keep audit reports strictly factual.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 5,
      title: 'Module 05: Spoken English — Meetings, Presentations, Audits & Interviews',
      estimatedMinutes: 45,
      learningObjectives: [
        'Use professional English phrases to open, lead, agree, politely disagree, and summarize meetings',
        'Structure a clear oral presentation using Signposting Language (Introduction, Transitions, Conclusion)',
        'Answer auditor and interview questions confidently using the STAR method (Situation, Task, Action, Result)'
      ],
      summary: 'Covers spoken workplace English for participating in management meetings, delivering presentations with signposting phrases, answering external auditor questions, and using the STAR method in interviews.',
      keyTakeaways: [
        'Signposting phrases ("First, let’s look at...", "Moving on to...", "To summarize...") guide listeners smoothly through a presentation.',
        'The STAR Method (Situation, Task, Action, Result) provides a structured, confident way to answer competency and audit questions.'
      ],
      practiceScenario: 'During a certification audit, the auditor asks how you handled a past customer complaint. Using the STAR method, you calmly explain the Situation (foreign body complaint in Q1), Task (find root cause within 24h), Action (inspected sieves and installed a finer 1mm mesh screen), and Result (zero complaints over the next 9 months).',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Professional Phrases for Business Meetings',
          subtitle: 'Module 05 • Participating Confidently in Discussions',
          bullets: [
            'Opening a Meeting: "Good morning everyone, thank you for joining. Let’s go over today’s agenda."',
            'Giving an Opinion: "From a food safety perspective, I believe we should..." / "In my experience, the most effective approach is..."',
            'Agreeing & Politely Disagreeing: "I completely agree with Sarah’s point." / "I see your point; however, have we considered the impact on line speed?"',
            'Clarifying & Summarizing: "Could you clarify what you mean by...?" / "Before we close, let’s summarize the key action items."'
          ],
          Example: 'Using "I understand your perspective, however..." instead of saying "No, you are wrong" keeps management meetings constructive and respectful.',
          keyPoint: 'Polite disagreement ("I see your point; however...") shows leadership maturity and keeps team discussions collaborative.'
        },
        {
          slideNumber: 2,
          title: 'Delivering Presentations with "Signposting" Language',
          subtitle: 'Module 05 • Guiding Your Audience Smoothly',
          bullets: [
            'Introduction: "Good morning. Today I will present our Q3 Production Efficiency results in three brief parts."',
            'Transitioning Between Slides: "Moving on to the next slide..." / "Now let’s turn our attention to..." / "This chart illustrates..."',
            'Highlighting Key Data: "As you can see from this graph, net efficiency increased by 6.5% in October."',
            'Concluding & Q&A: "To summarize our three main takeaways..." / "Thank you for your attention. I would be happy to answer any questions."'
          ],
          Example: 'If someone asks a difficult question during Q&A, start with: "That’s an important question. Based on our current data..."',
          keyPoint: 'Signposting phrases act like road signs for your listeners so they always know where you are in your presentation.'
        },
        {
          slideNumber: 3,
          title: 'The STAR Method for Interviews & Audit Questions',
          subtitle: 'Module 05 • Giving Structured, High-Impact Spoken Answers',
          bullets: [
            'S — SITUATION: Briefly set the context (When and where did it happen? What was the challenge?).',
            'T — TASK: Explain what your specific responsibility or goal was.',
            'A — ACTION: Describe the specific steps YOU and your team took to solve the problem.',
            'R — RESULT: Share the measurable positive outcome (numbers, %, audit pass, cost saved, or zero recurrence).'
          ],
          Example: 'Answering "Tell me about a time you improved a process" by ending with the Result: "...which reduced batch changeover time from 45 minutes down to 22 minutes."',
          keyPoint: 'Always finish a STAR answer with a measurable Result—numbers and outcomes make your spoken English memorable and credible.'
        }
      ],
      sections: [],
      quiz: []
    }
  ]
});

export const OFFICE_AND_ENGLISH_COURSES: InternationalTrainingCourse[] = [
  MICROSOFT_OFFICE_INTRO_COURSE,
  ENGLISH_PROFICIENCY_COURSE
];

export const OFFICE_AND_ENGLISH_HUB_TRAININGS: HubTraining[] = OFFICE_AND_ENGLISH_COURSES.map(buildHubTrainingFromCourse);
