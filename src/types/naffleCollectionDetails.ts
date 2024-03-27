export interface NFTDetails {
    content: string;
    name: string;
  }
  export interface NFTProperties {
    desc: string;
    id: number;
    precentage: number;
    type: string;
  }
  export interface NaffleCollectionDetails {
    imageURL: string;
    collection: string;
    nafflLink: string;
    description: string;
    floorPriceCUR: number;
    floorPriceETH: number;
    sellPriceCUR: number;
    sellPriceETH: number;
    currency: string;
    itmes: number;
    naffleListing: number;
    owners: number;
    NFTref: string;
    wallet: string;
    startDate: string;
    dateTimeStamp: string;
    eventID: string;
    ticketsSold: number;
    ticketsTotal: number;
    freeTicketsGiven: number;
    freeTicketsTotal: number;
    ticketETHPrice: number;
    ticketCurrencyPrice: number;
    details: {
      description: string;
      details: NFTDetails[];
      properties: NFTProperties[];
      ranking: {
        list: number;
        rank: number;
      };
    };
  }
  