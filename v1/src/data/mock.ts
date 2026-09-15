import type {
  ExtractionField,
  ExtractionRecord,
  Paper,
  Project,
  QaQuestion,
  ReportBucket,
} from '../types'

export const currentUser = {
  name: 'Alice Santos',
  role: 'Reviewer',
}

export const projects: Project[] = [
  {
    id: 'p1',
    title: 'Machine Learning for Requirements Engineering',
    description:
      'Systematic review on the application of ML techniques to automate requirements elicitation and analysis.',
    role: 'Owner',
    papersTotal: 342,
    papersProcessed: 214,
  },
  {
    id: 'p2',
    title: 'Technical Debt in Microservices',
    description:
      'Mapping study investigating how technical debt is identified and managed in microservices architectures.',
    role: 'Reviewer',
    papersTotal: 187,
    papersProcessed: 187,
  },
  {
    id: 'p3',
    title: 'Accessibility in Mobile Applications',
    description:
      'Review of evaluation methods and guidelines for accessibility in native and hybrid mobile apps.',
    role: 'Reviewer',
    papersTotal: 96,
    papersProcessed: 40,
  },
]

export const activeProject = projects[0]

export const inclusionCriteriaOptions = [
  'IC1 - Presents an ML technique applied to RE',
  'IC2 - Reports empirical evaluation',
  'IC3 - Published in the last 10 years',
]

export const exclusionCriteriaOptions = [
  'EC1 - Not written in English',
  'EC2 - Short paper (less than 4 pages)',
  'EC3 - Duplicate of an already included study',
  'EC4 - Secondary study (survey/review)',
]

export const papers: Paper[] = [
  {
    id: 'pap-1001',
    title: 'Deep Learning Approaches for Automated Requirements Classification',
    authors: 'J. Almeida, R. Costa, T. Nakamura',
    year: 2023,
    venue: 'IEEE Transactions on Software Engineering',
    abstract:
      'This paper proposes a deep learning pipeline to automatically classify functional and non-functional requirements extracted from natural language documents, achieving 91% F1-score across three industrial datasets.',
    status: 'pending',
    inclusionCriteria: [],
    exclusionCriteria: [],
    note: '',
    qaScore: null,
    qaAnswers: {},
  },
  {
    id: 'pap-1002',
    title: 'A Survey of NLP Techniques in Requirements Engineering',
    authors: 'M. Ferreira, L. Oliveira',
    year: 2021,
    venue: 'Requirements Engineering Journal',
    abstract:
      'We survey existing natural language processing techniques used in requirements engineering, covering extraction, classification, and ambiguity detection.',
    status: 'excluded',
    inclusionCriteria: [],
    exclusionCriteria: ['EC4 - Secondary study (survey/review)'],
    note: 'Secondary study, does not report new empirical results.',
    qaScore: null,
    qaAnswers: {},
  },
  {
    id: 'pap-1003',
    title: 'Requirement Prioritization Using Reinforcement Learning',
    authors: 'S. Barros, D. Lima, P. Souza',
    year: 2022,
    venue: 'ACM International Conference on Software Engineering',
    abstract:
      'A reinforcement learning agent is trained to prioritize backlog items based on stakeholder feedback, reducing manual prioritization effort by 40%.',
    status: 'included',
    inclusionCriteria: ['IC1 - Presents an ML technique applied to RE', 'IC2 - Reports empirical evaluation'],
    exclusionCriteria: [],
    note: 'Strong empirical evaluation across two case studies.',
    qaScore: 0.85,
    qaAnswers: { q1: 'Yes', q2: 'Yes', q3: 'Partial', q4: 'Yes' },
  },
  {
    id: 'pap-1004',
    title: 'On the Use of Transformers for Ambiguity Detection in User Stories',
    authors: 'K. Weber, A. Martins',
    year: 2024,
    venue: 'Empirical Software Engineering',
    abstract:
      'We fine-tune a transformer-based model to detect ambiguous terms in agile user stories, comparing performance against rule-based baselines.',
    status: 'conflict',
    inclusionCriteria: ['IC1 - Presents an ML technique applied to RE'],
    exclusionCriteria: ['EC2 - Short paper (less than 4 pages)'],
    note: 'Reviewers disagree on page-count exclusion criterion.',
    qaScore: 0.6,
    qaAnswers: { q1: 'Yes', q2: 'Partial', q3: 'No', q4: 'Partial' },
  },
  {
    id: 'pap-1005',
    title: 'Automated Traceability Link Recovery with Graph Neural Networks',
    authors: 'F. Rocha, N. Andrade',
    year: 2023,
    venue: 'Journal of Systems and Software',
    abstract:
      'This work models requirements and source code as a heterogeneous graph and applies GNNs to recover traceability links with higher recall than IR-based methods.',
    status: 'included',
    inclusionCriteria: ['IC1 - Presents an ML technique applied to RE', 'IC2 - Reports empirical evaluation', 'IC3 - Published in the last 10 years'],
    exclusionCriteria: [],
    note: '',
    qaScore: 0.92,
    qaAnswers: { q1: 'Yes', q2: 'Yes', q3: 'Yes', q4: 'Yes' },
  },
  {
    id: 'pap-1006',
    title: 'Requirements Elicitation Chatbots: A Preliminary Study',
    authors: 'V. Cardoso',
    year: 2020,
    venue: 'Workshop on Natural Language Processing for RE',
    abstract:
      'A short paper describing an early prototype of a chatbot to assist stakeholders during requirements elicitation sessions.',
    status: 'pending',
    inclusionCriteria: [],
    exclusionCriteria: [],
    note: '',
    qaScore: null,
    qaAnswers: {},
  },
]

export const screeningProgress = {
  done: papers.filter((p) => p.status !== 'pending').length,
  total: papers.length,
}

export const qaQuestions: QaQuestion[] = [
  { id: 'q1', text: 'Is the research method clearly described?', options: ['Yes', 'Partial', 'No'] },
  { id: 'q2', text: 'Is the study context/setting reported?', options: ['Yes', 'Partial', 'No'] },
  { id: 'q3', text: 'Are the results validated against a baseline?', options: ['Yes', 'Partial', 'No'] },
  { id: 'q4', text: 'Are threats to validity discussed?', options: ['Yes', 'Partial', 'No'] },
]

export const qaCutoffScore = 0.7

export const extractionFields: ExtractionField[] = [
  { id: 'ef1', label: 'Research type', type: 'select', options: ['Case study', 'Experiment', 'Survey', 'Proposal'] },
  { id: 'ef2', label: 'ML technique(s) used', type: 'multiselect', options: ['Deep Learning', 'Reinforcement Learning', 'NLP', 'Graph-based', 'Classical ML'] },
  { id: 'ef3', label: 'Dataset name', type: 'text' },
  { id: 'ef4', label: 'Publication date', type: 'date' },
  { id: 'ef5', label: 'Summary of contribution', type: 'textarea' },
  { id: 'ef6', label: 'Replication package available', type: 'checkbox' },
]

export const extractionRecords: ExtractionRecord[] = [
  {
    paperId: 'pap-1003',
    paperTitle: 'Requirement Prioritization Using Reinforcement Learning',
    values: {
      ef1: 'Experiment',
      ef2: 'Reinforcement Learning',
      ef3: 'Internal industrial backlog (n=1,204 items)',
      ef4: '2022-08-15',
      ef5: 'RL agent reduces manual prioritization effort by 40%.',
      ef6: 'true',
    },
  },
  {
    paperId: 'pap-1005',
    paperTitle: 'Automated Traceability Link Recovery with Graph Neural Networks',
    values: {
      ef1: 'Case study',
      ef2: 'Graph-based',
      ef3: 'iTrust, SMOS, eTour',
      ef4: '2023-02-02',
      ef5: 'GNN-based traceability recovery outperforms IR baselines by 12pp recall.',
      ef6: 'true',
    },
  },
]

export const screeningReport: ReportBucket[] = [
  { label: 'Included', count: papers.filter((p) => p.status === 'included').length, colorToken: 'teal' },
  { label: 'Excluded', count: papers.filter((p) => p.status === 'excluded').length, colorToken: 'red' },
  { label: 'Conflict', count: papers.filter((p) => p.status === 'conflict').length, colorToken: 'orange' },
  { label: 'Pending', count: papers.filter((p) => p.status === 'pending').length, colorToken: 'blue' },
]

export const qaReport: ReportBucket[] = [
  { label: 'High quality (>=0.7)', count: papers.filter((p) => (p.qaScore ?? 0) >= qaCutoffScore).length, colorToken: 'teal' },
  { label: 'Low quality (<0.7)', count: papers.filter((p) => p.qaScore !== null && p.qaScore < qaCutoffScore).length, colorToken: 'red' },
  { label: 'Not assessed', count: papers.filter((p) => p.qaScore === null).length, colorToken: 'blue' },
]

export const extractionReport: ReportBucket[] = [
  { label: 'Deep Learning', count: 1, colorToken: 'purple' },
  { label: 'Reinforcement Learning', count: 1, colorToken: 'teal' },
  { label: 'Graph-based', count: 1, colorToken: 'blue' },
  { label: 'NLP', count: 0, colorToken: 'orange' },
]

export const exclusionCriteriaStats: ReportBucket[] = [
  { label: 'EC1 - Not in English', count: 0, colorToken: 'red' },
  { label: 'EC2 - Short paper', count: 1, colorToken: 'orange' },
  { label: 'EC3 - Duplicate', count: 0, colorToken: 'blue' },
  { label: 'EC4 - Secondary study', count: 1, colorToken: 'purple' },
]
