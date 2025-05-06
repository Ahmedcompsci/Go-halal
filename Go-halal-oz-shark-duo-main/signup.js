<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Sign Up | Halal Go</title>
  <link rel="stylesheet" href="styles.css" />
  <style>
    body {
      background-color: #181818;
      color: #f1f1f1;
      font-family: 'Poppins', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
    }
    h1 {
      color: #2a9d8f;
      margin-bottom: 1rem;
    }
    form {
      background-color: #202020;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 0 15px rgba(0,0,0,0.5);
      width: 100%;
      max-width: 400px;
      display: flex;
      flex-direction: column;
    }
    input {
      padding: 0.75rem;
      margin-bottom: 1rem;
      background-color: #2a2a2a;
      border: 1px solid #444;
      border-radius: 8px;
      color: #fff;
    }
    button {
      background-color: #2a9d8f;
      color: #fff;
      padding: 0.75rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
    }
    button:hover {
      background-color: #21867a;
    }
  </style>
</head>
<body>
  <h1>Halal Go - Sign Up</h1>
  <form id="signupForm">
    <input type="text" name="name" placeholder="Full Name" required />
    <input type="email" name="email" placeholder="Email" required />
    <input type="password" name="password" placeholder="Password" required />
    <button type="submit">Sign Up</button>
  </form>

  <!-- Chatbot -->
  <div id="chatbot-container" style="position:fixed;bottom:1.5rem;left:1.5rem;z-index:10000;font-family:sans-serif;">
    <button id="chatbot-toggle" style="background:#3b82f6;color:white;border:none;width:3rem;height:3rem;border-radius:50%;font-size:1.5rem;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,0.3);">💬</button>
    <div id="chatbot-window" style="display:none;flex-direction:column;width:16rem;max-height:20rem;background:white;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.2);overflow:hidden;margin-top:0.5rem;">
      <div style="background:#3b82f6;color:white;padding:0.5rem;font-weight:bold;">HalalGo Chat</div>
      <div id="chatbot-messages" style="flex:1;padding:0.5rem;overflow-y:auto;font-size:0.85rem;"></div>
      <div style="display:flex;border-top:1px solid #ddd;">
        <input id="chatbot-input" placeholder="Ask me anything..." style="flex:1;border:none;padding:0.5rem;font-size:0.85rem;outline:none;">
        <button id="chatbot-send" style="background:#3b82f6;border:none;color:white;padding:0 1rem;cursor:pointer;">Send</button>
      </div>
    </div>
  </div>

  <!-- Scripts -->
  <script type="module" src="firebase-init.js"></script>
  <script type="module" src="signup.js"></script>

  <script>
    const botToggle = document.getElementById("chatbot-toggle");
    const botWindow = document.getElementById("chatbot-window");
    const botSend = document.getElementById("chatbot-send");
    const botInput = document.getElementById("chatbot-input");
    const botMessages = document.getElementById("chatbot-messages");

    botToggle.onclick = () => {
      botWindow.style.display = botWindow.style.display === "none" ? "flex" : "none";
    };

    botSend.onclick = () => handleBotSend();
    botInput.addEventListener("keypress", e => {
      if (e.key === "Enter") handleBotSend();
    });

    function handleBotSend() {
      const text = botInput.value.trim();
      if (!text) return;
      appendBotMessage("user", text);
      botInput.value = "";
      setTimeout(() => {
        appendBotMessage("bot", generateBotReply(text));
      }, 500);
    }

    function appendBotMessage(sender, message) {
      const div = document.createElement("div");
      div.style.margin = "0.25rem 0";
      div.style.textAlign = sender === "user" ? "right" : "left";
      const span = document.createElement("span");
      span.textContent = message;
      span.style.display = "inline-block";
      span.style.padding = "0.25rem 0.5rem";
      span.style.borderRadius = "4px";
      span.style.background = sender === "user" ? "#eff6ff" : "#f3f4f6";
      span.style.color = sender === "user" ? "#1e3a8a" : "#374151";
      div.appendChild(span);
      botMessages.appendChild(div);
      botMessages.scrollTop = botMessages.scrollHeight;
    }

    function generateBotReply(input) {
      const text = input.toLowerCase();
      const prayerTimes = {
        fajr: '5:30 AM',
        dhuhr: '12:45 PM',
        asr: '4:15 PM',
        maghrib: '8:00 PM',
        isha: '9:15 PM'
      };

      const specificPrayer = Object.keys(prayerTimes).find(p => text.includes(p));
      if (specificPrayer) {
        return `${specificPrayer.charAt(0).toUpperCase() + specificPrayer.slice(1)} prayer is at ${prayerTimes[specificPrayer]}.`;
      }

      if (text.includes("prayer time") || text.includes("what time")) {
        return `🕌 Today's Prayer Times in Rochester:\n• Fajr: ${prayerTimes.fajr}\n• Dhuhr: ${prayerTimes.dhuhr}\n• Asr: ${prayerTimes.asr}\n• Maghrib: ${prayerTimes.maghrib}\n• Isha: ${prayerTimes.isha}`;
      }

      if (text.includes("mosque") || text.includes("masjid")) {
        return "🕌 Rochester Mosques:\n• Masjid AbuBakr\n• Islamic Center of Rochester";
      }

      if (text.includes("restaurant") || text.includes("food")) {
        return "🍽️ Rochester Halal Restaurants:\n• Halal Bites - Rochester\n• Sabri Kitchen";
      }

      return "Sorry, I can help with halal restaurants, Rochester mosques, or prayer times. Try asking about those!";
    }
  </script>
</body>
</html>
