// Tab Navigation
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.add('hidden'));
    button.classList.add('active');
    document.getElementById(button.dataset.tab).classList.remove('hidden');
  });
});

// Call Groq API
// Call Groq API via your local Node.js backend
async function callGroqAPI(prompt) {
  const response = await fetch('http://localhost:3000/api/groq', {

    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'You are a professional resume assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  if (!data.choices || !data.choices[0]) {
    throw new Error('Invalid response from Groq API');
  }
  return data.choices[0].message.content;
}

// Generate AI Summary
document.getElementById('generate-summary').addEventListener('click', async () => {
  const hardSkills = document.getElementById('hard-skills').value;
  const softSkills = document.getElementById('soft-skills').value;

  const prompt = `Generate a professional resume summary based on these skills:\n\nHard Skills: ${hardSkills}\nSoft Skills: ${softSkills}\n\nKeep it formal and concise.`;

  const button = document.getElementById('generate-summary');
  const textarea = document.getElementById('ai-summary');

  button.disabled = true;
  button.textContent = "Generating...";

  try {
    const summary = await callGroqAPI(prompt); // Your API call function must be defined elsewhere
    textarea.value = summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    textarea.value = 'Error generating summary. Please try again.';
  } finally {
    button.disabled = false;
    button.textContent = "Generate AI Summary";
  }
});


// Handle Image Upload
let profileImageData = '';
document.getElementById('profile-image').addEventListener('change', event => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      profileImageData = e.target.result;
      updatePreview();
    };
    reader.readAsDataURL(file);
  }
});

// Form Submission and Real-Time Preview
const form = document.getElementById('resume-form');
const previewSection = document.getElementById('preview-section');
const previewContent = document.getElementById('preview-content');

function updatePreview() {
  const data = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    summary: document.getElementById('summary').value,
    education: document.getElementById('education-details').value,
    experience: document.getElementById('experience-details').value,
    hardSkills: document.getElementById('hard-skills').value,
    softSkills: document.getElementById('soft-skills').value,
    certifications: document.getElementById('certifications').value,
    languages: document.getElementById('languages').value,
    interests: document.getElementById('interests').value,
    aiSummary: document.getElementById('ai-summary').value,
  };

  previewContent.innerHTML = `
    <div class="mb-6">
      ${profileImageData ? `<img src="${profileImageData}" alt="Profile" class="w-32 h-32 rounded-full mx-auto mb-4">` : ''}
      

      <h3 class="text-2xl font-bold text-center">${data.name || 'Your Name'}</h3>
      <p class="text-center">${data.email || 'email@example.com'} | ${data.phone || 'Phone'} | ${data.address || 'Address'}</p>
    </div>
    ${data.aiSummary ? `
      <div class="mb-6">
        <h4 class="text-lg font-semibold mb-2">Professional Summary</h4>
        <p>${data.aiSummary}</p>
      </div>
    ` : ''}
    ${data.summary ? `
      <div class="mb-6">
        <h4 class="text-lg font-semibold mb-2">Personal Summary</h4>
        <p>${data.summary}</p>
      </div>
    ` : ''}
    ${data.education ? `
      <div class="mb-6">
        <h4 class="text-lg font-semibold mb-2">Education</h4>
        <p>${data.education.replace(/\n/g, '<br>')}</p>
      </div>
    ` : ''}
    ${(data.hardSkills || data.softSkills) ? `
      <div class="mb-6">
        <h4 class="text-lg font-semibold mb-2">Skills</h4>
        ${data.hardSkills ? `<p><strong>Hard Skills:</strong> ${data.hardSkills}</p>` : ''}
        ${data.softSkills ? `<p><strong>Soft Skills:</strong> ${data.softSkills}</p>` : ''}
      </div>
    ` : ''}
    ${data.experience ? `
      <div class="mb-6">
        <h4 class="text-lg font-semibold mb-2">Work Experience</h4>
        <p>${data.experience.replace(/\n/g, '<br>')}</p>
      </div>
    ` : ''}
    ${data.certifications ? `
      <div class="mb-6">
        <h4 class="text-lg font-semibold mb-2">Certifications</h4>
        <p>${data.certifications}</p>
      </div>
    ` : ''}
    ${data.languages ? `
      <div class="mb-6">
        <h4 class="text-lg font-semibold mb-2">Languages</h4>
        <p>${data.languages}</p>
      </div>
    ` : ''}
    ${data.interests ? `
      <div>
        <h4 class="text-lg font-semibold mb-2">Interests</h4>
        <p>${data.interests}</p>
      </div>
    ` : ''}
  `;

  previewSection.classList.remove('hidden');
}

// Real-Time Updates
form.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('input', updatePreview);
});

form.addEventListener('submit', e => {
  e.preventDefault();
  updatePreview();
});

// Copy to Clipboard
document.getElementById('copy-resume').addEventListener('click', () => {
  const text = previewContent.innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert('Resume copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy:', err);
    alert('Failed to copy resume.');
  });
});

// Email Resume
document.getElementById('email-resume').addEventListener('click', () => {
  const text = encodeURIComponent(previewContent.innerText);
  const subject = encodeURIComponent('My Professional Resume');
  window.location.href = `mailto:?subject=${subject}&body=${text}`;
});

// Download PDF
document.getElementById('download-pdf').addEventListener('click', () => {
  const element = document.getElementById('preview-content');

  const opt = {
    margin: 0.5,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
});


// Toggle Dark Mode
const toggle = document.getElementById('dark-toggle');
if (toggle) {
  toggle.addEventListener('change', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  });

  // Persist Dark Mode
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
    toggle.checked = true;
  }
}

// ATS Score Calculator
const atsBtn = document.getElementById('calculate-ats');
if (atsBtn) {
  atsBtn.addEventListener('click', () => {
    const previewEl = document.getElementById('preview-content');
    if (!previewEl) {
      alert("Resume content not found. Please generate or upload your resume first.");
      return;
    }
    const resumeText = previewEl.innerText.toLowerCase();

    const jobKeywords = ["javascript", "python", "react", "sql", "aws", "communication", "teamwork"];
    let score = 0;
    jobKeywords.forEach(keyword => {
      if (resumeText.includes(keyword)) score++;
    });
    const percent = Math.round((score / jobKeywords.length) * 100);
    document.getElementById('ats-result').textContent = `✅ Your ATS Score is ${percent}%`;
  });
}

// Initialize Preview
updatePreview();


