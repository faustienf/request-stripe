import styles from './request-stripe.css';

const random = () => Math.random().toString(32).slice(2);
const generateToken = () => random() + random();
const requests = new Set<string>();

export const defaultRender = (() => {
  let finish: null | (() => void) = null;

  return () => {
    if (finish) {
      return finish;
    }

    const stripeElement = document.createElement('div');
    stripeElement.classList.add('RequestStripe');
    stripeElement.classList.add(styles['request-stripe']);
    stripeElement.dataset.state = 'process';

    finish = () => {
      stripeElement.dataset.state = 'finish';
      finish = null;
    };

    stripeElement.addEventListener('animationend', () => {
      document.body.removeChild(stripeElement);

      if (stripeElement.dataset.state !== 'finish') {
        finish = null;
        throw new Error("Request hasn't been finished correctly");
      }
    });

    document.body.appendChild(stripeElement);

    return finish;
  };
})();

type Options = {
  render: () => () => void;
};

export const requestStripe = (options: Partial<Options> = {}) => {
  const { render = defaultRender } = options;

  const requestId = generateToken();
  requests.add(requestId);

  const finish = render();

  return () => {
    requests.delete(requestId);
    if (!requests.size) {
      finish();
    }
  };
};
