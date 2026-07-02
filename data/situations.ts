export type Passage = {
  reference: string;
  explanation: string;
};

export type Situation = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  heroCta: string;
  secondaryCta: string;
  realProblem: string;
  passages: Passage[];
  actionStep: string;
  reflectionQuestions: string[];
  applicationPlan: {
    title: string;
    description: string;
    includes: string[];
    cta: string;
  };
  relatedSituations: string[];
};

export const situations: Situation[] = [
  {
    slug: "cant-stop-worrying",
    title: "When you can’t stop worrying",
    category: "Anxiety & Fear",
    summary:
      "For the low hum that never fully turns off — the what-ifs, the tight chest, and the thoughts that keep circling back.",
    metaTitle: "When You Can’t Stop Worrying | The Still Compass",
    metaDescription:
      "What the Bible actually says about anxiety, worry, and a racing mind — with scripture references, reflection questions, and one concrete step for this week.",
    heroCta: "Get the printable application plan",
    secondaryCta: "Start reflection",
    realProblem: `It is not always one big fear.

Sometimes it is the low hum that never fully turns off — the what-ifs at 2am, the tight chest before you have even opened your eyes, the way your mind runs the same three scenarios on a loop even when you know it is not helping.

You may have already been told to “just pray about it” or “give it to God.” And maybe you have. Maybe you prayed, meant it, tried to let go, and then the worry came back an hour later.

That does not mean you have failed.

This is not about proving you have enough faith. It is about learning what to do with a mind that will not sit still.`,
    passages: [
      {
        reference: "Philippians 4:6–7",
        explanation: `Paul does not write about anxiety from a comfortable place. He writes from prison, with his own future uncertain.

He does not treat anxiety like a small inconvenience or a spiritual embarrassment. He gives it somewhere to go.

The peace described in this passage is not peace because every problem has already been solved. It is peace that guards your heart and mind while the situation is still open.`,
      },
      {
        reference: "Matthew 6:25–34",
        explanation: `Jesus points to birds and wildflowers, not to minimize the weight of what you are carrying, but to expose something worry cannot do.

Worry cannot add a single hour to your life.

The instruction is deeply practical: do not try to live tomorrow before it arrives. Return to today. Return to the next faithful thing.`,
      },
      {
        reference: "1 Peter 5:6–7",
        explanation: `Peter writes to people carrying real pressure, not imaginary stress.

He tells them to cast their anxiety on God because God cares for them. The reason given is not religious duty. It is care.

You are being invited to hand your worry to someone who actually cares about you.`,
      },
    ],
    actionStep: `Each morning, before you look at your phone, write down the one specific thing you are most anxious about that day.

Not the whole list. Just the loudest one.

Underneath it, write one honest sentence handing it to God with a specific request.

For example:

“God, I am anxious about the conversation with my manager at 2pm. I am asking you for a clear head, the right words, and the humility to listen well.”

Do this for seven mornings before deciding whether it is helping.`,
    reflectionQuestions: [
      "What is the one thing I am most anxious about right now, if I had to name just one?",
      "When I imagine handing this to God instead of holding it myself, what am I afraid would happen?",
      "Is there a next right action inside this worry — something small I actually control — or is this one I genuinely have to release?",
    ],
    applicationPlan: {
      title: "Keep this guidance with you this week.",
      description:
        "The printable plan gives you the scripture references, reflection questions, and a seven-day morning practice you can return to throughout the week.",
      includes: [
        "Three scripture references",
        "A short summary of what each passage teaches",
        "The seven-day morning practice",
        "Reflection space",
        "A simple prayer prompt",
      ],
      cta: "Get this as a printable plan",
    },
    relatedSituations: [
      "job-loss-financial-fear",
      "hard-decision",
      "burnout",
      "feeling-distant-from-god",
    ],
  },
  {
  slug: "hard-decision",
  title: "When you have a hard decision to make",
  category: "Decision & Direction",
  summary:
    "For the choice that feels too important to rush and too heavy to ignore.",
  metaTitle: "When You Have a Hard Decision to Make | The Still Compass",
  metaDescription:
    "Biblical guidance for making a hard decision with wisdom, prayer, and one concrete next step.",
  heroCta: "Get the printable application plan",
  secondaryCta: "Start reflection",
  realProblem: `Some decisions do not feel simple because they are not simple.

Maybe there is no obviously sinful option and no obviously perfect one. Maybe both paths carry risk. Maybe staying costs something, but leaving costs something too.

You may be waiting for a sign, a feeling, or a moment of total certainty. But the pressure keeps building because life does not pause while you wait.

A hard decision can make you feel frozen. You keep replaying the same options, asking the same questions, imagining the same outcomes, and still not knowing which way to go.

This is not about forcing a rushed answer. It is about learning how to seek wisdom without becoming trapped by fear.`,
  passages: [
    {
      reference: "James 1:5",
      explanation: `James gives a direct invitation to the person who lacks wisdom.

He does not say you should already know what to do. He does not shame you for needing help. He tells you to ask God, who gives generously.

That matters when you are facing a decision that feels bigger than your own understanding. The starting point is not pretending to be certain. The starting point is admitting you need wisdom and asking for it plainly.`,
    },
    {
      reference: "Proverbs 3:5–6",
      explanation: `This passage is often quoted quickly, but it speaks directly to the tension of decision-making.

Trusting God does not mean turning off your mind. It means refusing to make your own limited understanding the final authority.

To acknowledge God in your ways is to bring the actual path before him — your motives, fears, options, desires, and assumptions. The promise is not that every step will feel easy, but that God is able to make your path straight.`,
    },
    {
      reference: "Psalm 32:8",
      explanation: `This passage gives a picture of God as one who instructs, teaches, and counsels.

That is important because guidance is not always a dramatic sign. Sometimes it comes through correction, counsel, scripture, wise people, peace, timing, or the slow clarifying of motives.

God is not distant from the decision. He is able to guide you while you walk through it.`,
    },
  ],
  actionStep: `Take one sheet of paper and divide it into three sections.

First, write: “What do I know?”

List only the facts, not fears or imagined outcomes.

Second, write: “What am I afraid of?”

Name the fears honestly. Do not edit them to sound spiritual.

Third, write: “What would wisdom look like?”

Write one next faithful step you can take before making the final decision. That might be asking for counsel, gathering information, praying specifically for clarity, setting a deadline, or admitting the decision you have been avoiding.

Do not try to solve the whole decision today.

Ask God for wisdom. Then take the next faithful step that wisdom requires.`,
  reflectionQuestions: [
    "What part of this decision is truly unclear, and what part am I avoiding because it is costly?",
    "What fear is loudest when I imagine choosing one path over the other?",
    "Who is one wise and trustworthy person I can invite into this decision before I act?",
  ],
  applicationPlan: {
    title: "Walk through the decision with wisdom.",
    description:
      "The printable plan helps you separate facts from fears, ask for wisdom, and identify one faithful next step.",
    includes: [
      "Three scripture references",
      "A facts, fears, and wisdom worksheet",
      "Reflection questions",
      "A next-step decision prompt",
      "A simple prayer for wisdom",
    ],
    cta: "Get this as a printable plan",
  },
  relatedSituations: [
    "cant-stop-worrying",
    "job-loss-financial-fear",
    "burnout",
    "feeling-distant-from-god",
  ],
},
{
  slug: "burnout",
  title: "When you’re burned out and running on empty",
  category: "Burnout & Rest",
  summary:
    "For the kind of tired that sleep alone does not seem to fix.",
  metaTitle: "When You’re Burned Out and Running on Empty | The Still Compass",
  metaDescription:
    "Biblical guidance for burnout, exhaustion, and learning how to receive rest without shame.",
  heroCta: "Get the printable application plan",
  secondaryCta: "Start reflection",
  realProblem: `This is not just being tired.

Tired usually has a clear answer: sleep, a slower day, a weekend, a break.

Burnout feels different. It is the kind of exhaustion that follows you even after you rest. Your body may stop, but your mind keeps running. You may still show up, still do what is expected, still smile when needed, but inside you feel thin, irritated, numb, or quietly resentful.

Sometimes burnout becomes tangled with guilt. You wonder if you are being lazy, ungrateful, weak, or spiritually undisciplined.

But there is a difference between faithfulness and running past the limits God gave you.

This is not about quitting everything. It is about noticing that you are not a machine, and God never asked you to live like one.`,
  passages: [
    {
      reference: "Matthew 11:28–30",
      explanation: `Jesus does not call only the strong, impressive, and composed.

He calls the weary and burdened.

That matters because his invitation begins with honesty. You do not have to pretend you are fine before coming to him. He offers rest, not as a reward for having everything together, but as a gift to the one who is carrying too much.

The yoke of Jesus is not weightless, but it is different. It is not the crushing burden of performance, fear, people-pleasing, or endless proving. His way is gentle, and his heart is lowly toward the exhausted.`,
    },
    {
      reference: "Mark 6:30–32",
      explanation: `The disciples had been doing meaningful work. They were not burned out because they were wasting their lives. They were tired from serving.

Jesus does not respond by telling them to push harder because the mission matters.

He tells them to come away and rest.

This is important. Need does not automatically equal assignment. Just because there is more to do does not mean you are meant to keep pouring out without stopping.`,
    },
    {
      reference: "Psalm 23:1–3",
      explanation: `Psalm 23 does not describe God as a manager extracting more output from a tired worker.

It describes him as a shepherd.

He leads, restores, and makes his people lie down. Sometimes rest is not something we naturally choose. Sometimes we have to be led into it.

The restoration described here is not only physical. It reaches the soul — the inner life that becomes worn down by pressure, responsibility, fear, and constant motion.`,
    },
  ],
  actionStep: `This week, choose one small area where you will stop pretending you are unlimited.

Write down this sentence:

“I am not responsible for carrying everything today.”

Then name one burden you have been carrying that may not actually belong fully to you.

It may be someone else’s reaction. A task that needs to be delegated. A standard no one asked you to meet. A pressure you keep accepting because saying no feels uncomfortable.

Choose one practical act of release this week.

That could be canceling one unnecessary commitment, asking for help, taking a real Sabbath block, turning your phone off for one evening, or telling someone honestly, “I do not have capacity for this right now.”

Do not make rest theoretical.

Make one concrete decision that tells the truth: you are human, and God is not disappointed by that.`,
  reflectionQuestions: [
    "What am I carrying right now that God may not be asking me to carry alone?",
    "Where have I confused faithfulness with constant availability?",
    "What is one real act of rest or release I can practice this week?",
  ],
  applicationPlan: {
    title: "Practice rest without pretending.",
    description:
      "The printable plan helps you name what is draining you, identify one burden to release, and take one practical step toward rest.",
    includes: [
      "Three scripture references",
      "A burden-release worksheet",
      "Reflection questions",
      "A weekly rest decision prompt",
      "A simple prayer for restoration",
    ],
    cta: "Get this as a printable plan",
  },
  relatedSituations: [
    "cant-stop-worrying",
    "hard-decision",
    "job-loss-financial-fear",
    "feeling-distant-from-god",
  ],
},
{
  slug: "job-loss-financial-fear",
  title: "When you’re afraid about money or work",
  category: "Work & Money",
  summary:
    "For job loss, financial pressure, provision fear, and the question underneath it all: “Will we be okay?”",
  metaTitle: "When You’re Afraid About Money or Work | The Still Compass",
  metaDescription:
    "Biblical guidance for financial fear, job loss, work uncertainty, and trusting God while taking the next faithful step.",
  heroCta: "Get the printable application plan",
  secondaryCta: "Start reflection",
  realProblem: `Money fear rarely stays only about money.

It touches your sleep, your body, your relationships, your sense of safety, and sometimes your sense of worth. A lost job, unstable income, rising bills, debt, or an uncertain future can make everything feel fragile.

You may be trying to stay faithful while still refreshing your bank balance, checking job listings, doing mental math, or wondering how long you can keep things together.

The fear underneath the fear is often simple:

Will we be okay?

This is not a small thing. The Bible does not treat provision as imaginary. Food, work, shelter, and daily needs matter. But scripture also refuses to let fear become your shepherd.

This is about bringing financial fear into the presence of God while also taking wise, concrete steps in front of you.`,
  passages: [
    {
      reference: "Matthew 6:31–34",
      explanation: `Jesus names real needs: what to eat, what to drink, what to wear.

He is not dismissing practical concerns. He knows daily provision matters.

But he also tells his listeners not to let those needs become the center that controls everything. The call to seek first the kingdom of God is not a command to ignore bills or responsibilities. It is an invitation to reorder fear, trust, and today’s obedience.

Tomorrow still exists. But Jesus does not ask you to carry tomorrow’s trouble today.`,
    },
    {
      reference: "Philippians 4:11–13",
      explanation: `Paul speaks about both need and plenty.

That balance matters. Contentment is not denial. It is not pretending scarcity feels easy. Paul had learned how to walk with God in different circumstances, including lack.

The strength he describes is not motivational self-belief. It is Christ’s strength sustaining him in situations he would not have chosen.

Financial fear often asks, “Can I handle this?” Scripture gently redirects the question: “Will Christ sustain me here too?”`,
    },
    {
      reference: "Proverbs 21:5",
      explanation: `The Bible’s call to trust God does not cancel wisdom, planning, or diligence.

This proverb honors steady, thoughtful action.

When money fear is loud, panic often pushes people toward extremes: doing nothing because they feel overwhelmed, or making rushed decisions because they cannot sit with uncertainty.

Wisdom usually looks smaller and steadier. Make the call. Update the resume. Review the numbers. Ask for counsel. Take the next faithful step without pretending panic is guidance.`,
    },
  ],
  actionStep: `Set aside thirty minutes this week for a simple “truth and next step” review.

Use one page.

First, write the facts:
What money is available?
What bills are due?
What work or income options are actually in front of you?
What do you know for certain?

Second, write the fears:
What are you afraid might happen?
What story is your mind repeating?

Third, write one next faithful step:
Apply for one role.
Call one person.
Review one expense.
Ask one trusted person for advice.
Make one payment plan.
Prepare one honest conversation.

Do not try to solve six months of life in one sitting.

Bring the fear to God. Tell the truth about the numbers. Then take the next wise step available today.`,
  reflectionQuestions: [
    "What is the specific financial or work-related fear I keep replaying?",
    "What are the facts I know today, separate from the outcomes I am imagining?",
    "What is one wise step I can take this week instead of letting fear decide for me?",
  ],
  applicationPlan: {
    title: "Face the numbers without letting fear lead.",
    description:
      "The printable plan helps you separate facts from fears, pray honestly about provision, and choose one wise next step.",
    includes: [
      "Three scripture references",
      "A facts and fears worksheet",
      "Reflection questions",
      "A next financial step prompt",
      "A simple prayer for provision and wisdom",
    ],
    cta: "Get this as a printable plan",
  },
  relatedSituations: [
    "cant-stop-worrying",
    "hard-decision",
    "burnout",
    "feeling-distant-from-god",
  ],
},
{
  slug: "conflict-with-someone-you-love",
  title: "When you’re in conflict with someone you love",
  category: "Relationships & Conflict",
  summary:
    "For the conversation you keep replaying, avoiding, or entering badly.",
  metaTitle: "When You’re in Conflict With Someone You Love | The Still Compass",
  metaDescription:
    "Biblical guidance for conflict, difficult conversations, anger, humility, and one concrete step toward peace.",
  heroCta: "Get the printable application plan",
  secondaryCta: "Start reflection",
  realProblem: `Conflict hurts differently when love is involved.

It is not just disagreement. It is the replaying, the defensiveness, the things you wish you had not said, the things you still want to say, and the quiet fear that the distance may grow if nothing changes.

Maybe you keep avoiding the conversation because you do not want another argument. Maybe you keep entering it too sharply because you feel unheard. Maybe part of you wants peace, but another part wants to be proven right.

The Bible does not treat peace as pretending nothing happened.

But it also does not let honesty become cruelty.

This is not about winning the argument. It is about learning how to move toward truth with humility, courage, and love.`,
  passages: [
    {
      reference: "James 1:19–20",
      explanation: `James gives a simple pattern that is difficult to practice when emotions are high: quick to listen, slow to speak, slow to become angry.

This is not a call to silence or passivity. It is a call to slow down enough that anger does not become the leader in the room.

The passage also tells the truth about anger. Human anger does not produce the righteousness God desires. That does not mean every concern is wrong. It means anger, left in charge, rarely brings about the healing you actually want.`,
    },
    {
      reference: "Matthew 5:23–24",
      explanation: `Jesus treats reconciliation as spiritually serious.

He does not separate worship from the way we handle relationships. If there is something unresolved with a brother or sister, it matters.

This passage does not mean every relationship can be repaired instantly or that every unsafe situation should be re-entered without wisdom. But it does show that God cares deeply about the movement toward peace, confession, and repair where it is possible.`,
    },
    {
      reference: "Ephesians 4:29–32",
      explanation: `Paul gives a picture of speech that builds up rather than tears down.

That does not mean avoiding hard truth. It means asking whether your words are serving grace or simply releasing pressure.

The call to kindness, tenderheartedness, and forgiveness is not sentimental. It is costly. It asks you to remember how much grace you have received before deciding how you will speak to someone else.`,
    },
  ],
  actionStep: `Before the next conversation, write two sentences.

First:

“What I need to say honestly is…”

Second:

“What I need to say gently is…”

Do not enter the conversation with only the first sentence.

Do not avoid the conversation by hiding behind only the second.

Truth without gentleness can become a weapon. Gentleness without truth can become avoidance.

Then choose one concrete repair step.

That may be apologizing for your tone, asking to talk when both of you are calmer, naming the real issue without attacking, or saying, “I want to understand what you heard from me.”

The goal this week is not to fix the entire relationship in one conversation.

The goal is to take one faithful step toward peace without surrendering truth.`,
  reflectionQuestions: [
    "What am I most tempted to do in this conflict: avoid, attack, defend, withdraw, or control?",
    "What truth needs to be spoken, and how can I speak it with gentleness?",
    "Is there anything I need to own before asking the other person to own their part?",
  ],
  applicationPlan: {
    title: "Prepare for the conversation with truth and gentleness.",
    description:
      "The printable plan helps you slow down, name what needs to be said, and choose one faithful repair step.",
    includes: [
      "Three scripture references",
      "A truth and gentleness worksheet",
      "Reflection questions",
      "A repair-step prompt",
      "A simple prayer before a hard conversation",
    ],
    cta: "Get this as a printable plan",
  },
  relatedSituations: [
    "cant-stop-worrying",
    "hard-decision",
    "burnout",
    "feeling-distant-from-god",
  ],
},
{
  slug: "feeling-distant-from-god",
  title: "When you feel distant from God",
  category: "Faith & Dry Seasons",
  summary:
    "For the dry season where you are still showing up, but something feels quiet, numb, or far away.",
  metaTitle: "When You Feel Distant From God | The Still Compass",
  metaDescription:
    "Biblical guidance for spiritual dryness, feeling distant from God, numbness in prayer, and returning gently.",
  heroCta: "Get the printable application plan",
  secondaryCta: "Start reflection",
  realProblem: `There are seasons when faith does not disappear, but it feels quiet.

You may still believe. You may still show up. You may still pray, read, serve, or go to church. But something feels distant, dry, numb, or strangely muted.

That can be frightening because it is hard to know what it means.

Did I do something wrong?
Is God disappointed?
Am I drifting?
Why does prayer feel empty?
Why does scripture feel flat?

A dry season can make you feel guilty for not feeling more.

But the life of faith is not measured only by emotional intensity. Sometimes faithfulness looks like returning gently, even when you do not feel much yet.`,
  passages: [
    {
      reference: "Psalm 42:1–5",
      explanation: `The psalmist does not hide spiritual thirst.

He names it.

That matters because scripture gives language for longing, discouragement, and inner disquiet. The question “Why are you cast down, O my soul?” is not unbelief. It is honest self-address in the presence of God.

The psalm does not resolve everything immediately. It holds longing and hope together. That is often what a dry season feels like: not clean answers, but the decision to keep turning toward God.`,
    },
    {
      reference: "Isaiah 55:1–3",
      explanation: `God’s invitation is addressed to the thirsty.

Not the impressive. Not the emotionally strong. Not the people who feel spiritually successful.

The thirsty.

This passage reminds you that need is not a barrier to coming to God. It may be the very place where the invitation becomes clearest.

Dryness does not disqualify you. It may be the place where you learn to come honestly, without performance.`,
    },
    {
      reference: "John 15:4–5",
      explanation: `Jesus speaks about abiding.

Abiding is not frantic striving. It is remaining.

That is important in a dry season because your instinct may be to fix yourself quickly, manufacture emotion, or prove that you are still serious.

But Jesus describes fruitfulness as something that comes from remaining in him. Sometimes the next faithful step is not dramatic. It is staying connected in small, honest ways.`,
    },
  ],
  actionStep: `For the next seven days, practice a five-minute return.

Do not try to force a powerful quiet time.

Set a timer for five minutes.

Begin with one honest sentence:

“God, I feel distant, but I am here.”

Then read one short passage slowly. Psalm 42 is a good place to begin.

After reading, write one sentence only:

“What I noticed was…”

That is enough.

The goal is not to create a feeling on demand. The goal is to stop disappearing because you feel dry.

Return gently. Stay near. Let God meet you without performance.`,
  reflectionQuestions: [
    "When did I first notice this sense of distance or dryness?",
    "What do I assume God thinks of me when I do not feel spiritually alive?",
    "What would it look like to return gently instead of trying to force intensity?",
  ],
  applicationPlan: {
    title: "Return gently in a dry season.",
    description:
      "The printable plan gives you a simple seven-day practice for showing up honestly when God feels distant.",
    includes: [
      "Three scripture references",
      "A five-minute return practice",
      "Reflection questions",
      "A seven-day noticing space",
      "A simple prayer for spiritual dryness",
    ],
    cta: "Get this as a printable plan",
  },
  relatedSituations: [
    "cant-stop-worrying",
    "hard-decision",
    "burnout",
    "job-loss-financial-fear",
  ],
},
];

export function getAllSituations() {
  return situations;
}

export function getSituationBySlug(slug: string) {
  return situations.find((situation) => situation.slug === slug);
}

export function getFeaturedSituations() {
  return situations.slice(0, 6);
}