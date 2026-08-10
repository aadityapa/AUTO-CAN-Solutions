// Legal page content. Written to match how this website actually behaves:
// a static marketing site with a contact form relayed via FormSubmit,
// Google Fonts loaded from Google's CDN, and no analytics/ad trackers.
// Review with AUTO-CAN's legal counsel before relying on this content.

export const legalMeta = {
  updated: '20 July 2026',
  reviewNote:
    'This document reflects how this website currently operates. It is provided for information and does not constitute legal advice.',
}

export const privacySections = [
  { id: 'introduction', title: 'Introduction', body: [
    'AUTO-CAN Solutions (“we”, “us”, “our”) respects your privacy. This policy explains what information this website collects, how it is used, and the choices you have.',
    'This website is an informational site describing our automotive engineering and embedded software services. It does not require an account and does not sell products online.',
  ]},
  { id: 'information-we-collect', title: 'Information We Collect', body: [
    'The only personal information this website collects is what you choose to submit through the contact form:',
  ], list: [
    'Your name',
    'Your company or organisation (optional)',
    'Your work email address',
    'The area you are interested in',
    'The message you write about your programme',
  ], after: [
    'We do not run user accounts, payments, or profiling on this website.',
  ]},
  { id: 'how-information-is-used', title: 'How Information Is Used', body: [
    'Information submitted through the contact form is used solely to respond to your enquiry and to discuss potential engagement with our services. We do not use it for automated decision-making and we do not sell it to third parties.',
  ]},
  { id: 'cookies', title: 'Cookies & Similar Technologies', body: [
    'This website does not set its own tracking or advertising cookies. Essential browser storage may be used by your browser as part of normal page operation. Third-party services referenced below may receive standard technical data (such as your IP address) when their resources load.',
  ]},
  { id: 'third-party-services', title: 'Third-Party Services', body: [
    'The website relies on a small number of third-party services to function:',
  ], list: [
    'Form delivery — contact form submissions are relayed to our mailbox via FormSubmit (formsubmit.co). Your submitted details pass through this service.',
    'Fonts — typefaces are served by Google Fonts (fonts.googleapis.com / fonts.gstatic.com). Loading fonts discloses standard request data such as your IP address to Google.',
    'Hosting — the website is hosted on Vercel, which may keep standard server logs (IP address, browser type, pages requested) for security and operations.',
  ], after: [
    'Each of these providers processes data under its own privacy policy.',
  ]},
  { id: 'analytics', title: 'Analytics', body: [
    'This website does not currently include analytics or advertising trackers. If analytics are added in the future, this policy will be updated first.',
  ]},
  { id: 'data-retention', title: 'Data Retention', body: [
    'Contact enquiries are kept for as long as needed to handle your enquiry and any resulting business relationship, after which they are deleted or archived in line with our internal practice.',
  ]},
  { id: 'data-security', title: 'Data Security', body: [
    'The website is intended to be served over HTTPS, and form submissions are transmitted over encrypted connections. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.',
  ]},
  { id: 'your-rights', title: 'Your Rights', body: [
    'You may ask us to access, correct, or delete the personal information you have submitted to us. To make a request, contact us at info@auto-can.in. Applicable statutory rights depend on your jurisdiction.',
  ]},
  { id: 'third-party-links', title: 'Third-Party Links', body: [
    'Pages on this website may link to external websites. We are not responsible for the content or privacy practices of those sites.',
  ]},
  { id: 'childrens-privacy', title: 'Children’s Privacy', body: [
    'This website is intended for business audiences and is not directed at children. We do not knowingly collect personal information from children.',
  ]},
  { id: 'changes', title: 'Changes to This Policy', body: [
    'We may update this policy from time to time. The “Last updated” date at the top of this page reflects the latest revision. Material changes will be reflected on this page.',
  ]},
  { id: 'contact', title: 'Contact', body: [
    'For privacy questions or requests, contact AUTO-CAN Solutions at info@auto-can.in, or write to us at our headquarters in Jaipur, Rajasthan, India.',
  ]},
]

export const termsSections = [
  { id: 'acceptance', title: 'Acceptance of Terms', body: [
    'By accessing or using this website you agree to these Terms & Conditions. If you do not agree, please do not use the website.',
  ]},
  { id: 'website-use', title: 'Use of the Website', body: [
    'This website provides information about AUTO-CAN Solutions and its automotive engineering and embedded software services. You may browse the site and contact us through the form for legitimate business purposes.',
  ]},
  { id: 'prohibited-use', title: 'Prohibited Use', body: [
    'You agree not to:',
  ], list: [
    'Attempt to disrupt, overload, or gain unauthorised access to the website or its hosting infrastructure',
    'Use the contact form to send unlawful, deceptive, or abusive content, or unsolicited bulk messages',
    'Scrape, republish, or misrepresent the website’s content as your own',
    'Use the website in any way that violates applicable law',
  ]},
  { id: 'intellectual-property', title: 'Intellectual Property', body: [
    'Unless otherwise indicated, the content of this website — including text, graphics, illustrations, logos, and page design — belongs to AUTO-CAN Solutions or its licensors and is protected by applicable intellectual property laws. Trademarks and product names of third parties (for example, vehicle manufacturers or standards bodies mentioned in a descriptive context) belong to their respective owners.',
    'You may view and print pages for your own business evaluation of our services. Any other reproduction or distribution requires our prior written consent.',
  ]},
  { id: 'information-accuracy', title: 'Information Accuracy', body: [
    'We aim to keep the information on this website accurate and current, but it is provided for general information only and may change without notice. Descriptions of capabilities and services do not constitute a binding offer; specific engagements are governed by separately agreed contracts.',
  ]},
  { id: 'service-information', title: 'Service Information', body: [
    'References to engagement models, capacity, timelines, or technical capabilities describe our general way of working. The applicable scope, deliverables, and commercial terms for any engagement are defined exclusively in the written agreement executed for that engagement.',
  ]},
  { id: 'user-submissions', title: 'Enquiries & Submissions', body: [
    'Information you send through the contact form is handled as described in our Privacy Policy. Do not submit confidential information through the form; a non-disclosure agreement can be arranged before sharing sensitive programme details.',
  ]},
  { id: 'third-party-links', title: 'Third-Party Links & Services', body: [
    'The website may reference or link to third-party websites and services. We do not control them and are not responsible for their content, availability, or practices.',
  ]},
  { id: 'disclaimer', title: 'Disclaimer', body: [
    'This website and its content are provided “as is” and “as available”, without warranties of any kind, whether express or implied, including fitness for a particular purpose, accuracy, or non-infringement, to the extent permitted by law.',
  ]},
  { id: 'limitation-of-liability', title: 'Limitation of Liability', body: [
    'To the maximum extent permitted by applicable law, AUTO-CAN Solutions shall not be liable for any indirect, incidental, or consequential damages arising from the use of, or inability to use, this website or its content.',
  ]},
  { id: 'governing-law', title: 'Governing Law', body: [
    'These terms are governed by the laws of India, and disputes are subject to the jurisdiction of the courts at Jaipur, Rajasthan.',
  ]},
  { id: 'changes', title: 'Changes to These Terms', body: [
    'We may revise these Terms & Conditions from time to time. The “Last updated” date reflects the latest revision. Continued use of the website after changes constitutes acceptance of the revised terms.',
  ]},
  { id: 'contact', title: 'Contact', body: [
    'Questions about these terms can be sent to info@auto-can.in.',
  ]},
]
