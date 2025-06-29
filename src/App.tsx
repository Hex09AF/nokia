import { useEffect, useState } from "react";
import { cn } from "~/utils";
import { icons } from "~icons";

type DigitKey = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "0" | "*" | "#";

const isDigitKey = (key: string): key is DigitKey => {
  return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "*", "#"].includes(key);
};

const getCharsForKey = (key: DigitKey): string[] => KEYPADS.find((k) => k.key === key)?.chars ?? [];

interface KeyMapping {
  key: DigitKey;
  chars: string[];
}

const KEYPADS: KeyMapping[] = [
  { key: "1", chars: [".", ",", "?", "!", "1"] },
  { key: "2", chars: ["a", "b", "c", "2"] },
  { key: "3", chars: ["d", "e", "f", "3"] },
  { key: "4", chars: ["g", "h", "i", "4"] },
  { key: "5", chars: ["j", "k", "l", "5"] },
  { key: "6", chars: ["m", "n", "o", "6"] },
  { key: "7", chars: ["p", "q", "r", "s", "7"] },
  { key: "8", chars: ["t", "u", "v", "8"] },
  { key: "9", chars: ["w", "x", "y", "z", "9"] },
  { key: "*", chars: ["+", "*"] },
  { key: "0", chars: [" ", "0"] },
  { key: "#", chars: ["#"] },
];

type TypingEventHandler<T> = (event: KeyboardEvent) => T;

type TypingCtx = {
  message: string;
  isTyping: boolean;
  round: number;
  char: string;
  key?: DigitKey;
  timerId?: ReturnType<typeof setTimeout>;
};

const useTyping = (): [TypingCtx] => {
  const [typingCtx, setTypingCtx] = useState<TypingCtx>({
    message: "",
    isTyping: false,
    round: -1,
    char: "",
    key: undefined,
    timerId: undefined,
  });

  useEffect(() => {
    const typingEventHandler: TypingEventHandler<void> = (event) => {
      const { key } = event;
      clearTimeout(typingCtx.timerId);

      if (key === "Backspace") {
        setTypingCtx((preVal) => ({
          message: preVal.char ? preVal.message : preVal.message.slice(0, -1),
          isTyping: false,
          round: -1,
          char: "",
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
          char: "",
          key: undefined,
          timerId: undefined,
        }));
      }, 450);

      setTypingCtx((preVal) => {
        const is = preVal.char !== "" && preVal.key !== key;
        const chars = getCharsForKey(key);
        const round = !is && chars.length ? (preVal.round + 1) % chars.length : 0;
        const char = chars[round];

        return {
          message: preVal.message + (is ? preVal.char : ""),
          isTyping: true,
          round,
          char: char,
          key,
          timerId,
        };
      });
    };

    window.addEventListener("keydown", typingEventHandler);

    return () => window.removeEventListener("keydown", typingEventHandler);
  }, [typingCtx.timerId]);

  return [typingCtx];
};

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
                    {icons["#"]}
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
                        {typingCtx.message.split("").map((char) => {
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

    window.addEventListener("keydown", typingHandler);
    window.addEventListener("keyup", finishTypingHandler);

    return () => {
      window.removeEventListener("keydown", typingHandler);
      window.removeEventListener("keyup", finishTypingHandler);
    };
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {KEYPADS.map((keypad, index) => {
        const reversedKey = index % 3 === 2;
        return (
          <div key={keypad.key} className="pushable">
            <button className={cn("btn w-full", pushedKey === keypad.key && "btn-active")}>
              {!reversedKey && <h1 className="text-xl">{keypad.key}</h1>}
              {keypad.chars.filter(excludeDigitKey(keypad.key)).join("")}
              {reversedKey && <h1 className="text-xl">{keypad.key}</h1>}
            </button>
          </div>
        );
      })}
    </div>
  );
};
