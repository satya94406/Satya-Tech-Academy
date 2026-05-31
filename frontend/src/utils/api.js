const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const API_BASE = API_URL

export function getToken() {
  return localStorage.getItem('token')
}

export function getUser() {
  return JSON.parse(localStorage.getItem('user') || '{}')
}

export function saveAuth(authResponse) {
  localStorage.setItem('token', authResponse.token)
  localStorage.setItem(
    'user',
    JSON.stringify({
      name: authResponse.name,
      email: authResponse.email,
      role: authResponse.role,
    }),
  )
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/'
}

async function request(path, options = {}) {
  const {
    method = 'GET',
    body,
    auth = true,
  } = options

  const headers = {
    'Content-Type': 'application/json',
  }

  const token = getToken()

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Request failed')
  }

  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

export const authApi = {
  register: (data) => request('/auth/register', {
    method: 'POST',
    body: data,
    auth: false,
  }),

  login: (data) => request('/auth/login', {
    method: 'POST',
    body: data,
    auth: false,
  }),
}

export const studentApi = {
  enroll: (data) => request('/student/enroll', {
    method: 'POST',
    body: data,
  }),

  requestCertificate: (data) => request('/student/certificates/request', {
    method: 'POST',
    body: data,
  }),

  myCertificates: () => request('/student/certificates/my'),

  myEnrollments: () => request('/student/enrollments'),
}

export const adminApi = {
  enrollments: () => request('/admin/enrollments'),

  certificates: (status = '') => request(
    `/admin/certificates${status ? `?status=${status}` : ''}`,
  ),

  approve: (id) => request(`/admin/certificates/${id}/approve`, {
    method: 'PUT',
  }),

  reject: (id, remark) => request(`/admin/certificates/${id}/reject`, {
    method: 'PUT',
    body: { remark },
  }),

  approvePayment: (id) => request(`/admin/enrollments/${id}/approve-payment`, {
    method: 'PUT',
  }),

  rejectPayment: (id, remark) => request(`/admin/enrollments/${id}/reject-payment`, {
    method: 'PUT',
    body: { remark },
  }),
}

export const publicApi = {
  certificate: (serialNo) => request(`/public/certificates/${serialNo}`, {
    auth: false,
  }),

  verify: (serialNo) => request(`/public/verify/${serialNo}`, {
    auth: false,
  }),
}
