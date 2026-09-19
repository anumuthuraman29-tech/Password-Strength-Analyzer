import { AuditLog, PasswordAnalysisResult, SecurityStats } from '../types';

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-1',
    time: '2026-09-18 14:32',
    score: 5,
    strength: 'Strong',
    category: 'Enterprise Grade',
    status: 'Passed All Checks'
  },
  {
    id: 'audit-2',
    time: '2026-09-18 16:15',
    score: 3,
    strength: 'Medium',
    category: 'Moderate Risk',
    status: 'Missing Special Character'
  },
  {
    id: 'audit-3',
    time: '2026-09-19 09:10',
    score: 1,
    strength: 'Weak',
    category: 'Critical Vulnerability',
    status: 'Short Length & Low Entropy'
  },
  {
    id: 'audit-4',
    time: '2026-09-19 11:24',
    score: 4,
    strength: 'Medium',
    category: 'Acceptable',
    status: 'Missing Uppercase Letter'
  },
  {
    id: 'audit-5',
    time: '2026-09-19 13:45',
    score: 5,
    strength: 'Strong',
    category: 'Enterprise Grade',
    status: 'Passed All Checks'
  }
];

export function evaluatePassword(pwd: string): PasswordAnalysisResult {
  if (!pwd) {
    return {
      score: 0,
      strength: 'Weak',
      statusClass: 'weak',
      category: 'Awaiting Input',
      status: 'No password entered',
      recommendation: 'Type a candidate password to begin real-time heuristic analysis.',
      conditions: {
        hasLength: false,
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
        hasSpecial: false
      }
    };
  }

  const hasLength = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

  let score = 0;
  if (hasLength) score++;
  if (hasUpper) score++;
  if (hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  let strength: 'Strong' | 'Medium' | 'Weak' = 'Weak';
  let statusClass: 'strong' | 'medium' | 'weak' = 'weak';
  let category = 'Critical Vulnerability';
  let status = 'Fails Baseline Policies';
  let recommendation = '';

  if (score >= 5) {
    strength = 'Strong';
    statusClass = 'strong';
    category = 'Enterprise Grade';
    status = 'Passed All Checks';
    recommendation = 'Excellent entropy. The password meets cryptographic complexity standards.';
  } else if (score >= 3) {
    strength = 'Medium';
    statusClass = 'medium';
    category = 'Moderate Risk';
    status = 'Satisfies Basic Complexity';
    if (!hasSpecial) {
      recommendation = 'Your password is missing a special character (@, #, $, %). Add one to improve its strength.';
    } else if (!hasNumber) {
      recommendation = 'Add numerical digits to prevent targeted dictionary brute-force attacks.';
    } else if (!hasUpper) {
      recommendation = 'Add uppercase letters to expand character search space.';
    } else {
      recommendation = 'Increase password length beyond 12 characters to reach Enterprise strength.';
    }
  } else {
    strength = 'Weak';
    statusClass = 'weak';
    category = 'Critical Vulnerability';
    status = 'Fails Multiple Security Policies';
    if (!hasLength) {
      recommendation = 'Minimum 8 characters required. Passwords with fewer than 8 characters can be cracked in seconds.';
    } else {
      recommendation = 'Combine uppercase, lowercase, numbers, and symbols to achieve baseline resilience.';
    }
  }

  return {
    score,
    strength,
    statusClass,
    category,
    status,
    recommendation,
    conditions: {
      hasLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial
    }
  };
}

export function generateSecurePassword(
  length: number,
  useUpper: boolean,
  useLower: boolean,
  useNumbers: boolean,
  useSpecial: boolean
): string {
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

  let pool = '';
  const guaranteed: string[] = [];

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

  const remaining = Math.max(0, length - guaranteed.length);
  const randomArray = new Uint32Array(remaining);
  window.crypto.getRandomValues(randomArray);

  const passwordChars = [...guaranteed];
  for (let i = 0; i < remaining; i++) {
    passwordChars.push(pool[randomArray[i] % pool.length]);
  }

  // Fisher-Yates CSPRNG shuffle
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const jArray = new Uint32Array(1);
    window.crypto.getRandomValues(jArray);
    const j = jArray[0] % (i + 1);
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join('');
}

function getRandomChar(set: string): string {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return set[array[0] % set.length];
}

export function computeStats(history: AuditLog[]): SecurityStats {
  const total = history.length;
  const strong = history.filter(i => i.strength === 'Strong').length;
  const medium = history.filter(i => i.strength === 'Medium').length;
  const weak = history.filter(i => i.strength === 'Weak').length;

  const scoreDist = [0, 0, 0, 0, 0, 0];
  history.forEach(item => {
    if (item.score >= 0 && item.score <= 5) {
      scoreDist[item.score]++;
    }
  });

  return {
    total,
    strong,
    medium,
    weak,
    percentages: {
      strong: total > 0 ? Math.round((strong / total) * 100) : 0,
      medium: total > 0 ? Math.round((medium / total) * 100) : 0,
      weak: total > 0 ? Math.round((weak / total) * 100) : 0
    },
    scoreDistribution: scoreDist
  };
}
