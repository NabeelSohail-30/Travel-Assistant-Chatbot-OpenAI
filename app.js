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

        console.log(data.hotels);

        // Generate text response from bot message
        let botMessage = '';
        if (data.hotels) {
            botMessage += 'Here are some hotels you might be interested in:\n';
            data.hotels.forEach((hotel, index) => {
                botMessage += `${index + 1}. ${hotel.name} - ${hotel.area}, ${hotel.price}\n`;
            });
        }

        if (data.itinerary) {
            botMessage += 'Here is an itinerary for your trip:\n';
            data.itinerary.forEach((day) => {
                botMessage += `Day ${day.day}:\n`;
                day.toDo.forEach((activity, index) => {
                    botMessage += `${index + 1}. ${activity.name} - ${activity.time}\n`;
                });
            });
        }

        // Display text response from bot message
        displayMessage(botMessage, 'bot');
    }
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
