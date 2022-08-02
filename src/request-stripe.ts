import styles from './request-stripe.css';

export type Render = (onComplete: () => void) => () => void;

const random = () => Math.random().toString(32).slice(2);
const makeId = () => random() + random();
const requests = new Set<string>();
const surrenders = new Set<ReturnType<Render>>();

export const defaultRender: Render = (onComplete) => {
  const stripeElement = document.createElement('div');
  stripeElement.classList.add(styles['request-stripe']);
  stripeElement.classList.add('request-stripe-custom');
  stripeElement.dataset.state = 'process';

  stripeElement.addEventListener('animationend', () => {
    onComplete();
    document.body.removeChild(stripeElement);

    if (stripeElement.dataset.state !== 'finish') {
      throw new Error("Request hasn't been finished correctly");
    }
  });

  document.body.appendChild(stripeElement);

  return () => {
    onComplete();
    // finish animation and trigger animationend Event
    stripeElement.dataset.state = 'finish';
  };
};

export const requestStripe = (render: Render = defaultRender) => {
  const requestId = makeId();
  requests.add(requestId);

  if (!surrenders.size) {
    const surrender = render(() => {
      requests.delete(requestId);
      surrenders.delete(surrender);
    });
    surrenders.add(surrender);
  }

  return () => {
    requests.delete(requestId);
    const surrender = [...surrenders].at(-1);
    if (!requests.size && surrender) {
      surrender();
    }
  };
};
