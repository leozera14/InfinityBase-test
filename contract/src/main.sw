contract;

use std::{
    address::Address,
    asset::{
        transfer,
    },
    auth::msg_sender,
    call_frames::msg_asset_id,
    context::msg_amount,
    identity::Identity,
};

struct Campaign {
    pub id: u64,
    pub creator: Address,
    pub goal: u64,
    pub pledged: u64,
    pub active: bool,
}

storage {
    campaigns: StorageMap<u64, Campaign> = StorageMap::<u64, Campaign> {},
    campaign_count: u64 = 0,
    contributions: StorageMap<(u64, Address), u64> = StorageMap::<(u64, Address), u64> {},
}

abi Crowdfund {
    #[storage(read, write)]
    fn create_campaign(goal: u64) -> u64;

    #[storage(read, write), payable]
    fn contribute_campaign(id: u64);

    #[storage(read, write)]
    fn withdraw_campaign(id: u64);

    #[storage(read, write)]
    fn refund_campaign(id: u64);

    #[storage(read)]
    fn get_campaign_count() -> u64;

    #[storage(read)]
    fn get_campaign(id: u64) -> Campaign;

    #[storage(read)]
    fn get_my_campaigns() -> Vec<Campaign>;

    #[storage(read)]
    fn get_contributed_campaigns() -> Vec<Campaign>;

    #[storage(read)]
    fn get_all_campaigns() -> Vec<Campaign>;
}

impl Crowdfund for Contract {
    #[storage(read, write)]
    fn create_campaign(goal: u64) -> u64 {
        assert(goal > 0);

        let id = storage.campaign_count.read();

        storage.campaign_count.write(id + 1);

        let creator = match msg_sender().unwrap() {
            Identity::Address(addr) => addr,
            _ => revert(42),
        };

        let camp = Campaign {
            id,
            creator,
            goal,
            pledged: 0,
            active: true,
        };

        storage.campaigns.insert(id, camp);

        id
    }

    #[storage(read, write), payable]
    fn contribute_campaign(id: u64) {
        let mut camp = storage.campaigns.get(id).read();

        assert(camp.active);
        assert(msg_asset_id() == AssetId::base());

        let amount = msg_amount();

        assert(amount > 0);
        assert(camp.pledged + amount <= camp.goal);

        let user = match msg_sender().unwrap() {
            Identity::Address(addr) => addr,
            _ => revert(42),
        };

        camp.pledged += amount;

        let key = (id, user);

        let prev = storage.contributions.get(key).read();

        storage.contributions.insert(key, prev + amount);

        if camp.pledged == camp.goal {
            camp.active = false;
        }

        storage.campaigns.insert(id, camp);
    }

    #[storage(read, write)]
    fn withdraw_campaign(id: u64) {
        let mut camp = storage.campaigns.get(id).read();

        assert(!camp.active);
        assert(camp.pledged == camp.goal);

        let caller = msg_sender().unwrap();

        let addr = match caller {
            Identity::Address(a) => a,
            _ => revert(42),
        };

        assert(addr == camp.creator);

        transfer(
            Identity::Address(camp.creator),
            AssetId::base(),
            camp.pledged,
        );

        camp.pledged = 0;

        storage.campaigns.insert(id, camp);
    }

    #[storage(read, write)]
    fn refund_campaign(id: u64) {
        let mut camp = storage.campaigns.get(id).read();

        assert(camp.active);

        let caller = msg_sender().unwrap();
        let addr = match caller {
            Identity::Address(a) => a,
            _ => revert(42),
        };

        let contrib = storage.contributions.get((id, addr)).read();

        assert(contrib > 0);

        transfer(Identity::Address(addr), AssetId::base(), contrib);

        camp.pledged -= contrib;

        storage.contributions.insert((id, addr), 0);

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

    #[storage(read)]
    fn get_my_campaigns() -> Vec<Campaign> {
        let mut res: Vec<Campaign> = Vec::new();

        let count = storage.campaign_count.read();

        let caller = match msg_sender().unwrap() {
            Identity::Address(a) => a,
            _ => revert(42),
        };

        let mut i = 0;

        while i < count {
            let camp = storage.campaigns.get(i).read();
            if camp.creator == caller {
                res.push(camp);
            }
            i += 1;
        }

        res
    }

    #[storage(read)]
    fn get_contributed_campaigns() -> Vec<Campaign> {
        let mut res: Vec<Campaign> = Vec::new();

        let count = storage.campaign_count.read();

        let caller = match msg_sender().unwrap() {
            Identity::Address(a) => a,
            _ => revert(42),
        };

        let mut i = 0;

        while i < count {
            let amount = storage.contributions.get((i, caller)).try_read().unwrap_or(0);
            if amount > 0 {
                let camp = storage.campaigns.get(i).read();
                res.push(camp);
            }
            i += 1;
        }

        res
    }

    #[storage(read)]
    fn get_all_campaigns() -> Vec<Campaign> {
        let mut res: Vec<Campaign> = Vec::new();

        let count = storage.campaign_count.read();

        let mut i = 0;

        while i < count {
            res.push(storage.campaigns.get(i).read());
            i += 1;
        }

        res
    }
}

// ------------------- TESTS  ------------------- //
#[test]
fn test_create_campaign() {
    let instance = abi(Crowdfund, CONTRACT_ID);
    let new_id = instance.create_campaign(1_000);
    assert_eq(new_id, 0);
    let count = instance.get_campaign_count();
    assert_eq(count, 1);
    let c = instance.get_campaign(0);
    let _ = c.creator;
    assert_eq(c.goal, 1_000);
    assert_eq(c.pledged, 0);
    assert(c.active == true);
}
#[test(should_revert)]
fn test_create_campaign_with_zero_goal_should_fail() {
    let instance = abi(Crowdfund, CONTRACT_ID);
    instance.create_campaign(0);
}
#[test]
fn test_multiple_campaigns() {
    let instance = abi(Crowdfund, CONTRACT_ID);
    let id1 = instance.create_campaign(100);
    let id2 = instance.create_campaign(200);
    assert_eq(id1, 0);
    assert_eq(id2, 1);
    let count = instance.get_campaign_count();
    assert_eq(count, 2);
    let c1 = instance.get_campaign(id1);
    let c2 = instance.get_campaign(id2);
    assert_eq(c1.goal, 100);
    assert_eq(c2.goal, 200);
}

#[test]
fn test_get_campaign_count_and_get_campaign() {
    let instance = abi(Crowdfund, CONTRACT_ID);
    assert_eq(instance.get_campaign_count(), 0);

    let id1 = instance.create_campaign(100);
    let id2 = instance.create_campaign(200);
    assert_eq(instance.get_campaign_count(), 2);

    let c1 = instance.get_campaign(id1);
    assert_eq(c1.goal, 100);
    let c2 = instance.get_campaign(id2);
    assert_eq(c2.goal, 200);
}

#[test]
fn test_get_my_campaigns() {
    let instance = abi(Crowdfund, CONTRACT_ID);
    let _ = instance.create_campaign(150);
    let _ = instance.create_campaign(250);
    let _ = instance.create_campaign(350);

    let my = instance.get_my_campaigns();
    assert_eq(my.len(), 3);
    assert_eq(my.get(0).unwrap().goal, 150);
    assert_eq(my.get(1).unwrap().goal, 250);
    assert_eq(my.get(2).unwrap().goal, 350);
}

#[test]
fn test_get_contributed_campaigns_empty() {
    let instance = abi(Crowdfund, CONTRACT_ID);
    let _ = instance.create_campaign(500);
    let _ = instance.create_campaign(600);

    let contrib = instance.get_contributed_campaigns();
    assert(contrib.len() == 0);
}

#[test]
fn test_get_all_campaigns() {
    let instance = abi(Crowdfund, CONTRACT_ID);

    let id1 = instance.create_campaign(100);
    let id2 = instance.create_campaign(200);
    let id3 = instance.create_campaign(300);

    let all = instance.get_all_campaigns();

    assert_eq(all.len(), 3);

    assert_eq(all.get(0).unwrap().goal, 100);
    assert_eq(all.get(1).unwrap().goal, 200);
    assert_eq(all.get(2).unwrap().goal, 300);
}

// We dont have tests for functions that handle with real values like contribute_campaign, as here we cant
// send it, so the test will always fail.
