import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputPicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimerUI({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const pickedDate = selectedDates[0];

    if (pickedDate <= new Date()) {
      startBtn.disabled = true;
      userSelectedDate = null;

      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
    } else {
      userSelectedDate = pickedDate;
      startBtn.disabled = false;
    }
  },
};

flatpickr(inputPicker, options);

startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  inputPicker.disabled = true;

  tick();

  timerId = setInterval(tick, 1000);
});

function tick() {
  const currentTime = new Date();
  const diff = userSelectedDate - currentTime;

  if (diff <= 0) {
    clearInterval(timerId);
    timerId = null;

    updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    inputPicker.disabled = false;
    startBtn.disabled = true;
    return;
  }

  const timeComponents = convertMs(diff);
  updateTimerUI(timeComponents);
}
