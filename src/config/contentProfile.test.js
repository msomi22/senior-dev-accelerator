import {
  filterQuestionsForActiveProfile,
  isQuestionApprovedForProfile
} from './contentProfile.js';

describe('content profile filtering', () => {
  it('allows approved production questions', () => {
    const approved = {
      id: 'sliding-window-001'
    };

    expect(isQuestionApprovedForProfile(approved)).toBe(true);
  });

  it('filters arrays safely', () => {
    const questions = [
      { id: 'sliding-window-001' },
      { id: 'draft-question-001' }
    ];

    const filtered = filterQuestionsForActiveProfile(questions);

    expect(filtered.length).toBeGreaterThan(0);
  });
});
