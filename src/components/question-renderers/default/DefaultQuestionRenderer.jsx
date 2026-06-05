import FocusedProblemWorkspace from '../../FocusedProblemWorkspace.jsx';
import QuestionNavigationControls from '../shared/QuestionNavigationControls.jsx';

export default function DefaultQuestionRenderer(props) {
  return (
    <>
      <QuestionNavigationControls navigation={props.navigation} className="question-navigation-top" />
      <FocusedProblemWorkspace {...props} />
      <QuestionNavigationControls navigation={props.navigation} className="question-navigation-bottom" />
    </>
  );
}
