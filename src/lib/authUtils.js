const AUTH_ERRORS = {
  'Invalid login credentials': '이메일 또는 비밀번호가 올바르지 않습니다.',
  invalid_credentials: '이메일 또는 비밀번호가 올바르지 않습니다.',
  'Email not confirmed': '이메일 인증이 완료되지 않았습니다. 확인 메일을 확인해 주세요.',
  email_not_confirmed: '이메일 인증이 완료되지 않았습니다. 확인 메일을 확인해 주세요.',
  'User already registered': '이미 가입된 이메일입니다.',
  user_already_exists: '이미 가입된 이메일입니다.',
  'Password should be at least 6 characters': '비밀번호는 최소 8자 이상이어야 합니다.',
  'Unable to validate email address: invalid format': '올바른 이메일 형식이 아닙니다.',
  'Email rate limit exceeded': '잠시 후 다시 시도해 주세요.',
  over_email_send_rate_limit: '잠시 후 다시 시도해 주세요.',
  over_request_rate_limit: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
  'Too many requests': '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
  signup_disabled: '현재 회원가입이 비활성화되어 있습니다.',
  email_address_not_authorized: '허용되지 않은 이메일 주소입니다.',
  weak_password: '비밀번호 보안 기준을 충족하지 않습니다.',
  same_password: '기존 비밀번호와 다른 비밀번호를 입력해 주세요.',
  session_expired: '재설정 링크가 만료되었습니다. 새 링크를 요청해 주세요.',
  session_not_found: '유효한 재설정 세션을 찾을 수 없습니다. 새 링크를 요청해 주세요.',
}

export const translateAuthError = (error) => {
  if (error?.code && AUTH_ERRORS[error.code]) {
    return AUTH_ERRORS[error.code]
  }

  for (const [key, value] of Object.entries(AUTH_ERRORS)) {
    if (error?.message?.includes(key)) {
      return value
    }
  }

  return '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.'
}

export const isExistingAccountError = (error) => {
  return (
    error?.code === 'user_already_exists' ||
    error?.message?.includes('User already registered')
  )
}

export const validatePassword = (password) => {
  if (password.length < 8) {
    return '비밀번호는 최소 8자 이상이어야 합니다.'
  }
  if (!/[A-Za-z]/.test(password)) {
    return '비밀번호에 영문자를 포함해야 합니다.'
  }
  if (!/[0-9]/.test(password)) {
    return '비밀번호에 숫자를 포함해야 합니다.'
  }
  return null
}

export const getAuthRedirectUrl = (path) => {
  const baseUrl = new URL(import.meta.env.BASE_URL, window.location.origin)
  return new URL(path.replace(/^\//, ''), baseUrl).toString()
}
