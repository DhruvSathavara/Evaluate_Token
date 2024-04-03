
const AnswerBot = async (code, prePrompt) => {
    try {

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.REACT_APP_CHATBOT_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: `${prePrompt}, ${code}` }]
            })
        })
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.log(error);
    }
}


export default AnswerBot;