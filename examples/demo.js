document.body.innerHTML = `
  <div style="padding: 40px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <h1 style="color: #ff6b6b;">Hello from JavaScript! 🚀</h1>
    <p style="font-size: 18px;">Changes auto-reload instantly.</p>
    <p style="font-size: 16px; color: #666;">Time: ${new Date().toLocaleTimeString()}</p>
    <div style="margin-top: 20px;">
      <input type="text" id="name" placeholder="Enter your name" style="padding: 10px; font-size: 16px; border: 2px solid #ddd; border-radius: 4px;">
      <button id="greet" style="padding: 10px 20px; font-size: 16px; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
        Greet
      </button>
      <p id="greeting" style="margin-top: 20px; font-size: 20px; font-weight: bold;"></p>
    </div>
  </div>
`;

document.getElementById('greet').addEventListener('click', () => {
  const name = document.getElementById('name').value;
  const greeting = document.getElementById('greeting');
  greeting.textContent = name ? `Hello, ${name}! 👋` : 'Please enter your name!';
});
