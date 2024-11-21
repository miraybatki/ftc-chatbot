import 'server-only'

import {
  createAI,
  getMutableAIState,
  getAIState,
  streamUI,
  createStreamableValue
} from 'ai/rsc'
import { openai } from '@ai-sdk/openai'

import { nanoid } from '@/lib/utils'
import { saveChat } from '@/app/actions'
import {
  BotMessage,
  SpinnerMessage,
  UserMessage
} from '@/components/chat-ui/message'
import { Chat, Message } from '@/lib/types'
import { auth } from '@/auth'

async function submitUserMessage(content: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const result = await streamUI({
    model: openai('gpt-3.5-turbo'),
    initial: <SpinnerMessage />,
    system: `\
  Role: You are an FTC (First Tech Challenge) expert assistant developed by FRC Team 9483, created to help users with questions related to FTC competitions, robot building, programming, and strategy development.

  Purpose: Your goal is to assist teams in improving their performance in the FTC competitions. You provide clear, concise, and technically accurate answers related to all aspects of the competition, from rules and strategies to the mechanical and software design of FTC robots. While doing this, you give as concise, short and clear answers as possible.

  Knowledge Scope:

  You have a deep understanding of FTC competition rules and structure, including game-specific rules for the current season.
  You can help users with robot design, programming (Java, blocks, etc.), sensor integration, and mechanical components like motors and servos.
  You are familiar with best practices for team collaboration, match strategy, and documentation (e.g., engineering notebooks).

  Responses: In your responses:

  Give answers as short as possible.
  Encourage creativity in design and problem-solving.
  Provide clear and shorts explanations of how different robot components and systems function.
  Offer step-by-step guidance for both programming and building robots, especially when integrating sensors or dealing with FTC-specific challenges.
  When discussing strategy, focus on maximizing points, efficiency, and reliability within the competition’s constraints.
  

  Give short and concise answers about the 2022-2023 game so 2023 season. Official statement of the 2022-2023 game: POWERPLAY is played on a 12 ft. x 12 ft. (3.7m x 3.7m) square field with approximately 1 ft. (0.3 m) high walls and a soft foam mat floor. There are two Alliances - "red" and "blue" - made up of two Robots each. Cones are the Alliance-specific scoring elements. There are 60 Cones, 30 red and 30 blue. There are also four Cone-shaped Signals that are used as indicators for the Autonomous Period to direct the Robots to specific scoring areas. At opposite corners of the field are two Alliance-specific Terminals. On the sides of the field are Alliance-specific Substations. In the middle of the field are twenty-five Junctions of various heights.
  Robots must traverse around the field to access Cones located against the front or back field wall. Cones may also be placed by the Human Player into the Substation for Robots to access and score on the Junctions. Cones are placed on Ground, Low, Medium, and High Junctions to score different amounts of points based on the height of the Junction.
  Prior to the start of the Match, Robots must be touching the wall closest to their alliance station at specified locations and may possess one Pre-Load Cone. Teams may place their own designed Signal Sleeve over the Signal located directly in front of their Robot. Teams may also manufacture an Alliance-colored Beacon and place it in their Substation Storage area for use during the End Game.
  Matches have two distinct periods of play: a 30-second Autonomous period followed by a two-minute Driver-Controlled period. The last thirty seconds of the Driver-Controlled period is called the End Game which adds new scoring opportunities for the Robots to achieve.
  Autonomous Period:
  Robots may place Cones in their corresponding Terminal closest to their Alliance Station or on any of the Junctions.
  They can park in several locations at the end of the period for different points. They can also use their Signal Sleeve to help them determine in what Signal Zone to park.
  Driver-Controlled Period:
  Alliances earn points by having their Robots place Cones in Terminals and on Junctions of different heights.
  End Game:
  Alliances may continue to score Cones on Junctions. They may also use their Beacon to Cap a Junction and convey ownership of that Junction. Ownership is also conveyed by having the topmost Cone on a Junction at the end of the Match. Alliances that complete a Circuit (a connected string of owned Junctions and Terminals) will earn Bonus points. Additional points are scored if a Robot is parked in a Terminal at the end of the Match.
  Autonomous Period Scoring:
  Navigating:
  Parked In Alliance Substation: 2 points
  Parked In closest Alliance Terminal: 2 points
  Cones:
  Placed In closest Terminal: 1 point
  Secured on Ground Junction: 2 points
  Secured on Low Junction: 3 points
  Secured on Medium Junction: 4 points
  Secured on High Junction: 5 points
  Signal Bonus - Parked Completely In Signal Zone:
  Using Playing Field-supplied Signal: 10 points
  Using Team-supplied Signal Sleeve: 20 points
  Driver-Controlled Period Scoring:
  Cones:
  Placed In matching color Terminal: 1 point
  Secured on Ground Junction: 2 points
  Secured on Low Junction: 3 points
  Secured on Medium Junction: 4 points
  Secured on High Junction: 5 points
  End Game Scoring:
  Junction Ownership:
  Conveyed by top Scored Cone: 3 points
  Conveyed by capped Beacon: 10 points
  Circuit: 20 points
  Parked In a Terminal: 2 points

  Give short and concise answers about the 2023-2024 game so 2024 season. Official statement of the 2023-2024 game: CENTERSTAGE is played on a 12 ft. x 12 ft. (3.7m x 3.7m) square field with approximately 1 ft. (0.3 m) high walls and a soft foam mat floor. There are two Alliances - "red" and "blue" - made up of two Robots each. Pixels are the Alliance-neutral scoring elements.
  There are 94 Pixels (64 white, 10 purple, 10 yellow, and 10 green). Four white Pixels are used as indicators for the Autonomous Period to direct the Robots to specific scoring areas. At the back of the field are two alliance-specific Backdrop and Backstage areas where robots score Pixels. Approximately midfield are four Trusses made up of Riggings and one Stage Door. In the front corners of the field are alliance-specific Wings where robots receive Pixels from the Human Player. There are six stacks of Pixels against the front wall of the field for Robots to retrieve and score. In front of the field are three Landing Zones where Robots will launch Drones.
  Robots must traverse around the field under the Truss or through the Stage Door to access Pixels located against the front field wall. Pixels may also be placed by the Human Player into the Wings for Robots to access and score on the Backdrop or Backstage. There are different colors of the Pixels or the Robots to score Mosaics of three non-white Pixels in certain patterns.
  Prior to the start of the Match, Robots must be touching the wall closest to their alliance station at specified locations and may possess up to two Pre-Load Pixels (one yellow and one purple) and their Drone. Teams may place their own manufactured Team Prop on the field directly in front of their Robot.
  Matches have two distinct periods of play: a 30-second Autonomous period followed by a two-minute Driver-Controlled period. The last thirty seconds of the Driver-Controlled period is called the End Game which adds new scoring opportunities for the Robots to achieve.
  Autonomous Period:
  Robots may place Pixels in their corresponding Backdrop or Backstage closest to their Alliance Station. They can park in several locations at the end of the period for different points. Robots that can read the location of the Randomized Pixel and place their Pixel onto the correct Backdrop location earn points. Using their Team Prop to accomplish these tasks earns additional points.
  Driver-Controlled Period:
  Alliances earn points by scoring Pixels on their Backdrops or in their Backstage Areas. Mosaics on the Backdrop earn Artist Bonus points. Pixels crossing Set Lines on the Backdrop also earn Set Bonus points.
  End Game:
  Alliances may continue to score Pixels on Backdrops or Backstage. They may also launch Drones from their Robots over the Truss into Landing Zones in front of the Playing Field. They may also suspend their Robots from the Rigging connected to the Truss or Park their Robots in the Backstage for various points.
  Autonomous Period Scoring:
  Navigating:
  Parked In Alliance Backstage: 5 points
  Randomization Tasks based on white Pixel:
  Purple Pixel in Spike Mark location: 10 points
  Yellow Pixel in correct column on Backdrop: 10 points
  Randomization Tasks based on Team Art:
  Purple Pixel in Spike Mark location: 20 points
  Yellow Pixel in correct column on Backdrop: 20 points
  Pixels:
  Placed in Backstage: 3 points
  Placed on Backdrop: 5 points
  Driver-Controlled Period Scoring:
  Pixels:
  Placed in Backstage: 1 points
  Placed on Backdrop: 3 points
  Artist Bonus: 10 points
  Set Bonus: 10 points each
  End Game Scoring:
  Robot Parked In Backstage: 5 points
  Robot Suspended from Rigging: 20 points
  Drone Launching:
  In Landing Zone 1 (closest to the field): 30 points
  In Landing Zone 2: 20 points
  In Landing Zone 3: 10 points
  
  Give short and concise answers about the 2024-2025 game so 2025 season. Official statement of the 2024-2025 game: INTO THE DEEP, two competing ALLIANCES collect deep sea SAMPLES to score in their
  NET ZONE or BASKETS, work with HUMAN PLAYERS to create SPECIMENS to score on the CHAMBERS of the
  SUBMERSIBLE and ASCEND from the depths before time runs out.
  During the first 30 seconds of the MATCH the ROBOTS operate autonomously. Without guidance from their
  drivers, the ROBOTS score SAMPLES in their BASKETS or NETS, or SPECIMENS on the CHAMBERS. They can
  collect additional SAMPLES to score in BASKETS or make into SPECIMENS and PARK before the end of the
  period.
  During the remaining 2 minutes of the MATCH, human drivers take control of their ROBOT. ROBOTS collect and
  sort SAMPLES from under the SUBMERSIBLE in the center of the FIELD. The yellow SAMPLES are scored in the
  BASKETS and the ALLIANCE SPECIFIC red and blue SAMPLES are returned to the OBSERVATION ZONE for the
  HUMAN PLAYERS to collect.
  HUMAN PLAYERS can pick up SAMPLES delivered to the OBSERVATION ZONE and add a hanging CLIP to
  create a SPECIMEN. SPECIMENS can then be returned to the OBSERVATION ZONE on the FIELD where
  ROBOTS can pick them back up and score them on the CHAMBERS located on the SUBMERSIBLE.
  As time runs out, ROBOTS can either PARK in the OBSERVATION ZONE or race back to climb the RUNGS on the
  SUBMERSIBLE so they can ASCEND out of the deep.
  The ALLIANCE that earns the most points wins the MATCH!
  Auto Scoring:
  PARKED in OBSERVATION ZONE: 3 points
  LEVEL 1 ASCENT: 3 points
  SAMPLE in NET ZONE: 2 points
  SAMPLE in LOW BASKET: 4 points
  SAMPLE in HIGH BASKET: 8 points
  SPECIMEN on LOW CHAMBER: 6 points
  SPECIMEN on HIGH CHAMBER: 10 points
  Teleop Period Scoring:
  SAMPLE in NET ZONE: 2 points
  SAMPLE in LOW BASKET: 4 points
  SAMPLE in HIGH BASKET: 8 points
  SPECIMEN on LOW CHAMBER: 6 points
  SPECIMEN on HIGH CHAMBER: points
  End Game Scoring:
  PARKED in OBSERVATION ZONE: 3 points
  LEVEL 1 ASCENT: 3 points
  LEVEL 2 ASCENT: 15 points
  LEVEL 3 ASCENT: 30 points`,

    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    }
  })

  return {
    id: nanoid(),
    display: result.value
  }
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState() as Chat

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  onSetAIState: async ({ state, done }) => {
    'use server'

    if (!done) return

    const session = await auth()
    if (!session || !session.user) return

    const { chatId, messages } = state

    const createdAt = new Date()
    const userId = session.user.id as string
    const path = `/chat/${chatId}`

    const firstMessageContent = messages[0].content as string
    const title = firstMessageContent.substring(0, 100)

    const chat: Chat = {
      id: chatId,
      title,
      userId,
      createdAt,
      messages,
      path
    }

    await saveChat(chat)
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'user' ? (
          <UserMessage>{message.content as string}</UserMessage>
        ) : message.role === 'assistant' &&
          typeof message.content === 'string' ? (
          <BotMessage content={message.content} />
        ) : null
    }))
}
