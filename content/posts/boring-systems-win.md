---
title: "Boring Systems Win"
summary: "The best compliment I hear on-call is about how uneventful the night was. Here's why that's deliberate."
publishedAt: "2025-01-18"
---

I work on the control plane for EC2. When folks ask what the job is like, I tell them it is a constant campaign to make everything feel boring. We ship new features, react to hardware surprises, and untangle decades of decisions, but the bar for success is that thousands of engineers around the world simply forget we exist.

The temptation to add cleverness is real. We attract smart people. Smart people want to express that intelligence through intricate abstractions, fancy scheduling algorithms, or hyper-parameterized configuration. I have learned to be suspicious of cleverness that cannot be described without a whiteboard. The moment you need colored markers to explain a fix at 2 a.m., you are no longer running a boring system.

The systems that aged the best in EC2 share a few traits. They explain themselves with logs using plain language. They surface a single obvious knob when something drifts. Staff on-call have the authority to turn that knob without convening a tiger team. Most importantly, the failure modes are legible; they may not be pleasant, but they are finite and well understood.

We earn that boringness with relentless rehearsal. Load tests that feel wasteful, documentation reviews that seem pedantic, and post-incident drills that read like theater are how we keep the lights on. Culture becomes architecture: when new teammates see everyone sweating the checklists, they internalize that we do not ship heroics, we ship predictability.

If you want to make users happy, give them software that fades into the background. When the feedback we hear is, "I forgot we had a deploy yesterday," I know we did our job. Boring wins.
