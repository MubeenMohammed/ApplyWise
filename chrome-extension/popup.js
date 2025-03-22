let currentJob = null;

// Helper function to create a formatted display of job details
function formatJobDetails(job) {
  return `
    <div class="job-card">
      <div class="job-header">
        <h3>${job.title}</h3>
        <span class="company">${job.company}</span>
      </div>
      
      <div class="job-info">
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Job Type:</strong> ${job.jobType}</p>
        <p><strong>Platform:</strong> ${job.platform}</p>
      </div>

      <div class="section">
        <h4>Requirements:</h4>
        <ul>
          ${job.requirements.map(req => `<li>${req}</li>`).join('')}
        </ul>
      </div>

      ${job.linkedinSpecific ? `
        <div class="section">
          <h4>LinkedIn Specific Data:</h4>
          <div class="linkedin-data">
            ${job.linkedinSpecific.highlights ? `
              <h5>Highlights:</h5>
              <ul>
                ${job.linkedinSpecific.highlights.map(h => `<li>${h}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        </div>
      ` : ''}

      <div class="section">
        <h4>Raw Description:</h4>
        <div class="description-preview">
          ${job.description.substring(0, 200)}...
        </div>
      </div>

      <div class="metadata">
        <small>Scraped at: ${new Date(job.scrapedAt).toLocaleString()}</small>
      </div>
    </div>
  `;
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Popup opened, checking active tab...');
  
  // Query the active tab
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentTab = tabs[0];
  console.log('Current tab:', currentTab.url);

  // Update initial status
  const jobStatus = document.getElementById("job-status");
  jobStatus.innerHTML = `
    <div class="info-message">
      <i class="fas fa-search"></i>
      Looking for job details...
    </div>
  `;
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('Received message:', msg.action);
  
  if (msg.action === "jobFound") {
    console.log('Job data received:', msg.job);
    currentJob = msg.job;
    
    const jobStatus = document.getElementById("job-status");
    jobStatus.innerHTML = formatJobDetails(currentJob);
    
    // Enable the button since we have job data
    document.getElementById("send-to-ai").disabled = false;
  }

  if (msg.action === "scrapingError") {
    console.log('Scraping error:', msg.error);
    document.getElementById("job-status").innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        Error extracting job details: ${msg.error}
      </div>
    `;
  }
});

document.getElementById("send-to-ai").addEventListener("click", async () => {
  if (!currentJob) {
    document.getElementById("result").innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        No job detected. Please navigate to a job posting first.
      </div>
    `;
    return;
  }

  // For testing - just show what would be sent to the backend
  document.getElementById("result").innerHTML = `
    <div class="success-message">
      <i class="fas fa-check-circle"></i>
      Job data ready to be sent to backend:
      <pre>${JSON.stringify(currentJob, null, 2)}</pre>
    </div>
  `;
});
