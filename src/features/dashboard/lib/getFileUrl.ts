// Resolve a stored file path (relative or absolute) to a full URL.
export const getFileUrl = (path: string | undefined | null) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = ((import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace('/api', '');
  return `${baseUrl}${path}`;
};
