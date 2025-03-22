// Platform-specific selectors
const PLATFORM_SELECTORS = {
  linkedin: {
    title: '.job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title, h1',
    company: '.job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name, .ember-view.link-without-visited-state.inline-block',
    description: '#job-details span, .jobs-description__content span, .jobs-box__html-content span',
    location: '.job-details-jobs-unified-top-card__bullet, .jobs-unified-top-card__bullet, .jobs-unified-top-card__workplace-type',
    requirements: '.jobs-description__content ul, .jobs-box__group ul',
    jobType: '.job-details-jobs-unified-top-card__workplace-type, .jobs-unified-top-card__workplace-type, .workplace-type',
    experienceLevel: '.description__job-criteria-text, .experience-level',
    aboutJob: '.jobs-description__content',
    jobHighlights: '.jobs-box__group .jobs-box__list-item'
  },
  indeed: {
    title: '.jobsearch-JobInfoHeader-title',
    company: '.jobsearch-InlineCompanyRating div',
    description: '#jobDescriptionText',
    location: '.jobsearch-JobInfoHeader-subtitle',
    jobType: '.jobsearch-JobDescriptionSection-sectionItem'
  },
  glassdoor: {
    title: '[data-test="job-title"]',
    company: '[data-test="employer-name"]',
    description: '[data-test="description"]',
    location: '[data-test="location"]'
  }
};

// Debug function to check if selectors are found
function debugSelectors(platform, selectors) {
  console.log('=== Selector Debug Info ===');
  console.log('Platform:', platform);
  console.log('Current URL:', window.location.href);
  
  for (const [key, selector] of Object.entries(selectors)) {
    if (typeof selector === 'string') {
      const element = document.querySelector(selector);
      console.log(`${key}:`, {
        selector: selector,
        found: !!element,
        text: element?.innerText?.trim() || 'Not found'
      });
    }
  }
}

function detectPlatform() {
  const hostname = window.location.hostname;
  console.log('Checking hostname:', hostname);
  
  if (hostname.includes('linkedin')) {
    console.log('LinkedIn detected');
    return 'linkedin';
  }
  if (hostname.includes('indeed')) {
    console.log('Indeed detected');
    return 'indeed';
  }
  if (hostname.includes('glassdoor')) {
    console.log('Glassdoor detected');
    return 'glassdoor';
  }
  console.log('Generic platform detected');
  return 'generic';
}

// Helper function to find requirements section
function findRequirementsSection() {
  // Look for common requirement section headers
  const headers = document.querySelectorAll('h3, h4');
  for (const header of headers) {
    const text = header.innerText.toLowerCase();
    if (text.includes('qualifications') || text.includes('requirements') || text.includes('what you\'ll need')) {
      // Get the parent container that might contain the requirements
      const parent = header.closest('.jobs-box__group') || header.parentElement;
      if (parent) {
        const list = parent.querySelector('ul');
        if (list) return list;
      }
    }
  }
  return null;
}

function extractJobDetails() {
  try {
    const platform = detectPlatform();
    console.log(`Starting extraction for platform: ${platform}`);

    // Generic selectors as fallback
    const genericSelectors = {
      title: ['h1', '.job-title', '[class*="jobtitle"]', '[class*="job-title"]'],
      company: ['[class*="company"]', '[class*="employer"]', '.organization'],
      description: ['.job-description', '#job-description', '[class*="description"]'],
      location: ['[class*="location"]', '[class*="address"]'],
      requirements: ['[class*="requirements"]', '[class*="qualifications"]'],
      jobType: ['[class*="job-type"]', '[class*="employment-type"]']
    };

    // Helper function to try multiple selectors
    const findContent = (selectors, context = document) => {
      if (typeof selectors === 'string') {
        const elements = context.querySelectorAll(selectors);
        if (elements.length) {
          return Array.from(elements).map(el => el.innerText.trim()).join('\n');
        }
        return null;
      }
      
      for (const selector of selectors) {
        const elements = context.querySelectorAll(selector);
        if (elements.length) {
          return Array.from(elements).map(el => el.innerText.trim()).join('\n');
        }
      }
      return null;
    };

    // Extract requirements and skills from description
    function extractRequirements(description, platform) {
      const requirements = [];

      // LinkedIn-specific extraction
      if (platform === 'linkedin') {
        // Try to find requirements section first
        const reqSection = findRequirementsSection();
        if (reqSection) {
          const items = reqSection.querySelectorAll('li');
          items.forEach(item => {
            const text = item.innerText.trim();
            if (text) requirements.push(text);
          });
        }

        // If no requirements found, try other sections
        if (requirements.length === 0) {
          const allLists = document.querySelectorAll('.jobs-description__content ul');
          allLists.forEach(list => {
            const items = list.querySelectorAll('li');
            items.forEach(item => {
              const text = item.innerText.trim();
              if (text) requirements.push(text);
            });
          });
        }
      }

      // If still no requirements found, try generic extraction
      if (requirements.length === 0) {
        const lines = description.split('\n');
        let inRequirementsList = false;

        for (const line of lines) {
          const trimmedLine = line.trim();
          
          if (trimmedLine.match(/requirements|qualifications|what you'll need|what we're looking for|about the job/i)) {
            inRequirementsList = true;
            continue;
          }

          if (trimmedLine.match(/^(benefits|what we offer|about us|about the company|salary|compensation)/i)) {
            inRequirementsList = false;
            continue;
          }

          if (inRequirementsList && trimmedLine.match(/^[•\-\*]\s/)) {
            const requirement = trimmedLine.replace(/^[•\-\*]\s/, '').trim();
            if (requirement && !requirements.includes(requirement)) {
              requirements.push(requirement);
            }
          }
        }
      }

      return requirements;
    }

    // Get platform-specific or fallback to generic selectors
    const selectors = platform !== 'generic' 
      ? PLATFORM_SELECTORS[platform] 
      : genericSelectors;

    // Debug selector matches
    debugSelectors(platform, selectors);

    const description = findContent(selectors.description) || '';
    console.log('Found description:', description ? 'Yes (length: ' + description.length + ')' : 'No');
    
    const job = {
      title: findContent(selectors.title) || "No title found",
      company: findContent(selectors.company) || "No company found",
      description: description || "No description found",
      location: findContent(selectors.location) || "No location found",
      platform: platform,
      url: window.location.href,
      requirements: extractRequirements(description, platform),
      jobType: findContent(selectors.jobType) || "Not specified",
      experienceLevel: findContent(selectors.experienceLevel) || "Not specified",
      scrapedAt: new Date().toISOString(),
      metadata: {
        source: platform,
        sourceUrl: window.location.href,
        scrapedBy: 'ApplyWise Extension'
      }
    };

    console.log("Extracted job details:", job);
    
    // Add LinkedIn-specific data if available
    if (platform === 'linkedin') {
      const aboutJob = findContent(PLATFORM_SELECTORS.linkedin.aboutJob);
      const highlights = findContent(PLATFORM_SELECTORS.linkedin.jobHighlights);
      
      console.log('LinkedIn specific data:', { aboutJob: !!aboutJob, highlights: !!highlights });
      
      if (aboutJob || highlights) {
        job.linkedinSpecific = {
          aboutJob: aboutJob || '',
          highlights: highlights ? highlights.split('\n').filter(h => h.trim()) : []
        };
      }
    }

    // Only send message if we found at least title or description
    if (job.title !== "No title found" || job.description !== "No description found") {
      console.log("Sending job data to popup");
      chrome.runtime.sendMessage({ 
        action: "jobFound", 
        job,
        source: {
          platform,
          url: window.location.href
        }
      });
    } else {
      console.log("No job data found to send");
      chrome.runtime.sendMessage({ 
        action: "scrapingError", 
        error: "Could not find job title or description",
        url: window.location.href 
      });
    }

  } catch (error) {
    console.error("Error extracting job details:", error);
    chrome.runtime.sendMessage({ 
      action: "scrapingError", 
      error: error.message,
      url: window.location.href 
    });
  }
}

// Run extraction immediately and then set up observer
console.log('Content script loaded, attempting initial extraction...');
extractJobDetails();

// Use MutationObserver to detect when the content is loaded
const observer = new MutationObserver((mutations, obs) => {
  const platform = detectPlatform();
  const selectors = platform !== 'generic' 
    ? PLATFORM_SELECTORS[platform] 
    : { title: 'h1', description: '[class*="description"]' };
    
  // Look for meaningful content that indicates the job listing has loaded
  const hasJobContent = document.querySelector(selectors.title) || 
                       document.querySelector(selectors.description);
  
  if (hasJobContent) {
    console.log('Job content found by observer, extracting details...');
    extractJobDetails();
    obs.disconnect(); // Stop observing once we've found the content
  }
});

// Start observing the document with the configured parameters
observer.observe(document, {
  childList: true,
  subtree: true,
  characterData: true
});

// Fallback timeout in case MutationObserver doesn't trigger
setTimeout(() => {
  console.log('Fallback timeout reached, checking for job content...');
  const platform = detectPlatform();
  const selectors = platform !== 'generic' 
    ? PLATFORM_SELECTORS[platform] 
    : { title: 'h1' };
    
  if (!document.querySelector(selectors.title)) {
    console.log("Fallback: Attempting to extract job details after timeout");
    extractJobDetails();
  }
}, 3000);
