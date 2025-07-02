
import { describe, it, expect, jest } from '@jest/globals';

const i18n = { changeLanguage: jest.fn() };

function switchLanguage(lng: 'en' | 'fr') {
  i18n.changeLanguage(lng);
}

describe('PrivacyScreen Logic', () => {
  it('changes language to EN', () => {
    switchLanguage('en');
    expect(i18n.changeLanguage).toHaveBeenCalledWith('en');
  });

  it('changes language to FR', () => {
    switchLanguage('fr');
    expect(i18n.changeLanguage).toHaveBeenCalledWith('fr');
  });
});
