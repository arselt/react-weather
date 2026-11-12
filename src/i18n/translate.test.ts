import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectLanguage, getLocale, isLanguage, translate } from './translate.ts';
import { en, es } from './messages.ts';

test('translate returns the message for the chosen language', () => {
  assert.equal(translate('en', 'search.submit'), 'Search');
  assert.equal(translate('es', 'search.submit'), 'Buscar');
});

test('translate fills {placeholders} and keeps unknown ones visible', () => {
  assert.equal(translate('en', 'weather.rain', { chance: 40 }), '40% rain');
  assert.equal(translate('es', 'weather.rain', { chance: 40 }), '40% lluvia');
  assert.equal(translate('en', 'weather.rain'), '{chance}% rain');
});

test('every English key has a Spanish translation', () => {
  for (const key of Object.keys(en)) {
    assert.ok(es[key as keyof typeof es], `missing Spanish for ${key}`);
  }
});

test('detectLanguage picks Spanish for Spanish browsers and English otherwise', () => {
  assert.equal(detectLanguage('es-MX'), 'es');
  assert.equal(detectLanguage('es'), 'es');
  assert.equal(detectLanguage('en-US'), 'en');
  assert.equal(detectLanguage('fr-FR'), 'en');
});

test('isLanguage accepts only supported languages and getLocale maps them', () => {
  assert.equal(isLanguage('es'), true);
  assert.equal(isLanguage('fr'), false);
  assert.equal(getLocale('es'), 'es-MX');
  assert.equal(getLocale('en'), 'en-US');
});
