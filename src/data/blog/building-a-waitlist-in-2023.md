---
title: "Building a Waitlist in 2023"
author: "Kevin Hou"
date: 2023-11-15 10:16:00
description: "How to build a waitlist system for free in less than an hour. I recently built a waitlist for a new feature and was shocked at how far developer tools have come."
image: "https://khou22.github.io/blog/some-site-card.png"
tags: [coding, tutorial]
featured: false
---

Shipping a waitlist for a new feature can be a painful last mile to a developer's momentum. Using a mix of old and new tools, I was able to go from 0 to production in around an hour! DX has been on a rocketship this past year 🚀

Here's 5 free tools you can use to set up your next waitlist system:

## Neon Database

Serverless Postgres has caused a stir recently and for a non-intensive access pattern like a waitlist it's an easy decision. They offer a generous free tier (3 GiB of data and 1 GB of RAM) which is more than enough for my use case.

The only downside is the “cold start” but it won't make or break our user's experience.

I initialized a new table `gpt_4_waitlist` and within seconds I had a Postgres URL to get up and running. They also ship you a convenient NeonDB npm package that we'll use later.

## Codeium Chat

Using @ codeiumdev I asked it to create a waitlist table for my newly created Neon DB:

> Create a new postgres 16 table called **`gpt_4_waitlist`** that has the following columns:
>
> - waitlist_id: string primary key auto generated
> - email: string required unique
> - ...

A few seconds later I had a query that executed perfectly. I used Neon's console GUI to check my schema and everything looks good. Database provisioned!

## NextJS App Router Form Endpoint

The great news with NextJS is that we don't need to setup a new project, manage CORS, or spin up a new server! Instead, we can use a server side endpoint file in our `app/` directory. We use the following code to store our values in our NeonDatabase.

This took me about 5 minutes to setup. A very different story if I were to have made a new Flask/FastAPI Python server and deployed a new Kubernetes service.

```tsx {7-13}
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.WAITLIST_DATABASE_URL);

export async function POST(req: NextRequest) {
  const reqBody = await req.json();
  await sql`INSERT INTO
     gpt_4_waitlist (email, additional_details, occupation, years_of_experience, ...)
 VALUES (
     ${reqBody.email},
   ${reqBody.additional_details},
   ...
 ) RETURNING *`;
}
```

## Zod + React Hook Form

The last thing to do is to make a form that can send a payload to our endpoint. I've used `yup` in the past for schema validation but `zod` seems like the new kid on the block and I really like how simple their setup is.

It also plays really nicely with `react-hook-form`, a headless form hook that manages your validation, error states, controlled inputs, etc. It let's you bring your own UI components so you can have maximum flexibility while keeping the setup cost for state management low.

```tsx
const generateFormSchema = z.object({
  email: z.string().min(1),
  occupation: z.string().min(1),
  // ...
});
type GenerateFormValues = z.infer<typeof generateFormSchema>;

export const WaitlistForm = () => {
  const { handleSubmit, errors } = useForm<GenerateFormValues>({
      resolver: zodResolver(generateFormSchema),
      mode: 'onChange',
      // You can set default values if you'd like controlled components.
      defaultValues: { ... }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="additionalDetails" className="mb-1 block leading-5">
        Additional Details
      </label>
      <textarea {...register('additionalDetails', { required: true })} />
      {errors.additionalDetails && (
        <p className="text-sm text-red">{errors.additionalDetails.message}</p>
      )}
      ...
    </form>
  )
}
```

## Monitoring Results with Postico

As someone who holds their products to a high level of UX polish, I'm also a big advocate for tools that can make mundane tasks more delightful. I've been discovering, rediscovering, and tinkering on my own Postgres clients since 2016. I've finally arrived at my favorites:

1. [Postico 2](https://eggerapps.at/postico2/): Incredibly simple, lightweight, and intuitive PG client. Let's you save queries, make schema changes (and preview the SQL), export to CSV, etc. You can use it for free or pay to have unlimited connections bookmarked — or if you want to support the devs 🙂
2. [Beekeeper Studio](https://www.beekeeperstudio.io/): A very similar application to Postico 2 but also has a Windows application which I use on my workstation.

## Wrap Up

Just like that, we have a live waitlist! Follow for more developer productivity tips and tools

If you're interested, here's my finished product: [https://codeium.com/waitlist/gpt-4](https://codeium.com/waitlist/gpt-4?referrer=khou22.com)
