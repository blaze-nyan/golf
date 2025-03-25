/* eslint-disable @typescript-eslint/no-explicit-any */
// types/driver.d.ts
declare module "driver.js" {
  export const driver: any;
  interface DriverOptions {
    animate?: boolean;
    opacity?: number;
    padding?: number;
    showButtons?: string[];
    doneBtnText?: string;
    closeBtnText?: string;
    nextBtnText?: string;
    prevBtnText?: string;
    keyboardControl?: boolean;
    overlayClickNext?: boolean;
    stagePadding?: number;
    smoothScroll?: boolean;
    onHighlightStarted?: (element: any) => void;
    onDeselected?: (element: any) => void;
    onReset?: () => void;
    [key: string]: any;
  }

  interface StepOptions {
    element: string | HTMLElement;
    popover: {
      title?: string;
      description?: string;
      position?: string;
      [key: string]: any;
    };
    [key: string]: any;
  }

  class Driver {
    constructor(options?: DriverOptions);
    defineSteps(steps: StepOptions[]): void;
    start(stepNumber?: number): void;
    highlight(element: string | HTMLElement): void;
    reset(): void;
    // Add other methods as needed
  }

  export default Driver;
}
