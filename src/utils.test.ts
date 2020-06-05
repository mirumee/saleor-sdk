
import { filterNotEmptyArrayItems } from './utils';

test('Test for empty items', () => {
    expect(filterNotEmptyArrayItems(undefined)).toBe(false);
    expect(filterNotEmptyArrayItems(null)).toBe(false);
  });

  test('Test for non-empty items', () => {
    expect(filterNotEmptyArrayItems("I'm non empty")).toBe(true);
    expect(filterNotEmptyArrayItems({hello: "world"})).toBe(true);
  });