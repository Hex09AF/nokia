import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useTyping } from '../../hooks/useTyping.ts';

// Mock setTimeout and clearTimeout for timer control
vi.useFakeTimers();

// Helper to dispatch a keyboard event
const dispatchKeyEvent = (key: string) => {
  const event = new KeyboardEvent('keydown', { key });
  window.dispatchEvent(event);
};

describe('useTyping Hook', () => {
  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useTyping());
    expect(result.current[0]).toEqual({
      message: '',
      isTyping: false,
      round: -1,
      char: '',
      key: undefined,
      timerId: undefined,
    });
  });

  it('handles non-digit key presses', () => {
    const { result } = renderHook(() => useTyping());
    act(() => {
      dispatchKeyEvent('a');
    });
    expect(result.current[0]).toEqual({
      message: '',
      isTyping: false,
      round: -1,
      char: '',
      key: undefined,
      timerId: undefined,
    });
  });

  it('handles digit key press and cycles through characters', () => {
    const { result } = renderHook(() => useTyping());

    // Press '2' key (maps to ['a', 'b', 'c', '2'])
    act(() => {
      dispatchKeyEvent('2');
    });
    expect(result.current[0]).toEqual({
      message: '',
      isTyping: true,
      round: 0,
      char: 'a',
      key: '2',
      timerId: expect.any(Object),
    });

    // Press '2' again (cycles to 'b')
    act(() => {
      dispatchKeyEvent('2');
    });
    expect(result.current[0]).toEqual({
      message: '',
      isTyping: true,
      round: 1,
      char: 'b',
      key: '2',
      timerId: expect.any(Object),
    });

    // Press '2' again (cycles to 'c')
    act(() => {
      dispatchKeyEvent('2');
    });
    expect(result.current[0]).toEqual({
      message: '',
      isTyping: true,
      round: 2,
      char: 'c',
      key: '2',
      timerId: expect.any(Object),
    });

    // Press '2' again (cycles to '2')
    act(() => {
      dispatchKeyEvent('2');
    });
    expect(result.current[0]).toEqual({
      message: '',
      isTyping: true,
      round: 3,
      char: '2',
      key: '2',
      timerId: expect.any(Object),
    });

    // Press '2' again (cycles back to 'a')
    act(() => {
      dispatchKeyEvent('2');
    });
    expect(result.current[0]).toEqual({
      message: '',
      isTyping: true,
      round: 0,
      char: 'a',
      key: '2',
      timerId: expect.any(Object),
    });
  });

  it('commits character to message after timeout', () => {
    const { result } = renderHook(() => useTyping());

    // Press '2' key (selects 'a')
    act(() => {
      dispatchKeyEvent('2');
    });
    expect(result.current[0]).toEqual({
      message: '',
      isTyping: true,
      round: 0,
      char: 'a',
      key: '2',
      timerId: expect.any(Object),
    });

    // Advance timer by 450ms to trigger commit
    act(() => {
      vi.advanceTimersByTime(450);
    });
    expect(result.current[0]).toEqual({
      message: 'a',
      isTyping: false,
      round: -1,
      char: '',
      key: undefined,
      timerId: undefined,
    });
  });

  it('handles different keys and commits previous char', () => {
    const { result } = renderHook(() => useTyping());

    // Press '2' key (selects 'a')
    act(() => {
      dispatchKeyEvent('2');
    });
    expect(result.current[0]).toEqual({
      message: '',
      isTyping: true,
      round: 0,
      char: 'a',
      key: '2',
      timerId: expect.any(Object),
    });

    // Press '3' key (commits 'a' and selects 'd')
    act(() => {
      dispatchKeyEvent('3');
    });
    expect(result.current[0]).toEqual({
      message: 'a',
      isTyping: true,
      round: 0,
      char: 'd',
      key: '3',
      timerId: expect.any(Object),
    });

    // Advance timer to commit 'd'
    act(() => {
      vi.advanceTimersByTime(450);
    });
    expect(result.current[0]).toEqual({
      message: 'ad',
      isTyping: false,
      round: -1,
      char: '',
      key: undefined,
      timerId: undefined,
    });
  });

  it('handles backspace to remove last character', () => {
    const { result } = renderHook(() => useTyping());

    // Set up a message by pressing '2' and committing 'a'
    act(() => {
      dispatchKeyEvent('2');
      vi.advanceTimersByTime(450);
    });
    expect(result.current[0].message).toBe('a');

    // Press Backspace
    act(() => {
      dispatchKeyEvent('Backspace');
    });
    expect(result.current[0]).toEqual({
      message: '',
      isTyping: false,
      round: -1,
      char: '',
      key: undefined,
      timerId: undefined,
    });
  });

  it('handles backspace while typing (cancels current char)', () => {
    const { result } = renderHook(() => useTyping());

    // Press '2' key (selects 'a')
    act(() => {
      dispatchKeyEvent('2');
    });
    expect(result.current[0]).toEqual({
      message: '',
      isTyping: true,
      round: 0,
      char: 'a',
      key: '2',
      timerId: expect.any(Object),
    });

    // Press Backspace while typing
    act(() => {
      dispatchKeyEvent('Backspace');
    });
    expect(result.current[0]).toEqual({
      message: '',
      isTyping: false,
      round: -1,
      char: '',
      key: undefined,
      timerId: undefined,
    });
  });

  it('handles special keys like * and #', () => {
    const { result } = renderHook(() => useTyping());

    // Press '*' key (maps to ['+', '*'])
    act(() => {
      dispatchKeyEvent('*');
    });
    expect(result.current[0]).toEqual({
      message: '',
      isTyping: true,
      round: 0,
      char: '+',
      key: '*',
      timerId: expect.any(Object),
    });

    // Press '*' again (cycles to '*')
    act(() => {
      dispatchKeyEvent('*');
    });
    expect(result.current[0]).toEqual({
      message: '',
      isTyping: true,
      round: 1,
      char: '*',
      key: '*',
      timerId: expect.any(Object),
    });

    // Advance timer to commit '*'
    act(() => {
      vi.advanceTimersByTime(450);
    });
    expect(result.current[0]).toEqual({
      message: '*',
      isTyping: false,
      round: -1,
      char: '',
      key: undefined,
      timerId: undefined,
    });
  });
});
