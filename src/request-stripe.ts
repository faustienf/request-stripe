import styles from './request-stripe.css';

export type Render = (onComplete: () => void) => () => void;

const random = () => Math.random().toString(32).slice(2);
const generateToken = () => random() + random();
const requests = new Set<string>();
const processes = new Set<ReturnType<Render>>();

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

const startProcess = (render: Render) => {
  const endProcess = [...processes].at(-1);
  if (endProcess) {
    return endProcess;
  }

  const finish = render(() => {
    processes.delete(finish);
  });
  processes.add(finish);

  return finish;
};

export const requestStripe = (render: Render = defaultRender) => {
  const requestId = generateToken();
  requests.add(requestId);

  const endProcess = startProcess(render);

  return () => {
    requests.delete(requestId);
    if (!requests.size) {
      endProcess();
    }
  };
};
