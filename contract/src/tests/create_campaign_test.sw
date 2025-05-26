library;

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
    assert(c.active);
}
