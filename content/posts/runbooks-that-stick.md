---
title: "Write Runbooks That People Reach For"
summary: "Runbooks are only useful when stressed-out humans trust them. Here is how I encourage that trust."
publishedAt: "2024-12-05"
---

Every team I have joined has a folder full of dusty runbooks. The common failure pattern is aspirational prose that reads like it was written by someone who never had to use it at 3 a.m. If you want humans to reach for the runbook when alarms fire, you have to optimize for the midnight version of yourself.

I keep three constraints in mind when editing runbooks. First, page length is capped. One screen of content is ideal; two screens is the maximum. If you cannot fit the critical steps in that space, you are documenting the wrong thing. Second, every step starts with a verb. "Check CPU on host" beats "CPU diagnostics" because it nudges action. Third, we track freshness. When the runbook references a dashboard, the dashboard owner signs off during each game day. Otherwise the link will rot, and trust erodes.

Nothing beats practicing the runbooks outside of incidents. We run quarterly drills where a random teammate pulls a runbook and walks through it while someone else times them. The goal is not speed; it is to observe where the runbook makes anyone pause. After ten minutes of friction, we rewrite. The document is a living artifact, not a trophy.

Good runbooks save human attention for the problems that cannot be automated yet. They remind you which metrics matter, which levers are safe, and when to escalate. Most importantly, they keep stress from rewriting your brain. When folks feel calm enough to joke in chat during an incident, it is usually because the runbook is doing its job.
