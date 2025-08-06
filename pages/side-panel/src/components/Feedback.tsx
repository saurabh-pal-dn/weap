import { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const FEEDBACK_OPTIONS = ['Hallucination', 'Factually incorrect', 'Incomplete', 'Irrelevant'];

enum FeedbackTypes {
  like = 'like',
  dislike = 'dislike',
}

interface ExtraFeedbackProps {
  id: string | null;
}

async function sendFeedback(feedback: object) {
  try {
    const response = await fetch(
      'https://my-elasticsearch-project-d6a200.es.asia-south1.gcp.elastic.cloud:443/chirag-agent-0/_doc',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'ApiKey cmZ2TmZwZ0J2OEtUTEsyWVoxSmc6Sk10Q09OY0E4Sk1IUHd4cmh0M1lXdw==',
        },
        body: JSON.stringify(feedback),
      },
    );
    if (!response.ok) throw new Error('Failed to submit feedback');

    console.log('Feedback submitted successfully');
  } catch (error) {
    console.error('Error submitting feedback:', error);
  }
}

export default function Feedback({ id }: ExtraFeedbackProps) {
  const [feedbackState, setFeedbackState] = useState<'liked' | 'disliked' | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const handleLike = () => {
    setFeedbackState('liked');
    setShowPopup(false);
    sendFeedback({ type: FeedbackTypes.like, id: id });
  };

  const handleDislike = () => {
    setFeedbackState('disliked');
    setShowPopup(true);
    sendFeedback({ type: FeedbackTypes.dislike, id: id });
  };

  const handleReasonSelection = (reason: string) => {
    setSelectedReason(reason);
  };

  const handleSubmitFeedback = () => {
    if (selectedReason) {
      sendFeedback({ type: FeedbackTypes.dislike, id: id, reason: selectedReason });
      setShowPopup(false);
      setSelectedReason(null);
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <button
        onClick={handleLike}
        className={`rounded-md p-1 ${
          feedbackState === 'liked' ? 'bg-blue-100 text-blue-500' : 'text-gray-500 hover:bg-gray-100'
        }`}
        aria-label="Like">
        <FaThumbsUp />
      </button>
      <button
        onClick={handleDislike}
        className={`rounded-md p-1 ${
          feedbackState === 'disliked' && !showPopup ? 'bg-red-100 text-red-500' : 'text-gray-500 hover:bg-gray-100'
        }`}
        aria-label="Dislike">
        <FaThumbsDown />
      </button>

      {showPopup && (
        <div className="absolute bottom-full mb-2 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <p className="mb-2 text-sm font-semibold text-gray-800">Please provide more feedback:</p>
          <div className="flex flex-wrap gap-2">
            {FEEDBACK_OPTIONS.map(reason => (
              <button
                key={reason}
                onClick={() => handleReasonSelection(reason)}
                className={`rounded-full px-3 py-1 text-xs ${
                  selectedReason === reason ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}>
                {reason}
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setShowPopup(false)}
              className="rounded-md bg-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-300">
              Cancel
            </button>
            <button
              onClick={handleSubmitFeedback}
              disabled={!selectedReason}
              className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
