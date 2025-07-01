import { useEffect, useState } from 'react';

export type DigitKey = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0' | '*' | '#';

export const isDigitKey = (key: string): key is DigitKey => {
  return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '*', '#'].includes(key);
};

const getCharsForKey = (key: DigitKey): string[] => KEYPADS.find((k) => k.key === key)?.chars ?? [];

interface KeyMapping {
  key: DigitKey;
  chars: string[];
}

export const KEYPADS: KeyMapping[] = [
  { key: '1', chars: ['.', ',', '?', '!', '1'] },
  { key: '2', chars: ['a', 'b', 'c', '2'] },
  { key: '3', chars: ['d', 'e', 'f', '3'] },
  { key: '4', chars: ['g', 'h', 'i', '4'] },
  { key: '5', chars: ['j', 'k', 'l', '5'] },
  { key: '6', chars: ['m', 'n', 'o', '6'] },
  { key: '7', chars: ['p', 'q', 'r', 's', '7'] },
  { key: '8', chars: ['t', 'u', 'v', '8'] },
  { key: '9', chars: ['w', 'x', 'y', 'z', '9'] },
  { key: '*', chars: ['+', '*'] },
  { key: '0', chars: [' ', '0'] },
  { key: '#', chars: ['#'] },
];

export type TypingEventHandler<T> = (event: KeyboardEvent) => T;

type TypingCtx = {
  message: string;
  isTyping: boolean;
  round: number;
  char: string;
  key?: DigitKey;
  timerId?: ReturnType<typeof setTimeout>;
};

export const useTyping = (): [TypingCtx] => {
  const [typingCtx, setTypingCtx] = useState<TypingCtx>({
    message: '',
    isTyping: false,
    round: -1,
    char: '',
    key: undefined,
    timerId: undefined,
  });

  useEffect(() => {
    const typingEventHandler: TypingEventHandler<void> = (event) => {
      const { key } = event;
      clearTimeout(typingCtx.timerId);

      if (key === 'Backspace') {
        setTypingCtx((preVal) => ({
          message: preVal.char ? preVal.message : preVal.message.slice(0, -1),
          isTyping: false,
          round: -1,
          char: '',
          key: undefined,
          timerId: undefined,
        }));
        return;
      }

      if (!isDigitKey(key)) {
        return;
      }

      const timerId = setTimeout(() => {
        setTypingCtx((preVal) => ({
          message: preVal.message + preVal.char,
          isTyping: false,
          round: -1,
          char: '',
          key: undefined,
          timerId: undefined,
        }));
      }, 450);

      setTypingCtx((preVal) => {
        const is = preVal.char !== '' && preVal.key !== key;
        const chars = getCharsForKey(key);
        const round = !is && chars.length ? (preVal.round + 1) % chars.length : 0;
        const char = chars[round];

        return {
          message: preVal.message + (is ? preVal.char : ''),
          isTyping: true,
          round,
          char: char,
          key,
          timerId,
        };
      });
    };

    window.addEventListener('keydown', typingEventHandler);

    return () => window.removeEventListener('keydown', typingEventHandler);
  }, [typingCtx.timerId]);

  return [typingCtx];
};
