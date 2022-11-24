import type { StoryObj, Meta } from '@storybook/react'
import { Box, Multistep, MultistepProps } from '@ignite-ui-sonego/react'

export default {
  title: 'Form/Multistep',
  component: Multistep,
  args: {
    size: 4,
    currentStep: 1,
  },
  decorators: [
    (Story) => {
      return (
        <Box
          as="label"
          css={{ display: 'flex', alignItems: 'center', gap: '$2' }}
        >
          {Story()}
        </Box>
      )
    },
  ],
} as Meta<MultistepProps>

export const Primary: StoryObj<MultistepProps> = {}

export const Full: StoryObj<MultistepProps> = {
  args: {
    currentStep: 4,
  },
}
