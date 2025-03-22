let currentJob = null;

// Helper function to create a formatted display of job details
function formatJobDetails(job) {
  return `
    <div class="job-card">
      <div class="job-header">
        <h3>${job.title}</h3>
        <span class="company">${job.company}</span>
      </div>

      <div class="section">
        <h4>Description:</h4>
        <div class="description-preview">
          ${job.description}
        </div>
      </div>
    </div>
  `;
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
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
  if (msg.action === "jobFound") {
    currentJob = msg.job;
    const jobStatus = document.getElementById("job-status");
    jobStatus.innerHTML = formatJobDetails(currentJob);
    document.getElementById("send-to-ai").disabled = false;
  }

  if (msg.action === "scrapingError") {
    document.getElementById("job-status").innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        Error: ${msg.error}
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

  // For testing - show the extracted data
  document.getElementById("result").innerHTML = `
    <div class="success-message">
      <i class="fas fa-check-circle"></i>
      Extracted job data:
      <pre>${JSON.stringify({
        title: currentJob.title,
        company: currentJob.company,
        description: currentJob.description
      }, null, 2)}</pre>
    </div>
  `;
});
