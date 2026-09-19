/**
 * SecurePass — Cryptographically Secure Password Generator
 */
document.addEventListener('DOMContentLoaded', () => {
  const lengthSlider = document.getElementById('genLengthSlider');
  const lengthDisplay = document.getElementById('genLengthValue');
  const checkUpper = document.getElementById('genUpper');
  const checkLower = document.getElementById('genLower');
  const checkNumbers = document.getElementById('genNumbers');
  const checkSpecial = document.getElementById('genSpecial');

  const passwordField = document.getElementById('generatedPassword');
  const generateBtn = document.getElementById('generateBtn');
  const regenerateBtn = document.getElementById('regenerateBtn');
  const copyBtn = document.getElementById('copyBtn');
  const genStrengthBadge = document.getElementById('genStrengthBadge');
  const genCharCount = document.getElementById('genCharCount');

  if (!passwordField) return;

  // Sync length slider
  if (lengthSlider && lengthDisplay) {
    lengthSlider.addEventListener('input', () => {
      lengthDisplay.textContent = lengthSlider.value;
      generateNewPassword();
    });
  }

  // Toggles change
  [checkUpper, checkLower, checkNumbers, checkSpecial].forEach(cb => {
    if (cb) {
      cb.addEventListener('change', () => {
        // Ensure at least one is checked
        if (!checkUpper.checked && !checkLower.checked && !checkNumbers.checked && !checkSpecial.checked) {
          cb.checked = true;
          if (typeof showToast === 'function') {
            showToast('At least one character set must remain enabled.', 'error');
          }
        }
        generateNewPassword();
      });
    }
  });

  // Buttons
  if (generateBtn) generateBtn.addEventListener('click', generateNewPassword);
  if (regenerateBtn) regenerateBtn.addEventListener('click', generateNewPassword);

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const pwd = passwordField.value;
      if (!pwd) return;

      try {
        await navigator.clipboard.writeText(pwd);
        if (typeof showToast === 'function') {
          showToast('Password copied to clipboard securely!', 'success');
        }
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Password';
        }, 2000);
      } catch (err) {
        // Fallback copy
        passwordField.select();
        document.execCommand('copy');
        if (typeof showToast === 'function') {
          showToast('Password copied to clipboard!', 'success');
        }
      }
    });
  }

  async function generateNewPassword() {
    const length = parseInt(lengthSlider ? lengthSlider.value : 16, 10);
    const useUpper = checkUpper ? checkUpper.checked : true;
    const useLower = checkLower ? checkLower.checked : true;
    const useNumbers = checkNumbers ? checkNumbers.checked : true;
    const useSpecial = checkSpecial ? checkSpecial.checked : true;

    try {
      // Prefer backend API using Python's secrets module
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          length,
          uppercase: useUpper,
          lowercase: useLower,
          numbers: useNumbers,
          special: useSpecial
        })
      });

      if (res.ok) {
        const data = await res.json();
        renderGenerated(data.password, length);
        return;
      }
    } catch (e) {
      // Use crypto.getRandomValues client-side fallback
    }

    // Cryptographic client-side fallback (CSPRNG via Web Cryptography API)
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    let pool = '';
    const guaranteed = [];

    if (useUpper) {
      pool += upperChars;
      guaranteed.push(getRandomChar(upperChars));
    }
    if (useLower) {
      pool += lowerChars;
      guaranteed.push(getRandomChar(lowerChars));
    }
    if (useNumbers) {
      pool += numberChars;
      guaranteed.push(getRandomChar(numberChars));
    }
    if (useSpecial) {
      pool += specialChars;
      guaranteed.push(getRandomChar(specialChars));
    }

    if (!pool) pool = lowerChars + numberChars;

    const remainingLength = Math.max(0, length - guaranteed.length);
    const randomArray = new Uint32Array(remainingLength);
    window.crypto.getRandomValues(randomArray);

    let passwordChars = [...guaranteed];
    for (let i = 0; i < remainingLength; i++) {
      passwordChars.push(pool[randomArray[i] % pool.length]);
    }

    // Cryptographically shuffle
    for (let i = passwordChars.length - 1; i > 0; i--) {
      const jArray = new Uint32Array(1);
      window.crypto.getRandomValues(jArray);
      const j = jArray[0] % (i + 1);
      [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
    }

    const generated = passwordChars.join('');
    renderGenerated(generated, length);
  }

  function getRandomChar(str) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return str[array[0] % str.length];
  }

  function renderGenerated(pwd, length) {
    passwordField.value = pwd;
    if (genCharCount) genCharCount.textContent = `${length} characters`;

    if (genStrengthBadge) {
      if (length >= 14) {
        genStrengthBadge.className = 'badge badge-strong';
        genStrengthBadge.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Strong (Enterprise)';
      } else if (length >= 10) {
        genStrengthBadge.className = 'badge badge-medium';
        genStrengthBadge.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Medium';
      } else {
        genStrengthBadge.className = 'badge badge-weak';
        genStrengthBadge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Weak';
      }
    }
  }

  // Generate on page load
  generateNewPassword();
});
