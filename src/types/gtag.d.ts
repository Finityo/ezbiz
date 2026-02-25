// Google Analytics gtag.js type declarations
interface Window {
  gtag: (...args: any[]) => void;
  dataLayer: any[];
}
