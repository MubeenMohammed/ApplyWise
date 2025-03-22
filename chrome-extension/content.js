// Platform-specific selectors
const PLATFORM_SELECTORS = {
  linkedin: {
    title: '.job-details-jobs-unified-top-card__job-title, h1.t-24',
    company: '.jobs-unified-top-card__company-name, .job-details-jobs-unified-top-card__company-name',
    description: '.jobs-description__content'
  },
  indeed: {
    title: '.jobsearch-JobInfoHeader-title',
    company: '.jobsearch-InlineCompanyRating div',
    description: '#jobDescriptionText'
  },
  glassdoor: {
    title: '[data-test="job-title"]',
    company: '[data-test="employer-name"]',
    description: '[data-test="description"]'
  }
};

// Debug function to check if selectors are found
function debugSelectors(platform, selectors) {
  console.log('=== Selector Debug Info ===');
  console.log('Platform:', platform);
  console.log('Current URL:', window.location.href);
  
  Object.entries(selectors).forEach(([key, selector]) => {
    try {
      if (typeof selector === 'string') {
        const element = document.querySelector(selector);
        console.log(`${key}:`, {
          selector: selector,
          found: !!element,
          text: element?.innerText?.trim() || 'Not found'
        });
      } else if (Array.isArray(selector)) {
        let found = false;
        let text = 'Not found';
        
        for (const s of selector) {
          const element = document.querySelector(s);
          if (element) {
            found = true;
            text = element.innerText.trim();
            break;
          }
        }
        
        console.log(`${key}:`, {
          selector: selector,
          found: found,
          text: text
        });
      }
    } catch (error) {
      console.log(`Error checking selector for ${key}:`, error);
    }
  });
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
    console.log(`Extracting from: ${platform}`);

    if (platform === 'linkedin') {
      // Get the job title
      const titleElement = document.querySelector(PLATFORM_SELECTORS.linkedin.title);
      const title = titleElement ? titleElement.textContent.trim() : "No title found";

      // Get the company name
      const companyElement = document.querySelector(PLATFORM_SELECTORS.linkedin.company);
      const company = companyElement ? companyElement.textContent.trim() : "No company found";

      // Get the job description
      let description = '';
      const descriptionContainer = document.querySelector('.jobs-description__content');
      
      if (descriptionContainer) {
        // Find all text content after "About the job"
        const aboutJobHeader = Array.from(descriptionContainer.querySelectorAll('h2, strong'))
          .find(el => el.textContent.trim().toLowerCase() === 'about the job');

        if (aboutJobHeader) {
          // Get the parent section that contains all the content
          const section = aboutJobHeader.closest('section') || aboutJobHeader.parentElement;
          if (section) {
            // Clone the section to avoid modifying the original
            const sectionClone = section.cloneNode(true);
            // Remove the "About the job" header
            const header = sectionClone.querySelector('h2, strong');
            if (header) {
              header.remove();
            }
            description = sectionClone.textContent.trim();
          }
        } else {
          // If we can't find "About the job", just get all the content
          description = descriptionContainer.textContent.trim();
        }
      }

      // Clean up the description
      description = description
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .replace(/\n\s*\n/g, '\n')  // Replace multiple newlines with single newline
        .trim();

      const job = {
        title,
        company,
        description: description || "No description found"
      };

      console.log("Extracted job details:", job);
      chrome.runtime.sendMessage({ action: "jobFound", job });
      return;
    }

    // Fallback to generic extraction for other platforms
    const genericSelectors = {
      title: ['h1', '.job-title', '[class*="jobtitle"]', '[class*="job-title"]'],
      company: ['[class*="company"]', '[class*="employer"]', '.organization'],
      description: ['.jobs-description__content', '#job-description', '[class*="description"]']
    };

    const selectors = PLATFORM_SELECTORS[platform] || genericSelectors;
    
    // Helper function to try multiple selectors
    const findContent = (selectors) => {
      if (typeof selectors === 'string') {
        const element = document.querySelector(selectors);
        return element ? element.textContent.trim() : null;
      }
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) return element.textContent.trim();
      }
      return null;
    };

    const job = {
      title: findContent(selectors.title) || "No title found",
      company: findContent(selectors.company) || "No company found",
      description: findContent(selectors.description) || "No description found"
    };

    console.log("Extracted job details:", job);
    chrome.runtime.sendMessage({ action: "jobFound", job });

  } catch (error) {
    console.error("Error extracting job details:", error);
    chrome.runtime.sendMessage({ 
      action: "scrapingError", 
      error: error.message 
    });
  }
}

// Run extraction immediately and then set up observer
console.log('Content script loaded, attempting initial extraction...');
extractJobDetails();

// Use MutationObserver to detect when the content is loaded
const observer = new MutationObserver((mutations, obs) => {
  const jobContent = document.querySelector('.jobs-description__content');
  if (jobContent) {
    setTimeout(() => {
      extractJobDetails();
      obs.disconnect();
    }, 1000); // Give the content a second to fully load
  }
});

// Start observing the document with the configured parameters
observer.observe(document, {
  childList: true,
  subtree: true
});

// Fallback timeout in case MutationObserver doesn't trigger
setTimeout(() => {
  if (document.querySelector('.jobs-description__content')) {
    extractJobDetails();
  }
}, 3000);
