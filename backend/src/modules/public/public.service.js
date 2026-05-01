/**
 * Public-facing static data service for Turki Platform.
 * Returns portfolio content: projects, cyber labs, and skills.
 */

/**
 * Return the list of portfolio projects.
 * @returns {Array<Object>}
 */
export function getProjects() {
  return [
    {
      id: 'proj-001',
      title: 'Personal SIEM Dashboard',
      description:
        'A real-time security monitoring system built from scratch. Aggregates and visualizes security events, tracks login attempts, detects sensitive path scans, and provides a live threat intelligence dashboard.',
      tags: ['Security', 'Node.js', 'React', 'PostgreSQL', 'SIEM'],
      status: 'active',
    },
    {
      id: 'proj-002',
      title: 'AI Job Intelligence Dashboard',
      description:
        'An AI-powered career intelligence tool that analyzes job market trends, matches skill profiles to opportunities, and generates actionable insights using machine learning models.',
      tags: ['AI', 'Python', 'React', 'Data Analysis', 'NLP'],
      status: 'in-progress',
    },
    {
      id: 'proj-003',
      title: 'MoE Performance Dashboard Concept',
      description:
        'A conceptual analytics dashboard for the Ministry of Education, designed to surface performance metrics, visualize KPIs across districts, and support data-driven decision-making.',
      tags: ['Data Visualization', 'React', 'Analytics', 'Government'],
      status: 'concept',
    },
    {
      id: 'proj-004',
      title: 'Security Analyst Console',
      description:
        'An integrated analyst workflow tool that streamlines incident investigation, evidence collection, and reporting for security operations center (SOC) analysts.',
      tags: ['Security', 'SOC', 'React', 'Incident Response'],
      status: 'in-progress',
    },
    {
      id: 'proj-005',
      title: 'Turki Map',
      description:
        'A custom interactive mapping project built with open geospatial technologies. Features custom tile layers, location clustering, and geofencing capabilities.',
      tags: ['GIS', 'React', 'Mapping', 'JavaScript'],
      status: 'completed',
    },
  ];
}

/**
 * Return the list of cyber lab exercises.
 * @returns {Array<Object>}
 */
export function getCyberLabs() {
  return [
    {
      id: 'lab-001',
      title: 'Failed Login Detection',
      description:
        'Detect and alert on brute-force and credential-stuffing attempts by monitoring failed authentication events, correlating by IP address, and triggering alerts on threshold breaches.',
      category: 'Threat Detection',
      difficulty: 'beginner',
    },
    {
      id: 'lab-002',
      title: 'Sensitive Path Scanning',
      description:
        'Identify automated vulnerability scanners and curious attackers by detecting requests to known sensitive paths such as /.env, /wp-admin, and /phpmyadmin.',
      category: 'Reconnaissance Detection',
      difficulty: 'beginner',
    },
    {
      id: 'lab-003',
      title: 'Rate-Limit Alerts',
      description:
        'Implement and monitor adaptive rate limiting to detect abusive request patterns. Correlate rate-limit triggers with other signals to identify coordinated attacks.',
      category: 'Abuse Prevention',
      difficulty: 'intermediate',
    },
    {
      id: 'lab-004',
      title: 'Suspicious IP Analysis',
      description:
        'Analyze IP reputation, geolocation anomalies, and behavioral patterns to surface suspicious actors in the security event log.',
      category: 'Threat Intelligence',
      difficulty: 'intermediate',
    },
    {
      id: 'lab-005',
      title: 'Security Headers Review',
      description:
        'Audit HTTP response headers using tools like Mozilla Observatory. Implement and verify CSP, HSTS, X-Frame-Options, and other defensive headers.',
      category: 'Hardening',
      difficulty: 'beginner',
    },
    {
      id: 'lab-006',
      title: 'CSP Violation Logging',
      description:
        'Configure a Content Security Policy with report-only mode, collect violation reports, and analyze them to harden the policy against XSS and data injection attacks.',
      category: 'Web Security',
      difficulty: 'advanced',
    },
  ];
}

/**
 * Return the grouped skills object.
 * @returns {Object}
 */
export function getSkills() {
  return {
    security: {
      label: 'Security',
      skills: [
        'SIEM',
        'Threat Detection',
        'Incident Response',
        'Security Headers',
        'OWASP',
        'Log Analysis',
      ],
    },
    development: {
      label: 'Development',
      skills: [
        'React',
        'Node.js',
        'PostgreSQL',
        'Python',
        'REST APIs',
        'Tailwind CSS',
      ],
    },
    tools: {
      label: 'Tools',
      skills: [
        'Wireshark',
        'Burp Suite',
        'Nmap',
        'Git',
        'Linux',
        'Docker',
      ],
    },
  };
}
