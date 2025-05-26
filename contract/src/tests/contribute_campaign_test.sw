library;

#[test]
fn test_contribute_campaign() {
    let instance = abi(Crowdfund, CONTRACT_ID);

    // Create campaign with goal as 1000
    let id = instance.create_campaign(1_000);
    assert_eq(id, 0);

    // Contribute with 500
    instance.contribute_campaign(0, 500);
    let c = instance.get_campaign(0);
    assert_eq(c.pledged, 500);
    assert(c.active);

    // Add more 600 as contribution (hit the goal but doesnt exceed it)
    instance.contribute_campaign(0, 600);
    let c2 = instance.get_campaign(0);
    assert_eq(c2.pledged, 1_000);

    // Should be disabled
    assert(!c2.active);
}
