import './style.css';
import { requestStripe } from 'request-stripe';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <button id="run" type="button">requestStripe()</button>
`;

document
  .querySelector<HTMLButtonElement>('#run')!
  .addEventListener('click', () => {
    setTimeout(requestStripe(), 1000);
  });
