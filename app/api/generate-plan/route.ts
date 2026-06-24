import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: Request) {
  try {
    const { hazard, forecast } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an emergency response expert.

Hazard: ${hazard}
Forecast Time: ${forecast} minutes

Generate:
1. Risk Level
2. Predicted Impact
3. Recommended Action
4. Shelter Recommendation

Keep response concise.
`;

    const result = await model.generateContent(
      prompt
    );

    const response =
      result.response.text();

    return Response.json({
      plan: response,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to generate plan",
      },
      {
        status: 500,
      }
    );
  }
}