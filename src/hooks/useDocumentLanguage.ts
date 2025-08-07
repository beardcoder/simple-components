export function useDocumentLanguage(): string {
  const htmlElement = document.documentElement;
  return htmlElement.lang || 'en';
}
