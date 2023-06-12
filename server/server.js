import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello, welcome to Travel Assistant',
    });
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.message;

        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `Consider yourself as a travel assistant. The assistant is helpful, creative, clever, and very friendly. The assistant is very good at helping people. The human will provide a location and the number of days they will spend at that location. In response, you have to generate a list of the best hotels (5) with their prices to stay at and a complete personalized itinerary for the human to enjoy and spend their tour at that place. Generate the response in the JSON format.
        {
          "hotels": [
            {
              "name": "Hotel Name",
              "price": "Price per night",
              "area": "Area of the hotel"
            },
          ],
          "itinerary": [
            {
              "day": "Day Number",
              "toDo": [
                {
                  "name": "What activity to do",
                  "time": "Time to do that activity"
                },
              ]
            },
          ]
        }
        \n\nAssistant: "Hello, welcome to Travel Assistant. How may I assist you in your travel?"
        \nHuman: ${prompt}
        \nAssistant: Great! Here is a list of the best hotels with their prices to stay at and a complete personalized itinerary for you to enjoy and spend your tour at that place.`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error || 'Something went wrong');
    }
});

app.listen(8008, () => console.log('AI server started on http://localhost:8008'));
