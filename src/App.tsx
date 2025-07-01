import { useEffect, useState } from 'react';
import './index.css';
import { icons } from './assets/icons.tsx';
import { cn } from './utils';
import { type DigitKey, isDigitKey, KEYPADS, type TypingEventHandler, useTyping } from './hooks/useTyping.ts';

function App() {
  const [typingCtx] = useTyping();

  return (
    <div className="bg-base-100 drawer mx-auto max-w-[100rem] lg:drawer-open">
      <div className="drawer-content">
        <div className="relative max-w-[100vw] px-6 pb-16 xl:pe-2">
          <div className="flex flex-col-reverse justify-between gap-6 xl:flex-row">
            <div className="prose prose-sm md:prose-base w-full max-w-4xl grow pt-10 m-auto">
              <div className="component-preview not-prose text-base-content my-6 lg:my-12" id="button">
                <div className="flex items-center gap-2 pb-3 text-sm font-bold">
                  <a
                    className="bg-base-100 hover:bg-primary/10 text-base-content/50 hover:text-base-content border-primary/5 hover:border-primary/10 hover:shadow-base-200 inline-grid size-6 place-content-center rounded-sm border hover:shadow-sm"
                    href="#button"
                  >
                    {icons['#']}
                  </a>
                  <h4 className="component-preview-title mt-2 mb-1 text-lg font-semibold">Button</h4>
                </div>

                <div className="tabs tabs-lift">
                  {/* Preview Tab */}
                  <input
                    type="radio"
                    className="tab [--tab-p:.75rem]"
                    name="buttonTabs"
                    aria-label="Preview"
                    defaultChecked
                  />
                  <div className="tab-content border-base-300 overflow-x-auto">
                    <div className="preview bg-base-100 relative flex min-h-[6rem] max-w-4xl min-w-[18rem] flex-wrap items-center justify-center gap-2 overflow-x-hidden bg-cover bg-top p-4 xl:py-10">
                      <fieldset className="fieldset">
                        <legend className="fieldset-legend">Messages</legend>
                        {typingCtx.message.split('').map((char) => {
                          return char;
                        })}
                        {typingCtx.char}| <p className="label">You can edit page title later on from settings</p>
                      </fieldset>
                    </div>

                    <div className="preview bg-base-100 relative flex min-h-[6rem] max-w-4xl min-w-[18rem] flex-wrap items-center justify-center gap-2 overflow-x-hidden bg-cover bg-top p-4 xl:py-10">
                      <Keyboards />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

const excludeDigitKey = (digitKey: string) => (char: string) => char !== digitKey;

const Keyboards = () => {
  const [pushedKey, setPushedKey] = useState<DigitKey>();

  useEffect(() => {
    const typingHandler: TypingEventHandler<void> = (event) => {
      const { key } = event;
      if (!isDigitKey(key)) {
        return;
      }
      setPushedKey(key);
    };

    const finishTypingHandler: TypingEventHandler<void> = (event) => {
      const { key } = event;
      if (!isDigitKey(key)) {
        return;
      }
      setPushedKey(undefined);
    };

    window.addEventListener('keydown', typingHandler);
    window.addEventListener('keyup', finishTypingHandler);

    return () => {
      window.removeEventListener('keydown', typingHandler);
      window.removeEventListener('keyup', finishTypingHandler);
    };
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {KEYPADS.map((keypad, index) => {
        const reversedKey = index % 3 === 2;
        return (
          <div key={keypad.key} className="pushable">
            <button className={cn('btn w-full', pushedKey === keypad.key && 'btn-active')}>
              {!reversedKey && <h1 className="text-xl">{keypad.key}</h1>}
              {keypad.chars.filter(excludeDigitKey(keypad.key)).join('')}
              {reversedKey && <h1 className="text-xl">{keypad.key}</h1>}
            </button>
          </div>
        );
      })}
    </div>
  );
};
