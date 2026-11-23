import {Command} from "commander";

const program = new Command()

type TelegramResponse = {
    ok: boolean;
    result?:{
        message_id?: number;
    }
    description?: string;
};

program
    .name("sendkit")
    .description("Building Sendkit MCP server")
    .command("telegram")
    .description("Send a telegram Message")
    .argument("<chatID>", "Telegram chat ID")
    .argument("<message>", "Message text to send")
    .action(
        async (chatId: string, message: string) => {
            const token = process.env.TELEGRAM_BOT_TOKEN;
            if(!token) {
                console.error("TELEGRAM_BOT_TOKEN not available in the environment variable.");
                process.exit(1);
            }

            if(!chatId) {
                console.error("Telegram chat id is missing.");
                process.exit(1);
            }

            if(!message) {
                console.error("Missing Telegram Message text");
                process.exit(1);
            }

            const response = await fetch(
                `https://api.telegram.org/bot${token}/sendMessage`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        chat_id: chatId,
                        text: message
                    })
                }
            )

            const data = (await response.json()) as TelegramResponse;
            console.log(data)
            if(!response.ok || !data.ok){
                const details = data.description ?? response.statusText;
                console.error(`Telegram API request failed: ${details}`)
                process.exit(1)
            }

            const messageId = data.result?.message_id;

            if(messageId !== undefined){
                console.log(`Telegram message ID: ${messageId}`)
            }
        }
    )

program.parseAsync(process.argv)

// https://api.telegram.org/bot9070379701:AAHaaYJAR8ZuLqisyANai8QWToRZLB6q844/getUpdates