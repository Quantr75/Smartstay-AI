// ===== SmartStay AI — app.js (Ollama Edition) =====

const OLLAMA_URL = 'http://localhost:11434/api/chat';
const OLLAMA_MODEL = 'llama3.2'; // Change to 'llama3' or 'mistral' if you pulled a different model

const SYSTEM_PROMPT = `You are SmartStay AI, a friendly and professional hotel booking concierge assistant for SmartStay Hotel. You help guests find and book rooms.

AVAILABLE ROOMS:
1. Standard Room — $65/night
   - Queen bed, high-speed WiFi, flat-screen TV, air conditioning
   - Best for: solo travelers, budget-conscious couples

2. Deluxe Room — $110/night
   - King bed, stunning city view, minibar, high-speed WiFi
   - Best for: couples, business travelers, anyone wanting extra comfort

3. Family Suite — $175/night
   - 2 bedrooms, spacious living area, full kitchenette, high-speed WiFi
   - Best for: families, groups of up to 5 people

4. Executive Suite — $280/night
   - Penthouse level, panoramic city views, jacuzzi, butler service, premium WiFi
   - Best for: luxury travelers, special occasions, VIP guests

HOTEL POLICIES:
- Check-in: 3:00 PM | Check-out: 11:00 AM
- Free cancellation up to 24 hours before arrival
- Breakfast add-on available: $18 per person per day
- All rooms are non-smoking
- Pets not allowed
- Free parking available

BOOKING PROCESS (guide users through this):
1. Ask for their name
2. Ask for check-in and check-out dates
3. Ask for number of guests
4. Confirm the room and calculate total cost (price x number of nights)
5. Give a booking confirmation summary

YOUR PERSONALITY:
- Warm, helpful, and professional
- Concise responses (2-4 sentences unless comparing rooms or giving a full booking summary)
- Always mention prices when recommending rooms
- Be proactive: if a user says their budget, immediately suggest the best matching room
- When calculating costs, show the math: e.g. "$110/night x 3 nights = $330 total"

Always end booking confirmations with:
"Booking Confirmed! Your reservation has been recorded. You will receive a confirmation email shortly."`;

let conversationHistory = [];
let isLoading = false;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  appendMessage('ai', 'Welcome to SmartStay! I\'m your AI concierge running locally via Ollama. I can help you find the perfect room, check availability, and complete your booking. What are you looking for today?');
  setupInput();
  updateStatus();
});

// ===== CHECK OLLAMA STATUS =====
async function updateStatus() {
  const statusEl = document.getElementById('ollama-status');
  const modelEl = document.getElementById('ollama-model');
  if (!statusEl) return;
  try {
    const res = await fetch('http://localhost:11434/api/tags');
    if (res.ok) {
      const data = await res.json();
      const models = data.models?.map(m => m.name) || [];
      statusEl.textContent = 'Ollama: Connected';
      statusEl.className = 'ollama-status connected';
      if (modelEl) modelEl.textContent = models.length > 0 ? 'Model: ' + models[0].split(':')[0] : 'Model: ' + OLLAMA_MODEL;
    } else {
      throw new Error();
    }
  } catch {
    statusEl.textContent = 'Ollama: Not running';
    statusEl.className = 'ollama-status disconnected';
    if (modelEl) modelEl.textContent = 'Start Ollama first!';
  }
}

// ===== MESSAGES =====
function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function appendMessage(role, text) {
  const container = document.getElementById('messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${role}`;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = formatText(text);
  const time = document.createElement('span');
  time.className = 'msg-time';
  time.textContent = getTime();
  msgDiv.appendChild(bubble);
  msgDiv.appendChild(time);
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

function showTyping() {
  const container = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg ai';
  div.id = 'typing-indicator';
  div.innerHTML = `<div class="bubble typing-bubble"><span></span><span></span><span></span></div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typing-indicator');
  if (t) t.remove();
}

// ===== SEND MESSAGE =====
async function sendMessage() {
  if (isLoading) return;
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';
  appendMessage('user', text);
  conversationHistory.push({ role: 'user', content: text });

  isLoading = true;
  document.getElementById('send-btn').disabled = true;
  showTyping();

  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory
    ];

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: messages,
        stream: false
      })
    });

    if (!response.ok) throw new Error('Ollama returned an error. Is it running?');

    const data = await response.json();
    const reply = data.message?.content || 'Sorry, I had trouble responding. Please try again.';

    removeTyping();
    appendMessage('ai', reply);
    conversationHistory.push({ role: 'assistant', content: reply });
    updateStatus();

  } catch (error) {
    removeTyping();
    appendMessage('ai',
      'Cannot connect to Ollama. Please make sure:\n' +
      '1. Ollama is installed and running\n' +
      '2. You have pulled a model: <strong>ollama pull llama3.2</strong>\n' +
      '3. Ollama is running on http://localhost:11434'
    );
    conversationHistory.pop();
  }

  isLoading = false;
  document.getElementById('send-btn').disabled = false;
}

// ===== QUICK ACTIONS =====
function quickAsk(text) {
  document.getElementById('user-input').value = text;
  document.getElementById('chat-section').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => sendMessage(), 300);
}

function askAboutRoom(btn) {
  const card = btn.closest('.room-card');
  const question = card.dataset.ask;
  quickAsk(question);
}

function clearChat() {
  if (!confirm('Clear the chat history?')) return;
  conversationHistory = [];
  document.getElementById('messages').innerHTML = '';
  appendMessage('ai', 'Chat cleared! Welcome back to SmartStay. How can I help you find the perfect room today?');
}

// ===== INPUT SETUP =====
function setupInput() {
  const input = document.getElementById('user-input');
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  input.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });
}
