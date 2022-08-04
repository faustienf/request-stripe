import styles from './request-stripe.css';

type Finish = () => void;
export type Render = () => Finish;

const random = () => Math.random().toString(32).slice(2);
const makeId = () => random() + random();
const requests = new Set<string>();
const cleanups = new Set<ReturnType<Render>>();

const defaultRender: Render = () => {
  const stripeElement = document.createElement('div');
  stripeElement.classList.add(styles['request-stripe']);
  stripeElement.classList.add('request-stripe-custom');

  let animations = 0;

  stripeElement.addEventListener('transitionrun', () => {
    animations += 1;
  });

  stripeElement.addEventListener('transitioncancel', () => {
    animations -= 1;
  });

  stripeElement.addEventListener('transitionend', () => {
    animations -= 1;

    if (animations) {
      return;
    }

    if (stripeElement.dataset.state !== 'finish') {
      throw new Error("Request hasn't been finished correctly");
    }

    document.body.removeChild(stripeElement);
  });

  document.body.appendChild(stripeElement);

  // call reflow
  stripeElement.getBoundingClientRect();
  // run transition after reflow
  stripeElement.dataset.state = 'process';

  return () => {
    // run finish transition
    stripeElement.dataset.state = 'finish';
  };
};

export const requestStripe = (render: Render = defaultRender) => {
  const requestId = makeId();
  requests.add(requestId);

  if (!cleanups.size) {
    const finish = render();
    const cleanup = () => {
      finish();
      requests.delete(requestId);
      cleanups.delete(cleanup);
    };
    cleanups.add(cleanup);
  }

  return () => {
    requests.delete(requestId);
    const cleanup = [...cleanups].at(-1);
    if (!requests.size && cleanup) {
      cleanup();
    }
  };
};
