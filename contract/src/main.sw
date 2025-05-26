contract;

mod functions;

use std::auth::msg_sender;
use std::identity::Identity;
use functions::{handle_contribute_campaign, handle_create_campaign};

struct Campaign {
    pub creator: Identity,
    pub goal: u64,
    pub pledged: u64,
    pub active: bool,
}

storage {
    campaigns: StorageMap<u64, Campaign> = StorageMap::<u64, Campaign> {},
    campaign_count: u64 = 0,
}

abi Crowdfund {
    #[storage(read, write)]
    fn create_campaign(goal: u64) -> u64;

    #[storage(read, write)]
    fn contribute_campaign(id: u64, amount: u64);

    #[storage(read)]
    fn get_campaign_count() -> u64;

    #[storage(read)]
    fn get_campaign(id: u64) -> Campaign;
}

impl Crowdfund for Contract {
    #[storage(read, write)]
    fn create_campaign(goal: u64) -> u64 {
        let id = storage.campaign_count.read();
        
        storage.campaign_count.write(id + 1);

        let (creator, goal, pledged, active) = handle_create_campaign(goal, msg_sender().unwrap());

        let camp = Campaign {
            creator,
            goal,
            pledged,
            active,
        };

        storage.campaigns.insert(id, camp);
        
        id
    }

    #[storage(read, write)]
    fn contribute_campaign(id: u64, amount: u64) {
        // Find the campaign
        let mut camp = storage.campaigns.get(id).read();

        // Campaign doesnt exist
        assert(camp.active);

        //Calculate how much user can contribute for the campaign (cannot exceed the goal)
        let amountAdded = handle_contribute_campaign(camp.pledged, camp.goal, amount);

        camp.pledged = camp.pledged + amountAdded;

        // If exceed the goal, close the campaign
        if camp.pledged >= camp.goal {
            camp.active = false;
        }

        storage.campaigns.insert(id, camp);
    }

    #[storage(read)]
    fn get_campaign_count() -> u64 {
        storage.campaign_count.read()
    }

    #[storage(read)]
    fn get_campaign(id: u64) -> Campaign {
        storage.campaigns.get(id).read()
    }
}
