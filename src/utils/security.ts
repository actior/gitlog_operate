export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function sanitizeRedirectPath(redirect: unknown): string {
  if (typeof redirect !== 'string') {
    return '/'
  }

  // 仅允许站内相对路径，防止开放重定向（如 https://evil.com）
  if (!redirect.startsWith('/')) {
    return '/'
  }
  if (redirect.startsWith('//')) {
    return '/'
  }

  return redirect
}

