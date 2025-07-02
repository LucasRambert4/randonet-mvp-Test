import { describe, it, expect, jest } from '@jest/globals';

function handleSubmit(onSearch?: () => void) {
  if (onSearch) onSearch();
}

describe('SearchBar Logic', () => {
  it('calls onSearch if provided', () => {
    const mockSearch = jest.fn();
    handleSubmit(mockSearch);
    expect(mockSearch).toHaveBeenCalled();
  });

  it('does nothing if onSearch is undefined', () => {
    expect(() => handleSubmit()).not.toThrow();
  });
});
