import { expect, test, vi } from 'vitest';
import { Render, requestStripe } from '../src';

test('render and cleanup', () => {
  const renderSpy = vi.fn();
  const surrenderSpy = vi.fn();

  const render: Render = () => {
    renderSpy();
    return () => {
      surrenderSpy();
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

  const render: Render = () => {
    renderSpy();
    return () => {
      surrenderSpy();
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
