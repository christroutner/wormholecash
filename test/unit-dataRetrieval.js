/*
*/

"use strict";

let chai = require("chai");
let assert = require("assert");
const nock = require("nock");
let wh = require("./../lib/Wormhole").default;
let Wormhole = new wh({
  restURL: "https://wormholecash-staging.herokuapp.com/v1/",
});

describe("#DataRetrieval", () => {
  
  /*
  // This is technically an 'integration' test because it makes a live HTTP call.
  describe("#balancesForAddress", () => {
    it(`original (integration) test`, async () => {
      let balancesForAddress = await Wormhole.DataRetrieval.balancesForAddress(
        "bchtest:qq2j9gp97gm9a6lwvhxc4zu28qvqm0x4j5e72v7ejg"
      );
      //console.log(`balancesForAddress: ${JSON.stringify(balancesForAddress,null,2)}`);
      assert.deepEqual(Object.keys(balancesForAddress[0]), ["propertyid", "balance", "reserved"]);
    });
  });
  */

  // This is a 'unit' test because it mocks the http request and requires no external service to run the test.
  it(`unit test`, async () => {
    // https://wormholecash-staging.herokuapp.com/v1/dataRetrieval/balancesForAddress/bchtest:qq2j9gp97gm9a6lwvhxc4zu28qvqm0x4j5e72v7ejg
    nock(`https://wormholecash-staging.herokuapp.com`)
      .get(
        `/v1/dataRetrieval/balancesForAddress/bchtest:qq2j9gp97gm9a6lwvhxc4zu28qvqm0x4j5e72v7ejg`
      )
      .reply(200, [
        {
          propertyid: 1,
          balance: "67.65779501",
          reserved: "0.00000000",
        },
      ]);

    let balancesForAddress = await Wormhole.DataRetrieval.balancesForAddress(
      "bchtest:qq2j9gp97gm9a6lwvhxc4zu28qvqm0x4j5e72v7ejg"
    );
    assert.deepEqual(Object.keys(balancesForAddress[0]), ["propertyid", "balance", "reserved"]);
  });

  // The advantage of unit tests is that you can respond with a variety of errors,
  // like this 503 HTTP error.
  it(`503 unit test`, async () => {
    // https://wormholecash-staging.herokuapp.com/v1/dataRetrieval/balancesForAddress/bchtest:qq2j9gp97gm9a6lwvhxc4zu28qvqm0x4j5e72v7ejg
    nock(`https://wormholecash-staging.herokuapp.com`)
      .get(
        `/v1/dataRetrieval/balancesForAddress/bchtest:qq2j9gp97gm9a6lwvhxc4zu28qvqm0x4j5e72v7ejg`
      )
      .reply(503, "error");

    try {
      await Wormhole.DataRetrieval.balancesForAddress(
        "bchtest:qq2j9gp97gm9a6lwvhxc4zu28qvqm0x4j5e72v7ejg"
      );

      assert.equal(false, true, "Test passing unexpectedly!");
    } catch (err) {
      assert.equal(err.response.status, 503, "503 error expected.");
    }
  });
});
