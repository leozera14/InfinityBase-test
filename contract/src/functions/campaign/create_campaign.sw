library;

use std::identity::Identity;

pub fn handle_create_campaign(goal: u64, creator: Identity) -> (Identity, u64, u64, bool) {
    (creator, goal, 0, true)
}
