import { gql, useQuery } from "@apollo/client";
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
        tags
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

const useAllOrders = (printed, set) => {
  const query = `fulfillment_status:unshipped AND status:open AND ${printed ? '' : 'NOT'} tag:printed`;
  const { loading, error, } = useQuery(GET_ORDERS, {
    fetchPolicy: "no-cache",
    variables: { query },
    onCompleted: (res) => {
      const data = mapData(res);
      set(data);
    }
  });
  return { loading, error };
};

export default useAllOrders;
