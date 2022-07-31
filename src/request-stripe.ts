import styles from './request-stripe.css';

export type Render = (onComplete: (error: Error | null) => void) => () => void;

const random = () => Math.random().toString(32).slice(2);
const generateToken = () => random() + random();
const requests = new Set<string>();

export const defaultRender: Render = (onComplete) => {
  const stripeElement = document.createElement('div');
  stripeElement.classList.add('RequestStripe');
  stripeElement.classList.add(styles['request-stripe']);
  stripeElement.dataset.state = 'process';

  stripeElement.addEventListener('animationend', () => {
    document.body.removeChild(stripeElement);

    const error =
      stripeElement.dataset.state !== 'finish'
        ? new Error("Request hasn't been finished correctly")
        : null;

    onComplete(error);
  });

  document.body.appendChild(stripeElement);

  return () => {
    // finish animation and trigger animationend Event
    stripeElement.dataset.state = 'finish';
  };
};

const startProcess = (() => {
  let endProcess: null | (() => void) = null;

  return (render: Render) => {
    if (endProcess) {
      return endProcess;
    }

    const finish = render((error) => {
      if (error) {
        endProcess = null;
        throw error;
      }
    });

    endProcess = () => {
      finish();
      endProcess = null;
    };

    return endProcess;
  };
})();

type Options = {
  render: Render;
};

export const requestStripe = (options: Partial<Options> = {}) => {
  const { render = defaultRender } = options;

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
