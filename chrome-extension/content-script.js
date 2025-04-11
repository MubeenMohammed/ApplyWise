console.log("Content script loaded");

setTimeout(() => {
  const elements = document.querySelectorAll('p[dir="ltr"]');
  if (elements.length > 1) {
    console.log("Job Details:", elements[1].textContent);
  } else {
    console.log("Second element not found.");
  }
}, 5000);
