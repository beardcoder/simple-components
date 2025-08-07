import { describe, expect, it } from 'vitest';
import { useDocumentLanguage } from './useDocumentLanguage';

describe('Document Language Hook', () => {
  describe('useDocumentLanguage', () => {
    it('should return the fallback document language', () => {
      const lang = useDocumentLanguage();
      expect(lang).toBe('en');
    });

    it('should return the fallback document language', () => {
      global.document.documentElement.lang = 'de';

      const lang = useDocumentLanguage();
      expect(lang).toBe('de');
    });
  });
});
