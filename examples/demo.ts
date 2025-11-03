document.body.innerHTML = `
  <div style="padding: 40px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <h1 style="color: #4caf50;">Hello from TypeScript! 🎉</h1>
    <p style="font-size: 18px;">Edit this file and watch it reload automatically.</p>
    <p id="time" style="font-size: 16px; color: #666;">Current time: ${new Date().toLocaleTimeString()}</p>
    <div style="margin-top: 30px;">
      <button id="btn" style="padding: 12px 24px; font-size: 16px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Click me!
      </button>
      <p id="counter" style="margin-top: 20px; font-size: 18px;">Clicks: 0</p>
    </div>
  </div>
`;

let clicks = 0;

const btn = document.getElementById('btn') as HTMLButtonElement;
const counter = document.getElementById('counter') as HTMLParagraphElement;

btn.addEventListener('click', () => {
  clicks++;
  counter.textContent = `Clicks: ${clicks}`;
});

setInterval(() => {
  const timeEl = document.getElementById('time');
  if (timeEl) {
    timeEl.textContent = `Current time: ${new Date().toLocaleTimeString()}`;
  }
}, 1000);
