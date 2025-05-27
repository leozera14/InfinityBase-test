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
    assert(c.active == true); // <- ATIVO
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
