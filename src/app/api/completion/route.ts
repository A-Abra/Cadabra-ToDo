// map to -> /api/completion
import {OpenAIApi, Configuration} from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
    // extracting prompt from the body
    const {prompt} = await req.json();
    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role:'system',
                content:`You are a helpful AI embedded in a text editor app very similar to notion which is used 
                to autocomplete sentences The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness. 
                AI is a well-behaved and well-mannered individual. You, the AI, are always friendly, kind, and inspiring, and 
                he is eager to provide vivid and thoughtful responses to the user.`,
            },
            {
                role: 'user',
                content: `
                I am writing a piece of text in a notion text editor app.
                Help me complete my train of thought here: ##${prompt}##
                keep the tone of the text consistent with the rest of the text.
                keep the response short and sweet.
                `,
            },
        ],
        stream: true // allow openai api to pass tokens one by one instead of waiting for entire prompt
    });
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream);
}