const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const instances: Set<Toast> = new Set();
let container: HTMLDivElement;

export interface Action {
  text: string;
  callback?: ActionCallback;
}

export type Message = string | JSX.Element;

export type ActionCallback = (toast: Toast) => void;

export interface ToastOptions {
  /**
   * Automatically destroy the toast in specific timeout (ms)
   * @default `0` which means would not automatically destroy the toast
   */
  timeout?: number;
  /**
   * Toast type
   * @default `default`
   */
  type?: "success" | "error" | "warning" | "dark" | "default";
  action?: Action;
  cancel?: string;
  category?: string;
}

export class Toast {
  message: Message;
  options: ToastOptions;
  el?: HTMLDivElement;
  id: string;
  category?: string;

  private timeoutId?: number;

  constructor(message: Message, options: ToastOptions = {}) {
    const { timeout = 0, action, type = "default", cancel, category } = options;

    this.message = message;
    this.options = {
      timeout,
      action,
      type,
      cancel,
    };

    this.id = Math.random().toString();
    this.category = options.category;

    this.setContainer();

    this.insert();
    instances.add(this);
  }

  insert(): void {
    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("aria-live", "assertive");
    el.setAttribute("aria-atomic", "true");
    el.setAttribute("aria-hidden", "false");

    const { action, type, cancel } = this.options;

    const inner = document.createElement("div");
    inner.className = "toast-inner";

    const text = document.createElement("div");
    text.className = "toast-text";
    inner.classList.add(type as string);

    if (typeof this.message !== "object") {
      text.textContent = String(this.message);
    } else {
      /**
       * It's a React element
       */
      text.appendChild(createElementFromJsx(this.message));
    }

    inner.appendChild(text);

    if (cancel) {
      const button = document.createElement("button");
      button.className = "toast-button cancel-button";
      button.textContent = cancel;
      button.onclick = () => this.destroy();
      inner.appendChild(button);
    }

    if (action) {
      const button = document.createElement("button");
      button.className = "toast-button";
      button.textContent = action.text;
      button.onclick = () => {
        this.stopTimer();
        if (action.callback) action.callback(this);
        else this.destroy();
      };
      inner.appendChild(button);
    }

    el.appendChild(inner);

    this.startTimer();

    this.el = el;

    container.appendChild(el);

    // Delay to set slide-up transition
    waitFor(50).then(sortToast);
  }

  destroy(): void {
    const { el } = this;
    if (!el) return;

    el.style.opacity = "0";
    el.style.visibility = "hidden";
    el.style.transform = "translateY(10px)";

    this.stopTimer();

    setTimeout(() => {
      container.removeChild(el);
      instances.delete(this);
      sortToast();
    }, 150);
  }

  setContainer(): void {
    container = document.querySelector(".toast-container") as HTMLDivElement;
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    // Stop all instance timer when mouse enter
    container.addEventListener("mouseenter", () => {
      instances.forEach((instance) => instance.stopTimer());
    });

    // Restart all instance timer when mouse leave
    container.addEventListener("mouseleave", () => {
      instances.forEach((instance) => instance.startTimer());
    });
  }

  startTimer(): void {
    if (this.options.timeout && !this.timeoutId) {
      this.timeoutId = self.setTimeout(
        () => this.destroy(),
        this.options.timeout
      );
    }
  }

  stopTimer(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }
}

export function createToast(message: Message, options?: ToastOptions): string {
  if (options?.category) {
    /**
     * Only ever show one toast per category.
     */
    destroyToastsByCategory(options.category);
  }

  const toast = new Toast(message, options);

  return toast.id;
}

export function destroyToastById(toastId: string) {
  instances.forEach((instance) => {
    if (instance.id === toastId) {
      instance.destroy();
    }
  });
}

export function destroyToastsByCategory(category: string) {
  instances.forEach((instance) => {
    if (instance.category === category) {
      instance.destroy();
    }
  });
}

export function destroyAllToasts(): void {
  if (!container) return;

  instances.forEach((instance) => {
    instance.destroy();
  });
}

function sortToast(): void {
  const toasts = Array.from(instances).reverse().slice(0, 4);

  const heights: Array<number> = [];

  toasts.forEach((toast, index) => {
    const sortIndex = index + 1;
    const el = toast.el as HTMLDivElement;
    const height = +(el.getAttribute("data-height") || 0) || el.clientHeight;

    heights.push(height);

    el.className = `toast toast-${sortIndex}`;
    el.dataset.height = `${height}`;
    el.style.setProperty("--index", `${sortIndex}`);
    el.style.setProperty("--height", `${height}px`);
    el.style.setProperty("--front-height", `${heights[0]}px`);

    if (sortIndex > 1) {
      const hoverOffsetY = heights
        .slice(0, sortIndex - 1)
        .reduce((res, next) => (res += next), 0);
      el.style.setProperty("--hover-offset-y", `-${hoverOffsetY}px`);
    } else {
      el.style.removeProperty("--hover-offset-y");
    }
  });
}

const createElementFromJsx = (
  node: JSX.Element | string
): HTMLElement | Text => {
  if (typeof node === "string") {
    return document.createTextNode(node);
  }

  const element = document.createElement(node.type);
  const { children, ...props } = node.props || {};

  for (const propName in props) {
    if (props.hasOwnProperty(propName) && propName !== "children") {
      element.setAttribute(propName, props[propName]);
    }
  }

  if (children) {
    const childNodes = Array.isArray(children) ? children : [children];
    for (const child of childNodes) {
      const childElement = createElementFromJsx(child);
      element.appendChild(childElement);
    }
  }

  return element;
};
