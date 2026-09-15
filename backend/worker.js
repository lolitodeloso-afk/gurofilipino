export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Content-Type": "application/json"
    };
    if (request.method === "OPTIONS") return new Response(null, {headers:cors});
    if (request.method !== "POST") return new Response(JSON.stringify({error:"POST only"}), {status:405,headers:cors});
    if (!env.OPENAI_API_KEY) return new Response(JSON.stringify({error:"OPENAI_API_KEY is not configured"}), {status:500,headers:cors});

    const input = await request.json();
    if (!input.competency) return new Response(JSON.stringify({error:"Missing competency"}), {status:400,headers:cors});

    const instructions = `You are an assistant for a Filipino subject teacher in the Philippines.
Create a FOUR-SESSION editable DLP draft in Filipino based strictly on the teacher-provided competency, topic, and source notes.
Do not invent an official DepEd competency, policy, citation, historical fact, literary attribution, or curriculum requirement.
If source notes are insufficient for a factual detail, keep the activity generic and teacher-verifiable.
Follow this structure for each session: competency, objectives, learner_context, pre_lesson, flow, resources, integration, assessment, extended_learning, reflection_prompt.
Objectives should be observable and appropriate to the stated grade.
Include inclusive, practical classroom activities and formative assessment.
Return JSON only with top-level key "sessions", an array of exactly four objects.
Each object must use:
{"competency":"string","objectives":["string"],"learner_context":"string","pre_lesson":"string","flow":"string","resources":["string"],"integration":"string","assessment":"string","extended_learning":"string","reflection_prompt":"string"}`;

    const prompt = `Grade: ${input.grade || ""}
Term: ${input.term || ""}
Week: ${input.week || ""}
Topic: ${input.lesson || ""}
Exact learning competency supplied by teacher: ${input.competency}
Teacher-verified source notes:
${input.source_notes || "(none supplied)"}
Existing learner-context notes:
${JSON.stringify(input.learner_context || [])}`;

    const resp = await fetch("https://api.openai.com/v1/responses", {
      method:"POST",
      headers:{
        "Authorization":`Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        model:"gpt-5",
        input:[
          {role:"developer",content:[{type:"input_text",text:instructions}]},
          {role:"user",content:[{type:"input_text",text:prompt}]}
        ],
        text:{format:{type:"json_object"}}
      })
    });

    const raw = await resp.json();
    if (!resp.ok) return new Response(JSON.stringify({error:raw?.error?.message || "OpenAI request failed"}), {status:502,headers:cors});
    const text = raw.output?.flatMap(x=>x.content||[]).find(x=>x.type==="output_text")?.text || raw.output_text;
    try {
      const parsed=JSON.parse(text);
      return new Response(JSON.stringify(parsed), {headers:cors});
    } catch {
      return new Response(JSON.stringify({error:"Model returned invalid JSON"}), {status:502,headers:cors});
    }
  }
};