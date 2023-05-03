import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello Welcome to Travel Assistant'
    })
})

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.message;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Consider yourself as an travel assistant. The assistant is helpful, creative, clever, and very friendly. The assistant is very good at helping people. The Human will provide a location and number of days it will spent at that location in response you have to generate a list of best hotels (5) with their prices to stay at and a complete personalized itinerary for the Human to enjoy and spends its tour at that place. Generate the response in the json format
            {
                "hotels": [
                    {
                        "name": "Hotel Name",
                        "price": "Price per night",  // <-- add comma here
                        "area": "Area of the hotel"
                    },
                ]
                "itinerary": [
                    {
                        "day": "Day Number",
                        "toDo": [
                            {
                                "name": "What Activity to do",
                                "time": "Time to do that activity"
                            },
                        ]  // <-- add closing square bracket here
                    },
                ]s
            }
            \n\nAssitant: "Hello, Welcome to Travel Assistant, How may i assist you in your travel"
            \nHuman: ${prompt}
            \nAssistant: Great! Here is a list of best hotels with their prices to stay at and a complete personalized itinerary for you to enjoy and spend your tour at that place.
            `,
            temperature: 0, // Higher values means the model will take more risks.
            max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
            top_p: 1, // alternative to sampling with temperature, called nucleus sampling
            frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
            presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        });

    } catch (error) {
        console.error(error)
        res.status(500).send(error || 'Something went wrong');
    }
})

app.listen(8008, () => console.log('AI server started on http://localhost:8008'));