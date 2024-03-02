def mean_reciprocal_rank(predictions):
    """
    Calculate the Mean Reciprocal Rank (MRR) for a list of predictions.

    Parameters:
    - predictions: A list of lists, where each inner list represents the predicted rankings.
                   The first element in each inner list is the correct answer.

    Returns:
    - mean_rr: The mean reciprocal rank for the given predictions.
    """
    total_rr = 0.0  # Total reciprocal rank

    for prediction_list in predictions:
        correct_answer = prediction_list[0]

        # Check if the correct answer is in the predicted rankings
        if correct_answer in prediction_list:
            rank = prediction_list.index(correct_answer) + 1
            rr = 1.0 / rank
            total_rr += rr

    # Calculate mean reciprocal rank
    num_predictions = len(predictions)
    mean_rr = total_rr / num_predictions if num_predictions > 0 else 0.0

    return mean_rr
