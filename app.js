const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input input');
const chatButton = document.querySelector('.chat-input button');

chatButton.addEventListener('click', sendMessage);

async function sendMessage() {
    const message = chatInput.value.trim();
    displayMessage(message, 'user');

    // Clear input field
    chatInput.value = '';

    if (message !== '') {
        // Send message to server
        const response = await fetch('http://localhost:8008/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        // Display response from server
        const data = await response.json();

        console.log(data.bot);

        // Display text response from bot message
        displayMessage(data.bot, 'bot');
    }
}

function generateBotMessage(botData) {
    let message = '';

    // Extract hotel information
    if (botData.hotels && botData.hotels.length > 0) {
        message += 'Hotels:\n';
        botData.hotels.forEach((hotel) => {
            message += `- ${hotel.name}\n`;
            message += `  Price: ${hotel.price}\n`;
            message += `  Area: ${hotel.area}\n\n`;
        });
    }

    // Extract itinerary information
    if (botData.itinerary && botData.itinerary.length > 0) {
        message += 'Itinerary:\n';
        botData.itinerary.forEach((day) => {
            message += `- ${day.day}:\n`;
            day.toDo.forEach((task) => {
                message += `  - ${task.name}\n`;
                message += `    Time: ${task.time}\n`;
            });
        });
    }

    // If no information is available, display a default message
    if (message === '') {
        message = 'I apologize, but I couldn\'t find any information.';
    }

    return message;
}

function displayMessage(message, sender) {
    const messageElement = document.createElement('p');
    messageElement.classList.add('chat-message');
    messageElement.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');
    messageElement.innerText = message;
    chatMessages.appendChild(messageElement);

    // Scroll to bottom of messages
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
