// Demo showing how to use the PreviewAPI to create custom menus

document.body.innerHTML = `
  <div style="padding: 40px; font-family: sans-serif; max-width: 800px; margin: 0 auto;">
    <h1>🎛️ Preview Menu API Demo</h1>
    <p>This demo shows how to use the <code>PreviewAPI</code> to customize the application menu.</p>
    
    <div style="margin: 30px 0;">
      <h2>Current Status:</h2>
      <div id="status" style="padding: 20px; background: #f0f0f0; border-radius: 8px; font-family: monospace;">
        Ready
      </div>
    </div>

    <div style="margin: 30px 0;">
      <h2>Available API:</h2>
      <ul>
        <li><code>PreviewAPI.setMenu(template)</code> - Set custom menu</li>
        <li><code>PreviewAPI.addMenuItem(label, submenu)</code> - Add menu item</li>
        <li><code>PreviewAPI.onMenuAction(id, handler)</code> - Handle menu actions</li>
      </ul>
    </div>

    <div style="margin: 30px 0;">
      <button id="createMenu" style="padding: 12px 24px; font-size: 16px; cursor: pointer; background: #2196f3; color: white; border: none; border-radius: 4px; margin-right: 10px;">
        Create Custom Menu
      </button>
      <button id="addItem" style="padding: 12px 24px; font-size: 16px; cursor: pointer; background: #4caf50; color: white; border: none; border-radius: 4px;">
        Add Menu Item
      </button>
    </div>

    <div style="margin: 30px 0; padding: 20px; background: #fff3cd; border-radius: 8px;">
      <strong>💡 Tip:</strong> Look at the top menu bar to see the custom menus!
    </div>
  </div>
`;

const status = document.getElementById('status');

function updateStatus(message) {
  status.textContent = message;
  status.style.background = '#e8f5e9';
  setTimeout(() => {
    status.style.background = '#f0f0f0';
  }, 2000);
}

// Register menu action handlers
PreviewAPI.onMenuAction('action1', () => {
  updateStatus('Action 1 clicked! 🎉');
  alert('You clicked Action 1 from the menu!');
});

PreviewAPI.onMenuAction('action2', () => {
  updateStatus('Action 2 clicked! 🎊');
  console.log('Action 2 triggered');
});

PreviewAPI.onMenuAction('hello', () => {
  updateStatus('Hello clicked! 👋');
  alert('Hello from the menu!');
});

PreviewAPI.onMenuAction('about', () => {
  updateStatus('About clicked! ℹ️');
  alert('Preview Menu API Demo\nVersion 1.0.0');
});

// Button: Create custom menu
document.getElementById('createMenu').addEventListener('click', async () => {
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        { label: 'Action 1', id: 'action1', accelerator: 'CmdOrCtrl+1' },
        { label: 'Action 2', id: 'action2', accelerator: 'CmdOrCtrl+2' },
        { type: 'separator' },
        { label: 'Quit', role: 'quit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', role: 'reload' },
        { label: 'Toggle DevTools', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Reset Zoom', role: 'resetZoom' },
        { label: 'Zoom In', role: 'zoomIn' },
        { label: 'Zoom Out', role: 'zoomOut' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'About', id: 'about' }
      ]
    }
  ];

  const result = await PreviewAPI.setMenu(menuTemplate);
  if (result.success) {
    updateStatus('Custom menu created! ✨');
  } else {
    updateStatus('Error: ' + result.error);
  }
});

// Button: Add menu item
document.getElementById('addItem').addEventListener('click', async () => {
  const result = await PreviewAPI.addMenuItem('Custom', [
    { label: 'Say Hello', id: 'hello', accelerator: 'CmdOrCtrl+H' },
    { type: 'separator' },
    { label: 'Open DevTools', role: 'toggleDevTools' }
  ]);

  if (result.success) {
    updateStatus('Menu item added! 🎯');
  } else {
    updateStatus('Error: ' + result.error);
  }
});

// Initial status
updateStatus('Ready! Click the buttons to customize the menu.');
