import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import apiResponses from "./common/apiResponses";
import * as AWS from "aws-sdk";

export const handler: APIGatewayProxyHandler = async event => {
    const body = JSON.parse(event.body);
    const { text, language } = body;
    const translate = new AWS.Translate();
    try {
        if (!text) {
            return apiResponses._400({ message: "missing body text" });
        }
        if (!language) {
            return apiResponses._400({ message: "missing target language" });
        }
        const translateParams: AWS.Translate.Types.TranslateTextRequest = {
            Text: text,
            SourceLanguageCode: "en",
            TargetLanguageCode: language
        };
        const translatedMessage = await translate
            .translateText(translateParams)
            .promise();
        return apiResponses._200({ translatedMessage });
    } catch (err) {
        console.log("error in the translation", error);
        return apiResponses._400({
            message: "unable to translate the message"
        });
    }
};
