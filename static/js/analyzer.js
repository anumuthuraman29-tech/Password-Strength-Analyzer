/**
 * SecurePass — Password Strength Analyzer Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('analyzerPassword');
  const toggleVisibilityBtn = document.getElementById('togglePasswordVisibility');
  const clearPasswordBtn = document.getElementById('clearPasswordBtn');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const charCount = document.getElementById('charCount');
  
  const meterFill = document.getElementById('meterFill');
  const strengthLabel = document.getElementById('strengthLabel');
  const scoreValue = document.getElementById('scoreValue');
  const recommendationText = document.getElementById('recommendationText');
  const recommendationBox = document.getElementById('recommendationBox');

  // Requirement items
  const reqLength = document.getElementById('reqLength');
  const reqUpper = document.getElementById('reqUpper');
  const reqLower = document.getElementById('reqLower');
  const reqNumber = document.getElementById('reqNumber');
  const reqSpecial = document.getElementById('reqSpecial');

  if (!passwordInput) return;

  // Real-time character counter and live validation
  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    if (charCount) charCount.textContent = `${val.length} chars`;
    evaluatePassword(val, false);
  });

  // Show / Hide password toggle
  if (toggleVisibilityBtn) {
    toggleVisibilityBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      const icon = toggleVisibilityBtn.querySelector('i');
      if (icon) {
        icon.className = type === 'password' ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
      }
    });
  }

  // Clear button
  if (clearPasswordBtn) {
    clearPasswordBtn.addEventListener('click', () => {
      passwordInput.value = '';
      if (charCount) charCount.textContent = '0 chars';
      evaluatePassword('', false);
      passwordInput.focus();
    });
  }

  // Explicit Analyze Button (saves to audit history without storing the password!)
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', async () => {
      const val = passwordInput.value;
      if (!val) {
        if (typeof showToast === 'function') {
          showToast('Please enter a password to analyze.', 'error');
        }
        return;
      }
      
      // Perform server-side audit recording (POST to /api/analyze without saving plaintext)
      try {
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';

        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: val, recordHistory: true })
        });
        
        const data = await res.json();
        renderAnalysis(data);
        
        if (typeof showToast === 'function') {
          showToast(`Security Audit Logged: ${data.strength} (${data.score}/5)`, 'success');
        }
      } catch (err) {
        // Fallback to local evaluation if offline
        const local = evaluatePassword(val, true);
        if (typeof showToast === 'function') {
          showToast(`Analyzed locally: ${local.strength} (${local.score}/5)`, 'info');
        }
      } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Analyze & Save Audit';
      }
    });
  }

  function evaluatePassword(pwd, isFinal = false) {
    if (!pwd) {
      if (meterFill) {
        meterFill.style.width = '0%';
        meterFill.className = 'meter-fill';
      }
      if (strengthLabel) {
        strengthLabel.textContent = 'Awaiting Input';
        strengthLabel.className = 'badge';
      }
      if (scoreValue) scoreValue.textContent = '0 / 5';
      if (recommendationBox) recommendationBox.style.display = 'none';

      [reqLength, reqUpper, reqLower, reqNumber, reqSpecial].forEach(el => {
        if (el) {
          el.className = 'req-item';
          const icon = el.querySelector('i');
          if (icon) icon.className = 'fa-solid fa-circle-xmark';
        }
      });
      return { score: 0, strength: 'Weak' };
    }

    const hasLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

    updateReq(reqLength, hasLength);
    updateReq(reqUpper, hasUpper);
    updateReq(reqLower, hasLower);
    updateReq(reqNumber, hasNumber);
    updateReq(reqSpecial, hasSpecial);

    let score = 0;
    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    let strength = 'Weak';
    let statusClass = 'weak';

    if (score >= 5) {
      strength = 'Strong';
      statusClass = 'strong';
    } else if (score >= 3) {
      strength = 'Medium';
      statusClass = 'medium';
    } else {
      strength = 'Weak';
      statusClass = 'weak';
    }

    // Recommendation computation
    let recommendation = '';
    if (!hasLength) {
      recommendation = 'Increase length to at least 8 characters. Passwords with 14+ characters provide vastly higher brute-force resilience.';
    } else if (!hasSpecial) {
      recommendation = 'Your password is missing a special character (@, #, $, %, etc.). Add symbols to defend against dictionary attacks.';
    } else if (!hasNumber) {
      recommendation = 'Add numerical digits (0-9) to introduce variability into common dictionary patterns.';
    } else if (!hasUpper) {
      recommendation = 'Include uppercase letters (A-Z) to expand character space and increase entropy.';
    } else if (!hasLower) {
      recommendation = 'Include lowercase letters (a-z) to satisfy standard complexity benchmarks.';
    } else {
      recommendation = 'Excellent password entropy! Meets cryptographic complexity standards.';
    }

    const payload = {
      score,
      strength,
      statusClass,
      recommendation,
      conditions: { hasLength, hasUpper, hasLower, hasNumber, hasSpecial }
    };

    renderAnalysis(payload);
    return payload;
  }

  function updateReq(el, passed) {
    if (!el) return;
    if (passed) {
      el.classList.add('passed');
      const icon = el.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-circle-check';
    } else {
      el.classList.remove('passed');
      const icon = el.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-circle-xmark';
    }
  }

  function renderAnalysis(data) {
    if (scoreValue) scoreValue.textContent = `${data.score} / 5`;
    
    if (meterFill) {
      meterFill.className = `meter-fill ${data.statusClass}`;
      meterFill.style.width = data.score === 5 ? '100%' : data.score >= 3 ? '65%' : `${data.score * 15 + 10}%`;
    }

    if (strengthLabel) {
      strengthLabel.textContent = data.strength;
      strengthLabel.className = `badge badge-${data.statusClass}`;
    }

    if (recommendationBox && recommendationText) {
      recommendationBox.style.display = 'flex';
      recommendationText.textContent = data.recommendation;
    }
  }
});
