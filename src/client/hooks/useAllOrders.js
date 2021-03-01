import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { mapData } from "../helper";

const GET_ORDERS = gql`
query GetAllUnshippedOrders($query: String!){
  orders(first: 50, reverse: true, query:$query) {
    edges {
      node {
        id
        name
        createdAt
        subtotalLineItemsQuantity
        totalPriceSet {
          presentmentMoney {
            amount
            currencyCode
          }
        }
        customer {
          firstName
          lastName
        }
      }
    }
  }
}
`;

const useAllOrders = (shipped) => {
  const query = shipped ? "fulfillment_status:unshipped AND tag:printed" : "fulfillment_status:unshipped AND NOT tag:printed";
  const [data, setData] = useState([]);
  const { loading, error, } = useQuery(GET_ORDERS, {
    variables: { query },
    onCompleted: (res) => {
      const data = mapData(res);
      setData(data);
    }
  });
  return { loading, error, data, setData };
};

export default useAllOrders;
