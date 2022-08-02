import { expect, test, vi } from 'vitest';
import { Render, requestStripe } from '../src';

test('render and cleanup', () => {
  const renderSpy = vi.fn();
  const surrenderSpy = vi.fn();

  const render: Render = (onComplete) => {
    renderSpy();
    return () => {
      surrenderSpy();
      onComplete();
    };
  };

  const done = requestStripe(render);

  expect(renderSpy).toBeCalledTimes(1);
  expect(surrenderSpy).toBeCalledTimes(0);

  done();

  expect(surrenderSpy).toBeCalledTimes(1);
});

test('combine requests', () => {
  const renderSpy = vi.fn();
  const surrenderSpy = vi.fn();

  const render: Render = (onComplete) => {
    renderSpy();
    return () => {
      surrenderSpy();
      onComplete();
    };
  };

  const done1 = requestStripe(render);
  const done2 = requestStripe(render);
  const done3 = requestStripe(render);

  expect(renderSpy).toBeCalledTimes(1);
  expect(surrenderSpy).toBeCalledTimes(0);

  done1();
  done3();
  done2();

  expect(renderSpy).toBeCalledTimes(1);
  expect(surrenderSpy).toBeCalledTimes(1);
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test('break rendering', async () => {
  const renderSpy = vi.fn();
  const surrenderSpy = vi.fn();

  const render: Render = (onComplete) => {
    renderSpy();
    return () => {
      surrenderSpy();
      onComplete();
    };
  };

  const renderBreak: Render = (onComplete) => {
    renderSpy();
    setTimeout(() => {
      onComplete(); // <-- break
    }, 0);
    return () => {
      surrenderSpy();
      onComplete();
    };
  };

  const done1 = requestStripe(renderBreak);
  await wait(10);
  const done2 = requestStripe(renderBreak);
  await wait(10);
  const done3 = requestStripe(render);

  expect(renderSpy).toBeCalledTimes(3);

  done1();
  done2();

  expect(surrenderSpy).toBeCalledTimes(0);

  done3();

  expect(surrenderSpy).toBeCalledTimes(1);
});
