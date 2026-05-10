const visualWalkthroughs = {
  'sliding-window-001': {
    title: 'Mental model walkthrough',
    summary: '[left ... right] expands → violation appears → left moves until valid → answer updates',
    diagram: {
      title: 'Pointer movement: preserve a valid active region',
      frames: [
        {
          label: '1. Start',
          value: 'a  b  c  d  e\n^\nL,R',
          note: 'Both pointers begin at the first candidate item.'
        },
        {
          label: '2. Expand right',
          value: 'a  b  c  d  e\n[--]\nL  R',
          note: 'Move right to include one new item and reuse previous state.'
        },
        {
          label: '3. Keep growing',
          value: 'a  b  c  d  e\n[-----]\nL     R',
          note: 'The active region remains contiguous while state is valid.'
        },
        {
          label: '4. Violation appears',
          value: 'a  b  c  c  e\n[--------]\nL        R',
          note: 'A duplicate or invalid condition appears inside the window.'
        },
        {
          label: '5. Pause answer update',
          value: 'a  b  c  c  e\n[invalid]\nL        R',
          note: 'Do not update the answer while the invariant is broken.'
        },
        {
          label: '6. Move left',
          value: 'a  b  c  c  e\n   [-----]\n   L     R',
          note: 'Shrink from the left until the bad state is removed.'
        },
        {
          label: '7. Valid again',
          value: 'a  b  c  c  e\n      [--]\n      L  R',
          note: 'The window is valid again, so it is safe to compare answers.'
        },
        {
          label: '8. Continue scan',
          value: 'a  b  c  c  e\n      [-----]\n      L     R',
          note: 'Continue expanding and repairing until the input is exhausted.'
        }
      ]
    },
    steps: [
      {
        title: 'Track the active region',
        body: 'The window is the only part of the input you are currently reasoning about.'
      },
      {
        title: 'Protect the invariant',
        body: 'Before updating the answer, make sure the active region is valid.'
      },
      {
        title: 'Reuse previous work',
        body: 'Move one pointer at a time instead of recomputing every candidate from scratch.'
      }
    ],
    media: [
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
        alt: 'Code on a screen representing algorithm state transitions',
        caption: 'Visual clarity means tracking how state moves, not memorizing syntax.'
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1200&auto=format&fit=crop',
        alt: 'Developer workstation used for visual algorithm reasoning',
        caption: 'A strong mental model lets the same pattern transfer across variants.'
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
        alt: 'Laptop showing software engineering workspace',
        caption: 'Trace one small example until pointer movement becomes obvious.'
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        alt: 'Data dashboard representing evolving state',
        caption: 'Sliding windows are useful anywhere state changes over a moving range.'
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
        alt: 'Server racks representing production stream processing',
        caption: 'The same mental model appears in streaming, rate limits, and observability.'
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
        alt: 'Developer learning with laptop and notes',
        caption: 'Use visuals to explain the invariant before writing final code.'
      }
    ]
  }
};

export function getVisualWalkthroughForQuestion(questionId) {
  return visualWalkthroughs[questionId] || null;
}

export default visualWalkthroughs;
