import Event from "../../../models/Event.js";
import asyncLoop from "node-async-loop";
import fetch from "node-fetch";

export const detectSoldOut = () => {
  console.log("checking to see if shows have sold out...");
  const now = new Date();

  Event.aggregate([
    {
      $match: {
        date: {
          $gt: now,
        },
      },
    },
  ]).exec((err, events) => {
    if (err) {
      console.log(err);
    } else {
      asyncLoop(
        events,
        (event, next) => {
          // get the event's data
          const url = event.tickets,
            city = event.city,
            ticketId = event.ticketId;

          console.log(ticketId);

          const callback = (soldOut) => {
            if (soldOut) {
              console.log("found a sold out event!");
            }
          };

          // check which provider it is with
          if (url.includes("ticketmaster")) {
            console.log("found a ticketmaster event!");
            checkTicketmaster(ticketId, city, url, callback);
          } else {
            next();
          }
        },
        (err) => {}
      );
    }
  });
};

const checkTicketmaster = (ticketId, city, url, callback) => {
  const ticketmasterApiKey = process.env.TICKETMASTERAPIKEY;

  const getTicketId = (city) => {
    fetch(
      "https://app.ticketmaster.com/discovery/v2/events.json?keyword=not+another+d%26d+podcast&city=" +
        city +
        "&apikey=" +
        ticketmasterApiKey
    )
      .then((res) => res.json())
      .then((json) => {
        const ticketId = json._embedded.events[0].id;

        console.log("heard back from Ticketmaster, ticketId is " + ticketId);

        checkTicketAvailability(ticketId);

        console.log("adding ticketId to event in database");
        Event.findOneAndUpdate(
          {
            url,
          },
          {
            $set: { ticketId },
          }
        ).exec((err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Added ticketId to Event");
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkTicketAvailability = (ticketId) => {
    console.log("checking ticket availability");
    fetch(
      "https://app.ticketmaster.com/partners/v1/events/" +
        ticketId +
        "/availability&apikey=" +
        ticketmasterApiKey
    )
      .then((res) => res.json())
      .then((json) => {
        console.log("heard back from Ticketmaster: ");
        console.log(json);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // check if we have a ticketId
  if (ticketId === undefined) {
    console.log("No ticketId found, getting id from Ticketmaster");
    getTicketId(city);
  } else {
    console.log("ticketId found, checking availability");
    checkTicketAvailability(ticketId);
  }
};

const test = [
  {
    name: "Not Another D&D Podcast",
    type: "event",
    id: "vvG1zZ9oI5o6h2",
    test: false,
    url: "https://www.ticketmaster.com/not-another-dd-podcast-atlanta-georgia-12-03-2022/event/0E005D1A0B4476CF",
    locale: "en-us",
    images: [
      {
        ratio: "16_9",
        url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_TABLET_LANDSCAPE_16_9.jpg",
        width: 1024,
        height: 576,
        fallback: false,
      },
      {
        ratio: "4_3",
        url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_CUSTOM.jpg",
        width: 305,
        height: 225,
        fallback: false,
      },
      {
        ratio: "16_9",
        url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_RETINA_LANDSCAPE_16_9.jpg",
        width: 1136,
        height: 639,
        fallback: false,
      },
      {
        ratio: "16_9",
        url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_RECOMENDATION_16_9.jpg",
        width: 100,
        height: 56,
        fallback: false,
      },
      {
        ratio: "16_9",
        url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_EVENT_DETAIL_PAGE_16_9.jpg",
        width: 205,
        height: 115,
        fallback: false,
      },
      {
        ratio: "16_9",
        url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_TABLET_LANDSCAPE_LARGE_16_9.jpg",
        width: 2048,
        height: 1152,
        fallback: false,
      },
      {
        ratio: "3_2",
        url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_TABLET_LANDSCAPE_3_2.jpg",
        width: 1024,
        height: 683,
        fallback: false,
      },
      {
        ratio: "16_9",
        url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_RETINA_PORTRAIT_16_9.jpg",
        width: 640,
        height: 360,
        fallback: false,
      },
      {
        ratio: "3_2",
        url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_RETINA_PORTRAIT_3_2.jpg",
        width: 640,
        height: 427,
        fallback: false,
      },
      {
        ratio: "3_2",
        url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_ARTIST_PAGE_3_2.jpg",
        width: 305,
        height: 203,
        fallback: false,
      },
    ],
    sales: {
      public: {
        startDateTime: "2022-09-16T14:00:00Z",
        startTBD: false,
        startTBA: false,
        endDateTime: "2022-12-04T02:00:00Z",
      },
      presales: [
        {
          startDateTime: "2022-09-14T14:00:00Z",
          endDateTime: "2022-09-16T13:00:00Z",
          name: "Artist Presale",
        },
        {
          startDateTime: "2022-09-14T14:00:00Z",
          endDateTime: "2022-09-16T13:00:00Z",
          name: "Promoter Presale",
        },
        {
          startDateTime: "2022-09-14T14:00:00Z",
          endDateTime: "2022-09-16T13:00:00Z",
          name: "Venue Presale",
        },
        {
          startDateTime: "2022-09-14T14:00:00Z",
          endDateTime: "2022-09-16T13:00:00Z",
          name: "Official Platinum Presale",
        },
        {
          startDateTime: "2022-09-16T14:00:00Z",
          endDateTime: "2022-12-04T02:00:00Z",
          name: "Official Platinum",
        },
      ],
    },
    dates: {
      start: {
        localDate: "2022-12-03",
        localTime: "19:00:00",
        dateTime: "2022-12-04T00:00:00Z",
        dateTBD: false,
        dateTBA: false,
        timeTBA: false,
        noSpecificTime: false,
      },
      timezone: "America/New_York",
      status: { code: "onsale" },
      spanMultipleDays: false,
    },
    classifications: [
      {
        primary: true,
        segment: { id: "KZFzniwnSyZfZ7v7na", name: "Arts & Theatre" },
        genre: { id: "KnvZfZ7vAe1", name: "Comedy" },
        subGenre: { id: "KZazBEonSMnZfZ7vF17", name: "Comedy" },
        type: { id: "KZAyXgnZfZ7v7nI", name: "Undefined" },
        subType: { id: "KZFzBErXgnZfZ7v7lJ", name: "Undefined" },
        family: false,
      },
    ],
    promoter: {
      id: "494",
      name: "PROMOTED BY VENUE",
      description: "PROMOTED BY VENUE / NTL / USA",
    },
    promoters: [
      {
        id: "494",
        name: "PROMOTED BY VENUE",
        description: "PROMOTED BY VENUE / NTL / USA",
      },
    ],
    pleaseNote:
      "In the best interest of fans and staff, the Event Organizer will continue to monitor local COVID-19 trends and meet or exceed protocols mandated by local governments. By purchasing tickets to this event, unless prohibited by law, you agree to abide by the health and safety measures in effect at the time of the event, which may include, but not be limited to, wearing masks, providing proof of vaccination status and/or providing proof of negative COVID-19 test. Check back often for updates to your event venue website as guidelines are subject to change.",
    priceRanges: [{ type: "standard", currency: "USD", min: 58, max: 78 }],
    seatmap: {
      staticUrl:
        "https://maps.ticketmaster.com/maps/geometry/3/event/0E005D1A0B4476CF/staticImage?type=png&systemId=HOST",
    },
    accessibility: { ticketLimit: 4 },
    ticketLimit: { info: "There is an overall 8 ticket limit for this event." },
    ageRestrictions: { legalAgeEnforced: false },
    ticketing: { safeTix: { enabled: true } },
    _links: {
      self: { href: "/discovery/v2/events/vvG1zZ9oI5o6h2?locale=en-us" },
      attractions: [
        { href: "/discovery/v2/attractions/K8vZ917b2p0?locale=en-us" },
      ],
      venues: [{ href: "/discovery/v2/venues/KovZpZAFF1tA?locale=en-us" }],
    },
    _embedded: {
      venues: [
        {
          name: "Center Stage Theater",
          type: "venue",
          id: "KovZpZAFF1tA",
          test: false,
          url: "https://www.ticketmaster.com/center-stage-theater-tickets-atlanta/venue/114692",
          locale: "en-us",
          images: [
            {
              ratio: "16_9",
              url: "https://s1.ticketm.net/dbimages/17166v.jpg",
              width: 205,
              height: 115,
              fallback: false,
            },
          ],
          postalCode: "30309",
          timezone: "America/New_York",
          city: { name: "Atlanta" },
          state: { name: "Georgia", stateCode: "GA" },
          country: { name: "United States Of America", countryCode: "US" },
          address: { line1: "1374 W Peachtree St. NW" },
          location: { longitude: "-84.3877907", latitude: "33.7918926" },
          markets: [{ name: "Atlanta", id: "10" }],
          dmas: [
            { id: 220 },
            { id: 221 },
            { id: 258 },
            { id: 327 },
            { id: 384 },
          ],
          social: { twitter: { handle: "@centerstageatl" } },
          boxOfficeInfo: {
            phoneNumberDetail: "404-885-1365",
            openHoursDetail: "Hours : Monday - Friday 11:00am - 6:00pm",
            acceptedPaymentDetail:
              "Cash, Visa, MasterCard, American Express, Discover",
            willCallDetail:
              "Will Call is available 2 hours prior to the event. PLEASE BRING A PICTURE ID, THE ACTUAL CREDIT CARD USED TO PURCHASE THE TICKETS, AND YOUR ORDER NUMBER.",
          },
          parkingDetail: "Elite Parking (garage underneath venue) $10.00",
          accessibleSeatingDetail: "This venue is accessible.",
          generalInfo: {
            generalRule: "NO Cameras or Recorders allowed",
            childRule:
              "Anyone needing their own seat must have a ticket. Attendance by children is not recommended for most shows.",
          },
          upcomingEvents: { _total: 41, ticketmaster: 41, _filtered: 0 },
          ada: {
            adaPhones: "404-885-1365",
            adaCustomCopy:
              "Our ADA accessible seating is located in Section A Row B. For General Admission events, you may purchase a ticket and inquire about sitting in our ADA section when you arrive for the show. For Reserved Seat events, please purchase the accessible seating designated with the wheelchair symbol in Section A Row B. You may also contact the venue for assistance. Enjoy the show! ",
            adaHours:
              "Opens 1 & 1/2 hours prior to showtime on nights of events only.",
          },
          _links: {
            self: { href: "/discovery/v2/venues/KovZpZAFF1tA?locale=en-us" },
          },
        },
      ],
      attractions: [
        {
          name: "Not Another D+D Podcast",
          type: "attraction",
          id: "K8vZ917b2p0",
          test: false,
          url: "https://www.ticketmaster.com/not-another-dd-podcast-tickets/artist/2660046",
          locale: "en-us",
          images: [
            {
              ratio: "16_9",
              url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_TABLET_LANDSCAPE_16_9.jpg",
              width: 1024,
              height: 576,
              fallback: false,
            },
            {
              ratio: "4_3",
              url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_CUSTOM.jpg",
              width: 305,
              height: 225,
              fallback: false,
            },
            {
              ratio: "16_9",
              url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_RETINA_LANDSCAPE_16_9.jpg",
              width: 1136,
              height: 639,
              fallback: false,
            },
            {
              ratio: "16_9",
              url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_RECOMENDATION_16_9.jpg",
              width: 100,
              height: 56,
              fallback: false,
            },
            {
              ratio: "16_9",
              url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_EVENT_DETAIL_PAGE_16_9.jpg",
              width: 205,
              height: 115,
              fallback: false,
            },
            {
              ratio: "16_9",
              url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_TABLET_LANDSCAPE_LARGE_16_9.jpg",
              width: 2048,
              height: 1152,
              fallback: false,
            },
            {
              ratio: "3_2",
              url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_TABLET_LANDSCAPE_3_2.jpg",
              width: 1024,
              height: 683,
              fallback: false,
            },
            {
              ratio: "16_9",
              url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_RETINA_PORTRAIT_16_9.jpg",
              width: 640,
              height: 360,
              fallback: false,
            },
            {
              ratio: "3_2",
              url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_RETINA_PORTRAIT_3_2.jpg",
              width: 640,
              height: 427,
              fallback: false,
            },
            {
              ratio: "3_2",
              url: "https://s1.ticketm.net/dam/a/ebc/7f12974b-a1ba-4b3b-82ec-3ed9670ebebc_1590051_ARTIST_PAGE_3_2.jpg",
              width: 305,
              height: 203,
              fallback: false,
            },
          ],
          classifications: [
            {
              primary: true,
              segment: { id: "KZFzniwnSyZfZ7v7na", name: "Arts & Theatre" },
              genre: { id: "KnvZfZ7vAe1", name: "Comedy" },
              subGenre: { id: "KZazBEonSMnZfZ7vF17", name: "Comedy" },
              type: { id: "KZAyXgnZfZ7v7nI", name: "Undefined" },
              subType: { id: "KZFzBErXgnZfZ7v7lJ", name: "Undefined" },
              family: false,
            },
          ],
          upcomingEvents: { _total: 5, ticketmaster: 5, _filtered: 0 },
          _links: {
            self: {
              href: "/discovery/v2/attractions/K8vZ917b2p0?locale=en-us",
            },
          },
        },
      ],
    },
  },
];
