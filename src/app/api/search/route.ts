// src/app/api/search/route.ts
import { getPosts } from "@/utils/utils";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query?.trim()) {
    return new Response(JSON.stringify({ error: "No query provided" }), { status: 400 });
  }

  const posts = getPosts(["src", "app", "blog", "posts"]);
  const index = posts.map((post) => ({
    title: post.metadata.title,
    subtitle: post.metadata.subtitle ?? "",
    summary: post.metadata.summary ?? "",
    tag: post.metadata.tag ?? "",
    publishedAt: post.metadata.publishedAt,
    slug: post.slug,
    url: `/blog/${post.slug}`,
    content: post.content,
  }));

  const systemPrompt = `You are a helpful search assistant for Ray's personal blog at raychen666.vercel.app.
Ray is an MS Computer Science student and researcher at NYU working on XR systems, multi-agent AI pipelines, WebXR, computer vision, and programming languages.

Here is the complete list of blog posts available, as JSON:
${JSON.stringify(index, null, 2)}

When the user asks a question or types a search query:
1. Identify the most relevant posts (up to 3).
2. Reply naturally in 1-3 sentences — mention what you found and why it's relevant.
3. For each relevant post, include a markdown link using the exact url field: [Post Title](url)
4. If nothing matches, say so honestly and suggest related topics Ray has written about.
5. Keep replies concise and conversational. Do not list every post unless asked.`;

  const apiKey = process.env.GEMINI_API_KEY!;
  const model = "gemini-2.5-flash";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: query }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 2000,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    return new Response(JSON.stringify({ error: err }), { status: 500 });
  }

  // Stream SSE back to client
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.trim());

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              const text =
                parsed.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            } catch {}
          }
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}