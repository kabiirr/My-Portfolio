/**
 * Kabir — Private Branding & Website Questionnaire
 * Handles: Auto-save, progress tracking, headless Google Form submission, draft recovery, and export
 */

(() => {
    'use strict';

    const STORAGE_KEY = 'kabir_brief_draft_v1';
    const SUBMITTED_KEY = 'kabir_brief_submitted_v1';

    // DOM Elements
    const form = document.getElementById('briefForm');
    const submitBtn = document.getElementById('submitBtn');
    const autosaveDot = document.getElementById('autosaveDot');
    const autosaveText = document.getElementById('autosaveText');
    const clearDraftBtn = document.getElementById('clearDraftBtn');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const dockProgressText = document.getElementById('dockProgressText');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const tabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.form-section');

    let isSubmitting = false;
    let saveTimeout = null;

    // Trackable input elements
    function getTrackableInputs() {
        return form.querySelectorAll('textarea, input[type="text"], input[type="email"], input[type="url"], input[type="radio"]:checked');
    }

    // ==========================================================================
    // Progress Calculation
    // ==========================================================================
    function updateProgress() {
        // Collect distinct question containers
        const fields = form.querySelectorAll('.field');
        let answeredCount = 0;

        fields.forEach(field => {
            const inputs = field.querySelectorAll('textarea, input[type="text"], input[type="email"], input[type="url"], input[type="radio"]');
            let hasValue = false;

            inputs.forEach(input => {
                if (input.type === 'radio') {
                    if (input.checked) hasValue = true;
                } else if (input.value && input.value.trim().length > 0) {
                    hasValue = true;
                }
            });

            if (hasValue) answeredCount++;
        });

        const totalQuestions = fields.length;
        const percent = Math.round((answeredCount / totalQuestions) * 100);

        if (progressFill) progressFill.style.width = `${percent}%`;
        if (progressText) progressText.textContent = `${percent}% completed`;
        if (dockProgressText) dockProgressText.textContent = `${answeredCount} of ${totalQuestions} answered`;
    }

    // ==========================================================================
    // Local Auto-Save
    // ==========================================================================
    function saveDraft() {
        if (isSubmitting) return;

        if (autosaveDot) autosaveDot.classList.add('saving');
        if (autosaveText) autosaveText.textContent = 'Saving...';

        const data = {};
        const elements = form.querySelectorAll('input, textarea');

        elements.forEach(el => {
            if (!el.name) return;
            if (el.type === 'radio') {
                if (el.checked) {
                    data[el.name] = el.value;
                }
            } else if (el.type !== 'hidden') {
                data[el.name] = el.value;
            }
        });

        // Also save client meta
        data['_client_company'] = document.getElementById('clientCompany')?.value || '';
        data['_client_name'] = document.getElementById('clientName')?.value || '';
        data['_client_email'] = document.getElementById('clientEmail')?.value || '';

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Draft auto-save failed:', e);
        }

        setTimeout(() => {
            if (autosaveDot) autosaveDot.classList.remove('saving');
            if (autosaveText) autosaveText.textContent = 'Saved locally';
        }, 300);
    }

    function queueSave() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveDraft, 400);
        updateProgress();
    }

    function restoreDraft() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        try {
            const data = JSON.parse(raw);
            if (document.getElementById('clientCompany') && data['_client_company']) {
                document.getElementById('clientCompany').value = data['_client_company'];
            }
            if (document.getElementById('clientName') && data['_client_name']) {
                document.getElementById('clientName').value = data['_client_name'];
            }
            if (document.getElementById('clientEmail') && data['_client_email']) {
                document.getElementById('clientEmail').value = data['_client_email'];
            }

            Object.entries(data).forEach(([name, val]) => {
                if (name.startsWith('_')) return;
                const radios = form.querySelectorAll(`input[type="radio"][name="${name}"]`);
                if (radios.length > 0) {
                    radios.forEach(radio => {
                        if (radio.value === val) {
                            radio.checked = true;
                        }
                    });
                } else {
                    const input = form.querySelector(`[name="${name}"]`);
                    if (input) {
                        input.value = val;
                        // Trigger resize for textarea
                        if (input.tagName === 'TEXTAREA') {
                            autoResizeTextarea(input);
                        }
                    }
                }
            });

            updateProgress();
        } catch (e) {
            console.warn('Error restoring draft:', e);
        }
    }

    // ==========================================================================
    // Textarea Auto-sizing
    // ==========================================================================
    function autoResizeTextarea(textarea) {
        if (!textarea) return;
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(80, textarea.scrollHeight) + 'px';
    }

    // ==========================================================================
    // Intersection Observer for Active Tab Highlighting
    // ==========================================================================
    function setupScrollSpy() {
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    tabs.forEach(tab => {
                        if (tab.getAttribute('href') === `#${id}`) {
                            tab.classList.add('active');
                        } else {
                            tab.classList.remove('active');
                        }
                    });
                }
            });
        }, {
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        });

        sections.forEach(sec => observer.observe(sec));
    }

    // ==========================================================================
    // Form Submission (Headless Google Form POST)
    // ==========================================================================
    async function handleSubmit(e) {
        e.preventDefault();
        if (isSubmitting) return;

        isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.classList.add('submitting');

        const company = document.getElementById('clientCompany')?.value.trim() || '';
        const clientName = document.getElementById('clientName')?.value.trim() || '';
        const clientEmail = document.getElementById('clientEmail')?.value.trim() || '';

        // Form entry 1767677212: "How would you define your business in a short paragraph?"
        const firstField = form.querySelector('[name="entry.1767677212"]');
        const originalText = firstField ? firstField.value : '';

        // Prepend client identifier so Kabir immediately sees who submitted in Google Sheet
        const metaPrefix = `[Client: ${company || 'N/A'} | Contact: ${clientName || 'N/A'} <${clientEmail || 'N/A'}>]\n\n`;
        if (firstField) {
            const cleanText = originalText.replace(/^\[Client:[\s\S]*?\]\n\n/, '');
            firstField.value = metaPrefix + (cleanText || '(No business description provided)');
        }

        // Prepare URLSearchParams for Google Forms (Google Forms requires application/x-www-form-urlencoded)
        const formData = new FormData(form);
        const urlParams = new URLSearchParams();
        for (const [key, val] of formData.entries()) {
            urlParams.append(key, val);
        }
        urlParams.set('pageHistory', '0,1,2');
        urlParams.set('fvv', '1');

        // Save snapshot for client export/download
        const submissionSnapshot = {
            submittedAt: new Date().toISOString(),
            company,
            contactName: clientName,
            contactEmail: clientEmail,
            responses: {}
        };

        form.querySelectorAll('.field').forEach(field => {
            const label = field.querySelector('.field-label')?.childNodes[0]?.textContent?.trim() || '';
            const input = field.querySelector('textarea, input[type="text"], input[type="email"], input[type="url"], input[type="radio"]:checked');
            if (label && input) {
                submissionSnapshot.responses[label] = input.value;
            }
        });

        localStorage.setItem(SUBMITTED_KEY, JSON.stringify(submissionSnapshot));

        // Submit via fetch (mode: 'no-cors' with application/x-www-form-urlencoded)
        const actionUrl = form.getAttribute('action');

        let fetchSuccess = false;
        try {
            await fetch(actionUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: urlParams
            });
            fetchSuccess = true;
        } catch (err) {
            console.warn('Fetch submission notice (submitting fallback via iframe):', err);
            try {
                form.submit();
            } catch (iframeErr) {
                console.error('Fallback iframe submit failed:', iframeErr);
            }
        }

        // Show success state after smooth transition
        setTimeout(() => {
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.classList.remove('submitting');
            showSuccessModal();
        }, 600);
    }

    function showSuccessModal() {
        if (!successModal) return;
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideSuccessModal() {
        if (!successModal) return;
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ==========================================================================
    // Export Data (JSON & Formatted TXT)
    // ==========================================================================
    function downloadResponses(format) {
        const raw = localStorage.getItem(SUBMITTED_KEY) || localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        let content = '';
        let filename = `Kabir_Branding_Brief_${new Date().toISOString().slice(0, 10)}`;
        let mimeType = 'text/plain';

        if (format === 'json') {
            content = JSON.stringify(JSON.parse(raw), null, 2);
            filename += '.json';
            mimeType = 'application/json';
        } else {
            const data = JSON.parse(raw);
            content = `KABIR ANIFOWOSE — BRANDING & WEBSITE QUESTIONNAIRE\n`;
            content += `Submitted: ${data.submittedAt || new Date().toLocaleString()}\n`;
            content += `Client / Company: ${data.company || 'N/A'}\n`;
            content += `Contact: ${data.contactName || 'N/A'} (${data.contactEmail || 'N/A'})\n`;
            content += `================================================================\n\n`;

            if (data.responses) {
                Object.entries(data.responses).forEach(([q, a], idx) => {
                    content += `${idx + 1}. ${q}\n`;
                    content += `Response: ${a || '(No response provided)'}\n\n`;
                });
            }
            filename += '.txt';
        }

        const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ==========================================================================
    // Event Listeners
    // ==========================================================================
    function init() {
        // Restore existing draft
        restoreDraft();

        // Listen for all input/change events
        form.addEventListener('input', (e) => {
            if (e.target.tagName === 'TEXTAREA') {
                autoResizeTextarea(e.target);
            }
            queueSave();
        });

        form.addEventListener('change', () => {
            queueSave();
        });

        // Submit listener
        form.addEventListener('submit', handleSubmit);

        // Clear draft
        if (clearDraftBtn) {
            clearDraftBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear your saved draft? All unsent answers will be reset.')) {
                    localStorage.removeItem(STORAGE_KEY);
                    form.reset();
                    updateProgress();
                    if (autosaveText) autosaveText.textContent = 'Draft cleared';
                }
            });
        }

        // Modal Close listeners
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', hideSuccessModal);
        }
        if (successModal) {
            successModal.addEventListener('click', (e) => {
                if (e.target === successModal) hideSuccessModal();
            });
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && successModal?.classList.contains('active')) {
                hideSuccessModal();
            }
        });

        // Setup scroll spy
        setupScrollSpy();

        // Initial progress calculation
        updateProgress();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
