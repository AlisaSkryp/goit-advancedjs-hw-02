import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', event => {
  event.preventDefault();

  const delay = Number(event.currentTarget.elements.delay.value);
  const state = event.currentTarget.elements.state.value;

  createPromise(delay, state)
    .then(resolvedDelay => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${resolvedDelay}ms`,
        position: 'topRight',
      });
    })
    .catch(rejectedDelay => {
      iziToast.error({
        message: `❌ Rejected promise in ${rejectedDelay}ms`,
        position: 'topRight',
      });
    });

  event.currentTarget.reset();
});

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}
