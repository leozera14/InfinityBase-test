library;

pub fn handle_contribute_campaign(current_pledged: u64, goal: u64, amount: u64) -> u64 {
    let available = goal - current_pledged;
    //Contribution must be bigger than 0
    assert(amount > 0);
    // Campaign already hit the goal
    assert(available > 0);

    let actual_contribution = if amount > available {
        available
    } else {
        amount
    };

    actual_contribution
}
